/**
 * OOP Quest — Interview Simulator
 * --------------------------------------------------------------
 * Open-ended LLD problems. The player writes a free-form design;
 * the game scans it for the concepts in each rubric item and
 * scores coverage, then reveals a full model answer.
 *
 * Each rubric item carries `keywords` — if ANY appears as a whole
 * word in the player's text, that item counts as covered.
 */
window.SIMULATIONS = [

  {
    id: 'sim_ttt',
    title: 'Two-Player Tic-Tac-Toe',
    difficulty: 'Warm-up',
    prompt: 'Design the object model for a two-player Tic-Tac-Toe game. It should be extensible to an N×N board, detect wins and draws, and reject illegal moves.',
    clarify: [
      'Fixed 3×3, or a configurable N×N board?',
      'Two human players, or also a computer opponent?',
      'How is a win detected — after every move, on rows / columns / diagonals?',
      'What happens on an illegal move — exception, or a rejected result?',
    ],
    rubric: [
      { category: 'Core Entities', items: [
        { label: 'A Game / GameController class to run the match', keywords: ['game', 'controller'] },
        { label: 'A Board (or Grid) holding the playing surface', keywords: ['board', 'grid'] },
        { label: 'A Cell / Position / Square as the unit of the board', keywords: ['cell', 'square', 'position', 'tile'] },
        { label: 'A Player class', keywords: ['player'] },
        { label: 'A Symbol / Mark / Piece (X and O)', keywords: ['symbol', 'mark', 'piece', 'token'] },
      ]},
      { category: 'Responsibilities & Modelling', items: [
        { label: 'Game has-a Board (composition, not inheritance)', keywords: ['composition', 'has-a', 'compose', 'contains'] },
        { label: 'Game tracks whose turn it is / alternates moves', keywords: ['turn', 'alternate', 'current player'] },
        { label: 'Board owns the win / draw checking logic', keywords: ['win', 'check', 'row', 'column', 'diagonal'] },
        { label: 'Encapsulated state — private fields, controlled mutation', keywords: ['private', 'encapsul', 'getter'] },
      ]},
      { category: 'Patterns & SOLID', items: [
        { label: 'An enum for the X / O symbol', keywords: ['enum'] },
        { label: 'Single Responsibility — Board, Game and Player kept separate', keywords: ['single responsibility', 'srp', 'separate'] },
        { label: 'Strategy pattern for a pluggable win-rule or AI player', keywords: ['strategy'] },
      ]},
      { category: 'Edge Cases & Validation', items: [
        { label: 'A draw / tie when the board fills with no winner', keywords: ['draw', 'tie'] },
        { label: 'Rejecting a move on an occupied or out-of-bounds cell', keywords: ['occupied', 'invalid', 'illegal', 'bounds', 'taken'] },
        { label: 'Rejecting moves after the game has already ended', keywords: ['over', 'finished', 'ended'] },
      ]},
    ],
    model: `
      <p><b>Entities.</b> <code>Game</code> orchestrates the match; <code>Board</code> holds an N×N grid of <code>Cell</code> objects; <code>Player</code> has a name and a <code>Symbol</code>; <code>Symbol</code> is an <code>enum {X, O, EMPTY}</code>. <code>Game</code> <i>has-a</i> <code>Board</code> and a list of <code>Player</code> — composition, never inheritance.</p>
      <p><b>Responsibilities.</b> <code>Game</code> tracks the current player and alternates turns. <code>Board</code> owns the grid state and exposes <code>placeMark(row, col, symbol)</code> plus <code>checkWinner()</code> / <code>isFull()</code>. Keep each <code>Cell</code>'s symbol private and mutate it only through <code>Board</code> — encapsulation protects the invariants.</p>
      <p><b>Patterns.</b> An <code>enum</code> for the symbol is type-safe and self-documenting. Keeping <code>Board</code>, <code>Game</code> and <code>Player</code> separate is SRP in action. To support a computer opponent, model the move-chooser as a <b>Strategy</b>: <code>interface MoveStrategy { Move chooseMove(Board b); }</code> with <code>HumanStrategy</code> and <code>AiStrategy</code> — that is also the Open/Closed Principle.</p>
      <p><b>Edge cases.</b> Detect a draw when the board is full and no one has won; reject a move on an occupied or out-of-bounds cell; reject any move once <code>GameState</code> is <code>WON</code> or <code>DRAW</code>. Model the result of a move as a small object or enum rather than throwing for ordinary rejections.</p>
    `,
  },

  {
    id: 'sim_library',
    title: 'Library Management System',
    difficulty: 'Easy',
    prompt: 'Design a library system. Members can search, borrow and return books. The library stocks multiple physical copies of a title, tracks due dates, and charges fines for late returns.',
    clarify: [
      'One physical copy per title, or several?',
      'Is there a borrowing limit per member?',
      'Can members reserve a title that is currently all loaned out?',
      'How is the fine calculated — flat, or per day overdue?',
    ],
    rubric: [
      { category: 'Core Entities', items: [
        { label: 'A Book (the title / catalogue entry)', keywords: ['book', 'title'] },
        { label: 'A BookCopy / BookItem (one physical copy)', keywords: ['copy', 'bookitem', 'item', 'physical'] },
        { label: 'A Member / User', keywords: ['member', 'user', 'borrower'] },
        { label: 'A Loan / BorrowRecord / Transaction', keywords: ['loan', 'borrowrecord', 'transaction', 'lending', 'checkout'] },
        { label: 'A Library / Catalog that owns the collection', keywords: ['library', 'catalog'] },
      ]},
      { category: 'Responsibilities & Modelling', items: [
        { label: 'Distinguish a Book (title) from its many physical copies', keywords: ['copy', 'copies', 'physical'] },
        { label: 'A Member has-a set of active loans', keywords: ['loan', 'borrow'] },
        { label: 'Each loan records an issue date and a due date', keywords: ['due', 'date', 'deadline'] },
        { label: 'Search the catalogue by title / author / subject', keywords: ['search', 'query', 'find'] },
      ]},
      { category: 'Patterns & SOLID', items: [
        { label: 'An enum for copy status (AVAILABLE / LOANED / RESERVED)', keywords: ['enum', 'status', 'state'] },
        { label: 'Strategy pattern for the fine-calculation rule', keywords: ['strategy', 'fine strategy'] },
        { label: 'Observer pattern for due-date / availability notifications', keywords: ['observer', 'notify', 'notification'] },
        { label: 'Single Responsibility — search, lending and fines kept separate', keywords: ['single responsibility', 'srp', 'separate'] },
      ]},
      { category: 'Edge Cases & Validation', items: [
        { label: 'All copies of a title are currently loaned out', keywords: ['unavailable', 'all loaned', 'out of stock', 'no copies'] },
        { label: 'Overdue returns and fine charging', keywords: ['overdue', 'late', 'fine'] },
        { label: 'A member hitting their borrowing limit', keywords: ['limit', 'maximum', 'max'] },
        { label: 'Reserving / holding a title that is unavailable', keywords: ['reserve', 'reservation', 'hold', 'waitlist'] },
      ]},
    ],
    model: `
      <p><b>Entities.</b> The crucial modelling decision: separate <code>Book</code> (the title — ISBN, author, subject) from <code>BookCopy</code> (one physical, borrowable item with a barcode). One <code>Book</code> <i>has many</i> <code>BookCopy</code>. <code>Member</code> represents a borrower; <code>Loan</code> links one <code>BookCopy</code> to one <code>Member</code> with an issue date and due date; <code>Library</code> / <code>Catalog</code> owns the whole collection.</p>
      <p><b>Responsibilities.</b> <code>Catalog</code> handles search by title / author / subject. <code>Member</code> holds its active <code>Loan</code> list. A <code>LendingService</code> issues and returns copies; a <code>FineService</code> computes fines. Splitting these is the Single Responsibility Principle — search rules, lending rules and fine rules each change for different reasons.</p>
      <p><b>Patterns.</b> A <code>BookStatus</code> <code>enum {AVAILABLE, LOANED, RESERVED, LOST}</code> models a copy's state safely. The fine rule (flat vs per-day vs member-tier) is a <b>Strategy</b>: <code>interface FineStrategy { double fine(Loan loan); }</code>. Due-date reminders and "your reserved book is back" alerts are a natural <b>Observer</b>: members subscribe and are notified.</p>
      <p><b>Edge cases.</b> Handle every copy of a title being loaned out (offer a reservation / hold queue); overdue returns triggering fines; a member exceeding their borrow limit; and reserving an unavailable title. Mention concurrency if two members race for the last copy.</p>
    `,
  },

  {
    id: 'sim_movie',
    title: 'Movie Ticket Booking System',
    difficulty: 'Medium',
    prompt: 'Design a BookMyShow-style system. Users browse movies by city, pick a show at a theatre, choose seats, and pay. Two users must never be sold the same seat.',
    clarify: [
      'One city or many? Many theatres per city?',
      'Are seats typed (regular / premium / recliner) with different prices?',
      'How long is a seat held before payment must complete?',
      'Is partial booking allowed, or all-seats-or-nothing?',
    ],
    rubric: [
      { category: 'Core Entities', items: [
        { label: 'Movie', keywords: ['movie', 'film'] },
        { label: 'Theatre / Cinema and its Screens / Audis', keywords: ['theatre', 'theater', 'cinema', 'screen', 'auditorium', 'hall'] },
        { label: 'Show / Showtime (a movie on a screen at a time)', keywords: ['show', 'showtime', 'screening'] },
        { label: 'Seat (and seat type)', keywords: ['seat'] },
        { label: 'Booking / Reservation and Ticket', keywords: ['booking', 'reservation', 'ticket'] },
        { label: 'User / Customer and Payment', keywords: ['user', 'customer', 'payment'] },
      ]},
      { category: 'Responsibilities & Modelling', items: [
        { label: 'Theatre has-a list of Screens; a Screen hosts many Shows', keywords: ['has-a', 'composition', 'contains', 'compose'] },
        { label: 'A Show owns its seat availability map', keywords: ['availability', 'available', 'seat map'] },
        { label: 'A Booking links a User, a Show and chosen Seats', keywords: ['booking', 'links', 'associat'] },
        { label: 'Search / browse movies by city', keywords: ['city', 'search', 'browse', 'location'] },
      ]},
      { category: 'Patterns & SOLID', items: [
        { label: 'State pattern for the booking lifecycle (HELD → CONFIRMED → CANCELLED)', keywords: ['state', 'lifecycle'] },
        { label: 'Strategy pattern for pricing and/or payment method', keywords: ['strategy', 'pricing'] },
        { label: 'A seat lock / hold with a timeout to prevent double-selling', keywords: ['lock', 'hold', 'timeout', 'expire'] },
        { label: 'Dependency Inversion — depend on a PaymentGateway interface', keywords: ['interface', 'dependency inversion', 'dip', 'abstraction'] },
      ]},
      { category: 'Edge Cases & Concurrency', items: [
        { label: 'Two users selecting the same seat at once (concurrency)', keywords: ['concurren', 'race', 'simultaneous', 'thread', 'synchron'] },
        { label: 'A held seat being released when payment is not completed in time', keywords: ['timeout', 'expire', 'release'] },
        { label: 'Payment failure and rollback', keywords: ['payment fail', 'failure', 'rollback', 'declined'] },
        { label: 'Cancellation and refund', keywords: ['cancel', 'refund'] },
      ]},
    ],
    model: `
      <p><b>Entities.</b> <code>Movie</code>; <code>Theatre</code> <i>has-a</i> list of <code>Screen</code>; a <code>Screen</code> hosts many <code>Show</code> objects (a movie + a screen + a start time); each <code>Show</code> owns a map of <code>ShowSeat</code> (a physical <code>Seat</code> plus its status and price for that show). <code>Booking</code> links a <code>User</code>, a <code>Show</code> and the chosen seats; <code>Payment</code> settles it. A <code>City</code> groups theatres for browsing.</p>
      <p><b>Responsibilities.</b> A <code>SearchService</code> finds movies/shows by city. A <code>BookingService</code> coordinates seat selection, holding, and payment. Keep the <code>PaymentGateway</code> an interface so <code>BookingService</code> depends on the abstraction (Dependency Inversion) and is testable.</p>
      <p><b>The hard part — never double-sell a seat.</b> When a user selects seats, atomically move them from <code>AVAILABLE</code> to <code>HELD</code> (a lock) and start a short expiry timer. Only a successful payment promotes them to <code>BOOKED</code>; otherwise the hold expires and they return to <code>AVAILABLE</code>. The seat status transitions are a clean <b>State</b> pattern, and the per-seat lock guards against concurrent buyers. Pricing (per seat type, weekend surcharge) and payment method are each a <b>Strategy</b>.</p>
      <p><b>Edge cases.</b> Concurrent selection of the same seat (atomic hold / synchronisation); a hold expiring before payment; payment failure with rollback of the hold; and cancellation with a refund policy. Voice each one — interviewers grade exactly this.</p>
    `,
  },

  {
    id: 'sim_ratelimiter',
    title: 'API Rate Limiter',
    difficulty: 'Hard',
    prompt: 'Design a rate limiter for an API. It must allow at most N requests per client within a time window, decide allow/deny in O(1), be thread-safe, and support swapping the limiting algorithm.',
    clarify: [
      'Per user, per IP, or per API key?',
      'Which algorithm — fixed window, sliding window, token bucket, leaky bucket?',
      'Single server, or distributed across many servers?',
      'On a denied request — reject, or queue it?',
    ],
    rubric: [
      { category: 'Core Entities', items: [
        { label: 'A RateLimiter entry point', keywords: ['ratelimiter', 'rate limiter', 'limiter'] },
        { label: 'A Client / User / key the limit applies to', keywords: ['client', 'user', 'api key', 'key'] },
        { label: 'A Rule / Config (limit N and window size)', keywords: ['rule', 'config', 'limit', 'policy'] },
        { label: 'Per-client state (a bucket / counter / window)', keywords: ['bucket', 'counter', 'window', 'state'] },
      ]},
      { category: 'Responsibilities & Modelling', items: [
        { label: 'A single allow/deny decision method, e.g. allowRequest(clientId)', keywords: ['allow', 'deny', 'permit', 'decision'] },
        { label: 'Per-client state stored in a map for O(1) lookup', keywords: ['map', 'hashmap', 'o(1)', 'lookup'] },
        { label: 'Time / timestamps drive the window logic', keywords: ['time', 'timestamp', 'clock'] },
      ]},
      { category: 'Patterns & SOLID', items: [
        { label: 'Strategy pattern — the limiting algorithm is pluggable', keywords: ['strategy'] },
        { label: 'Names a concrete algorithm (token bucket / sliding window / leaky bucket / fixed window)', keywords: ['token bucket', 'sliding window', 'leaky bucket', 'fixed window'] },
        { label: 'Open/Closed — new algorithms added without editing the limiter', keywords: ['open/closed', 'open closed', 'ocp', 'extensible'] },
        { label: 'Dependency Inversion — depend on a strategy interface', keywords: ['interface', 'dependency inversion', 'dip', 'abstraction'] },
      ]},
      { category: 'Edge Cases & Scale', items: [
        { label: 'Thread-safety / concurrent requests from one client', keywords: ['thread', 'concurren', 'synchron', 'atomic', 'lock'] },
        { label: 'Distributed limiting across many servers (shared store, e.g. Redis)', keywords: ['distributed', 'redis', 'shared', 'cluster'] },
        { label: 'Burst traffic at a window boundary', keywords: ['burst', 'spike', 'boundary'] },
        { label: 'Memory cleanup / eviction of idle clients', keywords: ['evict', 'cleanup', 'expire', 'memory'] },
      ]},
    ],
    model: `
      <p><b>Entities.</b> <code>RateLimiter</code> is the entry point with one method: <code>boolean allowRequest(String clientId)</code>. A <code>Rule</code> holds the limit (N requests) and the window length. Per-client state — a counter, a token <code>Bucket</code>, or a timestamp log — lives in a <code>Map&lt;String, ClientState&gt;</code> so lookup is O(1).</p>
      <p><b>The key decision — make the algorithm pluggable.</b> Fixed window, sliding window log, sliding window counter, token bucket and leaky bucket all make the same allow/deny call differently. Put them behind a <b>Strategy</b>: <code>interface RateLimitStrategy { boolean allow(ClientState s, Rule r, long now); }</code>. A new algorithm is a new class — the <code>RateLimiter</code> never changes (Open/Closed), and it depends only on the interface (Dependency Inversion).</p>
      <p><b>Algorithm note.</b> Token bucket is a common default: each client has a bucket that refills at a steady rate; a request consumes a token, and is denied if the bucket is empty. It naturally allows controlled bursts. Mention that fixed-window counters are simplest but allow a 2× burst at the window edge — sliding window fixes that.</p>
      <p><b>Edge cases & scale.</b> Concurrent requests from one client need thread-safety — synchronise per-client state or use atomic counters. For multiple API servers, per-process state is wrong; the counters must move to a shared store such as Redis (distributed rate limiting). Also handle burst traffic at window boundaries and evict idle clients so the map does not grow forever.</p>
    `,
  },

];
