/**
 * OOP Quest — server
 * --------------------------------------------------------------
 * A tiny Express backend that:
 *   1. Serves the game (static files in /public)
 *   2. Persists each hero's progress to /data/progress.json
 *   3. Exposes a leaderboard built from saved progress
 *
 * No database needed — progress is a flat JSON file so the whole
 * thing runs with a single `npm install && npm start`.
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { execFile } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');

// --- storage helpers ------------------------------------------------
function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(PROGRESS_FILE)) fs.writeFileSync(PROGRESS_FILE, '{}');
}
function readStore() {
  ensureStore();
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8') || '{}');
  } catch (e) {
    return {};
  }
}
function writeStore(obj) {
  ensureStore();
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(obj, null, 2));
}

// --- middleware -----------------------------------------------------
app.use(express.json({ limit: '256kb' }));

// --- access gate ---------------------------------------------------
// Set the OOPQUEST_GATE_CODE env var to a 6-digit code and visitors
// must enter it before they can reach the game. Leave it unset and
// the gate is disabled (useful for local development).
const GATE_CODE = (process.env.OOPQUEST_GATE_CODE || '').trim();
const GATE_COOKIE = 'oopq_gate';
// Cookie value is derived from the code — not a guessable constant.
const GATE_TOKEN = GATE_CODE
  ? crypto.createHash('sha256').update('oopquest::' + GATE_CODE).digest('hex').slice(0, 20)
  : '';

function gatePassed(req) {
  const raw = req.headers.cookie || '';
  return raw.split(';').some((p) => p.trim() === GATE_COOKIE + '=' + GATE_TOKEN);
}

const GATE_PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>OOP Quest — Access Code</title><style>
*{box-sizing:border-box;margin:0;padding:0}
body{min-height:100vh;display:flex;align-items:center;justify-content:center;
font-family:"Segoe UI",system-ui,sans-serif;
background:radial-gradient(800px 500px at 50% -10%,rgba(155,108,255,.25),transparent 60%),#0e1020;color:#e8ebff}
.card{width:340px;max-width:90vw;background:#1c2142;border:1px solid #343b6e;
border-radius:16px;padding:34px 28px;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,.5)}
.crest{font-size:3rem}
h1{font-size:1.4rem;margin:8px 0 2px}
p{color:#aab0d8;font-size:.9rem;margin-bottom:20px}
input{width:100%;font:inherit;font-size:1.7rem;letter-spacing:.45em;text-align:center;
background:#11142b;color:#ffce5c;border:1px solid #343b6e;border-radius:10px;padding:12px 8px}
input:focus{outline:none;border-color:#d99b2b}
button{width:100%;margin-top:14px;font:inherit;font-weight:700;cursor:pointer;
border:none;border-radius:10px;padding:12px;
background:linear-gradient(180deg,#ffce5c,#d99b2b);color:#2a1c00}
.err{color:#ff5d7a;font-size:.85rem;margin-top:12px;min-height:1.1em}
.shake{animation:sh .35s}
@keyframes sh{0%,100%{transform:translateX(0)}25%{transform:translateX(-9px)}75%{transform:translateX(9px)}}
</style></head><body>
<form class="card" id="f">
<div class="crest">&#9876;&#65039;</div>
<h1>OOP Quest</h1>
<p>Enter the 6-digit access code to continue.</p>
<input id="c" inputmode="numeric" maxlength="6" autocomplete="off" placeholder="------" autofocus/>
<button type="submit">Enter</button>
<div class="err" id="e"></div>
</form>
<script>
var f=document.getElementById('f'),c=document.getElementById('c'),e=document.getElementById('e');
f.addEventListener('submit',function(ev){
ev.preventDefault();e.textContent='';
fetch('/api/gate',{method:'POST',headers:{'Content-Type':'application/json'},
body:JSON.stringify({code:c.value})})
.then(function(r){return r.json();})
.then(function(d){if(d.ok){location.reload();}else{
e.textContent='Wrong code. Try again.';
f.classList.remove('shake');void f.offsetWidth;f.classList.add('shake');
c.value='';c.focus();}})
.catch(function(){e.textContent='Something went wrong. Try again.';});
});
</script></body></html>`;

// Check the code; on success drop a 30-day cookie.
app.post('/api/gate', (req, res) => {
  if (!GATE_CODE) return res.json({ ok: true });
  const code = String((req.body && req.body.code) || '').trim();
  if (code === GATE_CODE) {
    res.setHeader('Set-Cookie',
      GATE_COOKIE + '=' + GATE_TOKEN + '; Path=/; HttpOnly; Max-Age=2592000; SameSite=Lax');
    return res.json({ ok: true });
  }
  return res.status(401).json({ ok: false });
});

// Everything below is blocked until the visitor has entered the code.
app.use((req, res, next) => {
  if (!GATE_CODE || gatePassed(req)) return next();
  res.status(200).send(GATE_PAGE);
});

app.use(express.static(path.join(__dirname, 'public')));

// --- API ------------------------------------------------------------

// Load a hero's saved progress.
app.get('/api/progress/:hero', (req, res) => {
  const store = readStore();
  const key = (req.params.hero || '').trim().toLowerCase();
  res.json(store[key] || null);
});

// Save a hero's progress.
app.post('/api/progress/:hero', (req, res) => {
  const key = (req.params.hero || '').trim().toLowerCase();
  if (!key) return res.status(400).json({ error: 'hero name required' });

  const store = readStore();
  const body = req.body || {};
  store[key] = {
    hero: body.hero || req.params.hero,
    xp: Number(body.xp) || 0,
    level: Number(body.level) || 1,
    completed: Array.isArray(body.completed) ? body.completed : [],
    badges: Array.isArray(body.badges) ? body.badges : [],
    sim: (body.sim && typeof body.sim === 'object' && !Array.isArray(body.sim)) ? body.sim : {},
    updatedAt: new Date().toISOString(),
  };
  writeStore(store);
  res.json({ ok: true, saved: store[key] });
});

// Top heroes by XP.
app.get('/api/leaderboard', (req, res) => {
  const store = readStore();
  const board = Object.values(store)
    .sort((a, b) => (b.xp || 0) - (a.xp || 0))
    .slice(0, 10)
    .map((p) => ({
      hero: p.hero,
      xp: p.xp || 0,
      level: p.level || 1,
      stagesCleared: (p.completed || []).length,
    }));
  res.json(board);
});

// --- live Java execution -------------------------------------------
// Learner-submitted Java runs either inside a locked-down Docker
// container (the safe choice for any public / AWS deployment) or,
// for local development, by invoking `java` directly.
//
// Mode is auto-detected. Override with the OOPQUEST_SANDBOX env var:
//   docker  — always use the Docker sandbox (recommended in production)
//   direct  — run `java` directly on the host (local dev only)
//   off     — disable live execution (game still fully playable)
//   auto    — Docker if the sandbox image exists, else direct (default)
const SANDBOX_IMAGE = process.env.OOPQUEST_SANDBOX_IMAGE || 'oopquest-sandbox';
const EXEC = { mode: 'off' };          // 'off' | 'direct' | 'docker'

function checkJava(next) {
  execFile('java', ['-version'], { timeout: 6000 }, (err, stdout, stderr) => {
    const m = /version "(\d+)(?:\.(\d+))?/.exec((stderr || '') + (stdout || ''));
    const major = m ? (m[1] === '1' ? parseInt(m[2] || '0', 10) : parseInt(m[1], 10)) : 0;
    next(!err && major >= 11);
  });
}
function checkDockerImage(next) {
  execFile('docker', ['image', 'inspect', SANDBOX_IMAGE], { timeout: 6000 }, (err) => next(!err));
}
function announceExec() {
  if (EXEC.mode === 'docker')
    console.log('  🐳 Live Java execution ON — sandboxed in Docker (image: ' + SANDBOX_IMAGE + ')');
  else if (EXEC.mode === 'direct')
    console.log('  ☕ Live Java execution ON — direct mode (local dev only; NOT sandboxed)');
  else
    console.log('  ☕ Live Java execution OFF — running in pattern-check mode (still fully playable)');
}
function detectExecutor() {
  const want = (process.env.OOPQUEST_SANDBOX || 'auto').toLowerCase();
  if (want === 'off') { EXEC.mode = 'off'; announceExec(); return; }
  if (want === 'docker') {
    checkDockerImage((ok) => {
      EXEC.mode = ok ? 'docker' : 'off';
      if (!ok) console.log('  ⚠ OOPQUEST_SANDBOX=docker but image "' + SANDBOX_IMAGE +
        '" was not found — build it first (see DEPLOY.md).');
      announceExec();
    });
    return;
  }
  if (want === 'direct') { checkJava((ok) => { EXEC.mode = ok ? 'direct' : 'off'; announceExec(); }); return; }
  // auto: prefer the Docker sandbox, fall back to direct java for local dev
  checkDockerImage((dok) => {
    if (dok) { EXEC.mode = 'docker'; announceExec(); return; }
    checkJava((jok) => { EXEC.mode = jok ? 'direct' : 'off'; announceExec(); });
  });
}
detectExecutor();

// Replace comments / string / char literals with spaces, keeping length
// and newlines so character indices stay aligned with the original.
function blankLiterals(src) {
  let out = '';
  for (let i = 0; i < src.length; ) {
    const c = src[i], d = src[i + 1];
    if (c === '/' && d === '/') { while (i < src.length && src[i] !== '\n') { out += ' '; i++; } continue; }
    if (c === '/' && d === '*') {
      out += '  '; i += 2;
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) { out += src[i] === '\n' ? '\n' : ' '; i++; }
      if (i < src.length) { out += '  '; i += 2; }
      continue;
    }
    if (c === '"' || c === "'") {
      const q = c; out += ' '; i++;
      while (i < src.length && src[i] !== q) {
        if (src[i] === '\\') { out += '  '; i += 2; }
        else { out += src[i] === '\n' ? '\n' : ' '; i++; }
      }
      if (i < src.length) { out += ' '; i++; }
      continue;
    }
    out += c; i++;
  }
  return out;
}

// Find every top-level type (class / interface / enum / record).
function topLevelTypes(src) {
  const s = blankLiterals(src);
  const types = [];
  const MODS = ['public', 'private', 'protected', 'abstract', 'final', 'sealed', 'strictfp'];
  let depth = 0, i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch === '{') { depth++; i++; continue; }
    if (ch === '}') { depth--; i++; continue; }
    if (depth === 0 && /[A-Za-z]/.test(ch)) {
      const m = /^(class|interface|enum|record)\b/.exec(s.slice(i));
      if (m && (i === 0 || /\W/.test(s[i - 1]))) {
        let start = i, p = i - 1;
        while (p >= 0) {                       // absorb leading modifiers
          while (p >= 0 && /\s/.test(s[p])) p--;
          let e = p;
          while (p >= 0 && /\w/.test(s[p])) p--;
          const w = s.slice(p + 1, e + 1);
          if (MODS.indexOf(w) !== -1) start = p + 1; else break;
        }
        let j = i;
        while (j < s.length && s[j] !== '{') j++;
        let dd = 0, k = j;
        for (; k < s.length; k++) {
          if (s[k] === '{') dd++;
          else if (s[k] === '}') { dd--; if (dd === 0) { k++; break; } }
        }
        types.push({ start: start, end: k, hasMain: /static\s+void\s+main\s*\(/.test(src.slice(start, k)) });
        i = k; continue;
      }
    }
    i++;
  }
  return types;
}

// For "run" mode: drop package, keep imports on top, and move the class
// that declares main() to the front (the source launcher runs the first).
function prepareForRun(src) {
  let code = src.replace(/^[ \t]*package\s+[^;]+;[ \t]*\r?\n?/m, '');
  const imports = (code.match(/^[ \t]*import\s+[^;]+;/gm) || []).join('\n');
  const types = topLevelTypes(code);
  if (types.length === 0) return code;
  let idx = types.findIndex((t) => t.hasMain);
  if (idx < 0) idx = 0;
  const ordered = [types[idx]].concat(types.filter((_, n) => n !== idx));
  const body = ordered.map((t) => code.slice(t.start, t.end)).join('\n\n');
  return (imports ? imports + '\n\n' : '') + body;
}

app.get('/api/java-status', (req, res) => res.json({ available: EXEC.mode !== 'off' }));

// Cap how many submissions may run at once — protects a small (free-tier)
// box from many JVMs/containers starting simultaneously.
const MAX_CONCURRENT_RUNS = 2;
let activeRuns = 0;

app.post('/api/run-java', (req, res) => {
  if (EXEC.mode === 'off') return res.json({ available: false });

  const mode = req.body && req.body.mode === 'compile' ? 'compile' : 'run';
  const code = String((req.body && req.body.code) || '');
  if (!code.trim()) return res.json({ available: true, ok: false, output: 'No code submitted.' });
  if (code.length > 20000) return res.json({ available: true, ok: false, output: 'Code is too long.' });
  if (activeRuns >= MAX_CONCURRENT_RUNS) {
    return res.json({ available: true, ok: false,
      output: 'The sandbox is busy right now — please try again in a moment.' });
  }

  let fileBody;
  if (mode === 'compile') {
    // Strip top-level `public` so the file always compiles regardless of
    // how many public types the learner wrote, then prepend a tiny entry.
    const stripped = code.replace(
      /\bpublic\s+(?=(?:abstract\s+|final\s+|sealed\s+|strictfp\s+)*(?:class|interface|enum|record)\b)/g, '');
    fileBody = 'class __Probe { public static void main(String[] __a) { } }\n\n' + stripped;
  } else {
    fileBody = prepareForRun(code);
  }

  let dir;
  try {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'oopquest-'));
    fs.writeFileSync(path.join(dir, 'Quest.java'), fileBody, { mode: 0o644 });
    // The mount must be readable by the (non-root) user inside the container.
    fs.chmodSync(dir, 0o755);
  } catch (e) {
    return res.json({ available: true, ok: false, output: 'Server could not prepare the run.' });
  }

  const javaFile = path.join(dir, 'Quest.java');
  const containerName = 'oopq-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);

  let cmd, args;
  if (EXEC.mode === 'docker') {
    // A throwaway, fully locked-down container per submission.
    cmd = 'docker';
    args = [
      'run', '--rm', '--name', containerName,
      '--network', 'none',                       // no internet, no LAN
      '--memory', '128m', '--memory-swap', '128m', // hard RAM ceiling
      '--cpus', '0.5',                            // at most half a core
      '--pids-limit', '128',                      // stop fork/thread bombs
      '--read-only',                              // immutable root filesystem
      '--tmpfs', '/tmp:size=16m',                 // tiny writable scratch
      '--ulimit', 'cpu=10',                       // hard 10 CPU-second backstop
      '--cap-drop', 'ALL',                        // drop every Linux capability
      '--security-opt', 'no-new-privileges',
      '-e', 'HOME=/tmp',
      '-v', dir + ':/code:ro',                    // submission mounted read-only
      SANDBOX_IMAGE,
      'java', '/code/Quest.java',
    ];
  } else {
    cmd = 'java';
    args = [javaFile];
  }

  activeRuns++;
  let done = false;
  execFile(cmd, args, { timeout: 12000, maxBuffer: 1 << 20, cwd: dir },
    (err, stdout, stderr) => {
      if (done) return;
      done = true;
      activeRuns--;
      fs.rm(dir, { recursive: true, force: true }, () => {});
      // A timed-out container can outlive the client process — force-remove it.
      if (EXEC.mode === 'docker' && err && err.killed) {
        execFile('docker', ['rm', '-f', containerName], () => {});
      }
      let combined = ((stdout || '') + (stderr || ''))
        .split(javaFile).join('Quest.java')
        .split(dir + path.sep).join('')
        .split(dir).join('');
      if (combined.length > 6000) combined = combined.slice(0, 6000) + '\n…(output truncated)';
      const timedOut = err && err.killed;
      res.json({
        available: true,
        ok: !err,
        output: timedOut
          ? (combined + '\n[Stopped — time limit reached. Check for an infinite loop.]').trim()
          : (combined.trim() || (err ? 'Run failed.' : '(program produced no output)')),
      });
    });
});

app.listen(PORT, () => {
  console.log('');
  console.log('  ⚔️   OOP Quest is running!');
  console.log('  ➜  Open  http://localhost:' + PORT + '  in your browser');
  console.log('');
});
