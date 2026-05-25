/**
 * OOP Quest — code editor
 * --------------------------------------------------------------
 * Turns the plain <textarea> code boxes into real CodeMirror
 * editors: Java syntax highlighting, line numbers, auto-closing
 * brackets, bracket matching, auto-indent, and a live linter that
 * flags structural mistakes as you type.
 *
 * Loaded after the CodeMirror library, before game.js.
 */
(function (global) {
  'use strict';

  /**
   * A lightweight, reliable Java linter — it is NOT a compiler.
   * It scans the source (ignoring comments and string/char literals)
   * and reports the mistakes that are unambiguous to detect:
   *   - unbalanced / mismatched ( ) [ ] { }
   *   - unterminated string or character literals
   * Returns CodeMirror lint annotations: {message, severity, from, to}.
   */
  function javaLint(text) {
    const ann = [];
    const stack = [];
    const pairs = { ')': '(', ']': '[', '}': '{' };
    let i = 0, line = 0, ch = 0;
    let inStr = false, inChar = false, inLine = false, inBlock = false;
    let litLine = 0, litCh = 0;
    const n = text.length;

    function P(l, c) { return { line: l, ch: c }; }
    function err(msg, l, c) {
      ann.push({ message: msg, severity: 'error', from: P(l, c), to: P(l, c + 1) });
    }

    while (i < n) {
      const c = text[i], d = text[i + 1];

      if (inLine) {
        if (c === '\n') inLine = false;
      } else if (inBlock) {
        if (c === '*' && d === '/') { inBlock = false; i++; ch++; }
      } else if (inStr) {
        if (c === '\\') { i++; ch++; }
        else if (c === '"') inStr = false;
        else if (c === '\n') { err('Unterminated string literal', litLine, litCh); inStr = false; }
      } else if (inChar) {
        if (c === '\\') { i++; ch++; }
        else if (c === "'") inChar = false;
        else if (c === '\n') { err('Unterminated character literal', litLine, litCh); inChar = false; }
      } else {
        if (c === '/' && d === '/') inLine = true;
        else if (c === '/' && d === '*') { inBlock = true; i++; ch++; }
        else if (c === '"') { inStr = true; litLine = line; litCh = ch; }
        else if (c === "'") { inChar = true; litLine = line; litCh = ch; }
        else if (c === '(' || c === '[' || c === '{') {
          stack.push({ c: c, line: line, ch: ch });
        } else if (c === ')' || c === ']' || c === '}') {
          if (stack.length === 0) {
            err('Unexpected "' + c + '" — nothing is open here', line, ch);
          } else if (stack[stack.length - 1].c === pairs[c]) {
            stack.pop();
          } else {
            // Spurious closer — report it but leave the opener open so
            // a later correct closer can still match cleanly.
            err('Mismatched "' + c + '" — "' + stack[stack.length - 1].c +
              '" is still open', line, ch);
          }
        }
      }

      if (c === '\n') { line++; ch = 0; } else { ch++; }
      i++;
    }

    stack.forEach(function (o) {
      err('Unclosed "' + o.c + '" — it is never closed', o.line, o.ch);
    });
    if (inStr) err('Unterminated string literal', litLine, litCh);
    if (inChar) err('Unterminated character literal', litLine, litCh);
    return ann;
  }

  /**
   * Wrap a <textarea> in a CodeMirror Java editor.
   * opts.height — pixel height of the editor (default 260).
   * Returns the CodeMirror instance (use .getValue() / .setValue()).
   */
  function makeJavaEditor(textarea, opts) {
    opts = opts || {};
    const cm = CodeMirror.fromTextArea(textarea, {
      mode: 'text/x-java',
      theme: 'oopquest',
      lineNumbers: true,
      indentUnit: 4,
      tabSize: 4,
      smartIndent: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      lineWrapping: false,
      gutters: ['CodeMirror-lint-markers'],
      lint: { getAnnotations: javaLint, async: false },
      extraKeys: {
        Tab: function (cm) {
          if (cm.somethingSelected()) cm.indentSelection('add');
          else cm.replaceSelection('    ');
        },
        'Shift-Tab': function (cm) { cm.indentSelection('subtract'); },
      },
    });
    cm.setSize('100%', opts.height || 260);
    return cm;
  }

  global.OOPEditor = { makeJavaEditor: makeJavaEditor, javaLint: javaLint };
})(window);
