/**
 * OOP Quest — Java code checker
 * --------------------------------------------------------------
 * This is NOT a Java compiler. It is a forgiving pattern analyser.
 * A code challenge in the curriculum carries a `checks` array.
 * Each check looks like:
 *
 *   { label: "Declares a class called Car", re: "\\bclass\\s+Car\\b" }
 *   { label: "Fields are not public", re: "public\\s+(int|String)", forbid: true }
 *   { label: "Has a constructor", fn: (code) => true|false }
 *
 *  - `re`     : a regex (as a string) that must be FOUND for the check to pass.
 *  - `forbid` : if true, the check passes only when the pattern is NOT found.
 *  - `fn`     : an optional function (code, rawCode) => boolean for custom logic.
 *  - `hint`   : shown to the player when the check fails.
 *
 * The checker strips comments and string literals before matching so
 * that the word "class" inside a comment never counts.
 */
(function (global) {
  'use strict';

  // Remove // line comments, block comments and string/char literals,
  // replacing literals with a neutral token so structure stays intact.
  function sanitize(code) {
    return String(code || '')
      .replace(/\/\*[\s\S]*?\*\//g, ' ')      // block comments
      .replace(/\/\/[^\n]*/g, ' ')            // line comments
      .replace(/"(?:\\.|[^"\\])*"/g, '"STR"') // string literals
      .replace(/'(?:\\.|[^'\\])*'/g, "'C'");  // char literals
  }

  function runCheck(check, clean, raw) {
    let found;
    if (typeof check.fn === 'function') {
      found = !!check.fn(clean, raw);
    } else if (check.re) {
      const flags = check.flags || 'i';
      found = new RegExp(check.re, flags).test(clean);
    } else {
      found = true;
    }
    const passed = check.forbid ? !found : found;
    return {
      label: check.label,
      passed: passed,
      hint: passed ? '' : (check.hint || ''),
    };
  }

  /**
   * Evaluate a player's code against a list of checks.
   * Returns { passed, score, total, results:[{label,passed,hint}] }
   */
  function evaluate(code, checks) {
    const raw = String(code || '');
    const clean = sanitize(raw);
    const list = Array.isArray(checks) ? checks : [];

    if (!raw.trim()) {
      return {
        passed: false,
        score: 0,
        total: list.length,
        empty: true,
        results: list.map((c) => ({ label: c.label, passed: false, hint: c.hint || '' })),
      };
    }

    const results = list.map((c) => runCheck(c, clean, raw));
    const score = results.filter((r) => r.passed).length;
    return {
      passed: score === list.length && list.length > 0,
      score: score,
      total: list.length,
      empty: false,
      results: results,
    };
  }

  // A few reusable helper builders so curriculum checks stay short.
  const helpers = {
    hasClass: (name) => ({
      label: 'Declares a class named ' + name,
      re: '\\bclass\\s+' + name + '\\b',
      hint: 'Start with:  public class ' + name + ' { ... }',
    }),
    hasInterface: (name) => ({
      label: 'Declares an interface named ' + name,
      re: '\\binterface\\s+' + name + '\\b',
      hint: 'Use:  interface ' + name + ' { ... }',
    }),
    hasMethod: (name) => ({
      label: 'Defines a method called ' + name + '()',
      re: '\\b' + name + '\\s*\\([^)]*\\)\\s*\\{',
      hint: 'Add a method:  ... ' + name + '() { ... }',
    }),
    balancedBraces: {
      label: 'Braces { } are balanced',
      hint: 'Count your opening and closing braces — one is missing.',
      fn: (clean) => {
        let depth = 0;
        for (const ch of clean) {
          if (ch === '{') depth++;
          if (ch === '}') depth--;
          if (depth < 0) return false;
        }
        return depth === 0;
      },
    },
  };

  global.OOPChecker = { evaluate: evaluate, sanitize: sanitize, helpers: helpers };
})(window);
