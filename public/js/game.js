/* ===========================================================
   OOP Quest — game engine
   Title -> World Map -> Level (lesson + challenges) -> Victory
   Progress is persisted to the Node backend (with a localStorage
   fallback so the game still works if the API is unreachable).
   =========================================================== */
(function () {
  'use strict';

  // ---- DOM handles -------------------------------------------------
  const screen   = document.getElementById('screen');
  const hud      = document.getElementById('hud');
  const toastEl  = document.getElementById('toast');

  // ---- hero state --------------------------------------------------
  const STATE = {
    hero: '',
    xp: 0,
    completed: [],   // ids of cleared level nodes
    badges: [],      // act badges earned from bosses
    simBest: {},     // best % score per interview-simulation problem
  };

  const XP_PER_LEVEL = 600;

  // Boss node id -> badge title awarded.
  const BADGES = {
    boss1: 'Foundations Badge',
    boss2: 'Four Pillars Badge',
    boss3: 'SOLID Temple Badge',
    boss4: 'Pattern Atelier Badge',
    boss4b: 'Advanced Atelier Badge',
    boss5: 'Master of OOP & LLD',
  };

  // ---- live Java execution (optional — needs Java 11+ on the server)
  const JAVA = { available: false };
  fetch('/api/java-status')
    .then(function (r) { return r.ok ? r.json() : null; })
    .catch(function () { return null; })
    .then(function (d) { JAVA.available = !!(d && d.available); });

  function runJava(code, mode) {
    return fetch('/api/run-java', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code, mode: mode }),
    }).then(function (r) { return r.json(); })
      .catch(function () {
        return { available: false, ok: false, output: 'Could not reach the server.' };
      });
  }

  // Curated, fully-runnable Java demos for the Code Forge.
  const FORGE_EXAMPLES = [
    {
      name: '1 · Classes & Objects',
      code:
`public class Main {
    public static void main(String[] args) {
        Dog rex = new Dog("Rex", 3);
        Dog bella = new Dog("Bella", 5);
        rex.bark();
        bella.bark();
        System.out.println(rex.name + " is " + rex.age + " years old.");
    }
}

class Dog {
    String name;
    int age;
    Dog(String name, int age) {
        this.name = name;
        this.age = age;
    }
    void bark() {
        System.out.println(name + " says: Woof!");
    }
}
`,
    },
    {
      name: '2 · Encapsulation',
      code:
`public class Main {
    public static void main(String[] args) {
        BankAccount acc = new BankAccount();
        acc.deposit(100);
        acc.deposit(50);
        System.out.println("Balance: " + acc.getBalance());
        acc.deposit(-999);   // rejected by the validating setter
        System.out.println("Balance still: " + acc.getBalance());
    }
}

class BankAccount {
    private double balance;          // hidden state

    public double getBalance() { return balance; }

    public void deposit(double amount) {
        if (amount <= 0) {
            System.out.println("Rejected invalid deposit: " + amount);
            return;
        }
        balance += amount;
    }
}
`,
    },
    {
      name: '3 · Inheritance & Polymorphism',
      code:
`public class Main {
    public static void main(String[] args) {
        Animal[] zoo = { new Dog(), new Cat(), new Cow() };
        for (Animal a : zoo) {
            System.out.println(a.name() + " says " + a.sound());
        }
    }
}

abstract class Animal {
    abstract String sound();
    String name() { return getClass().getSimpleName(); }
}
class Dog extends Animal { String sound() { return "Woof"; } }
class Cat extends Animal { String sound() { return "Meow"; } }
class Cow extends Animal { String sound() { return "Moo"; } }
`,
    },
    {
      name: '4 · Strategy Pattern',
      code:
`public class Main {
    public static void main(String[] args) {
        ShoppingCart cart = new ShoppingCart(1200);
        cart.pay(new CreditCardPayment());   // swap the algorithm...
        cart.pay(new UpiPayment());          // ...at runtime
    }
}

interface PaymentStrategy { void pay(double amount); }

class CreditCardPayment implements PaymentStrategy {
    public void pay(double amount) {
        System.out.println("Paid " + amount + " by credit card.");
    }
}
class UpiPayment implements PaymentStrategy {
    public void pay(double amount) {
        System.out.println("Paid " + amount + " by UPI.");
    }
}

class ShoppingCart {
    private double total;
    ShoppingCart(double total) { this.total = total; }
    void pay(PaymentStrategy strategy) { strategy.pay(total); }
}
`,
    },
    {
      name: '5 · Singleton Pattern',
      code:
`public class Main {
    public static void main(String[] args) {
        GameConfig a = GameConfig.getInstance();
        GameConfig b = GameConfig.getInstance();
        a.difficulty = "HARD";
        System.out.println("b sees difficulty = " + b.difficulty);
        System.out.println("Same single instance? " + (a == b));
    }
}

class GameConfig {
    private static GameConfig instance;
    String difficulty = "NORMAL";

    private GameConfig() { }

    public static GameConfig getInstance() {
        if (instance == null) instance = new GameConfig();
        return instance;
    }
}
`,
    },
  ];

  // ---- flatten the curriculum into an ordered list of nodes --------
  const NODES = [];
  CURRICULUM.forEach(function (act) {
    act.levels.forEach(function (lvl) {
      NODES.push({ act: act, level: lvl });
    });
  });

  function nodeIndex(id) {
    for (let i = 0; i < NODES.length; i++) if (NODES[i].level.id === id) return i;
    return -1;
  }
  function isCompleted(id) { return STATE.completed.indexOf(id) !== -1; }
  function isUnlocked(id) {
    const i = nodeIndex(id);
    if (i <= 0) return true;
    return isCompleted(NODES[i - 1].level.id);
  }
  function heroLevel() { return 1 + Math.floor(STATE.xp / XP_PER_LEVEL); }

  // ---- helpers -----------------------------------------------------
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function el(html) {
    const d = document.createElement('div');
    d.innerHTML = html.trim();
    return d.firstElementChild;
  }
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  }

  // ---- persistence -------------------------------------------------
  function snapshot() {
    return {
      hero: STATE.hero,
      xp: STATE.xp,
      level: heroLevel(),
      completed: STATE.completed,
      badges: STATE.badges,
      sim: STATE.simBest,
    };
  }
  function save() {
    const data = snapshot();
    try { localStorage.setItem('oopquest:' + STATE.hero.toLowerCase(), JSON.stringify(data)); }
    catch (e) { /* ignore */ }
    fetch('/api/progress/' + encodeURIComponent(STATE.hero), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(function () { /* offline — localStorage already has it */ });
  }
  function applyData(data) {
    if (!data) return;
    STATE.hero = data.hero || STATE.hero;
    STATE.xp = Number(data.xp) || 0;
    STATE.completed = Array.isArray(data.completed) ? data.completed.slice() : [];
    STATE.badges = Array.isArray(data.badges) ? data.badges.slice() : [];
    STATE.simBest = (data.sim && typeof data.sim === 'object') ? data.sim : {};
  }
  function loadHero(name) {
    // Try the server first, fall back to localStorage.
    return fetch('/api/progress/' + encodeURIComponent(name))
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; })
      .then(function (data) {
        if (data) return data;
        try { return JSON.parse(localStorage.getItem('oopquest:' + name.toLowerCase()) || 'null'); }
        catch (e) { return null; }
      });
  }

  // ---- HUD ---------------------------------------------------------
  function renderHud() {
    if (!STATE.hero) { hud.classList.add('hidden'); return; }
    hud.classList.remove('hidden');
    document.getElementById('hud-hero').textContent = STATE.hero;
    document.getElementById('hud-level').textContent = heroLevel();
    document.getElementById('hud-xp-text').textContent = STATE.xp + ' XP';
    const within = (STATE.xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100;
    document.getElementById('hud-xp-fill').style.width = within + '%';
  }

  // =================================================================
  // SCREEN: TITLE
  // =================================================================
  function showTitle() {
    STATE.hero = '';
    renderHud();
    let lastHero = '';
    try { lastHero = localStorage.getItem('oopquest:lastHero') || ''; } catch (e) {}

    screen.innerHTML = '';
    const wrap = el(
      '<div class="title-wrap">' +
        '<div class="title-crest">⚔️</div>' +
        '<div class="title-name">OOP Quest</div>' +
        '<div class="title-tag">Master Object-Oriented Programming in Java &mdash; from your very first class to acing an LLD interview.</div>' +
        '<div class="title-sub">A quest-RPG in ' + CURRICULUM.length + ' Acts &middot; ' +
          NODES.length + ' quests &middot; pillars, SOLID, design patterns, real LLD problems ' +
          '&amp; a live Java sandbox.</div>' +
        '<div class="title-card">' +
          '<label for="heroName">Name your hero</label>' +
          '<input id="heroName" class="input" maxlength="24" placeholder="e.g. Baljeet the Bold" value="' + esc(lastHero) + '"/>' +
          '<button id="beginBtn" class="btn btn-primary" style="width:100%">Begin the Quest ➤</button>' +
          '<div id="returnHint" class="muted center" style="margin-top:10px"></div>' +
        '</div>' +
        '<div class="title-journey">' +
          CURRICULUM.map(function (a) {
            return '<span class="journey-chip">' + esc(a.title) + '</span>';
          }).join('') +
        '</div>' +
      '</div>'
    );
    screen.appendChild(wrap);

    const input = document.getElementById('heroName');
    const begin = document.getElementById('beginBtn');

    function start() {
      const name = input.value.trim();
      if (!name) { input.focus(); toast('Your hero needs a name!'); return; }
      begin.disabled = true;
      begin.textContent = 'Loading your saga...';
      try { localStorage.setItem('oopquest:lastHero', name); } catch (e) {}
      loadHero(name).then(function (data) {
        STATE.hero = name;
        STATE.xp = 0; STATE.completed = []; STATE.badges = []; STATE.simBest = {};
        if (data) { applyData(data); STATE.hero = name; toast('Welcome back, ' + name + '!'); }
        else { toast('A new hero rises: ' + name); }
        showMap();
      });
    }
    begin.addEventListener('click', start);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') start(); });
    input.focus();
  }

  // =================================================================
  // SCREEN: WORLD MAP
  // =================================================================
  function showMap() {
    renderHud();
    save();
    screen.innerHTML = '';

    const totalQuests = NODES.length;
    const done = STATE.completed.length;

    const head = el(
      '<div class="fade">' +
        '<div class="map-head">' +
          '<h1>🗺️ The Realm of Objects</h1>' +
          '<p>' + esc(STATE.hero) + ' &mdash; Hero Level ' + heroLevel() +
          ' &middot; ' + done + ' / ' + totalQuests + ' quests cleared' +
          (STATE.badges.length ? ' &middot; ' + STATE.badges.length + ' badge(s)' : '') +
          '</p>' +
        '</div>' +
      '</div>'
    );
    screen.appendChild(head);

    if (STATE.badges.length) {
      const b = el('<div class="fade" style="margin-top:8px"></div>');
      STATE.badges.forEach(function (bd) {
        b.appendChild(el('<span class="badge-earned">🏅 ' + esc(bd) + '</span>'));
      });
      screen.appendChild(b);
    }

    CURRICULUM.forEach(function (act) {
      const cleared = act.levels.filter(function (l) { return isCompleted(l.id); }).length;
      const actEl = el(
        '<section class="act fade">' +
          '<div class="act-bar" style="--act:' + act.color + '">' +
            '<h2>' + esc(act.title) + '</h2>' +
            '<span class="act-sub">' + esc(act.subtitle) + '</span>' +
            '<span class="act-prog">' + cleared + ' / ' + act.levels.length + ' ✓</span>' +
          '</div>' +
          '<div class="nodes"></div>' +
        '</section>'
      );
      const nodesEl = actEl.querySelector('.nodes');

      act.levels.forEach(function (lvl) {
        const unlocked = isUnlocked(lvl.id);
        const completed = isCompleted(lvl.id);
        const cls = 'node' + (lvl.boss ? ' boss' : '') +
                    (!unlocked ? ' locked' : '') + (completed ? ' done' : '');
        const icon = lvl.boss ? '🐉' : (completed ? '✅' : (unlocked ? '📜' : '🔒'));
        const state = !unlocked ? 'Locked' : (completed ? 'Cleared' : (lvl.boss ? 'BOSS — ready' : 'Ready'));
        const node = el(
          '<button class="' + cls + '">' +
            '<div class="node-top">' +
              '<span class="node-badge">' + icon + '</span>' +
              '<span class="node-xp">+' + lvl.xp + ' XP</span>' +
            '</div>' +
            '<div class="node-title">' + esc(lvl.title) + '</div>' +
            '<div class="node-state">' + state + '</div>' +
          '</button>'
        );
        if (unlocked) {
          node.addEventListener('click', function () {
            if (lvl.boss || !lvl.lesson) showChallenges(lvl.id, 0);
            else showLesson(lvl.id);
          });
        } else {
          node.addEventListener('click', function () { toast('Clear the previous quest first.'); });
        }
        nodesEl.appendChild(node);
      });
      screen.appendChild(actEl);
    });

    renderLeaderboard();

    document.getElementById('btn-map').onclick = showMap;
    document.getElementById('btn-reset').onclick = confirmReset;
  }

  function renderLeaderboard() {
    const box = el(
      '<section class="act fade lb" style="margin-top:26px">' +
        '<div class="act-bar" style="--act:#ffce5c"><h2>🏆 Hall of Heroes</h2>' +
        '<span class="act-sub">top adventurers by XP</span></div>' +
        '<div style="padding:6px 18px 18px"><div id="lb-body" class="muted">Loading…</div></div>' +
      '</section>'
    );
    screen.appendChild(box);
    fetch('/api/leaderboard')
      .then(function (r) { return r.ok ? r.json() : []; })
      .catch(function () { return []; })
      .then(function (list) {
        const body = document.getElementById('lb-body');
        if (!body) return;
        if (!list.length) { body.textContent = 'No heroes ranked yet — be the first!'; return; }
        let rows = '';
        list.forEach(function (p, i) {
          const me = p.hero && p.hero.toLowerCase() === STATE.hero.toLowerCase();
          rows += '<tr class="' + (me ? 'me' : '') + '"><td>' + (i + 1) + '</td><td>' +
            esc(p.hero) + (me ? ' (you)' : '') + '</td><td>Lv ' + p.level +
            '</td><td>' + p.xp + ' XP</td><td>' + p.stagesCleared + ' ✓</td></tr>';
        });
        body.innerHTML =
          '<table><thead><tr><th>#</th><th>Hero</th><th>Level</th><th>XP</th><th>Quests</th></tr></thead>' +
          '<tbody>' + rows + '</tbody></table>';
      });
  }

  function confirmReset() {
    if (confirm('Erase ' + STATE.hero + "'s progress and return to the title screen?")) {
      STATE.xp = 0; STATE.completed = []; STATE.badges = []; STATE.simBest = {};
      save();
      showTitle();
    }
  }

  // =================================================================
  // SCREEN: LESSON
  // =================================================================
  function showLesson(id) {
    const i = nodeIndex(id);
    const node = NODES[i];
    const lvl = node.level;
    renderHud();
    screen.innerHTML = '';

    const view = el(
      '<div class="fade">' +
        '<div class="level-head">' +
          '<h1>' + esc(lvl.title) + '</h1>' +
          '<span class="pill">+' + lvl.xp + ' XP</span>' +
          '<span class="pill">' + esc(node.act.title) + '</span>' +
        '</div>' +
        '<div class="story">“' + esc(lvl.story) + '”</div>' +
        '<div class="panel lesson">' + lvl.lesson + '</div>' +
        '<div class="row-actions">' +
          '<button id="toChal" class="btn btn-primary">Begin the Trials ➤</button>' +
          '<button id="backMap" class="btn btn-ghost">← World Map</button>' +
        '</div>' +
      '</div>'
    );
    screen.appendChild(view);
    document.getElementById('toChal').onclick = function () { showChallenges(id, 0); };
    document.getElementById('backMap').onclick = showMap;
    document.getElementById('btn-map').onclick = showMap;
    window.scrollTo(0, 0);
  }

  // =================================================================
  // SCREEN: CHALLENGES
  // =================================================================
  function showChallenges(id, index) {
    const i = nodeIndex(id);
    const node = NODES[i];
    const lvl = node.level;
    const challenges = lvl.challenges;
    renderHud();
    screen.innerHTML = '';

    if (index >= challenges.length) { showVictory(id); return; }
    const ch = challenges[index];

    // progress dots
    let dots = '';
    for (let d = 0; d < challenges.length; d++) {
      const c = d < index ? 'done' : (d === index ? 'current' : '');
      dots += '<div class="chal-dot ' + c + '"></div>';
    }

    const kindLabel = {
      mcq: 'Multiple Choice', fill: 'Fill the Blanks', code: 'Write Java Code',
    }[ch.type] || 'Challenge';

    const view = el(
      '<div class="fade">' +
        '<div class="level-head">' +
          '<h1>' + (lvl.boss ? '🐉 ' : '') + esc(lvl.title) + '</h1>' +
          '<span class="pill' + (lvl.boss ? ' boss' : '') + '">Trial ' + (index + 1) +
            ' / ' + challenges.length + '</span>' +
        '</div>' +
        '<div class="chal-progress">' + dots + '</div>' +
        '<div class="panel">' +
          '<span class="chal-kind">' + kindLabel + '</span>' +
          '<div id="chalBody"></div>' +
          '<div id="chalFeedback"></div>' +
          '<div class="row-actions">' +
            '<button id="primaryBtn" class="btn btn-primary"></button>' +
            '<button id="exitBtn" class="btn btn-ghost">← Leave quest</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
    screen.appendChild(view);
    document.getElementById('exitBtn').onclick = showMap;
    document.getElementById('btn-map').onclick = showMap;
    window.scrollTo(0, 0);

    const body = document.getElementById('chalBody');
    const fb = document.getElementById('chalFeedback');
    const primary = document.getElementById('primaryBtn');

    function advance() { showChallenges(id, index + 1); }

    function passFeedback(extraHtml) {
      fb.innerHTML = '<div class="feedback good"><h5>✅ Correct!</h5>' +
        '<div>' + esc(ch.explain || '') + '</div>' + (extraHtml || '') + '</div>';
      primary.textContent = (index + 1 >= challenges.length)
        ? 'Claim Victory 🌟' : 'Next Trial ➤';
      primary.onclick = advance;
      primary.disabled = false;
    }
    function failFeedback(title, extraHtml) {
      fb.innerHTML = '<div class="feedback bad"><h5>❌ ' + esc(title) + '</h5>' +
        (extraHtml || '') + '</div>';
    }

    // ----- render by type -----------------------------------------
    if (ch.type === 'mcq') renderMCQ(ch, body, primary, passFeedback, failFeedback);
    else if (ch.type === 'fill') renderFill(ch, body, primary, passFeedback, failFeedback);
    else if (ch.type === 'code') renderCode(ch, body, primary, passFeedback, failFeedback);
  }

  // ----- MCQ ---------------------------------------------------------
  function renderMCQ(ch, body, primary, pass, fail) {
    const keys = ['A', 'B', 'C', 'D', 'E'];
    let html = '<div class="chal-q">' + esc(ch.q) + '</div>';
    if (ch.code) html += '<div class="chal-code-snippet">' + esc(ch.code) + '</div>';
    html += '<div id="opts"></div>';
    body.innerHTML = html;

    const opts = body.querySelector('#opts');
    let solved = false;
    ch.options.forEach(function (text, idx) {
      const btn = el('<button class="opt"><span class="opt-key">' + keys[idx] +
        '</span>' + esc(text) + '</button>');
      btn.onclick = function () {
        if (solved) return;
        if (idx === ch.answer) {
          solved = true;
          btn.classList.add('correct');
          Array.prototype.forEach.call(opts.children, function (c) { c.disabled = true; });
          pass();
        } else {
          btn.classList.add('wrong');
          btn.disabled = true;
          fail('Not quite — try another answer.',
            '<div class="muted">That option is not correct. Pick another.</div>');
        }
      };
      opts.appendChild(btn);
    });
    primary.textContent = 'Pick an answer above';
    primary.disabled = true;
    primary.onclick = function () {};
  }

  // ----- FILL --------------------------------------------------------
  function renderFill(ch, body, primary, pass, fail) {
    const parts = ch.code.split('___');
    let codeHtml = '';
    for (let p = 0; p < parts.length; p++) {
      codeHtml += esc(parts[p]);
      if (p < parts.length - 1) {
        codeHtml += '<input class="blank" data-i="' + p + '" autocomplete="off" spellcheck="false"/>';
      }
    }
    body.innerHTML = '<div class="chal-q">' + esc(ch.q) + '</div>' +
      '<div class="fill-code">' + codeHtml + '</div>';

    const inputs = Array.prototype.slice.call(body.querySelectorAll('.blank'));
    let solved = false;

    function accepts(blank) {
      return Array.isArray(blank) ? blank : [blank];
    }
    function check() {
      if (solved) return;
      let allOk = true;
      inputs.forEach(function (inp, idx) {
        const val = inp.value.trim().toLowerCase();
        const ok = accepts(ch.blanks[idx]).some(function (a) {
          return String(a).trim().toLowerCase() === val;
        });
        inp.classList.toggle('ok', ok);
        inp.classList.toggle('no', !ok);
        if (!ok) allOk = false;
      });
      if (allOk) {
        solved = true;
        inputs.forEach(function (inp) { inp.disabled = true; });
        pass();
      } else {
        fail('Some blanks are not right yet.',
          '<div class="muted">The red blanks need another look. Keywords are case-insensitive.</div>');
      }
    }
    inputs.forEach(function (inp) {
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') check(); });
    });
    primary.textContent = 'Check Answer';
    primary.disabled = false;
    primary.onclick = check;
    if (inputs[0]) inputs[0].focus();
  }

  // ----- CODE --------------------------------------------------------
  function renderCode(ch, body, primary, pass, fail) {
    body.innerHTML =
      '<div class="chal-q">' + esc(ch.q) + '</div>' +
      '<textarea id="editor" class="editor" spellcheck="false"></textarea>' +
      '<div class="muted">Your answer is graded on structure (the checks below). ' +
      (JAVA.available
        ? 'You can also compile it on a real JVM with the button below.'
        : 'Tip: focus on the structure each check asks for.') + '</div>' +
      (JAVA.available
        ? '<div class="run-row"><button id="compileBtn" class="btn btn-ember">' +
          '▶ Compile on a real JVM</button></div>' +
          '<pre id="runOut" class="forge-out hidden"></pre>'
        : '');

    const editorEl = body.querySelector('#editor');
    editorEl.value = ch.starter || '';
    const cm = OOPEditor.makeJavaEditor(editorEl, { height: 240 });

    let solved = false;
    function check() {
      if (solved) return;
      const result = OOPChecker.evaluate(cm.getValue(), ch.checks);
      let list = '<ul class="check-list">';
      result.results.forEach(function (r) {
        list += '<li class="' + (r.passed ? 'pass' : 'fail') + '">' +
          '<span class="mark">' + (r.passed ? '✔' : '✘') + '</span>' +
          esc(r.label) +
          (!r.passed && r.hint ? ' <span class="check-hint">— ' + esc(r.hint) + '</span>' : '') +
          '</li>';
      });
      list += '</ul>';

      if (result.passed) {
        solved = true;
        cm.setOption('readOnly', true);
        pass('<div style="margin-top:8px"><b>' + result.score + ' / ' + result.total +
          ' checks passed.</b></div>' + list);
      } else if (result.empty) {
        fail('Write some code first.', '<div class="muted">The editor is empty.</div>');
      } else {
        fail(result.score + ' / ' + result.total + ' checks passed — keep going.', list);
      }
    }
    if (JAVA.available) {
      const compileBtn = body.querySelector('#compileBtn');
      const runOut = body.querySelector('#runOut');
      compileBtn.onclick = function () {
        compileBtn.disabled = true;
        compileBtn.textContent = '⏳ Compiling…';
        runOut.classList.remove('hidden');
        runOut.className = 'forge-out';
        runOut.textContent = 'Compiling on the JVM…';
        const full = (ch.scaffold ? ch.scaffold + '\n\n' : '') + cm.getValue();
        runJava(full, 'compile').then(function (r) {
          compileBtn.disabled = false;
          compileBtn.textContent = '▶ Compile on a real JVM';
          if (!r.available) {
            runOut.className = 'forge-out err';
            runOut.textContent = 'Live execution is unavailable.';
          } else if (r.ok) {
            runOut.className = 'forge-out ok';
            runOut.textContent = '✔ Your code compiles cleanly on a real Java compiler.' +
              (ch.scaffold ? '\n(supporting types were provided for you)' : '');
          } else {
            runOut.className = 'forge-out err';
            runOut.textContent = r.output || 'Compilation failed.';
          }
        });
      };
    }

    primary.textContent = 'Run Checks';
    primary.disabled = false;
    primary.onclick = check;
  }

  // =================================================================
  // SCREEN: VICTORY
  // =================================================================
  function showVictory(id) {
    const i = nodeIndex(id);
    const node = NODES[i];
    const lvl = node.level;
    renderHud();
    screen.innerHTML = '';

    const firstClear = !isCompleted(id);
    const lvlBefore = heroLevel();
    let gained = 0;
    let newBadge = null;

    if (firstClear) {
      STATE.completed.push(id);
      STATE.xp += lvl.xp;
      gained = lvl.xp;
      if (lvl.boss && BADGES[id] && STATE.badges.indexOf(BADGES[id]) === -1) {
        newBadge = BADGES[id];
        STATE.badges.push(newBadge);
      }
    }
    const leveledUp = heroLevel() > lvlBefore;
    save();
    renderHud();

    const allDone = STATE.completed.length >= NODES.length;
    const next = NODES[i + 1];

    let html = '<div class="victory">';
    if (allDone) {
      html += '<div class="victory-crest">👑</div>' +
        '<h1>The Realm is Yours!</h1>' +
        '<p>You have cleared every quest in OOP Quest. You now command classes &amp; objects, ' +
        'the four pillars, all five SOLID principles, the core design patterns, and a ' +
        'repeatable method for any LLD interview problem. Go and ace that interview, ' +
        esc(STATE.hero) + '.</p>';
    } else {
      html += '<div class="victory-crest">' + (lvl.boss ? '🌟' : '⚔️') + '</div>' +
        '<h1>' + esc(lvl.boss ? 'Boss Defeated!' : 'Quest Cleared!') + '</h1>' +
        '<p>' + esc(lvl.title) + ' is complete.</p>';
    }
    if (gained > 0) html += '<div class="xp-gain">+' + gained + ' XP</div>';
    else html += '<p class="muted">(Already cleared — no new XP, but practice never hurts.)</p>';

    if (leveledUp) html += '<div class="levelup">✨ Hero Level Up! You are now Level ' + heroLevel() + '</div>';
    if (newBadge) html += '<div><span class="badge-earned">🏅 ' + esc(newBadge) + ' earned!</span></div>';

    html += '<div class="row-actions" style="justify-content:center">';
    if (!allDone && next) {
      const nextUnlocked = isUnlocked(next.level.id);
      if (nextUnlocked) {
        html += '<button id="nextBtn" class="btn btn-primary">Next: ' + esc(next.level.title) + ' ➤</button>';
      }
    }
    html += '<button id="mapBtn" class="btn btn-ghost">🗺️ World Map</button>';
    html += '<button id="replayBtn" class="btn btn-ghost">↺ Replay this quest</button>';
    html += '</div></div>';

    screen.appendChild(el(html));

    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.onclick = function () {
      if (next.level.boss || !next.level.lesson) showChallenges(next.level.id, 0);
      else showLesson(next.level.id);
    };
    document.getElementById('mapBtn').onclick = showMap;
    document.getElementById('replayBtn').onclick = function () {
      if (lvl.boss || !lvl.lesson) showChallenges(id, 0);
      else showLesson(id);
    };
    document.getElementById('btn-map').onclick = showMap;
    window.scrollTo(0, 0);
  }

  // =================================================================
  // SCREEN: CODE FORGE  (free Java sandbox)
  // =================================================================
  function showForge() {
    renderHud();
    screen.innerHTML = '';

    const view = el(
      '<div class="fade">' +
        '<div class="level-head">' +
          '<h1>🔨 The Code Forge</h1>' +
          '<span class="pill">live Java sandbox</span>' +
        '</div>' +
        '<div class="story">Write real Java and run it on the spot. Load a demo, change it, ' +
          'and watch what happens. No XP, no pressure — this is your workshop.</div>' +
        '<div class="panel">' +
          (JAVA.available ? '' :
            '<div class="feedback bad" style="margin-bottom:14px"><h5>⚠ Live execution is off</h5>' +
            '<div class="muted">The server could not find Java 11+. You can still write code here, ' +
            'but running it needs Java installed on the machine hosting the game.</div></div>') +
          '<div class="forge-bar">' +
            '<label class="forge-label" for="forgeEx">Load a demo</label>' +
            '<select id="forgeEx" class="forge-select"></select>' +
          '</div>' +
          '<textarea id="forgeEditor" class="editor" spellcheck="false"></textarea>' +
          '<div class="row-actions">' +
            '<button id="forgeRun" class="btn btn-primary">▶ Run Code</button>' +
            '<button id="forgeMap" class="btn btn-ghost">← World Map</button>' +
          '</div>' +
          '<div class="forge-out-label">Console output</div>' +
          '<pre id="forgeOut" class="forge-out">(run your code to see the output here)</pre>' +
        '</div>' +
      '</div>'
    );
    screen.appendChild(view);

    const sel = document.getElementById('forgeEx');
    const editor = document.getElementById('forgeEditor');
    const out = document.getElementById('forgeOut');
    const runBtn = document.getElementById('forgeRun');

    FORGE_EXAMPLES.forEach(function (ex, idx) {
      const o = document.createElement('option');
      o.value = String(idx); o.textContent = ex.name;
      sel.appendChild(o);
    });
    editor.value = FORGE_EXAMPLES[0].code;
    const cm = OOPEditor.makeJavaEditor(editor, { height: 360 });
    sel.addEventListener('change', function () {
      cm.setValue(FORGE_EXAMPLES[Number(sel.value)].code);
      out.textContent = '(run your code to see the output here)';
      out.className = 'forge-out';
    });

    runBtn.onclick = function () {
      runBtn.disabled = true;
      runBtn.textContent = '⏳ Running…';
      out.className = 'forge-out';
      out.textContent = 'Compiling and running on the JVM…';
      runJava(cm.getValue(), 'run').then(function (r) {
        runBtn.disabled = false;
        runBtn.textContent = '▶ Run Code';
        if (!r.available) {
          out.className = 'forge-out err';
          out.textContent = 'Live execution is unavailable — Java 11+ is not installed on the server.';
          return;
        }
        out.className = 'forge-out ' + (r.ok ? 'ok' : 'err');
        out.textContent = r.output || '(no output)';
      });
    };

    document.getElementById('forgeMap').onclick = showMap;
    window.scrollTo(0, 0);
  }

  // =================================================================
  // INTERVIEW SIMULATOR
  // =================================================================

  // Score a free-form design against a problem's rubric by scanning
  // the player's text for each rubric item's keywords (whole-word).
  function gradeSim(sim, text) {
    const t = ' ' + String(text || '').toLowerCase() + ' ';
    function reEsc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
    const cats = sim.rubric.map(function (cat) {
      const items = cat.items.map(function (it) {
        const hit = it.keywords.some(function (k) {
          return new RegExp('(^|[^a-z0-9])' + reEsc(k.toLowerCase()) + '([^a-z0-9]|$)').test(t);
        });
        return { label: it.label, hit: hit };
      });
      return {
        category: cat.category, items: items,
        hits: items.filter(function (i) { return i.hit; }).length,
        total: items.length,
      };
    });
    const hits = cats.reduce(function (s, c) { return s + c.hits; }, 0);
    const total = cats.reduce(function (s, c) { return s + c.total; }, 0);
    return { cats: cats, hits: hits, total: total, pct: total ? Math.round(hits / total * 100) : 0 };
  }

  function showSimList() {
    renderHud();
    screen.innerHTML = '';
    screen.appendChild(el(
      '<div class="fade"><div class="map-head">' +
        '<h1>🎯 The Interview Simulator</h1>' +
        '<p>Open-ended LLD problems — exactly like the real round. There is no multiple choice here: ' +
        'write your design in plain words, then get scored on concept coverage and compare against a model answer.</p>' +
      '</div></div>'
    ));
    const grid = el('<div class="nodes fade" style="margin-top:16px"></div>');
    SIMULATIONS.forEach(function (sim) {
      const best = STATE.simBest[sim.id];
      const card = el(
        '<button class="node">' +
          '<div class="node-top"><span class="node-badge">🎯</span>' +
            '<span class="node-xp">' + esc(sim.difficulty) + '</span></div>' +
          '<div class="node-title">' + esc(sim.title) + '</div>' +
          '<div class="node-state">' +
            (best != null ? 'Best score: ' + best + '%' : 'Not attempted yet') +
          '</div>' +
        '</button>'
      );
      if (best != null && best >= 80) card.classList.add('done');
      card.onclick = function () { showSim(sim.id, ''); };
      grid.appendChild(card);
    });
    screen.appendChild(grid);
    const back = el('<div class="row-actions fade"><button class="btn btn-ghost">← World Map</button></div>');
    back.querySelector('button').onclick = showMap;
    screen.appendChild(back);
    window.scrollTo(0, 0);
  }

  function showSim(id, prefill) {
    const sim = SIMULATIONS.filter(function (s) { return s.id === id; })[0];
    if (!sim) { showSimList(); return; }
    renderHud();
    screen.innerHTML = '';

    const clarify = sim.clarify.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('');
    const view = el(
      '<div class="fade">' +
        '<div class="level-head"><h1>🎯 ' + esc(sim.title) + '</h1>' +
          '<span class="pill">' + esc(sim.difficulty) + '</span></div>' +
        '<div class="story">' + esc(sim.prompt) + '</div>' +
        '<div class="panel">' +
          '<h4 class="sim-h">Clarifying questions worth asking first</h4>' +
          '<ul class="sim-clarify">' + clarify + '</ul>' +
          '<h4 class="sim-h">Your design</h4>' +
          '<div class="muted">Write freely. Name the classes (the nouns), how they relate (is-a / has-a), ' +
          'which design patterns and SOLID principles apply, and the edge cases. The more relevant ' +
          'concepts you name, the higher you score.</div>' +
          '<textarea id="simEditor" class="editor sim-editor" spellcheck="true" ' +
            'placeholder="Core classes: ...&#10;Relationships: ...&#10;Patterns &amp; SOLID: ...&#10;Edge cases: ..."></textarea>' +
          '<div class="row-actions">' +
            '<button id="simSubmit" class="btn btn-primary">Submit Design for Review</button>' +
            '<button id="simBack" class="btn btn-ghost">← All problems</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
    screen.appendChild(view);

    const editor = document.getElementById('simEditor');
    editor.value = prefill || '';
    document.getElementById('simSubmit').onclick = function () {
      if (editor.value.trim().length < 25) { toast('Sketch out a bit more detail first.'); return; }
      showSimResult(id, editor.value);
    };
    document.getElementById('simBack').onclick = showSimList;
    editor.focus();
    window.scrollTo(0, 0);
  }

  function showSimResult(id, text) {
    const sim = SIMULATIONS.filter(function (s) { return s.id === id; })[0];
    const g = gradeSim(sim, text);
    const prev = STATE.simBest[id];
    const isBest = prev == null || g.pct > prev;
    if (isBest) { STATE.simBest[id] = g.pct; save(); }
    renderHud();
    screen.innerHTML = '';

    const verdict = g.pct >= 80 ? 'Outstanding — this reads as interview-ready.'
      : g.pct >= 55 ? 'A solid design. Close the gaps marked below.'
      : 'A starting point — study the model answer, then revise.';

    let html = '<div class="fade">' +
      '<div class="level-head"><h1>🎯 Design Review</h1>' +
        '<span class="pill">' + esc(sim.title) + '</span></div>' +
      '<div class="panel">' +
        '<div class="sim-score">' +
          '<div class="sim-score-num">' + g.pct + '%</div>' +
          '<div><b>' + g.hits + ' / ' + g.total + ' key concepts covered</b>' +
          '<div class="muted">' + esc(verdict) +
          (isBest && prev != null ? ' &middot; new best!' : '') + '</div></div>' +
        '</div>';

    g.cats.forEach(function (c) {
      html += '<h4 class="sim-h">' + esc(c.category) + ' &mdash; ' + c.hits + '/' + c.total + '</h4>' +
        '<ul class="check-list">';
      c.items.forEach(function (it) {
        html += '<li class="' + (it.hit ? 'pass' : 'fail') + '">' +
          '<span class="mark">' + (it.hit ? '✔' : '○') + '</span>' + esc(it.label) + '</li>';
      });
      html += '</ul>';
    });

    html += '<h4 class="sim-h">📘 Model answer</h4>' +
      '<div class="lesson sim-model">' + sim.model + '</div>' +
      '<div class="muted" style="margin-top:10px">Scoring is based on keyword coverage — the model answer ' +
      'is the real teacher. Aim to reason through every category aloud, just as you would for an interviewer.</div>' +
      '<div class="row-actions">' +
        '<button id="simRetry" class="btn btn-primary">↻ Revise my design</button>' +
        '<button id="simOther" class="btn btn-ghost">Another problem</button>' +
        '<button id="simMap" class="btn btn-ghost">🗺️ World Map</button>' +
      '</div></div></div>';

    screen.appendChild(el(html));
    document.getElementById('simRetry').onclick = function () { showSim(id, text); };
    document.getElementById('simOther').onclick = showSimList;
    document.getElementById('simMap').onclick = showMap;
    window.scrollTo(0, 0);
  }

  // ---- boot --------------------------------------------------------
  document.getElementById('btn-reset').onclick = confirmReset;
  document.getElementById('btn-map').onclick = function () {
    if (STATE.hero) showMap();
  };
  document.getElementById('btn-forge').onclick = function () {
    if (STATE.hero) showForge();
    else toast('Name your hero first!');
  };
  document.getElementById('btn-sim').onclick = function () {
    if (STATE.hero) showSimList();
    else toast('Name your hero first!');
  };
  showTitle();
})();
