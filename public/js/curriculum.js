/**
 * OOP Quest — Curriculum
 * --------------------------------------------------------------
 * The entire 0 -> advanced journey, expressed as data.
 *
 * Structure:
 *   ACTS[]           -> a chapter of the story
 *     .levels[]      -> a quest node on the map
 *       .lesson      -> teaching content (HTML)
 *       .challenges[]-> what the player must clear to win the node
 *
 * Challenge types:
 *   mcq   : pick one option            { q, code?, options[], answer, explain }
 *   fill  : fill the blanks (___)       { q, code, blanks[], explain }
 *   order : drag code lines into order  { q, lines[], correct[], explain }
 *   code  : write Java, pattern-checked { q, starter, checks[], explain }
 *
 * `checks` are consumed by checker.js. See that file for the spec.
 */
window.CURRICULUM = [

/* ================================================================
 * ACT I — THE FOUNDATIONS
 * ============================================================== */
{
  id: 'act1',
  title: 'Act I — The Foundations',
  subtitle: 'Where every object is born.',
  color: '#4f8cff',
  levels: [
    {
      id: 'l1',
      title: 'Classes & Objects',
      xp: 100,
      story: 'You arrive at the Village of Blueprints. The elder hands you a scroll: "A class is a blueprint. An object is the house built from it. Master this, and the realm opens to you."',
      lesson: `
        <h4>What is Object-Oriented Programming?</h4>
        <p>OOP is a way of organising code around <b>objects</b> — bundles of <i>data</i> and the <i>behaviour</i> that acts on that data. Instead of one long script, you model your program as a set of cooperating objects, just like the real world is made of cooperating things.</p>
        <h4>Class vs Object</h4>
        <p>A <b>class</b> is a blueprint. It describes what something is and what it can do, but it is not the thing itself. An <b>object</b> (also called an <i>instance</i>) is a concrete thing created from that blueprint.</p>
        <pre>// The blueprint
public class Dog {
}

// Building real dogs from the blueprint
Dog rex   = new Dog();   // object 1
Dog bella = new Dog();   // object 2</pre>
        <p>One <code>Dog</code> class can produce unlimited <code>Dog</code> objects. The keyword <code>new</code> is what actually constructs an object in memory and hands you a reference to it.</p>
        <h4>Why it matters for interviews</h4>
        <p>Low-Level Design (LLD) interviews ask you to <i>model a system</i>. The very first move is always: "What are the classes (the nouns) in this problem?" Spotting good classes is the foundation of every answer you will ever give.</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'A class is to an object as ___ is to ___.',
          options: [
            'a house : a brick',
            'a blueprint : a house built from it',
            'a house : a blueprint',
            'a function : a variable',
          ],
          answer: 1,
          explain: 'The class is the blueprint (the description); the object is the real, built thing created from it.',
        },
        {
          type: 'mcq',
          q: 'Which keyword actually creates an object in Java?',
          code: 'Dog rex = ____ Dog();',
          options: ['create', 'object', 'new', 'class'],
          answer: 2,
          explain: '`new` allocates memory for the object and runs its constructor. `Dog rex = new Dog();` builds one Dog.',
        },
        {
          type: 'fill',
          q: 'Complete the blueprint declaration for a Robot.',
          code: 'public ___ Robot {\n}',
          blanks: ['class'],
          explain: 'A blueprint is declared with the `class` keyword.',
        },
        {
          type: 'code',
          q: 'Declare a public class named Hero. Just the empty blueprint is enough.',
          starter: '// Write your class below\n',
          checks: [
            { label: 'Declares a class named Hero', re: '\\bclass\\s+Hero\\b', hint: 'Write: public class Hero { }' },
            { label: 'It is public', re: 'public\\s+class\\s+Hero', hint: 'Add the `public` modifier before `class`.' },
            { label: 'Has a body { }', re: 'class\\s+Hero\\s*\\{[\\s\\S]*\\}', hint: 'A class needs an opening { and a closing }.' },
          ],
          explain: 'A class is the unit OOP is built on. Even an empty one is a valid blueprint.',
        },
      ],
    },
    {
      id: 'l2',
      title: 'State & Behaviour',
      xp: 120,
      story: 'The elder frowns at your empty blueprint. "A house with no rooms is useless. Give your class fields to hold its state, and methods to give it life."',
      lesson: `
        <h4>Fields = state, Methods = behaviour</h4>
        <p>An object is made of two things. <b>Fields</b> (also called instance variables or attributes) store the object's <i>state</i> — what it currently knows. <b>Methods</b> define its <i>behaviour</i> — what it can do.</p>
        <pre>public class Dog {
    // fields  -> state
    String name;
    int    age;

    // method  -> behaviour
    void bark() {
        System.out.println(name + " says: Woof!");
    }
}</pre>
        <h4>Each object owns its own state</h4>
        <p>Every object created from the class gets its <i>own copy</i> of the fields. Changing <code>rex.name</code> does not touch <code>bella.name</code>.</p>
        <pre>Dog rex = new Dog();
rex.name = "Rex";
rex.bark();        // Rex says: Woof!</pre>
        <h4>The dot operator</h4>
        <p><code>object.field</code> reads or writes state. <code>object.method()</code> runs behaviour. The dot means "reach into this specific object".</p>
        <h4>Interview lens</h4>
        <p>When modelling a system, ask of every class: "What does it need to <i>remember</i> (fields) and what does it need to <i>do</i> (methods)?" That single question produces most of a clean design.</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'In OOP terms, a field stores ___ and a method defines ___.',
          options: [
            'behaviour ; state',
            'state ; behaviour',
            'memory ; speed',
            'a class ; an object',
          ],
          answer: 1,
          explain: 'Fields hold state (data the object remembers); methods hold behaviour (what it does).',
        },
        {
          type: 'fill',
          q: 'Give the BankAccount a field for its balance and finish the method.',
          code: 'public class BankAccount {\n    double ___;\n\n    void deposit(double amount) {\n        balance = balance + ___;\n    }\n}',
          blanks: ['balance', 'amount'],
          explain: 'The field `balance` holds state; the parameter `amount` is added to it inside the behaviour.',
        },
        {
          type: 'mcq',
          q: 'rex and bella are two Dog objects. You run rex.name = "Rex". What is bella.name?',
          options: [
            'Also "Rex" — fields are shared',
            'Still whatever it was — each object owns its own fields',
            'It causes a compile error',
            'null, always',
          ],
          answer: 1,
          explain: 'Instance fields are per-object. Setting one object\'s field never affects another object.',
        },
        {
          type: 'code',
          q: 'Write a class Player with a String field called name and a method greet().',
          starter: 'public class Player {\n    // add a field and a method\n}\n',
          checks: [
            { label: 'Declares class Player', re: '\\bclass\\s+Player\\b', hint: 'public class Player { ... }' },
            { label: 'Has a String field name', re: 'String\\s+name\\s*;', hint: 'Add a field: String name;' },
            { label: 'Defines a greet() method', re: '\\bgreet\\s*\\(\\s*\\)\\s*\\{', hint: 'Add: void greet() { ... }' },
          ],
          explain: 'A class with state (name) and behaviour (greet) is a complete, useful object.',
        },
      ],
    },
    {
      id: 'l3',
      title: 'The Constructor Forge',
      xp: 140,
      story: 'In the Forge, objects are hammered into shape at the moment of birth. "Never let an object exist half-built," says the smith. "The constructor is its first breath."',
      lesson: `
        <h4>What a constructor does</h4>
        <p>A <b>constructor</b> is a special method that runs exactly once — when an object is created with <code>new</code>. Its job is to put the object into a valid starting state. It has the <i>same name as the class</i> and <i>no return type</i>.</p>
        <pre>public class Dog {
    String name;
    int    age;

    // constructor
    public Dog(String name, int age) {
        this.name = name;
        this.age  = age;
    }
}

Dog rex = new Dog("Rex", 3);   // born fully formed</pre>
        <h4>The <code>this</code> keyword</h4>
        <p><code>this</code> means "the current object". When a parameter and a field share a name, <code>this.name</code> is the field and <code>name</code> is the parameter. It removes ambiguity.</p>
        <h4>The default constructor</h4>
        <p>If you write <i>no</i> constructor, Java silently gives you an empty one. The moment you write <i>any</i> constructor, that free gift disappears — a common interview gotcha.</p>
        <h4>Constructor overloading</h4>
        <p>You can have several constructors with different parameter lists. One can call another with <code>this(...)</code>:</p>
        <pre>public Dog(String name) {
    this(name, 0);   // delegate to the other constructor
}</pre>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'Which statement about constructors is TRUE?',
          options: [
            'A constructor must declare a return type of void',
            'A constructor has the same name as the class and no return type',
            'A class can only ever have one constructor',
            'Constructors run every time a method is called',
          ],
          answer: 1,
          explain: 'Constructors share the class name, declare no return type, and run once at creation. A class may have many (overloading).',
        },
        {
          type: 'mcq',
          q: 'Inside a constructor, what does `this.name = name;` do?',
          options: [
            'Copies the field into the parameter',
            'Assigns the parameter `name` into the object\'s field `name`',
            'Creates a new object called name',
            'Nothing — it is a no-op',
          ],
          answer: 1,
          explain: '`this.name` is the field, `name` is the parameter. The line stores the incoming value into the object.',
        },
        {
          type: 'fill',
          q: 'Finish the constructor so the object is built correctly.',
          code: 'public class Point {\n    int x, y;\n    public ___(int x, int y) {\n        this.x = x;\n        ___.y = y;\n    }\n}',
          blanks: ['Point', 'this'],
          explain: 'The constructor name must match the class (Point); `this.y` targets the field.',
        },
        {
          type: 'code',
          q: 'Write a class Sword with an int field damage and a constructor that sets it.',
          starter: 'public class Sword {\n\n}\n',
          checks: [
            { label: 'Declares class Sword', re: '\\bclass\\s+Sword\\b', hint: 'public class Sword { ... }' },
            { label: 'Has an int field damage', re: 'int\\s+damage', hint: 'Add: int damage;' },
            { label: 'Has a constructor named Sword(...)', re: '\\bSword\\s*\\([^)]*\\)\\s*\\{', hint: 'Add: public Sword(int damage) { ... }' },
            { label: 'Uses this.damage to assign the field', re: 'this\\s*\\.\\s*damage\\s*=', hint: 'Inside the constructor: this.damage = damage;' },
          ],
          explain: 'The constructor guarantees a Sword always has its damage set the instant it exists.',
        },
      ],
    },
    {
      id: 'l4',
      title: 'The Encapsulation Vault',
      xp: 160,
      story: 'A thief just set a dragon\'s age to -500 and it vanished from existence. The Vault Keeper sighs: "Expose nothing. Guard your state behind walls and gates."',
      lesson: `
        <h4>Encapsulation — pillar #1</h4>
        <p><b>Encapsulation</b> means bundling data with the methods that use it, and <i>hiding the internal state</i> so it can only be changed in controlled ways. It is the first of the four pillars of OOP.</p>
        <h4>Access modifiers</h4>
        <p>These keywords control who can see a member: <code>private</code> (only this class), <code>protected</code> (this class + subclasses + package), <code>public</code> (everyone), and <i>default</i>/package-private (no keyword — same package only).</p>
        <h4>The private-field + public-getter/setter pattern</h4>
        <pre>public class BankAccount {
    private double balance;          // hidden state

    public double getBalance() {     // controlled read
        return balance;
    }

    public void deposit(double amt) {// controlled write
        if (amt &lt;= 0) throw new IllegalArgumentException("bad amount");
        balance += amt;
    }
}</pre>
        <p>Because <code>balance</code> is <code>private</code>, no outside code can write <code>account.balance = -999</code>. Every change must pass through <code>deposit()</code>, which can <i>validate</i> it. The object protects its own invariants.</p>
        <h4>Why interviewers love this</h4>
        <p>Encapsulation is what makes objects <i>trustworthy</i>. A class that cannot be put into an invalid state is a class you can reason about. "Make the field private and validate in the setter" is one of the most common pieces of design feedback you will hear.</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'What is the main purpose of encapsulation?',
          options: [
            'To make code run faster',
            'To hide internal state and allow change only through controlled methods',
            'To let any class read and write any field directly',
            'To remove the need for classes',
          ],
          answer: 1,
          explain: 'Encapsulation protects an object\'s invariants by hiding state and exposing controlled access.',
        },
        {
          type: 'mcq',
          q: 'Which access modifier means "visible only inside this same class"?',
          options: ['public', 'protected', 'private', 'default'],
          answer: 2,
          explain: '`private` is the most restrictive — only the declaring class can see the member.',
        },
        {
          type: 'fill',
          q: 'Lock down the field and complete the getter.',
          code: 'public class Hero {\n    ___ int health;\n\n    public int getHealth() {\n        ___ health;\n    }\n}',
          blanks: ['private', 'return'],
          explain: 'The field is hidden with `private`; the getter `return`s a copy of it for safe reading.',
        },
        {
          type: 'code',
          q: 'Write a class Dragon with a private int age and a setAge method that rejects negative values.',
          starter: 'public class Dragon {\n\n}\n',
          checks: [
            { label: 'Declares class Dragon', re: '\\bclass\\s+Dragon\\b', hint: 'public class Dragon { ... }' },
            { label: 'Field age is private', re: 'private\\s+int\\s+age', hint: 'Add: private int age;' },
            { label: 'Has a setAge method', re: '\\bsetAge\\s*\\([^)]*\\)\\s*\\{', hint: 'Add: public void setAge(int age) { ... }' },
            { label: 'Validates the input (uses if / throw)', re: '\\b(if|throw)\\b', hint: 'Inside setAge, check the value: if (age < 0) ... ' },
          ],
          explain: 'A private field plus a validating setter means a Dragon can never hold a negative age.',
        },
      ],
    },
    {
      id: 'boss1',
      title: 'BOSS — The Hollow Construct',
      xp: 250,
      boss: true,
      story: 'A creature of pure uninitialised memory blocks the gate to Act II. It can only be defeated by someone who truly understands what an object IS.',
      lesson: '',
      challenges: [
        {
          type: 'mcq',
          q: 'BOSS Q1 — You write `class Dog { }` with no constructor. Can you still do `new Dog()`?',
          options: [
            'No — a class with no constructor cannot be instantiated',
            'Yes — Java supplies a default no-arg constructor automatically',
            'Only if the class is abstract',
            'Only if you also write a main method',
          ],
          answer: 1,
          explain: 'With zero constructors written, Java auto-provides an empty default constructor.',
        },
        {
          type: 'mcq',
          q: 'BOSS Q2 — What breaks here? `public class Cat { public Cat(String n) { } }  ...  new Cat();`',
          options: [
            'Nothing — it compiles fine',
            'Once you declare a constructor, the free default constructor disappears, so new Cat() fails',
            'Cat must be abstract',
            'String n must be private',
          ],
          answer: 1,
          explain: 'Declaring ANY constructor removes the auto default. `new Cat()` no longer has a matching constructor.',
        },
        {
          type: 'mcq',
          q: 'BOSS Q3 — Why make a field private with a public setter instead of just making the field public?',
          options: [
            'It runs faster',
            'So the setter can validate input and protect the object\'s invariants',
            'Private fields use less memory',
            'There is no real difference',
          ],
          answer: 1,
          explain: 'The setter is a gate: it can reject bad values. A public field has no gate.',
        },
        {
          type: 'mcq',
          q: 'BOSS Q4 — Two objects of the same class always share...',
          options: [
            'The same instance field values',
            'The same class (blueprint), but each has its own instance field values',
            'Nothing at all',
            'The same memory address',
          ],
          answer: 1,
          explain: 'They share the blueprint and behaviour, but each carries its own independent state.',
        },
        {
          type: 'code',
          q: 'FINISHING BLOW — Write a fully encapsulated class Potion: private int healAmount, a constructor that sets it, and a public getter getHealAmount().',
          starter: 'public class Potion {\n\n}\n',
          checks: [
            { label: 'Declares class Potion', re: '\\bclass\\s+Potion\\b', hint: 'public class Potion { ... }' },
            { label: 'Field healAmount is private', re: 'private\\s+int\\s+healAmount', hint: 'private int healAmount;' },
            { label: 'Has a constructor Potion(...)', re: '\\bPotion\\s*\\([^)]*\\)\\s*\\{', hint: 'public Potion(int healAmount) { ... }' },
            { label: 'Uses this.healAmount in the constructor', re: 'this\\s*\\.\\s*healAmount\\s*=', hint: 'this.healAmount = healAmount;' },
            { label: 'Has a getHealAmount() getter', re: '\\bgetHealAmount\\s*\\(\\s*\\)\\s*\\{', hint: 'public int getHealAmount() { return healAmount; }' },
            { label: 'Getter returns the field', re: 'return\\s+healAmount', hint: 'The getter must `return healAmount;`' },
          ],
          explain: 'Private state + constructor + getter = a complete, trustworthy object. Act I is yours.',
        },
      ],
    },
  ],
},

/* ================================================================
 * ACT II — THE FOUR PILLARS
 * ============================================================== */
{
  id: 'act2',
  title: 'Act II — The Four Pillars',
  subtitle: 'Abstraction, Inheritance, Polymorphism, Interfaces.',
  color: '#9b6cff',
  levels: [
    {
      id: 'l5',
      title: 'The Tower of Abstraction',
      xp: 180,
      story: 'At the top of the Tower, the monk shows you a sealed door labelled "Shape". "You may speak of a Shape and ask its area — but no Shape may ever be built. Only its kinds."',
      lesson: `
        <h4>Abstraction — pillar #2</h4>
        <p><b>Abstraction</b> means exposing <i>what</i> something does while hiding <i>how</i> it does it. You program against a simple concept and ignore the messy details.</p>
        <h4>Abstract classes</h4>
        <p>An <code>abstract</code> class is an incomplete blueprint. It <i>cannot be instantiated</i> with <code>new</code>. It can hold normal fields and methods, plus <code>abstract</code> methods that have no body — subclasses are forced to fill them in.</p>
        <pre>public abstract class Shape {
    private String name;
    public Shape(String name) { this.name = name; }

    public String getName() { return name; }   // concrete

    public abstract double area();              // abstract — no body
}

public class Circle extends Shape {
    private double r;
    public Circle(double r) { super("Circle"); this.r = r; }

    @Override
    public double area() { return Math.PI * r * r; }
}</pre>
        <p><code>new Shape(...)</code> is illegal — Shape is abstract. But <code>new Circle(2)</code> works, and you can hold it in a <code>Shape</code> variable.</p>
        <h4>Abstract class vs interface (preview)</h4>
        <p>Use an <b>abstract class</b> when subclasses share real code and state. Use an <b>interface</b> (next levels) when you only need to agree on a contract. Knowing when to pick which is a classic interview question.</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'What happens if you try `new Shape("x")` where Shape is an abstract class?',
          options: [
            'It works and returns an empty Shape',
            'Compile error — abstract classes cannot be instantiated',
            'It returns null',
            'It throws a RuntimeException at runtime',
          ],
          answer: 1,
          explain: 'An abstract class is an incomplete blueprint; the compiler forbids instantiating it directly.',
        },
        {
          type: 'mcq',
          q: 'An abstract method is one that...',
          options: [
            'has a body but cannot be called',
            'is declared with no body — subclasses must provide the implementation',
            'can only return void',
            'runs automatically when the class loads',
          ],
          answer: 1,
          explain: 'Abstract methods declare a signature only; concrete subclasses are forced to implement them.',
        },
        {
          type: 'fill',
          q: 'Declare an abstract class with one abstract method.',
          code: 'public ___ class Animal {\n    public ___ void makeSound();\n}',
          blanks: ['abstract', 'abstract'],
          explain: 'Both the class and the body-less method need the `abstract` keyword.',
        },
        {
          type: 'code',
          q: 'Write an abstract class Vehicle with an abstract method maxSpeed() that returns int.',
          starter: '// abstract blueprint here\n',
          checks: [
            { label: 'Class Vehicle is abstract', re: 'abstract\\s+class\\s+Vehicle', hint: 'public abstract class Vehicle { ... }' },
            { label: 'Has an abstract maxSpeed method', re: 'abstract\\s+int\\s+maxSpeed\\s*\\(', hint: 'public abstract int maxSpeed();' },
            { label: 'maxSpeed has no body (ends with ;)', re: 'maxSpeed\\s*\\(\\s*\\)\\s*;', hint: 'An abstract method ends with a semicolon, not { }.' },
          ],
          explain: 'Vehicle defines the contract "every vehicle has a max speed" without saying what it is.',
        },
      ],
    },
    {
      id: 'l6',
      title: 'The Bloodline of Inheritance',
      xp: 200,
      story: 'The royal family tree glows on the wall. "A child inherits the gifts of its parent," the herald says, "and may add gifts of its own. This is how blueprints pass down power."',
      lesson: `
        <h4>Inheritance — pillar #3</h4>
        <p><b>Inheritance</b> lets one class (the <i>child</i> / <i>subclass</i>) reuse and extend another (the <i>parent</i> / <i>superclass</i>) using the <code>extends</code> keyword. The child gets the parent's fields and methods for free.</p>
        <pre>public class Animal {
    protected String name;
    public Animal(String name) { this.name = name; }
    public void eat() { System.out.println(name + " eats"); }
}

public class Dog extends Animal {
    public Dog(String name) {
        super(name);          // call the parent constructor
    }
    public void fetch() { System.out.println(name + " fetches"); }
}</pre>
        <p>A <code>Dog</code> can <code>eat()</code> (inherited) and <code>fetch()</code> (its own). <code>super(...)</code> calls the parent constructor and must be the first line of the child constructor.</p>
        <h4>The "is-a" test</h4>
        <p>Only use inheritance when the child genuinely <i>is a</i> kind of the parent. A Dog <i>is an</i> Animal — good. A Car <i>is not a</i> Engine — bad; a Car <i>has an</i> Engine. That is <b>composition</b>, and it should be your default.</p>
        <h4>Favour composition over inheritance</h4>
        <p>Deep inheritance trees are rigid and fragile. Modern design advice — and a frequent interview talking point — is: prefer <i>composition</i> (an object holding other objects) unless a true is-a relationship exists. Java also forbids extending more than one class (no multiple inheritance of classes).</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'Which keyword makes class Dog inherit from class Animal?',
          options: ['implements', 'inherits', 'extends', 'super'],
          answer: 2,
          explain: '`class Dog extends Animal` establishes the inheritance relationship.',
        },
        {
          type: 'mcq',
          q: 'Which of these is the CORRECT use of inheritance (a true "is-a")?',
          options: [
            'Car extends Engine',
            'Manager extends Employee',
            'House extends Door',
            'Order extends Database',
          ],
          answer: 1,
          explain: 'A Manager IS A (kind of) Employee. The others are has-a relationships — use composition.',
        },
        {
          type: 'fill',
          q: 'Complete the subclass and its call to the parent constructor.',
          code: 'public class Cat ___ Animal {\n    public Cat(String name) {\n        ___(name);\n    }\n}',
          blanks: ['extends', 'super'],
          explain: '`extends Animal` inherits; `super(name)` runs the parent constructor first.',
        },
        {
          type: 'code',
          q: 'Write a class Wizard that extends a class Character. Give Wizard a method castSpell().',
          starter: 'public class Wizard {\n\n}\n',
          scaffold: 'class Character { }',
          checks: [
            { label: 'Wizard extends Character', re: 'class\\s+Wizard\\s+extends\\s+Character', hint: 'public class Wizard extends Character { ... }' },
            { label: 'Defines a castSpell() method', re: '\\bcastSpell\\s*\\(\\s*\\)\\s*\\{', hint: 'Add: void castSpell() { ... }' },
          ],
          explain: 'Wizard reuses everything Character offers and adds spell-casting of its own.',
        },
      ],
    },
    {
      id: 'l7',
      title: 'The Hall of Many Faces',
      xp: 220,
      story: 'Every statue in the Hall is labelled "Animal", yet each speaks with its own voice when touched. "One name," whispers the curator, "many forms. This is the deepest magic."',
      lesson: `
        <h4>Polymorphism — pillar #4</h4>
        <p><b>Polymorphism</b> ("many forms") lets a single reference type behave differently depending on the actual object behind it. It is what makes OOP code flexible.</p>
        <h4>Method overriding (runtime polymorphism)</h4>
        <p>A subclass can <b>override</b> a parent method — same signature, new behaviour. Mark it <code>@Override</code> so the compiler checks you.</p>
        <pre>class Animal { public String sound() { return "..."; } }
class Dog extends Animal { @Override public String sound() { return "Woof"; } }
class Cat extends Animal { @Override public String sound() { return "Meow"; } }

Animal a = new Dog();
System.out.println(a.sound());   // "Woof" — decided at RUNTIME by the real object</pre>
        <p>The variable type is <code>Animal</code>, but the JVM looks at the <i>actual</i> object (<code>Dog</code>) to choose the method. This is <b>dynamic dispatch</b>.</p>
        <h4>Method overloading (compile-time polymorphism)</h4>
        <p><b>Overloading</b> is several methods with the <i>same name</i> but <i>different parameter lists</i> in the same class. The compiler picks one based on arguments.</p>
        <pre>int add(int a, int b)            { return a + b; }
double add(double a, double b)   { return a + b; }   // overload</pre>
        <h4>Why it wins interviews</h4>
        <p>Polymorphism lets you write code against a general type and add new subtypes <i>without touching existing code</i>. That is the engine behind the Open/Closed Principle you will meet in Act III.</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: '`Animal a = new Dog(); a.sound();` calls Dog\'s sound(). This is decided...',
          options: [
            'at compile time, from the variable type Animal',
            'at runtime, from the actual object type Dog (dynamic dispatch)',
            'randomly',
            'only if Dog is abstract',
          ],
          answer: 1,
          explain: 'Overridden methods are resolved at runtime based on the real object — dynamic dispatch.',
        },
        {
          type: 'mcq',
          q: 'What is the difference between overriding and overloading?',
          options: [
            'They are two words for the same thing',
            'Overriding = subclass redefines a parent method; Overloading = same method name, different parameters',
            'Overloading needs inheritance; overriding does not',
            'Overriding changes the method name',
          ],
          answer: 1,
          explain: 'Override: redefine inherited behaviour (runtime). Overload: same name, different parameter lists (compile-time).',
        },
        {
          type: 'mcq',
          q: 'Which annotation asks the compiler to verify you really are overriding a parent method?',
          options: ['@Overload', '@Inherit', '@Override', '@Polymorphic'],
          answer: 2,
          explain: '`@Override` makes the compiler fail loudly if the signature does not match a parent method.',
        },
        {
          type: 'code',
          q: 'In a class Knight that extends Character, override a method attack() and mark it with @Override.',
          starter: 'public class Knight extends Character {\n\n}\n',
          scaffold: 'class Character { public void attack() { } }',
          checks: [
            { label: 'Uses the @Override annotation', re: '@Override', hint: 'Put @Override on the line above the method.' },
            { label: 'Defines an attack() method', re: '\\battack\\s*\\(\\s*\\)\\s*\\{', hint: 'Add: public void attack() { ... }' },
          ],
          explain: 'Knight gives attack() its own behaviour; @Override guarantees the signature matches the parent.',
        },
      ],
    },
    {
      id: 'l8',
      title: 'The Pact of Interfaces',
      xp: 240,
      story: 'A bird, a plane, and a dragon all sign the same scroll: "I can Fly". None shares a bloodline, yet all honour the same pact. "An interface," says the scribe, "is a promise, not a family."',
      lesson: `
        <h4>What an interface is</h4>
        <p>An <b>interface</b> is a pure contract: a list of method signatures a class promises to provide. A class <code>implements</code> an interface and must supply every method.</p>
        <pre>public interface Flyable {
    void fly();                 // implicitly public & abstract
}

public class Bird   implements Flyable { public void fly(){ /*...*/ } }
public class Plane  implements Flyable { public void fly(){ /*...*/ } }</pre>
        <p>Bird and Plane share no parent, yet both are <code>Flyable</code>. You can treat them uniformly:</p>
        <pre>List&lt;Flyable&gt; squadron = List.of(new Bird(), new Plane());
for (Flyable f : squadron) f.fly();   // polymorphism via interface</pre>
        <h4>Interface vs abstract class</h4>
        <p>A class can <code>implement</code> <i>many</i> interfaces but <code>extend</code> only <i>one</i> class — interfaces give Java its multiple-inheritance of <i>type</i>. Use an <b>abstract class</b> when subtypes share state and code; use an <b>interface</b> when unrelated classes share only a capability.</p>
        <h4>Modern interfaces</h4>
        <p>Since Java 8 an interface may also have <code>default</code> methods (with a body) and <code>static</code> methods. Fields in an interface are always <code>public static final</code> constants.</p>
        <h4>Interview gold</h4>
        <p>"Program to an interface, not an implementation" is the single most repeated piece of OOP design advice. It is the foundation of loose coupling and the Dependency Inversion Principle.</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'A class uses which keyword to fulfil an interface contract?',
          options: ['extends', 'implements', 'inherits', 'uses'],
          answer: 1,
          explain: 'A class `implements` an interface (and `extends` a class).',
        },
        {
          type: 'mcq',
          q: 'In Java, a class can...',
          options: [
            'extend many classes and implement one interface',
            'extend one class and implement many interfaces',
            'extend many classes and implement many interfaces',
            'only ever extend, never implement',
          ],
          answer: 1,
          explain: 'Single inheritance of classes, but a class may implement any number of interfaces.',
        },
        {
          type: 'fill',
          q: 'Declare an interface and a class that fulfils it.',
          code: 'public ___ Drivable {\n    void drive();\n}\n\npublic class Car ___ Drivable {\n    public void drive() { }\n}',
          blanks: ['interface', 'implements'],
          explain: 'Declare with `interface`; a class fulfils the contract with `implements`.',
        },
        {
          type: 'code',
          q: 'Write an interface Weapon with a method use(), and a class Bow that implements it.',
          starter: '// interface then class\n',
          checks: [
            { label: 'Declares interface Weapon', re: 'interface\\s+Weapon', hint: 'public interface Weapon { ... }' },
            { label: 'Weapon declares use()', re: '\\buse\\s*\\(\\s*\\)\\s*;', hint: 'Inside the interface: void use();' },
            { label: 'Bow implements Weapon', re: 'class\\s+Bow\\s+implements\\s+Weapon', hint: 'public class Bow implements Weapon { ... }' },
            { label: 'Bow provides a use() body', re: '\\buse\\s*\\(\\s*\\)\\s*\\{', hint: 'In Bow: public void use() { ... }' },
          ],
          explain: 'Any class can be a Weapon by signing the contract — no shared bloodline required.',
        },
      ],
    },
    {
      id: 'boss2',
      title: 'BOSS — The Shapeshifter',
      xp: 350,
      boss: true,
      story: 'It wears the face of every class you have met. To strike it, you must name the pillar behind each of its forms.',
      lesson: '',
      challenges: [
        {
          type: 'mcq',
          q: 'BOSS Q1 — "Hiding internal state behind controlled methods" is which pillar?',
          options: ['Inheritance', 'Encapsulation', 'Polymorphism', 'Abstraction'],
          answer: 1,
          explain: 'Encapsulation = bundling + hiding state behind controlled access.',
        },
        {
          type: 'mcq',
          q: 'BOSS Q2 — "Exposing what something does while hiding how" is which pillar?',
          options: ['Abstraction', 'Inheritance', 'Encapsulation', 'Composition'],
          answer: 0,
          explain: 'Abstraction = what, not how. Abstract classes and interfaces are its tools.',
        },
        {
          type: 'mcq',
          q: 'BOSS Q3 — `Animal a = new Cat(); a.sound();` printing "Meow" demonstrates...',
          options: ['Encapsulation', 'Overloading', 'Runtime polymorphism (overriding + dynamic dispatch)', 'Abstraction'],
          answer: 2,
          explain: 'The real object (Cat) decides the method at runtime — runtime polymorphism.',
        },
        {
          type: 'mcq',
          q: 'BOSS Q4 — You need 3 unrelated classes to all be "Exportable". Best tool?',
          options: [
            'Make them all extend one abstract Exportable class',
            'Have each implement an Exportable interface',
            'Copy the export code into each class',
            'Use a static method',
          ],
          answer: 1,
          explain: 'Unrelated classes sharing only a capability is the textbook case for an interface.',
        },
        {
          type: 'mcq',
          q: 'BOSS Q5 — A Car has an Engine. The Car/Engine relationship should be modelled with...',
          options: ['Inheritance (Car extends Engine)', 'Composition (Car holds an Engine field)', 'An interface', 'Overloading'],
          answer: 1,
          explain: 'has-a => composition. is-a => inheritance. A Car has-a Engine.',
        },
        {
          type: 'code',
          q: 'FINISHING BLOW — Write an abstract class Monster with an abstract method attack(), then a class Goblin that extends Monster and overrides attack() with @Override.',
          starter: '// abstract class, then subclass\n',
          checks: [
            { label: 'Monster is an abstract class', re: 'abstract\\s+class\\s+Monster', hint: 'public abstract class Monster { ... }' },
            { label: 'Monster declares abstract attack()', re: 'abstract\\s+\\w+\\s+attack\\s*\\(', hint: 'public abstract void attack();' },
            { label: 'Goblin extends Monster', re: 'class\\s+Goblin\\s+extends\\s+Monster', hint: 'public class Goblin extends Monster { ... }' },
            { label: 'Goblin uses @Override', re: '@Override', hint: 'Mark the overriding method with @Override.' },
            { label: 'Goblin implements attack() with a body', re: 'attack\\s*\\(\\s*\\)\\s*\\{', hint: 'public void attack() { ... }' },
          ],
          explain: 'Abstraction + inheritance + polymorphism in one strike. The Shapeshifter falls.',
        },
      ],
    },
  ],
},

/* ================================================================
 * ACT III — THE SOLID TEMPLE
 * ============================================================== */
{
  id: 'act3',
  title: 'Act III — The SOLID Temple',
  subtitle: 'Five principles that separate good design from bad.',
  color: '#ff9f43',
  levels: [
    {
      id: 'l9',
      title: 'S — Single Responsibility',
      xp: 260,
      story: 'A blacksmith who also cooks, banks, and heals burns the soup, loses the gold, and breaks the swords. "One worker, one job," says the temple guide.',
      lesson: `
        <h4>SOLID — five principles of good OOP design</h4>
        <p>SOLID is an acronym for five principles (Robert C. Martin) that keep object-oriented code flexible and maintainable. The Temple has one level per letter: <b>S</b>RP, <b>O</b>CP, <b>L</b>SP, <b>I</b>SP, <b>D</b>IP.</p>
        <h4>S — Single Responsibility Principle</h4>
        <p><i>"A class should have only one reason to change."</i> Each class should do one job. If a class handles business logic <i>and</i> database access <i>and</i> formatting, three unrelated forces can each make you edit it — and a change for one can break another.</p>
        <h4>Smell vs fix</h4>
        <pre>// ✗ violates SRP — three responsibilities in one class
class Invoice {
    void calculateTotal() { }
    void saveToDatabase()  { }   // persistence
    void printAsPdf()      { }   // presentation
}

// ✓ one responsibility each
class Invoice          { void calculateTotal() { } }
class InvoiceRepository{ void save(Invoice i)  { } }
class InvoicePrinter   { void printPdf(Invoice i){ } }</pre>
        <p>Now a change to the PDF layout touches only <code>InvoicePrinter</code>; the database schema touches only <code>InvoiceRepository</code>. Each class has exactly <i>one reason to change</i>.</p>
        <h4>Interview tip</h4>
        <p>When you describe a class in an LLD interview and find yourself saying "and" a lot ("it calculates <i>and</i> saves <i>and</i> emails"), that is the SRP alarm. Split it.</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'The Single Responsibility Principle says a class should have...',
          options: [
            'only one method',
            'only one reason to change',
            'only one field',
            'only one subclass',
          ],
          answer: 1,
          explain: 'SRP is about reasons to change — one job, one axis of change, per class.',
        },
        {
          type: 'mcq',
          q: 'Which class most clearly VIOLATES SRP?',
          options: [
            'class TaxCalculator { double calculate(Order o) }',
            'class UserValidator { boolean isValid(User u) }',
            'class ReportManager { build(); saveToDb(); emailToBoss(); printPdf(); }',
            'class Logger { void log(String msg) }',
          ],
          answer: 2,
          explain: 'ReportManager builds, persists, emails, and prints — four responsibilities, four reasons to change.',
        },
        {
          type: 'mcq',
          q: 'You split a god-class into UserService, UserRepository, and UserMailer. The main benefit is...',
          options: [
            'The code runs measurably faster',
            'A change to email logic no longer risks breaking persistence or business logic',
            'You write fewer total lines of code',
            'You no longer need interfaces',
          ],
          answer: 1,
          explain: 'Isolating responsibilities isolates change — that is the whole point of SRP.',
        },
        {
          type: 'code',
          q: 'Following SRP, write a class OrderValidator whose ONLY job is validation — give it a single method validate().',
          starter: 'public class OrderValidator {\n\n}\n',
          scaffold: 'class Order { }',
          checks: [
            { label: 'Declares class OrderValidator', re: 'class\\s+OrderValidator', hint: 'public class OrderValidator { ... }' },
            { label: 'Has a validate() method', re: '\\bvalidate\\s*\\([^)]*\\)\\s*\\{', hint: 'Add: boolean validate(...) { ... }' },
            { label: 'Does NOT also save to a database', re: '\\bsave|database|jdbc', forbid: true, hint: 'Keep persistence OUT — that is another class\'s job.' },
            { label: 'Does NOT also print/email', re: '\\bprint|email|sendMail', forbid: true, hint: 'Validation only. Printing and emailing belong elsewhere.' },
          ],
          explain: 'One class, one job. OrderValidator only ever changes when validation rules change.',
        },
      ],
    },
    {
      id: 'l10',
      title: 'O — Open/Closed',
      xp: 280,
      story: 'Every time a new payment type appears, the scribes tear open the sacred ledger and rewrite it — and every rewrite spawns new bugs. "Extend the ledger," the guide says, "do not reopen it."',
      lesson: `
        <h4>O — Open/Closed Principle</h4>
        <p><i>"Software entities should be open for extension, but closed for modification."</i> You should be able to add new behaviour by adding <i>new</i> code, not by editing <i>existing, tested</i> code.</p>
        <h4>The smell: a growing switch</h4>
        <pre>// ✗ every new shape forces an edit here
double area(Shape s) {
    if (s.type == CIRCLE)    return ...;
    else if (s.type == SQUARE) return ...;
    else if (s.type == TRIANGLE) return ...;   // edit again... and again
}</pre>
        <h4>The fix: polymorphism</h4>
        <pre>interface Shape { double area(); }
class Circle implements Shape { public double area(){ return ...; } }
class Square implements Shape { public double area(){ return ...; } }

double area(Shape s) { return s.area(); }   // never changes again</pre>
        <p>To add a <code>Triangle</code> you write a <i>new</i> class. The <code>area()</code> caller — already tested and trusted — is never touched. The system is <b>open</b> to new shapes, <b>closed</b> to modification.</p>
        <h4>How OCP is achieved</h4>
        <p>OCP is enabled by abstraction and polymorphism: depend on an interface/abstract type, and let new subclasses plug in. A long <code>if/else</code> or <code>switch</code> on a "type" field is the classic OCP violation interviewers look for.</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'Open/Closed Principle: a class should be open for ___ and closed for ___.',
          options: [
            'modification ; extension',
            'extension ; modification',
            'reading ; writing',
            'testing ; deployment',
          ],
          answer: 1,
          explain: 'Add behaviour by extending (new code); avoid modifying existing, working code.',
        },
        {
          type: 'mcq',
          q: 'A method has a 6-branch `switch (animal.type)`. Adding a 7th animal means editing it. Best OCP fix?',
          options: [
            'Add a 7th case to the switch',
            'Make each animal a class implementing a common interface with its own behaviour method',
            'Convert the switch to if/else',
            'Make the method static',
          ],
          answer: 1,
          explain: 'Replace the type-switch with polymorphism so new types are new classes, not edits.',
        },
        {
          type: 'mcq',
          q: 'Which language features make OCP possible?',
          options: [
            'static methods and global variables',
            'abstraction and polymorphism (interfaces / overriding)',
            'private fields only',
            'long switch statements',
          ],
          answer: 1,
          explain: 'Depending on an abstraction and letting subtypes plug in is exactly how OCP is achieved.',
        },
        {
          type: 'code',
          q: 'Create the abstraction for an OCP-friendly design: an interface Discount with a method apply(double price) returning double.',
          starter: '// the extension point\n',
          checks: [
            { label: 'Declares interface Discount', re: 'interface\\s+Discount', hint: 'public interface Discount { ... }' },
            { label: 'Has apply(double ...) returning double', re: 'double\\s+apply\\s*\\(\\s*double', hint: 'double apply(double price);' },
            { label: 'apply has no body (it is the contract)', re: 'apply\\s*\\([^)]*\\)\\s*;', hint: 'In an interface the method ends with ; not { }.' },
          ],
          explain: 'New discount types now arrive as new classes implementing Discount — existing code stays closed.',
        },
      ],
    },
    {
      id: 'l11',
      title: 'L — Liskov Substitution',
      xp: 300,
      story: 'A Penguin was filed under "Bird", and the moment the squadron took off it crashed the whole flight. "If a subtype cannot stand in for its parent," the guide warns, "the bloodline is a lie."',
      lesson: `
        <h4>L — Liskov Substitution Principle</h4>
        <p><i>"Subtypes must be substitutable for their base type."</i> Anywhere code expects a <code>Bird</code>, you should be able to hand it <i>any</i> subclass of <code>Bird</code> and nothing should break or behave surprisingly.</p>
        <h4>The classic violation</h4>
        <pre>class Bird            { void fly() { } }
class Penguin extends Bird {
    void fly() { throw new UnsupportedOperationException(); } // ✗
}

void migrate(Bird b) { b.fly(); }   // explodes when given a Penguin</pre>
        <p>A <code>Penguin</code> IS-A <code>Bird</code> biologically, but it is <i>not substitutable</i> for a flying Bird. Code written against <code>Bird</code> assumed <code>fly()</code> works.</p>
        <h4>The fix: model capabilities honestly</h4>
        <pre>class Bird { }
interface Flyable { void fly(); }
class Sparrow extends Bird implements Flyable { public void fly(){ } }
class Penguin extends Bird { /* simply not Flyable */ }</pre>
        <h4>Rules a subclass must respect</h4>
        <p>A subtype must not strengthen preconditions, weaken postconditions, throw new unexpected exceptions, or remove behaviour the parent promised. Overriding a method just to throw "not supported" is the loudest LSP alarm — and the famous Rectangle/Square problem is the same trap.</p>
        <h4>Interview note</h4>
        <p>LSP reframes inheritance: it is not about "is-a" in English, it is about "is <i>behaviourally substitutable</i> for". If a subclass breaks the parent's contract, prefer composition or a separate interface.</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'The Liskov Substitution Principle requires that...',
          options: [
            'every class has at most one subclass',
            'objects of a subclass can replace objects of the base class without breaking the program',
            'subclasses never add new methods',
            'all subclasses are abstract',
          ],
          answer: 1,
          explain: 'LSP = a subtype must be a safe, behaviour-preserving stand-in for its base type.',
        },
        {
          type: 'mcq',
          q: 'Which is a textbook LSP violation?',
          options: [
            'A subclass adds an extra method',
            'A subclass overrides a method only to throw UnsupportedOperationException',
            'A subclass calls super() in its constructor',
            'A subclass implements an interface',
          ],
          answer: 1,
          explain: 'Overriding to throw "not supported" removes promised behaviour — callers of the base type break.',
        },
        {
          type: 'mcq',
          q: 'Penguin extends Bird, but Bird.fly() is meaningless for it. The LSP-honest fix is to...',
          options: [
            'Leave it and just document it',
            'Move fly() out of Bird into a Flyable interface that only flying birds implement',
            'Make Penguin.fly() print a warning',
            'Make Bird abstract',
          ],
          answer: 1,
          explain: 'Model the capability separately so only birds that can truly fly are Flyable.',
        },
        {
          type: 'code',
          q: 'Design honestly: write an interface Swimmer with a swim() method (a capability a subclass can opt into without breaking substitutability).',
          starter: '// capability interface\n',
          checks: [
            { label: 'Declares interface Swimmer', re: 'interface\\s+Swimmer', hint: 'public interface Swimmer { ... }' },
            { label: 'Declares swim()', re: '\\bswim\\s*\\(\\s*\\)\\s*;', hint: 'void swim();' },
          ],
          explain: 'Capability interfaces let a class claim only what it can truly deliver — LSP stays intact.',
        },
      ],
    },
    {
      id: 'l12',
      title: 'I — Interface Segregation',
      xp: 320,
      story: 'The Worker\'s Pact demands every signer can "work, eat, AND sleep". The tireless Robot can work — but is now forced to fake eating and sleeping. "No one should sign promises they cannot keep."',
      lesson: `
        <h4>I — Interface Segregation Principle</h4>
        <p><i>"No client should be forced to depend on methods it does not use."</i> Prefer many small, focused interfaces over one large, "fat" interface.</p>
        <h4>The fat-interface smell</h4>
        <pre>// ✗ fat interface
interface Worker {
    void work();
    void eat();
    void sleep();
}
class Robot implements Worker {
    public void work()  { }
    public void eat()   { /* meaningless — forced to implement */ }
    public void sleep() { /* meaningless — forced to implement */ }
}</pre>
        <h4>The fix: segregate</h4>
        <pre>interface Workable { void work(); }
interface Eatable  { void eat(); }
interface Sleepable{ void sleep(); }

class Human implements Workable, Eatable, Sleepable { /* all 3 */ }
class Robot implements Workable { /* only what it can do */ }</pre>
        <p>Each class implements exactly the contracts that make sense for it. Clients depend only on the slice they need.</p>
        <h4>ISP and SRP are cousins</h4>
        <p>ISP is essentially SRP applied to interfaces. A fat interface forces empty/throwing implementations — which then drags in LSP violations too. Small role interfaces keep the whole design honest.</p>
        <h4>Interview tip</h4>
        <p>If implementers of your interface keep leaving methods empty or throwing "not supported", the interface is too fat. Split it along the lines of who actually uses what.</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'Interface Segregation Principle says...',
          options: [
            'every class needs its own interface',
            'no client should be forced to depend on methods it does not use',
            'interfaces should have as many methods as possible',
            'interfaces cannot have default methods',
          ],
          answer: 1,
          explain: 'ISP: keep interfaces small and role-focused so implementers are not forced into useless methods.',
        },
        {
          type: 'mcq',
          q: 'A class implements interface Machine but leaves 3 of its 5 methods empty. This signals...',
          options: [
            'a fat interface that should be split (ISP violation)',
            'good design — flexibility',
            'a missing constructor',
            'nothing — empty methods are normal',
          ],
          answer: 0,
          explain: 'Empty/forced implementations are the classic ISP alarm — the interface is too broad.',
        },
        {
          type: 'mcq',
          q: 'ISP can be summed up as...',
          options: [
            'SRP applied to interfaces — one focused role per interface',
            'a rule that bans inheritance',
            'a way to make code run faster',
            'the same thing as encapsulation',
          ],
          answer: 0,
          explain: 'A focused, single-role interface is SRP\'s idea expressed at the interface level.',
        },
        {
          type: 'code',
          q: 'Split a fat interface: write two small interfaces — Printer with print() and Scanner with scan().',
          starter: '// two focused interfaces\n',
          checks: [
            { label: 'Declares interface Printer', re: 'interface\\s+Printer', hint: 'public interface Printer { ... }' },
            { label: 'Printer declares print()', re: '\\bprint\\s*\\(\\s*\\)\\s*;', hint: 'void print();' },
            { label: 'Declares interface Scanner', re: 'interface\\s+Scanner', hint: 'public interface Scanner { ... }' },
            { label: 'Scanner declares scan()', re: '\\bscan\\s*\\(\\s*\\)\\s*;', hint: 'void scan();' },
          ],
          explain: 'A plain printer implements only Printer; a multifunction device implements both. Nobody fakes a method.',
        },
      ],
    },
    {
      id: 'l13',
      title: 'D — Dependency Inversion',
      xp: 340,
      story: 'The Royal Messenger only knows how to shout. When the kingdom switched to ravens, the whole court had to be rebuilt. "Depend on the idea of a Messenger," the guide says, "never on one mouth."',
      lesson: `
        <h4>D — Dependency Inversion Principle</h4>
        <p><i>"High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details; details should depend on abstractions."</i></p>
        <h4>The smell: a concrete dependency</h4>
        <pre>// ✗ high-level class welded to a low-level detail
class NotificationService {
    private EmailSender sender = new EmailSender();   // hard-wired
    void notify(String msg) { sender.send(msg); }
}</pre>
        <p>To switch to SMS you must edit <code>NotificationService</code> — and you cannot unit-test it without sending real email.</p>
        <h4>The fix: depend on an abstraction + inject it</h4>
        <pre>interface MessageSender { void send(String msg); }

class EmailSender implements MessageSender { public void send(String m){ } }
class SmsSender   implements MessageSender { public void send(String m){ } }

class NotificationService {
    private final MessageSender sender;
    NotificationService(MessageSender sender) {   // injected
        this.sender = sender;
    }
    void notify(String msg) { sender.send(msg); }
}</pre>
        <p>Now <code>NotificationService</code> depends only on the <code>MessageSender</code> abstraction. You pick the concrete sender from outside — this is <b>Dependency Injection</b>, the most common way to apply DIP.</p>
        <h4>Why "inversion"?</h4>
        <p>Normally high-level code would point down to low-level details. DIP <i>inverts</i> that: both point at an abstraction in the middle. The result is loose coupling, easy swapping, and trivial testing (pass a fake sender).</p>
        <p>This closes the SOLID Temple — and notice DIP is just "program to an interface" from Act II, scaled up to architecture.</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'Dependency Inversion Principle says high-level and low-level modules should both depend on...',
          options: [
            'each other directly',
            'abstractions (interfaces), not concrete classes',
            'the main method',
            'static utility classes',
          ],
          answer: 1,
          explain: 'Both layers depend on an abstraction in the middle — neither depends on the other\'s concrete details.',
        },
        {
          type: 'mcq',
          q: '`private EmailSender sender = new EmailSender();` inside a service violates DIP because...',
          options: [
            'EmailSender is too slow',
            'the high-level service is hard-wired to a concrete low-level class and cannot be swapped or mocked',
            'the field should be public',
            'you cannot call send() on it',
          ],
          answer: 1,
          explain: 'Hard `new`-ing a concrete class welds the high-level module to a detail — exactly what DIP forbids.',
        },
        {
          type: 'mcq',
          q: 'Passing a MessageSender into a constructor instead of newing one inside is called...',
          options: ['Dependency Injection', 'Method overloading', 'Encapsulation', 'Garbage collection'],
          answer: 0,
          explain: 'Supplying a dependency from outside is Dependency Injection — the usual way to apply DIP.',
        },
        {
          type: 'code',
          q: 'Apply DIP: write a class ReportService that holds a private final Storage field (Storage is an interface) and receives it through its constructor.',
          starter: '// Storage is already defined for you:\n// interface Storage { void save(String data); }\npublic class ReportService {\n\n}\n',
          scaffold: 'interface Storage { void save(String data); }',
          checks: [
            { label: 'Declares class ReportService', re: 'class\\s+ReportService', hint: 'public class ReportService { ... }' },
            { label: 'Has a Storage field', re: 'Storage\\s+\\w+\\s*;', hint: 'private final Storage storage;' },
            { label: 'Constructor takes a Storage parameter', re: 'ReportService\\s*\\(\\s*Storage', hint: 'public ReportService(Storage storage) { ... }' },
            { label: 'Does NOT new a concrete storage class', re: 'new\\s+\\w*Storage\\s*\\(', forbid: true, hint: 'Do not `new` it inside — inject it through the constructor.' },
          ],
          explain: 'ReportService depends only on the Storage abstraction; the concrete one is injected. Loose coupling achieved.',
        },
      ],
    },
    {
      id: 'boss3',
      title: 'BOSS — The Rigid Colossus',
      xp: 450,
      boss: true,
      story: 'A statue of tangled, welded code — every limb depends on every other. Strike each joint with the right SOLID letter and it crumbles.',
      lesson: '',
      challenges: [
        {
          type: 'mcq',
          q: 'BOSS Q1 — "A class should have only one reason to change" is which letter?',
          options: ['S', 'O', 'L', 'D'],
          answer: 0,
          explain: 'S — Single Responsibility Principle.',
        },
        {
          type: 'mcq',
          q: 'BOSS Q2 — Adding a feature should mean writing new classes, not editing tested ones. Which letter?',
          options: ['L', 'O', 'I', 'D'],
          answer: 1,
          explain: 'O — Open/Closed Principle: open for extension, closed for modification.',
        },
        {
          type: 'mcq',
          q: 'BOSS Q3 — A subclass that throws UnsupportedOperationException for an inherited method violates...',
          options: ['ISP', 'SRP', 'LSP', 'OCP'],
          answer: 2,
          explain: 'L — Liskov Substitution: the subtype is no longer a safe stand-in for its base.',
        },
        {
          type: 'mcq',
          q: 'BOSS Q4 — A class is forced to implement 4 interface methods it never uses. Which letter is violated?',
          options: ['I', 'S', 'D', 'O'],
          answer: 0,
          explain: 'I — Interface Segregation: no client should depend on methods it does not use.',
        },
        {
          type: 'mcq',
          q: 'BOSS Q5 — A service does `new MySqlDatabase()` internally and cannot be tested with a fake. Which letter?',
          options: ['S', 'L', 'D', 'O'],
          answer: 2,
          explain: 'D — Dependency Inversion: depend on an abstraction and inject the concrete detail.',
        },
        {
          type: 'mcq',
          q: 'BOSS Q6 — Which best explains why SOLID matters for an LLD interview?',
          options: [
            'It makes code shorter',
            'It produces designs that are flexible, testable, and easy to extend — exactly what interviewers grade',
            'It is required by the Java compiler',
            'It removes the need for classes',
          ],
          answer: 1,
          explain: 'SOLID is the rubric. Interviewers literally look for these properties in your design.',
        },
        {
          type: 'code',
          q: 'FINISHING BLOW — Write an interface PaymentMethod with pay(double amount). This single abstraction lets you satisfy OCP (new methods = new classes) and DIP (depend on it, not on a concrete processor).',
          starter: '// the abstraction that topples the Colossus\n',
          checks: [
            { label: 'Declares interface PaymentMethod', re: 'interface\\s+PaymentMethod', hint: 'public interface PaymentMethod { ... }' },
            { label: 'Declares pay(double amount)', re: 'pay\\s*\\(\\s*double', hint: 'void pay(double amount);' },
            { label: 'pay is a contract (no body)', re: 'pay\\s*\\([^)]*\\)\\s*;', hint: 'End the method with ; — it is an interface.' },
          ],
          explain: 'One clean abstraction unlocks OCP and DIP at once. The Rigid Colossus shatters.',
        },
      ],
    },
  ],
},

/* ================================================================
 * ACT IV — THE PATTERN ATELIER
 * ============================================================== */
{
  id: 'act4',
  title: 'Act IV — The Pattern Atelier',
  subtitle: 'Reusable solutions every interviewer expects you to know.',
  color: '#21c997',
  levels: [
    {
      id: 'l14',
      title: 'Singleton',
      xp: 360,
      story: 'The realm has one Moon, one Crown, one Royal Treasury. "Some things," says the Atelier master, "must exist exactly once — and everyone must share that one."',
      lesson: `
        <h4>Design patterns</h4>
        <p>A <b>design pattern</b> is a named, reusable solution to a problem that recurs in OOP design. They are split into <i>creational</i>, <i>structural</i>, and <i>behavioural</i> families. The Atelier teaches the four interviewers ask about most.</p>
        <h4>Singleton (creational)</h4>
        <p><b>Intent:</b> ensure a class has <i>exactly one instance</i> and give the whole program a single global access point to it. Used for things like a configuration store, a logger, or a connection pool.</p>
        <pre>public class GameConfig {
    private static GameConfig instance;        // the one and only

    private GameConfig() { }                   // private => outsiders cannot use new

    public static GameConfig getInstance() {
        if (instance == null) {
            instance = new GameConfig();
        }
        return instance;
    }
}</pre>
        <p>The three moving parts: a <code>private static</code> field holding the instance, a <code>private</code> constructor so outsiders cannot create more, and a <code>public static getInstance()</code> that creates-once-then-returns.</p>
        <h4>Thread-safety</h4>
        <p>The simple version above can create two instances if two threads race. Interview-grade fixes: an <code>enum</code> singleton (simplest and safe), eager initialisation (<code>private static final GameConfig instance = new GameConfig();</code>), or double-checked locking with a <code>volatile</code> field.</p>
        <h4>Trade-offs</h4>
        <p>Singletons are effectively global state — they can hide dependencies and make testing harder. Mention this awareness in interviews; it shows maturity.</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'The Singleton pattern guarantees...',
          options: [
            'a class has many cached instances',
            'a class has exactly one instance with a global access point',
            'a class cannot be subclassed',
            'every method is static',
          ],
          answer: 1,
          explain: 'Singleton = exactly one instance, reachable through one well-known access point.',
        },
        {
          type: 'mcq',
          q: 'Why must a Singleton\'s constructor be private?',
          options: [
            'To make it run faster',
            'So no outside code can use `new` to create extra instances',
            'Because all constructors must be private',
            'To allow inheritance',
          ],
          answer: 1,
          explain: 'A private constructor blocks `new` from outside, forcing everyone through getInstance().',
        },
        {
          type: 'fill',
          q: 'Complete the core of a Singleton.',
          code: 'public class Logger {\n    private ___ Logger instance;\n    private Logger() { }\n    public static Logger getInstance() {\n        if (instance == null) instance = ___ Logger();\n        return instance;\n    }\n}',
          blanks: ['static', 'new'],
          explain: 'The held instance must be `static` (one per class); it is built once with `new`.',
        },
        {
          type: 'code',
          q: 'Write a Singleton class Treasury: a private static instance field, a private constructor, and a public static getInstance() method.',
          starter: 'public class Treasury {\n\n}\n',
          checks: [
            { label: 'Declares class Treasury', re: 'class\\s+Treasury', hint: 'public class Treasury { ... }' },
            { label: 'Has a private static instance field', re: 'private\\s+static\\s+Treasury', hint: 'private static Treasury instance;' },
            { label: 'Constructor is private', re: 'private\\s+Treasury\\s*\\(', hint: 'private Treasury() { }' },
            { label: 'Has a static getInstance() method', re: 'static\\s+Treasury\\s+getInstance\\s*\\(', hint: 'public static Treasury getInstance() { ... }' },
          ],
          explain: 'Private static field + private constructor + static accessor = a textbook Singleton.',
        },
      ],
    },
    {
      id: 'l15',
      title: 'Factory Method',
      xp: 380,
      story: 'Adventurers keep writing `new` for every kind of weapon, scattered across the realm. The Atelier master opens a single Forge: "Ask the Forge for a weapon. Let it decide which to build."',
      lesson: `
        <h4>Factory Method (creational)</h4>
        <p><b>Intent:</b> move object creation behind a method so callers ask for <i>what</i> they want and never call <code>new</code> on a concrete class themselves.</p>
        <h4>The problem</h4>
        <pre>// ✗ creation logic duplicated and scattered everywhere
Weapon w;
if (type.equals("sword")) w = new Sword();
else if (type.equals("bow")) w = new Bow();
// ...repeated in 12 files</pre>
        <h4>The factory</h4>
        <pre>interface Weapon { void use(); }
class Sword implements Weapon { public void use(){ } }
class Bow   implements Weapon { public void use(){ } }

class WeaponFactory {
    public static Weapon create(String type) {
        switch (type) {
            case "sword": return new Sword();
            case "bow":   return new Bow();
            default: throw new IllegalArgumentException(type);
        }
    }
}

Weapon w = WeaponFactory.create("sword");   // caller never says: new Sword()</pre>
        <p>Creation logic now lives in <i>one</i> place. Callers depend on the <code>Weapon</code> interface, not on concrete classes — that is DIP in action.</p>
        <h4>Why interviewers ask for it</h4>
        <p>Factories centralise and encapsulate object creation, decouple callers from concrete types, and make swapping implementations easy. Related ideas worth a sentence: <i>Abstract Factory</i> (a factory of factories, for families of related objects) and the <i>Builder</i> pattern (step-by-step construction of complex objects).</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'The main benefit of a Factory is that...',
          options: [
            'objects are created faster',
            'object-creation logic is centralised and callers depend on an abstraction, not concrete classes',
            'it removes the need for constructors',
            'it makes every class a Singleton',
          ],
          answer: 1,
          explain: 'A factory encapsulates creation in one place and decouples callers from concrete types.',
        },
        {
          type: 'mcq',
          q: 'A factory method typically returns...',
          options: [
            'the concrete class type, e.g. Sword',
            'an interface / abstract type, e.g. Weapon, so the concrete choice stays hidden',
            'void',
            'a String',
          ],
          answer: 1,
          explain: 'Returning the abstraction keeps callers ignorant of the concrete class — that is the point.',
        },
        {
          type: 'mcq',
          q: 'Abstract Factory differs from a simple Factory Method in that it...',
          options: [
            'is always a Singleton',
            'creates whole families of related objects, not just one product',
            'cannot return interfaces',
            'is a behavioural pattern',
          ],
          answer: 1,
          explain: 'Abstract Factory groups the creation of related products (e.g. a matching Button + Checkbox set).',
        },
        {
          type: 'code',
          q: 'Write a class EnemyFactory with a static method create(String type) that returns an Enemy.',
          starter: '// Enemy is already defined for you:\n// interface Enemy { }\npublic class EnemyFactory {\n\n}\n',
          scaffold: 'interface Enemy { }',
          checks: [
            { label: 'Declares class EnemyFactory', re: 'class\\s+EnemyFactory', hint: 'public class EnemyFactory { ... }' },
            { label: 'Has a static create method', re: 'static\\s+Enemy\\s+create\\s*\\(', hint: 'public static Enemy create(String type) { ... }' },
            { label: 'create takes a String parameter', re: 'create\\s*\\(\\s*String', hint: 'The parameter should be a String type.' },
            { label: 'Returns an Enemy (uses return)', re: '\\breturn\\b', hint: 'The factory must return the created Enemy.' },
          ],
          explain: 'All enemy creation now flows through one method that hands back the Enemy abstraction.',
        },
      ],
    },
    {
      id: 'l16',
      title: 'Strategy',
      xp: 400,
      story: 'A hero hard-coded one attack and was useless against every new foe. The master hands over a belt of interchangeable techniques: "Swap the strategy, not the hero."',
      lesson: `
        <h4>Strategy (behavioural)</h4>
        <p><b>Intent:</b> define a family of interchangeable algorithms, put each in its own class behind a common interface, and let the client swap them at runtime.</p>
        <h4>The smell</h4>
        <pre>// ✗ behaviour chosen by a switch the class must keep editing
class Character {
    void attack(String mode) {
        if (mode.equals("melee")) { /* ... */ }
        else if (mode.equals("ranged")) { /* ... */ }
        else if (mode.equals("magic"))  { /* ... */ }
    }
}</pre>
        <h4>The pattern</h4>
        <pre>interface AttackStrategy { void attack(); }

class MeleeAttack  implements AttackStrategy { public void attack(){ } }
class RangedAttack implements AttackStrategy { public void attack(){ } }

class Character {
    private AttackStrategy strategy;                 // composition
    public void setStrategy(AttackStrategy s) { this.strategy = s; }
    public void attack() { strategy.attack(); }      // delegate
}

Character hero = new Character();
hero.setStrategy(new MeleeAttack());  hero.attack();
hero.setStrategy(new RangedAttack()); hero.attack();   // swapped at runtime</pre>
        <h4>Why it is loved in interviews</h4>
        <p>Strategy is the cleanest demonstration of "favour composition over inheritance" and the Open/Closed Principle: a new algorithm is a new class, and behaviour can change while the program runs. It removes branching <code>if/else</code> on behaviour. Payment processing, sorting, pricing, routing, and compression all map naturally onto it.</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'The Strategy pattern lets you...',
          options: [
            'ensure only one instance of a class',
            'select an interchangeable algorithm at runtime by swapping objects behind a common interface',
            'create objects without calling new',
            'notify many objects of a change',
          ],
          answer: 1,
          explain: 'Strategy = a family of swappable algorithms behind one interface, chosen at runtime.',
        },
        {
          type: 'mcq',
          q: 'Strategy achieves its flexibility mainly through...',
          options: [
            'deep inheritance hierarchies',
            'composition — the context holds a reference to a strategy interface and delegates to it',
            'static methods',
            'private constructors',
          ],
          answer: 1,
          explain: 'The context composes a strategy object and delegates the work — composition over inheritance.',
        },
        {
          type: 'mcq',
          q: 'Replacing a 5-branch `if (mode)` with Strategy classes mainly helps you satisfy...',
          options: [
            'the Singleton pattern',
            'the Open/Closed Principle — new behaviour is a new class, not an edit',
            'garbage collection',
            'the Liskov rule only',
          ],
          answer: 1,
          explain: 'Each algorithm becomes its own class; adding one no longer means editing the context — that is OCP.',
        },
        {
          type: 'code',
          q: 'Write the Strategy contract: an interface SortStrategy with a method sort(int[] data).',
          starter: '// the strategy interface\n',
          checks: [
            { label: 'Declares interface SortStrategy', re: 'interface\\s+SortStrategy', hint: 'public interface SortStrategy { ... }' },
            { label: 'Declares sort(int[] ...)', re: 'sort\\s*\\(\\s*int\\s*\\[\\s*\\]', hint: 'void sort(int[] data);' },
          ],
          explain: 'Every sorting algorithm now implements SortStrategy and becomes hot-swappable at runtime.',
        },
      ],
    },
    {
      id: 'l17',
      title: 'Observer',
      xp: 420,
      story: 'When the dragon wakes, the whole village must know — guards, healers, bell-ringers. "Do not make the dragon call each one," says the master. "Let them subscribe, and notify them all."',
      lesson: `
        <h4>Observer (behavioural)</h4>
        <p><b>Intent:</b> define a one-to-many dependency so that when one object (the <i>subject</i> / <i>publisher</i>) changes state, all its dependents (the <i>observers</i> / <i>subscribers</i>) are notified automatically.</p>
        <h4>The pattern</h4>
        <pre>interface Observer { void update(String event); }

class Subject {
    private List&lt;Observer&gt; observers = new ArrayList&lt;&gt;();
    public void subscribe(Observer o)   { observers.add(o); }
    public void unsubscribe(Observer o) { observers.remove(o); }
    public void notifyAll(String event) {
        for (Observer o : observers) o.update(event);   // fan-out
    }
}

class Guard implements Observer {
    public void update(String event) { /* react */ }
}</pre>
        <p>The subject keeps a list of observers and a way to <code>subscribe</code>/<code>unsubscribe</code>. On a change it loops the list and calls <code>update()</code> on each. The subject never needs to know the <i>concrete</i> observer types — only the <code>Observer</code> interface.</p>
        <h4>Where you have already seen it</h4>
        <p>UI event listeners, the publish/subscribe model, reactive streams, and Java's own (now legacy) <code>java.util.Observer</code> are all Observer. It powers event-driven systems.</p>
        <h4>Interview value</h4>
        <p>Observer gives <b>loose coupling</b>: publishers and subscribers evolve independently. It is the go-to answer for "notify many parts of a system about an event" — for example a notification service, a stock-price ticker, or a chat room.</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'The Observer pattern models a relationship that is...',
          options: [
            'one-to-one',
            'one-to-many: one subject notifies many observers automatically',
            'many-to-many always',
            'none — objects never communicate',
          ],
          answer: 1,
          explain: 'One subject, many observers — when the subject changes, all observers are notified.',
        },
        {
          type: 'mcq',
          q: 'Why does the subject hold a List<Observer> rather than a List<Guard>?',
          options: [
            'Guards are slow',
            'So it stays loosely coupled — it can notify ANY observer type without knowing concrete classes',
            'Lists cannot hold concrete types',
            'It must, or it will not compile',
          ],
          answer: 1,
          explain: 'Depending on the Observer interface keeps the subject decoupled from concrete observer classes.',
        },
        {
          type: 'mcq',
          q: 'A real-world fit for Observer is...',
          options: [
            'ensuring one database connection exists',
            'a stock ticker pushing price updates to many subscribed displays',
            'building a complex object step by step',
            'choosing a sorting algorithm at runtime',
          ],
          answer: 1,
          explain: 'A price source (subject) notifying many displays (observers) is a classic Observer scenario.',
        },
        {
          type: 'code',
          q: 'Write the Observer contract: an interface Subscriber with a method update(String message).',
          starter: '// the observer interface\n',
          checks: [
            { label: 'Declares interface Subscriber', re: 'interface\\s+Subscriber', hint: 'public interface Subscriber { ... }' },
            { label: 'Declares update(String ...)', re: 'update\\s*\\(\\s*String', hint: 'void update(String message);' },
          ],
          explain: 'Every subscriber implements this; the publisher loops its list and calls update() on each.',
        },
      ],
    },
    {
      id: 'boss4',
      title: 'BOSS — The Pattern Mimic',
      xp: 550,
      boss: true,
      story: 'It copies any pattern it sees. To beat it you must name the right pattern for each situation it conjures.',
      lesson: '',
      challenges: [
        {
          type: 'mcq',
          q: 'BOSS Q1 — "Exactly one shared configuration object for the whole app." Which pattern?',
          options: ['Factory', 'Singleton', 'Observer', 'Strategy'],
          answer: 1,
          explain: 'One instance, one global access point => Singleton.',
        },
        {
          type: 'mcq',
          q: 'BOSS Q2 — "Centralise object creation so callers never call new on concrete classes." Which pattern?',
          options: ['Strategy', 'Observer', 'Factory', 'Singleton'],
          answer: 2,
          explain: 'Encapsulating creation behind a method => Factory.',
        },
        {
          type: 'mcq',
          q: 'BOSS Q3 — "Swap a payment algorithm at runtime without editing the checkout class." Which pattern?',
          options: ['Strategy', 'Singleton', 'Factory', 'Observer'],
          answer: 0,
          explain: 'Interchangeable algorithms behind one interface => Strategy.',
        },
        {
          type: 'mcq',
          q: 'BOSS Q4 — "When an order ships, email + SMS + analytics must all react." Which pattern?',
          options: ['Factory', 'Observer', 'Singleton', 'Strategy'],
          answer: 1,
          explain: 'One event, many automatic reactions => Observer.',
        },
        {
          type: 'mcq',
          q: 'BOSS Q5 — Strategy is preferred over a big if/else mainly because it...',
          options: [
            'is faster at runtime',
            'satisfies the Open/Closed Principle — new behaviour is a new class',
            'uses less memory',
            'removes the need for interfaces',
          ],
          answer: 1,
          explain: 'Strategy turns each branch into a class, so adding behaviour adds code instead of editing it.',
        },
        {
          type: 'code',
          q: 'FINISHING BLOW — Write a Singleton class GameEngine (private static instance, private constructor, public static getInstance()).',
          starter: 'public class GameEngine {\n\n}\n',
          checks: [
            { label: 'Declares class GameEngine', re: 'class\\s+GameEngine', hint: 'public class GameEngine { ... }' },
            { label: 'Private static instance field', re: 'private\\s+static\\s+GameEngine', hint: 'private static GameEngine instance;' },
            { label: 'Private constructor', re: 'private\\s+GameEngine\\s*\\(', hint: 'private GameEngine() { }' },
            { label: 'Static getInstance() method', re: 'static\\s+GameEngine\\s+getInstance\\s*\\(', hint: 'public static GameEngine getInstance() { ... }' },
          ],
          explain: 'The Mimic cannot copy a pattern you have truly mastered. Act IV is complete.',
        },
      ],
    },
  ],
},

/* ================================================================
 * ACT V — THE ADVANCED ATELIER
 * ============================================================== */
{
  id: 'act4b',
  title: 'Act V — The Advanced Atelier',
  subtitle: 'Four more patterns interviewers expect you to know.',
  color: '#3ac0e0',
  levels: [
    {
      id: 'l24',
      title: 'Builder',
      xp: 400,
      story: 'A smith tries to forge a legendary sword by passing twelve ingredients into one giant order — and gets the order wrong every time. "Build it step by step," the master sighs, "and only then forge."',
      lesson: `
        <h4>Builder (creational)</h4>
        <p><b>Intent:</b> construct a complex object step by step, so you do not need one enormous constructor with a dozen parameters.</p>
        <h4>The smell: the telescoping constructor</h4>
        <pre>// ✗ which argument is which? what about the optional ones?
new Burger(true, false, true, 2, false, true, "large");

// ...and a constructor for every combination of optional fields
Burger(boolean cheese) { ... }
Burger(boolean cheese, boolean lettuce) { ... }
Burger(boolean cheese, boolean lettuce, int patties) { ... }</pre>
        <h4>The pattern</h4>
        <pre>class Burger {
    private final int patties;
    private final boolean cheese;
    private Burger(Builder b) {            // private — only the Builder builds it
        this.patties = b.patties;
        this.cheese  = b.cheese;
    }
    static class Builder {
        private int patties = 1;
        private boolean cheese = false;
        Builder patties(int n) { this.patties = n; return this; }   // fluent
        Builder cheese(boolean c) { this.cheese = c; return this; }
        Burger build() { return new Burger(this); }
    }
}

Burger b = new Burger.Builder()
        .patties(2)
        .cheese(true)
        .build();          // readable, order-independent, optional fields easy</pre>
        <p>Each setter <code>return this;</code> — that is the <b>fluent interface</b> that lets you chain calls. <code>build()</code> produces the final, often immutable, object.</p>
        <h4>Why interviewers ask for it</h4>
        <p>Builder shines when an object has many fields, several of them optional. It gives readable construction, supports immutability (all fields <code>final</code>), and lets <code>build()</code> validate the object before it exists. Java's <code>StringBuilder</code> and <code>Stream</code> APIs are everyday Builders.</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'The Builder pattern is the right tool when...',
          options: [
            'you need exactly one instance of a class',
            'an object has many fields (often with optional ones) and a giant constructor would be unreadable',
            'you want to notify many objects of a change',
            'you need to swap an algorithm at runtime',
          ],
          answer: 1,
          explain: 'Builder replaces unreadable, telescoping constructors for objects with many/optional fields.',
        },
        {
          type: 'mcq',
          q: 'Why does each Builder setter end with `return this;`?',
          options: [
            'To free memory',
            'To enable a fluent chain — .patties(2).cheese(true).build()',
            'Because Java requires it',
            'To make the class a Singleton',
          ],
          answer: 1,
          explain: 'Returning `this` lets calls be chained — the fluent interface that makes Builder readable.',
        },
        {
          type: 'mcq',
          q: 'A real-world Builder you have already used in Java is...',
          options: ['ArrayList', 'StringBuilder', 'HashMap', 'Thread'],
          answer: 1,
          explain: 'StringBuilder chains .append(...) calls and produces the final String with .toString() — a Builder.',
        },
        {
          type: 'code',
          q: 'Write a fluent Builder method: in class RobotBuilder, a method withName(String name) that returns RobotBuilder.',
          starter: 'public class RobotBuilder {\n    private String name;\n\n}\n',
          checks: [
            { label: 'Declares class RobotBuilder', re: '\\bclass\\s+RobotBuilder\\b', hint: 'public class RobotBuilder { ... }' },
            { label: 'Has a withName method returning RobotBuilder', re: 'RobotBuilder\\s+withName\\s*\\(', hint: 'public RobotBuilder withName(String name) { ... }' },
            { label: 'withName takes a String', re: 'withName\\s*\\(\\s*String', hint: 'The parameter should be a String.' },
            { label: 'Returns this for chaining', re: 'return\\s+this', hint: 'End the method with: return this;' },
          ],
          explain: 'A setter that returns `this` is the heart of a fluent Builder — calls can now be chained.',
        },
      ],
    },
    {
      id: 'l25',
      title: 'Decorator',
      xp: 420,
      story: 'A plain coffee costs 2 gold. The barista needs milk, cream, syrup, foam — in any combination. "I will not forge a class for every combo," she says. "I will wrap."',
      lesson: `
        <h4>Decorator (structural)</h4>
        <p><b>Intent:</b> attach extra responsibilities to an object dynamically by <i>wrapping</i> it, instead of creating a subclass for every possible combination.</p>
        <h4>The smell: a subclass explosion</h4>
        <p>Coffee, CoffeeWithMilk, CoffeeWithMilkAndSugar, CoffeeWithSugarAndFoam... every combination is a new class. It does not scale.</p>
        <h4>The pattern</h4>
        <pre>interface Coffee { double cost(); String desc(); }

class PlainCoffee implements Coffee {
    public double cost() { return 2.0; }
    public String desc() { return "Coffee"; }
}

// the decorator: IS-A Coffee and HAS-A Coffee
abstract class CoffeeDecorator implements Coffee {
    protected final Coffee inner;
    CoffeeDecorator(Coffee inner) { this.inner = inner; }
}

class Milk extends CoffeeDecorator {
    Milk(Coffee inner) { super(inner); }
    public double cost() { return inner.cost() + 0.5; }       // add to the wrapped object
    public String desc() { return inner.desc() + " + Milk"; }
}

Coffee c = new Milk(new Sugar(new PlainCoffee()));   // stack decorators freely
// c.cost() == 2.0 + sugar + milk</pre>
        <p>The key trick: a decorator <i>implements the same interface</i> as the thing it wraps <i>and holds a reference to it</i>. So a decorated object is still a <code>Coffee</code> — and can itself be wrapped again.</p>
        <h4>Why interviewers like it</h4>
        <p>Decorator is the cleanest demonstration of "favour composition over inheritance" and the Open/Closed Principle — new behaviour is a new wrapper class, combined at runtime. Java's <code>java.io</code> streams (<code>new BufferedReader(new FileReader(...))</code>) are decorators.</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'The Decorator pattern adds behaviour to an object by...',
          options: [
            'editing the original class',
            'wrapping it in another object that implements the same interface and delegates to it',
            'creating one subclass per feature combination',
            'making it a Singleton',
          ],
          answer: 1,
          explain: 'A decorator implements the same interface and holds the wrapped object, adding behaviour around it.',
        },
        {
          type: 'mcq',
          q: 'For a decorator to be stackable (wrap a wrapped object), it must...',
          options: [
            'be a final class',
            'implement the SAME interface as the object it wraps',
            'be abstract',
            'have a private constructor',
          ],
          answer: 1,
          explain: 'Because the decorator IS the same type, the result is still that type and can be wrapped again.',
        },
        {
          type: 'mcq',
          q: 'Which standard Java API is built on the Decorator pattern?',
          options: [
            'new BufferedReader(new FileReader(file))',
            'Math.max(a, b)',
            'List.of(1, 2, 3)',
            'Integer.parseInt(s)',
          ],
          answer: 0,
          explain: 'java.io streams wrap each other — BufferedReader decorates FileReader — a textbook Decorator.',
        },
        {
          type: 'fill',
          q: 'Complete the decorator base class.',
          code: 'abstract class CoffeeDecorator ___ Coffee {\n    protected final Coffee inner;\n    CoffeeDecorator(Coffee inner) { this.___ = inner; }\n}',
          blanks: ['implements', 'inner'],
          explain: 'A decorator `implements` the shared interface and stores the wrapped object in its `inner` field.',
        },
        {
          type: 'code',
          q: 'Write an abstract class CoffeeDecorator that implements Coffee and holds a protected Coffee field named inner.',
          starter: '// Coffee is defined for you: interface Coffee { double cost(); }\npublic abstract class CoffeeDecorator {\n\n}\n',
          scaffold: 'interface Coffee { double cost(); }',
          checks: [
            { label: 'CoffeeDecorator is abstract', re: 'abstract\\s+class\\s+CoffeeDecorator', hint: 'public abstract class CoffeeDecorator ...' },
            { label: 'It implements Coffee', re: 'class\\s+CoffeeDecorator\\s+implements\\s+Coffee', hint: 'abstract class CoffeeDecorator implements Coffee { ... }' },
            { label: 'Holds a Coffee field named inner', re: 'Coffee\\s+inner', hint: 'protected Coffee inner;' },
            { label: 'The inner field is protected', re: 'protected\\s+(final\\s+)?Coffee\\s+inner', hint: 'Mark the field protected.' },
          ],
          explain: 'Implementing Coffee while holding a Coffee is the structural core of every decorator.',
        },
      ],
    },
    {
      id: 'l26',
      title: 'Adapter',
      xp: 440,
      story: 'The kingdom\'s new spellbook speaks one tongue; an ancient, irreplaceable relic speaks another. "We will not rewrite the relic," says the archivist. "We build a translator."',
      lesson: `
        <h4>Adapter (structural)</h4>
        <p><b>Intent:</b> let two classes with <i>incompatible interfaces</i> work together by introducing a wrapper that translates one interface into the other.</p>
        <h4>The problem</h4>
        <p>Your app is written against a clean <code>PaymentProcessor</code> interface. You must integrate a third-party or legacy class whose method is called something else and you cannot change it.</p>
        <pre>// what your app expects
interface PaymentProcessor { void pay(int amountInCents); }

// the legacy class you cannot modify
class LegacyPayGateway {
    void makePayment(double dollars) { /* ... */ }
}</pre>
        <h4>The pattern</h4>
        <pre>class PaymentAdapter implements PaymentProcessor {
    private final LegacyPayGateway legacy;          // the adaptee
    PaymentAdapter(LegacyPayGateway legacy) { this.legacy = legacy; }

    public void pay(int amountInCents) {            // translate the call
        legacy.makePayment(amountInCents / 100.0);
    }
}

PaymentProcessor p = new PaymentAdapter(new LegacyPayGateway());
p.pay(1500);   // your app speaks its own language; the adapter translates</pre>
        <p>The adapter <i>implements the interface your code wants</i> and <i>holds the incompatible object</i>, converting each call. Your application never knows the legacy class exists.</p>
        <h4>Decorator vs Adapter</h4>
        <p>They look similar — both wrap an object — but the intent differs. A <b>Decorator</b> keeps the same interface and <i>adds behaviour</i>. An <b>Adapter</b> <i>changes the interface</i> so two incompatible parts can connect. Naming that distinction is a common interview question.</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'The Adapter pattern exists to...',
          options: [
            'add new behaviour to an object',
            'make two incompatible interfaces work together via a translating wrapper',
            'ensure a class has one instance',
            'build complex objects step by step',
          ],
          answer: 1,
          explain: 'Adapter converts one interface into another so otherwise-incompatible classes can collaborate.',
        },
        {
          type: 'mcq',
          q: 'What is the difference between an Adapter and a Decorator?',
          options: [
            'They are identical',
            'Adapter changes the interface to connect incompatible code; Decorator keeps the interface and adds behaviour',
            'Adapter is creational; Decorator is behavioural',
            'Decorator cannot wrap objects',
          ],
          answer: 1,
          explain: 'Same wrapping technique, different intent: Adapter translates an interface, Decorator augments behaviour.',
        },
        {
          type: 'mcq',
          q: 'A PaymentAdapter implements PaymentProcessor and holds a LegacyPayGateway. The LegacyPayGateway is called the...',
          options: ['client', 'adaptee (the object being adapted)', 'decorator', 'observer'],
          answer: 1,
          explain: 'The incompatible object that the adapter wraps and translates for is the "adaptee".',
        },
        {
          type: 'code',
          q: 'Write a class PaymentAdapter that implements PaymentProcessor and holds a LegacyGateway field.',
          starter: '// Defined for you:\n// interface PaymentProcessor { void pay(int cents); }\n// class LegacyGateway { void makePayment(double dollars) {} }\npublic class PaymentAdapter {\n\n}\n',
          scaffold: 'interface PaymentProcessor { void pay(int cents); }\nclass LegacyGateway { void makePayment(double dollars) {} }',
          checks: [
            { label: 'PaymentAdapter implements PaymentProcessor', re: 'class\\s+PaymentAdapter\\s+implements\\s+PaymentProcessor', hint: 'public class PaymentAdapter implements PaymentProcessor { ... }' },
            { label: 'Holds a LegacyGateway field', re: 'LegacyGateway\\s+\\w+', hint: 'private LegacyGateway legacy;' },
            { label: 'Implements the pay(int ...) method', re: '\\bpay\\s*\\(\\s*int', hint: 'public void pay(int cents) { ... }' },
            { label: 'Delegates to the legacy makePayment', re: 'makePayment\\s*\\(', hint: 'Inside pay(), call legacy.makePayment(...).' },
          ],
          explain: 'Implements the wanted interface, wraps the adaptee, translates the call — a complete Adapter.',
        },
      ],
    },
    {
      id: 'l27',
      title: 'Command',
      xp: 460,
      story: 'The general shouts orders that vanish the instant they are heard — no record, no recall. "Make each order an object," says the strategist. "Then you can queue them, log them, even undo them."',
      lesson: `
        <h4>Command (behavioural)</h4>
        <p><b>Intent:</b> turn a request into a stand-alone object. That object carries everything needed to perform the action — which lets you queue requests, log them, and undo them.</p>
        <h4>The pattern</h4>
        <pre>interface Command {
    void execute();
    void undo();
}

class LightOnCommand implements Command {
    private final Light light;
    LightOnCommand(Light light) { this.light = light; }
    public void execute() { light.on(); }
    public void undo()    { light.off(); }
}

// the invoker — knows only the Command interface
class RemoteControl {
    private final Deque&lt;Command&gt; history = new ArrayDeque&lt;&gt;();
    public void press(Command c) { c.execute(); history.push(c); }
    public void undoLast() { if (!history.isEmpty()) history.pop().undo(); }
}</pre>
        <p>Three roles: the <b>Command</b> (the request as an object), the <b>Receiver</b> (<code>Light</code> — the thing that does the real work), and the <b>Invoker</b> (<code>RemoteControl</code> — triggers commands without knowing what they do).</p>
        <h4>What it unlocks</h4>
        <p>Because a request is now an object, you can store it in a <i>history stack</i> for <b>undo/redo</b>, put it in a <i>queue</i> for later or background execution, and add new actions as new Command classes without touching the invoker (Open/Closed). Menu items, buttons, job queues, and transaction logs are all built on Command.</p>
        <h4>Interview value</h4>
        <p>Whenever a problem mentions "undo", "redo", "queue of operations", or "macro", Command is the expected answer. It also decouples the thing that <i>triggers</i> an action from the thing that <i>performs</i> it.</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'The Command pattern works by...',
          options: [
            'turning a request into an object that knows how to execute (and often undo) itself',
            'ensuring one instance of a class',
            'wrapping an object to add behaviour',
            'translating one interface into another',
          ],
          answer: 0,
          explain: 'Command encapsulates a request as an object, so it can be passed around, queued, logged, and undone.',
        },
        {
          type: 'mcq',
          q: 'Which feature does the Command pattern most naturally enable?',
          options: ['Faster method calls', 'Undo / redo via a history of command objects', 'Smaller memory use', 'Static typing'],
          answer: 1,
          explain: 'Because each request is an object with an undo(), you can keep a history stack and reverse actions.',
        },
        {
          type: 'mcq',
          q: 'In the Command pattern, the object that triggers a command without knowing what it does is the...',
          options: ['Receiver', 'Invoker', 'Adapter', 'Singleton'],
          answer: 1,
          explain: 'The Invoker (e.g. a RemoteControl or button) just calls execute() — it depends only on the Command interface.',
        },
        {
          type: 'code',
          q: 'Write the Command contract: an interface Command with two methods, execute() and undo().',
          starter: '// the command interface\n',
          checks: [
            { label: 'Declares interface Command', re: 'interface\\s+Command', hint: 'public interface Command { ... }' },
            { label: 'Declares execute()', re: '\\bexecute\\s*\\(\\s*\\)\\s*;', hint: 'void execute();' },
            { label: 'Declares undo()', re: '\\bundo\\s*\\(\\s*\\)\\s*;', hint: 'void undo();' },
          ],
          explain: 'Every concrete command implements this — and the undo() is what makes a history stack possible.',
        },
      ],
    },
    {
      id: 'boss4b',
      title: 'BOSS — The Pattern Archmage',
      xp: 580,
      boss: true,
      story: 'The Archmage weaves all eight patterns at once. Name the right one for each spell, and the Advanced Atelier is yours.',
      lesson: '',
      challenges: [
        {
          type: 'mcq',
          q: 'BOSS Q1 — "Construct an object with many optional fields, readably." Which pattern?',
          options: ['Adapter', 'Builder', 'Command', 'Decorator'],
          answer: 1,
          explain: 'Many fields, optional ones, readable construction => Builder.',
        },
        {
          type: 'mcq',
          q: 'BOSS Q2 — "Add milk, then sugar, then foam to a coffee, in any combination, at runtime." Which pattern?',
          options: ['Decorator', 'Factory', 'Command', 'Adapter'],
          answer: 0,
          explain: 'Stackable, runtime-combinable behaviour by wrapping => Decorator.',
        },
        {
          type: 'mcq',
          q: 'BOSS Q3 — "Integrate a legacy class whose method names do not match your interface." Which pattern?',
          options: ['Builder', 'Observer', 'Adapter', 'Strategy'],
          answer: 2,
          explain: 'Translating an incompatible interface => Adapter.',
        },
        {
          type: 'mcq',
          q: 'BOSS Q4 — "Support undo/redo and a queue of operations." Which pattern?',
          options: ['Command', 'Singleton', 'Decorator', 'Factory'],
          answer: 0,
          explain: 'Requests as objects with execute()/undo() => Command.',
        },
        {
          type: 'mcq',
          q: 'BOSS Q5 — Builder, Decorator, and Adapter all favour which OOP principle over deep inheritance?',
          options: ['Global state', 'Composition (holding/wrapping objects)', 'Static methods', 'Tight coupling'],
          answer: 1,
          explain: 'All three compose objects rather than relying on subclassing — composition over inheritance.',
        },
        {
          type: 'code',
          q: 'FINISHING BLOW — Write a fluent Builder step: in class PizzaBuilder, a method addTopping(String t) that returns PizzaBuilder for chaining.',
          starter: 'public class PizzaBuilder {\n\n}\n',
          checks: [
            { label: 'Declares class PizzaBuilder', re: '\\bclass\\s+PizzaBuilder\\b', hint: 'public class PizzaBuilder { ... }' },
            { label: 'addTopping returns PizzaBuilder', re: 'PizzaBuilder\\s+addTopping\\s*\\(', hint: 'public PizzaBuilder addTopping(String t) { ... }' },
            { label: 'addTopping takes a String', re: 'addTopping\\s*\\(\\s*String', hint: 'The parameter is a String.' },
            { label: 'Returns this for chaining', re: 'return\\s+this', hint: 'End with: return this;' },
          ],
          explain: 'A fluent builder step — and the Pattern Archmage falls. The Advanced Atelier is mastered.',
        },
      ],
    },
  ],
},

/* ================================================================
 * ACT VI — THE LLD ARENA
 * ============================================================== */
{
  id: 'act5',
  title: 'Act VI — The LLD Arena',
  subtitle: 'Real interview design problems, end to end.',
  color: '#ff5d8f',
  levels: [
    {
      id: 'l18',
      title: 'How to Attack Any LLD Problem',
      xp: 440,
      story: 'The Arena gates open. The veteran champion stops you: "Strength is not enough here. You need a method. Let me give you the seven-step ritual every winner uses."',
      lesson: `
        <h4>The LLD interview, decoded</h4>
        <p>A Low-Level Design round asks you to design the <i>classes</i> of a system (a parking lot, an elevator, a vending machine...). You are graded on a clean object model, correct use of OOP + SOLID, sensible patterns, and how you handle edge cases — not on a database schema or scaling.</p>
        <h4>The 7-step ritual</h4>
        <p><b>1. Clarify requirements.</b> Ask questions. Pin down scope, list functional features, note constraints. Never start designing in silence.</p>
        <p><b>2. Identify the core entities.</b> Find the nouns — they become your classes. (Parking lot => ParkingLot, Level, Spot, Vehicle, Ticket.)</p>
        <p><b>3. Define relationships.</b> For each pair ask: is-a (inheritance) or has-a (composition)? Draw the model. Composition is your default.</p>
        <p><b>4. Assign responsibilities.</b> Give each class one job (SRP). Decide its fields (state) and methods (behaviour).</p>
        <p><b>5. Apply patterns where they fit.</b> Strategy for swappable rules (pricing), Factory for creation, Singleton for a single registry, Observer for events. Do not force them.</p>
        <p><b>6. Walk a use case.</b> Trace one real flow end to end ("a car enters and parks") to prove the objects collaborate.</p>
        <p><b>7. Handle edge cases & state.</b> Full lot, invalid input, concurrency, enums for fixed states. Mention trade-offs out loud.</p>
        <h4>Golden rules</h4>
        <p>Program to interfaces. Favour composition over inheritance. Keep classes small and single-purpose. Use <code>enum</code>s for fixed sets of states/types. Think aloud — the interviewer is grading your reasoning, not just the final diagram.</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'What is the very FIRST thing you should do in an LLD interview?',
          options: [
            'Start writing classes immediately',
            'Clarify requirements and scope by asking questions',
            'Pick a design pattern',
            'Draw the database schema',
          ],
          answer: 1,
          explain: 'Always clarify scope and requirements first — designing on assumptions is the top failure mode.',
        },
        {
          type: 'mcq',
          q: 'A reliable trick for discovering candidate classes is to...',
          options: [
            'pick the verbs in the problem statement',
            'pick the nouns in the problem statement',
            'always use exactly five classes',
            'copy a previous design',
          ],
          answer: 1,
          explain: 'Nouns => entities => classes. Verbs tend to become methods.',
        },
        {
          type: 'mcq',
          q: 'For a fixed set of states like SpotType {SMALL, MEDIUM, LARGE}, the best Java tool is...',
          options: ['a bunch of int constants', 'an enum', 'a separate class per state', 'a String field'],
          answer: 1,
          explain: 'An enum gives a type-safe, fixed, self-documenting set of values — ideal for states/types.',
        },
        {
          type: 'code',
          q: 'Model a fixed set of states: write an enum VehicleSize with values SMALL, MEDIUM, and LARGE.',
          starter: '// declare the enum\n',
          checks: [
            { label: 'Declares enum VehicleSize', re: 'enum\\s+VehicleSize', hint: 'public enum VehicleSize { ... }' },
            { label: 'Contains SMALL', re: '\\bSMALL\\b', hint: 'List SMALL as a value.' },
            { label: 'Contains MEDIUM', re: '\\bMEDIUM\\b', hint: 'List MEDIUM as a value.' },
            { label: 'Contains LARGE', re: '\\bLARGE\\b', hint: 'List LARGE as a value.' },
          ],
          explain: 'Enums make fixed state sets type-safe — interviewers love seeing them used well.',
        },
      ],
    },
    {
      id: 'l19',
      title: 'LLD — Design a Parking Lot',
      xp: 480,
      story: 'The Arena floor becomes a vast parking structure. "Design it," says the champion. "Classes, relationships, the fee rule. Show me the ritual."',
      lesson: `
        <h4>Problem: design a parking lot system</h4>
        <p>This is the most-asked LLD warm-up. Walk the 7-step ritual.</p>
        <h4>1–2. Requirements & entities</h4>
        <p>Multiple <i>levels</i>; each level has <i>spots</i> of different sizes; vehicles of different sizes; on entry a vehicle gets a <i>ticket</i>; on exit a <i>fee</i> is charged by time. Nouns => classes: <code>ParkingLot</code>, <code>ParkingLevel</code>, <code>ParkingSpot</code>, <code>Vehicle</code> (abstract, with <code>Car</code>/<code>Bike</code>/<code>Truck</code>), <code>Ticket</code>, plus enums <code>VehicleSize</code> and <code>SpotType</code>.</p>
        <h4>3. Relationships</h4>
        <p><code>ParkingLot</code> <i>has-a</i> list of <code>ParkingLevel</code>; a level <i>has-a</i> list of <code>ParkingSpot</code>. <code>Car</code> <i>is-a</i> <code>Vehicle</code>. Composition for the structure, inheritance for the vehicle hierarchy.</p>
        <pre>abstract class Vehicle {
    private final String plate;
    private final VehicleSize size;
    Vehicle(String plate, VehicleSize size) { this.plate = plate; this.size = size; }
    public VehicleSize getSize() { return size; }
}
class Car  extends Vehicle { Car(String p)  { super(p, VehicleSize.MEDIUM); } }
class Bike extends Vehicle { Bike(String p) { super(p, VehicleSize.SMALL);  } }

class ParkingSpot {
    private final SpotType type;
    private Vehicle current;            // null when free
    public boolean isFree() { return current == null; }
    public boolean canFit(Vehicle v) { return isFree() && type.fits(v.getSize()); }
    public void park(Vehicle v)   { this.current = v; }
    public void release()         { this.current = null; }
}</pre>
        <h4>4–5. Responsibilities & patterns</h4>
        <p><code>ParkingLot.parkVehicle()</code> finds the first fitting free spot and issues a <code>Ticket</code>. The <b>fee rule</b> varies (flat, hourly, weekend) — wrap it in a <b>Strategy</b>: <code>interface FeeStrategy { double calculate(Ticket t); }</code>. A single shared <code>ParkingLot</code> registry is a fair use of <b>Singleton</b>.</p>
        <h4>6. Use-case walk</h4>
        <p>Car enters → lot scans levels for a spot where <code>canFit</code> is true → spot.park(car) → new Ticket(spot, now). Car exits → fee = feeStrategy.calculate(ticket) → spot.release().</p>
        <h4>7. Edge cases</h4>
        <p>Lot full (return no ticket / reject), invalid plate, a truck needing a large spot, two cars racing for the last spot (synchronise the spot assignment). State each one aloud.</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'What is the relationship between ParkingLot and ParkingLevel?',
          options: [
            'ParkingLot extends ParkingLevel (is-a)',
            'ParkingLot has-a list of ParkingLevel (composition)',
            'They are unrelated',
            'ParkingLevel extends ParkingLot',
          ],
          answer: 1,
          explain: 'A lot is composed of levels — has-a => composition, not inheritance.',
        },
        {
          type: 'mcq',
          q: 'The parking FEE can be flat, hourly, or weekend-based and may change. Best design choice?',
          options: [
            'A long if/else inside ParkingLot',
            'A FeeStrategy interface with one class per pricing rule (Strategy pattern)',
            'Hard-code the hourly rate',
            'Make fee a Singleton',
          ],
          answer: 1,
          explain: 'Variable, swappable pricing rules is the textbook case for the Strategy pattern (and it honours OCP).',
        },
        {
          type: 'mcq',
          q: 'Car, Bike, and Truck should be modelled as...',
          options: [
            'three completely unrelated classes',
            'subclasses of an abstract Vehicle base class',
            'three enums',
            'one class with a String type field and a giant switch',
          ],
          answer: 1,
          explain: 'They genuinely is-a Vehicle and share state/behaviour — an abstract Vehicle superclass fits.',
        },
        {
          type: 'mcq',
          q: 'Which is a real edge case you should raise for the parking lot?',
          options: [
            'What font the ticket uses',
            'Two vehicles racing for the last free spot (concurrency)',
            'The colour of the building',
            'How many CPUs the server has',
          ],
          answer: 1,
          explain: 'Concurrency on the last spot is a genuine correctness edge case — naming it shows design maturity.',
        },
        {
          type: 'code',
          q: 'Write the ParkingSpot class: a private boolean field occupied, plus methods isFree() and occupy().',
          starter: 'public class ParkingSpot {\n\n}\n',
          checks: [
            { label: 'Declares class ParkingSpot', re: 'class\\s+ParkingSpot', hint: 'public class ParkingSpot { ... }' },
            { label: 'Has a private boolean occupied field', re: 'private\\s+boolean\\s+occupied', hint: 'private boolean occupied;' },
            { label: 'Has an isFree() method', re: '\\bisFree\\s*\\(\\s*\\)\\s*\\{', hint: 'public boolean isFree() { return !occupied; }' },
            { label: 'Has an occupy() method', re: '\\boccupy\\s*\\(\\s*\\)\\s*\\{', hint: 'public void occupy() { occupied = true; }' },
          ],
          explain: 'A small, encapsulated ParkingSpot that owns and guards its own occupied state — clean LLD.',
        },
      ],
    },
    {
      id: 'l20',
      title: 'LLD — Elevator System',
      xp: 520,
      story: 'The final trial: an elevator system, the trickiest of the classics. Survive it and the Arena crowns you. "Design the brain that decides where the car goes."',
      lesson: `
        <h4>Problem: design an elevator system</h4>
        <p>One or more elevator cars, N floors, buttons inside cars and on each floor. Same 7-step ritual.</p>
        <h4>Entities</h4>
        <p>Nouns => <code>ElevatorSystem</code> (coordinates everything), <code>ElevatorCar</code> (one physical car), <code>Request</code> (a call: floor + direction), <code>Button</code>/<code>Display</code>, plus enums <code>Direction {UP, DOWN, IDLE}</code> and <code>DoorState {OPEN, CLOSED}</code>.</p>
        <h4>State & relationships</h4>
        <pre>enum Direction { UP, DOWN, IDLE }

class ElevatorCar {
    private int currentFloor;
    private Direction direction;
    private final TreeSet&lt;Integer&gt; targetFloors = new TreeSet&lt;&gt;();

    public void addTarget(int floor) { targetFloors.add(floor); }
    public void step() { /* move one floor toward the next target */ }
}</pre>
        <p><code>ElevatorSystem</code> <i>has-a</i> list of <code>ElevatorCar</code> (composition).</p>
        <h4>The key decision: scheduling</h4>
        <p>"Which car serves a request, and in what order does a car visit floors?" That algorithm <i>will</i> change (nearest-car, SCAN/elevator algorithm, load-aware). Put it behind a <b>Strategy</b>: <code>interface SchedulingStrategy { ElevatorCar selectCar(List&lt;ElevatorCar&gt; cars, Request r); }</code>. This is the single most important design move in this problem.</p>
        <h4>Other patterns</h4>
        <p><b>State pattern</b> models a car's behaviour in <code>Moving</code> / <code>Idle</code> / <code>DoorOpen</code> states. <b>Observer</b> lets floor displays update when a car moves. <b>Singleton</b> suits the single <code>ElevatorSystem</code> controller.</p>
        <h4>Use-case walk + edge cases</h4>
        <p>Request("floor 7, UP") → system asks the SchedulingStrategy to pick a car → car.addTarget(7) → car steps floor by floor → doors open. Edge cases: all cars busy, a request for the current floor, simultaneous requests, an emergency stop, weight limit. Voice every one — that is what wins the trial.</p>
        <h4>Two systems down</h4>
        <p>You have now walked two full designs end to end. The same 7-step ritual is ahead for three more classic problems — a vending machine, an LRU cache, and an expense-sharing app — before the final boss. The method never changes; only the nouns do.</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'In the elevator design, which decision is best wrapped in a Strategy?',
          options: [
            'The colour of the display',
            'The scheduling algorithm that picks which car serves a request',
            'The number of floors',
            'The name of the building',
          ],
          answer: 1,
          explain: 'The scheduling algorithm varies and will be swapped — the prime Strategy candidate here.',
        },
        {
          type: 'mcq',
          q: 'Direction {UP, DOWN, IDLE} and DoorState {OPEN, CLOSED} should be...',
          options: ['String fields', 'enums', 'separate subclasses', 'int flags'],
          answer: 1,
          explain: 'Fixed sets of states are exactly what enums are for — type-safe and self-documenting.',
        },
        {
          type: 'mcq',
          q: 'A car\'s behaviour differs while Moving vs Idle vs DoorOpen. The pattern that models this cleanly is...',
          options: ['Singleton', 'The State pattern', 'Factory', 'Observer'],
          answer: 1,
          explain: 'The State pattern encapsulates per-state behaviour and transitions — ideal for an elevator car.',
        },
        {
          type: 'mcq',
          q: 'Why should floor displays use the Observer pattern?',
          options: [
            'To create elevator cars',
            'So displays are notified automatically when a car moves, without the car knowing each display',
            'To ensure one display exists',
            'To pick a scheduling algorithm',
          ],
          answer: 1,
          explain: 'A moving car (subject) notifies all subscribed displays (observers) — loose coupling via Observer.',
        },
        {
          type: 'mcq',
          q: 'Which is a genuine elevator edge case worth raising aloud?',
          options: [
            'The brand of steel used',
            'Simultaneous requests from multiple floors / all cars already busy',
            'The lobby carpet colour',
            'The Wi-Fi password',
          ],
          answer: 1,
          explain: 'Concurrent requests and saturation are real correctness concerns — naming them shows maturity.',
        },
        {
          type: 'code',
          q: 'DESIGN — Write an interface SchedulingStrategy with a method selectCar that takes a Request and returns an ElevatorCar.',
          starter: '// Request and ElevatorCar are already defined for you.\n',
          scaffold: 'class ElevatorCar { } class Request { }',
          checks: [
            { label: 'Declares interface SchedulingStrategy', re: 'interface\\s+SchedulingStrategy', hint: 'public interface SchedulingStrategy { ... }' },
            { label: 'Declares a selectCar method', re: '\\bselectCar\\s*\\(', hint: 'ElevatorCar selectCar(...);' },
            { label: 'selectCar returns an ElevatorCar', re: 'ElevatorCar\\s+selectCar', hint: 'The return type must be ElevatorCar.' },
            { label: 'selectCar accepts a Request', re: 'selectCar\\s*\\([^)]*Request', hint: 'Pass a Request parameter into selectCar.' },
          ],
          explain: 'You closed the loop: an abstraction that makes the elevator open to any scheduling algorithm. You are LLD-ready.',
        },
      ],
    },
    {
      id: 'l21',
      title: 'LLD — Vending Machine',
      xp: 540,
      story: 'A merchant\'s vending machine keeps handing out free soda and eating coins. "It has no sense of where it IS," says the champion. "Give it states — and make it behave differently in each."',
      lesson: `
        <h4>Problem: design a vending machine</h4>
        <p>A machine holds products in slots, accepts coins, dispenses an item, and returns change. The same 7-step ritual applies — and this problem is the canonical home of the <b>State pattern</b>.</p>
        <h4>1–2. Requirements & entities</h4>
        <p>Select a product, insert coins until enough is paid, dispense + return change, or cancel and refund. Nouns => classes: <code>VendingMachine</code>, <code>Product</code>, <code>Slot</code> (a product + a count), <code>Inventory</code>, <code>CoinManager</code>, plus an enum <code>Coin</code> with values that each carry a cent amount.</p>
        <h4>3. The key insight: behaviour depends on state</h4>
        <p>The machine behaves <i>differently</i> depending on its current state. Inserting a coin means nothing in the <i>Idle</i> state, but adds credit in the <i>HasMoney</i> state. A long <code>if (state == ...)</code> in every method is the smell. The <b>State pattern</b> fixes it: model each state as a class.</p>
        <pre>interface VendingState {
    void selectProduct(VendingMachine m, String code);
    void insertCoin(VendingMachine m, Coin coin);
    void dispense(VendingMachine m);
}

class IdleState     implements VendingState { /* waiting for a selection */ }
class HasMoneyState implements VendingState { /* collecting coins      */ }
class DispenseState implements VendingState { /* releasing the item    */ }

class VendingMachine {
    private VendingState state = new IdleState();
    public void setState(VendingState s) { this.state = s; }
    public void insertCoin(Coin c) { state.insertCoin(this, c); }   // delegate
}</pre>
        <p>The machine <i>delegates</i> every action to its current state object, and a state transitions the machine by calling <code>setState(...)</code>. Each state class holds the behaviour for one situation only — that is SRP applied to states.</p>
        <h4>4–7. The rest of the ritual</h4>
        <p>Responsibilities: <code>Inventory</code> tracks stock, <code>CoinManager</code> tracks/returns change. Patterns: State (above); a <b>Strategy</b> could vary the change-making algorithm. Use-case walk: select → insert coins → enough paid → dispense → change → back to Idle. Edge cases: out of stock, insufficient funds, exact-change-only, cancel/refund mid-transaction. Voice every one.</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'A vending machine behaves differently while Idle vs collecting money vs dispensing. The cleanest pattern is...',
          options: [
            'Singleton',
            'The State pattern — one class per state, the machine delegates to its current state',
            'Factory',
            'a big if/else on a state field inside every method',
          ],
          answer: 1,
          explain: 'State pattern: each state is a class holding that state\'s behaviour; the machine delegates and transitions.',
        },
        {
          type: 'mcq',
          q: 'Coin {PENNY, NICKEL, DIME, QUARTER}, where each value also knows its cent amount, is best modelled as...',
          options: [
            'four separate classes',
            'an enum (an enum constant can carry fields like a cent value)',
            'four int constants',
            'a String field',
          ],
          answer: 1,
          explain: 'A fixed set of values that each carry data is a perfect Java enum with a field + constructor.',
        },
        {
          type: 'mcq',
          q: 'In the State pattern design, what does VendingMachine.insertCoin() actually do?',
          options: [
            'A long switch on the current state',
            'Delegates to the current state object: state.insertCoin(this, coin)',
            'Always adds credit directly',
            'Nothing — coins are handled by the Inventory',
          ],
          answer: 1,
          explain: 'The machine delegates the action to its current state; that state decides what happens and may transition.',
        },
        {
          type: 'mcq',
          q: 'Which is a real vending-machine edge case worth raising aloud?',
          options: [
            'The colour of the buttons',
            'Selected product is out of stock, or the machine cannot make exact change',
            'The brand of the screen',
            'How the coins are minted',
          ],
          answer: 1,
          explain: 'Out-of-stock and exact-change-only are genuine correctness cases — naming them shows design maturity.',
        },
        {
          type: 'code',
          q: 'Write the State-pattern contract: an interface VendingState with methods insertCoin() and dispense().',
          starter: '// the state interface\n',
          checks: [
            { label: 'Declares interface VendingState', re: 'interface\\s+VendingState', hint: 'public interface VendingState { ... }' },
            { label: 'Declares insertCoin()', re: '\\binsertCoin\\s*\\(', hint: 'void insertCoin();' },
            { label: 'Declares dispense()', re: '\\bdispense\\s*\\(', hint: 'void dispense();' },
          ],
          explain: 'Each concrete state (Idle, HasMoney, Dispense) implements this — behaviour per state, no giant if/else.',
        },
      ],
    },
    {
      id: 'l22',
      title: 'LLD — LRU Cache',
      xp: 560,
      story: 'The archive scribe keeps the most-recently-read scrolls within arm\'s reach and banishes the stalest one when the shelf is full. "Reads and evictions must both be instant," warns the champion.',
      lesson: `
        <h4>Problem: design an LRU (Least Recently Used) cache</h4>
        <p>A cache with a fixed capacity. <code>get(key)</code> and <code>put(key, value)</code> must both run in <b>O(1)</b>. When the cache is full, inserting a new key <i>evicts the least recently used</i> entry. This problem blends OOP modelling with data-structure design — a favourite of interviewers.</p>
        <h4>The two-structure trick</h4>
        <p>No single structure gives O(1) for everything, so you <i>compose two</i>:</p>
        <p>A <b>HashMap</b> <code>key → Node</code> gives O(1) lookup. A <b>doubly linked list</b> of those nodes keeps usage order: most-recently-used at the head, least-recently-used at the tail. Because each node carries <code>prev</code> and <code>next</code>, you can unlink it and move it to the head in O(1) — no scanning.</p>
        <pre>class Node {
    int key, value;
    Node prev, next;
    Node(int key, int value) { this.key = key; this.value = value; }
}

class LRUCache {
    private final int capacity;
    private final Map&lt;Integer, Node&gt; map = new HashMap&lt;&gt;();
    private final Node head, tail;          // dummy sentinels

    public int get(int key) {
        if (!map.containsKey(key)) return -1;
        Node n = map.get(key);
        moveToHead(n);                       // mark as most-recently-used
        return n.value;
    }
    public void put(int key, int value) {
        // insert/update, moveToHead, and if over capacity removeTail()
    }
}</pre>
        <h4>Why the design choices matter</h4>
        <p><b>Dummy head/tail sentinel nodes</b> remove every null check when inserting or removing — a clean-code move interviewers notice. <code>capacity</code> is <code>final</code> and the fields are <code>private</code> (encapsulation): callers touch only <code>get</code>/<code>put</code>.</p>
        <h4>Going further</h4>
        <p>Mention the alternatives: Java's <code>LinkedHashMap</code> with access-order can implement LRU in a few lines, and a different eviction rule (LFU, FIFO) is a natural <b>Strategy</b>. Edge cases: capacity of zero, updating an existing key, get on a missing key. Note thread-safety if asked.</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'An LRU cache needs O(1) get AND O(1) eviction. The standard design composes...',
          options: [
            'a single ArrayList',
            'a HashMap (O(1) lookup) plus a doubly linked list (O(1) reorder/evict)',
            'two HashMaps',
            'a sorted TreeMap',
          ],
          answer: 1,
          explain: 'HashMap gives O(1) lookup; the doubly linked list gives O(1) move-to-front and tail eviction.',
        },
        {
          type: 'mcq',
          q: 'Why a DOUBLY linked list rather than a singly linked one?',
          options: [
            'It uses less memory',
            'With prev + next you can unlink any node in O(1) without scanning for its predecessor',
            'Singly linked lists cannot store integers',
            'There is no real difference',
          ],
          answer: 1,
          explain: 'Removing an arbitrary node needs its predecessor; a `prev` pointer gives it in O(1).',
        },
        {
          type: 'mcq',
          q: 'What is the role of dummy "sentinel" head and tail nodes?',
          options: [
            'They store the most important data',
            'They remove null-checks — every real node always has a non-null prev and next',
            'They make the cache thread-safe',
            'They double the capacity',
          ],
          answer: 1,
          explain: 'Sentinels mean insert/remove never touch null, simplifying the linked-list code considerably.',
        },
        {
          type: 'mcq',
          q: 'On a get(key) for a key that IS present, an LRU cache must also...',
          options: [
            'evict that key',
            'move that node to the head — it is now the most recently used',
            'do nothing else',
            'clear the whole cache',
          ],
          answer: 1,
          explain: 'A successful get counts as a use, so the node moves to the most-recently-used end.',
        },
        {
          type: 'code',
          q: 'Write the Node class for the cache: int fields key and value, and two Node references prev and next.',
          starter: 'public class Node {\n\n}\n',
          checks: [
            { label: 'Declares class Node', re: '\\bclass\\s+Node\\b', hint: 'public class Node { ... }' },
            { label: 'Has int fields key and value', re: 'int\\s+key\\s*,\\s*value|int\\s+key[\\s\\S]*int\\s+value', hint: 'int key, value;' },
            { label: 'Has a Node prev reference', re: '\\bNode\\s+[\\s\\S]*\\bprev\\b', hint: 'Node prev;' },
            { label: 'Has a Node next reference', re: '\\bnext\\b', hint: 'Node next;' },
          ],
          explain: 'A node that points both ways is the unit that makes O(1) reordering possible.',
        },
      ],
    },
    {
      id: 'l23',
      title: 'LLD — Splitwise (Expense Sharing)',
      xp: 600,
      story: 'After the victory feast the party cannot agree who owes whom. The champion grins: "Design the ledger that settles it — and make the splitting rule swappable, because nobody splits the same way twice."',
      lesson: `
        <h4>Problem: design an expense-sharing app (Splitwise)</h4>
        <p>Users record shared expenses; the app tracks who owes whom and settles balances. It pulls together everything you have learned: clean entities, encapsulation, and the Strategy pattern.</p>
        <h4>1–2. Requirements & entities</h4>
        <p>A user adds an expense, names who paid and who shares it, picks how to split it; anyone can view balances and settle up. Nouns => classes: <code>User</code>, <code>Expense</code>, <code>Group</code>, <code>Split</code> (one person\'s share of an expense), and a <code>BalanceSheet</code> / <code>ExpenseManager</code> that tracks net balances.</p>
        <h4>3–4. The key decision: how to split</h4>
        <p>A bill can be split <i>equally</i>, by <i>exact amounts</i>, or by <i>percentage</i>. Hard-coding that with an <code>if</code> violates Open/Closed. Wrap it in a <b>Strategy</b>:</p>
        <pre>interface SplitStrategy {
    List&lt;Split&gt; split(double amount, List&lt;User&gt; members, double[] values);
}

class EqualSplit      implements SplitStrategy { /* amount / n each */ }
class ExactSplit      implements SplitStrategy { /* values are amounts   */ }
class PercentageSplit implements SplitStrategy { /* values are percents  */ }</pre>
        <p>A new splitting rule is a new class — the <code>ExpenseManager</code> never changes (OCP + DIP). The manager depends only on the <code>SplitStrategy</code> interface.</p>
        <h4>5–6. Tracking balances</h4>
        <p>Keep a balance map: for each pair of users, how much one owes the other. Adding an expense updates the map; <code>settleUp()</code> zeroes a pair. A clean model stores balances as <code>Map&lt;User, Map&lt;User, Double&gt;&gt;</code>. Use-case walk: Alice pays 900 for 3 people equally → each share 300 → Bob owes Alice 300, Carol owes Alice 300.</p>
        <h4>7. Edge cases & validation</h4>
        <p>Exact splits must sum to the total; percentages must sum to 100; a user cannot owe themselves; settling more than is owed. Validate in the strategy or the manager. As always — say these out loud. With this, your LLD toolkit is complete.</p>
      `,
      challenges: [
        {
          type: 'mcq',
          q: 'A bill can be split equally, by exact amounts, or by percentage — and more rules may be added. Best design?',
          options: [
            'A long if/else inside ExpenseManager',
            'A SplitStrategy interface with one class per splitting rule (Strategy pattern)',
            'A separate manager class per rule',
            'Hard-code equal splitting only',
          ],
          answer: 1,
          explain: 'Swappable, extensible algorithms behind one interface = Strategy, and it keeps ExpenseManager closed for modification.',
        },
        {
          type: 'mcq',
          q: 'Using a SplitStrategy interface means ExpenseManager depends on...',
          options: [
            'every concrete split class directly',
            'only the SplitStrategy abstraction — satisfying the Dependency Inversion Principle',
            'nothing at all',
            'the User class only',
          ],
          answer: 1,
          explain: 'Depending on the interface, not the concrete strategies, is DIP — and it makes the manager testable.',
        },
        {
          type: 'mcq',
          q: 'Which is a genuine validation edge case for expense splitting?',
          options: [
            'The font of the receipt',
            'Exact-amount splits not summing to the total, or percentages not summing to 100',
            'The colour of the app',
            'How fast the phone is',
          ],
          answer: 1,
          explain: 'A split that does not reconcile to the total is a correctness bug — validate it explicitly.',
        },
        {
          type: 'fill',
          q: 'Complete the Strategy contract for splitting.',
          code: 'public ___ SplitStrategy {\n    double[] split(double amount, int people);\n}\n\nclass EqualSplit ___ SplitStrategy {\n    public double[] split(double amount, int people) { /* ... */ return null; }\n}',
          blanks: ['interface', 'implements'],
          explain: 'Declare the contract with `interface`; each concrete rule `implements` it.',
        },
        {
          type: 'code',
          q: 'Write a class User with a private String name and a private double balance, a constructor, and a getter getBalance().',
          starter: 'public class User {\n\n}\n',
          checks: [
            { label: 'Declares class User', re: '\\bclass\\s+User\\b', hint: 'public class User { ... }' },
            { label: 'name field is private', re: 'private\\s+String\\s+name', hint: 'private String name;' },
            { label: 'balance field is private', re: 'private\\s+double\\s+balance', hint: 'private double balance;' },
            { label: 'Has a constructor User(...)', re: '\\bUser\\s*\\([^)]*\\)\\s*\\{', hint: 'public User(String name) { ... }' },
            { label: 'Has a getBalance() getter', re: '\\bgetBalance\\s*\\(\\s*\\)\\s*\\{', hint: 'public double getBalance() { return balance; }' },
          ],
          explain: 'A small, encapsulated User entity — the building block the whole expense ledger is made of.',
        },
      ],
    },
    {
      id: 'boss5',
      title: 'BOSS — The Architect of Chaos',
      xp: 800,
      boss: true,
      story: 'The final guardian throws every concept of the realm at you at once — pillars, principles, patterns, and design judgement. Defeat it and you are crowned a Master of Object-Oriented Design.',
      lesson: '',
      challenges: [
        {
          type: 'mcq',
          q: 'GRAND BOSS Q1 — A class does logging, validation, and DB access. Which principle is violated?',
          options: ['Open/Closed', 'Single Responsibility', 'Liskov', 'Interface Segregation'],
          answer: 1,
          explain: 'Three jobs, three reasons to change — Single Responsibility Principle violated.',
        },
        {
          type: 'mcq',
          q: 'GRAND BOSS Q2 — You need to add new behaviour without editing tested classes. Combine which principle + pattern?',
          options: [
            'LSP + Singleton',
            'Open/Closed + Strategy',
            'ISP + Observer',
            'SRP + Factory',
          ],
          answer: 1,
          explain: 'Open/Closed says extend-don\'t-modify; Strategy makes each new behaviour a new pluggable class.',
        },
        {
          type: 'mcq',
          q: 'GRAND BOSS Q3 — A service does `new MySqlRepo()` internally. Fix it with...',
          options: [
            'the Singleton pattern',
            'Dependency Injection — depend on a Repository interface and inject the concrete one',
            'method overloading',
            'a bigger constructor',
          ],
          answer: 1,
          explain: 'DIP via Dependency Injection: depend on the abstraction, inject the detail from outside.',
        },
        {
          type: 'mcq',
          q: 'GRAND BOSS Q4 — A Car needs an Engine. Model it with...',
          options: [
            'inheritance — Car extends Engine',
            'composition — Car has an Engine field',
            'an enum',
            'a Singleton',
          ],
          answer: 1,
          explain: 'has-a => composition. Favour composition over inheritance.',
        },
        {
          type: 'mcq',
          q: 'GRAND BOSS Q5 — `Animal a = new Dog(); a.speak();` printing "Woof" is...',
          options: [
            'method overloading',
            'runtime polymorphism via dynamic dispatch',
            'encapsulation',
            'abstraction',
          ],
          answer: 1,
          explain: 'The real object decides the overridden method at runtime — dynamic dispatch.',
        },
        {
          type: 'mcq',
          q: 'GRAND BOSS Q6 — In an LLD interview, the best way to discover your classes is to...',
          options: [
            'use exactly the classes from a tutorial you memorised',
            'extract the nouns from clarified requirements, then assign each one responsibility',
            'start coding and see what happens',
            'make everything static',
          ],
          answer: 1,
          explain: 'Clarify → nouns become classes → assign single responsibilities. The ritual.',
        },
        {
          type: 'mcq',
          q: 'GRAND BOSS Q7 — A fat interface forces classes to implement methods they do not need. Two things at risk?',
          options: [
            'Only performance',
            'ISP (too fat) and LSP (empty/throwing methods break substitutability)',
            'Only encapsulation',
            'Nothing — it is fine',
          ],
          answer: 1,
          explain: 'A fat interface violates ISP, and the forced empty/throwing methods then break LSP too.',
        },
        {
          type: 'code',
          q: 'CROWNING BLOW — Demonstrate mastery. Write an abstract class Account with a private double balance, a constructor, an abstract method withdraw(double amount), and a public getter getBalance().',
          starter: 'public abstract class Account {\n\n}\n',
          checks: [
            { label: 'Account is an abstract class', re: 'abstract\\s+class\\s+Account', hint: 'public abstract class Account { ... }' },
            { label: 'balance field is private', re: 'private\\s+double\\s+balance', hint: 'private double balance;' },
            { label: 'Has a constructor Account(...)', re: '\\bAccount\\s*\\([^)]*\\)\\s*\\{', hint: 'public Account(double balance) { ... }' },
            { label: 'Declares abstract withdraw(double ...)', re: 'abstract\\s+\\w+\\s+withdraw\\s*\\(\\s*double', hint: 'public abstract void withdraw(double amount);' },
            { label: 'Has a getBalance() getter', re: '\\bgetBalance\\s*\\(\\s*\\)\\s*\\{', hint: 'public double getBalance() { return balance; }' },
            { label: 'Getter returns balance', re: 'return\\s+balance', hint: 'getBalance must return the balance field.' },
          ],
          explain: 'Encapsulation, abstraction, constructors, and a polymorphic hook — all in one class. You are crowned a Master of OOP & LLD.',
        },
      ],
    },
  ],
},
];
