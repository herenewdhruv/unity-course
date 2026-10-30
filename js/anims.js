/* ==========================================================
   CODE ANIMATIONS — har step: kaunsi line (number ya unique text),
   note (kya hua), set (memory/widgets mein badlav), log (console)
   ========================================================== */
const F = (name, vars) => ({ frames: { [name]: vars } });
const ANIMS = {};

/* ---------- Topic 0: Unity khud functions call karta hai ---------- */
ANIMS.lifecycle = {
  title: 'Unity ka game loop', file: 'Hello.cs',
  intro: 'Is script ko ek Cube pe lagaya hai jisme Collider hai. Dekhte hain Play dabane pe Unity kaunse functions <b>khud</b> call karta hai.',
  code: `
public class Hello : MonoBehaviour
{
    void Start()
    {
        Debug.Log("Game shuru!");
    }

    void Update()
    {
        transform.position += Vector3.down * 1f;
    }

    void OnCollisionEnter(Collision other)
    {
        Debug.Log("Takra gaye: " + other.gameObject.name);
    }
}`,
  steps: [
    { l: 'void Start()', note: '▶ Play dabaya! Unity ne sabse pehle <code>Start()</code> call kiya. Ye <b>sirf ek baar</b> chalta hai.', set: { cube: { x: 5, y: 4, label: '🧊' }, loop: { items: ['F1', 'F2', 'F3', 'F4'], cur: -1, label: 'frame = 0' } } },
    { l: 'Debug.Log("Game shuru!")', note: 'Console mein message print hua. <code>Debug.Log()</code> = Console pe likhne wala pen ✍️', log: 'Game shuru!' },
    { l: 'void Update()', note: 'Ab shuru hua <b>game loop</b>. Unity har frame <code>Update()</code> call karta hai — 60 FPS = ek second mein 60 baar!', set: { loop: { cur: 0, label: 'frame = 1' } } },
    { l: 'transform.position +=', note: 'Cube 1 unit neeche khiska. (y: 4 → 3)', set: { cube: { y: 3 } } },
    { l: 'void Update()', note: 'Agla frame aaya → Update() <b>phir se</b> chala. Koi loop likhna nahi pada, Unity khud bula raha hai!', set: { loop: { cur: 1, label: 'frame = 2' } } },
    { l: 'transform.position +=', note: 'y: 3 → 2. Cube girta jaa raha hai…', set: { cube: { y: 2 } } },
    { l: 'void Update()', note: 'Frame 3 → Update() again 🔁', set: { loop: { cur: 2, label: 'frame = 3' } } },
    { l: 'transform.position +=', note: 'y: 2 → 1', set: { cube: { y: 1 } } },
    { l: 'void Update()', note: 'Frame 4 → Update() 🔁', set: { loop: { cur: 3, label: 'frame = 4' } } },
    { l: 'transform.position +=', note: 'y: 1 → 0… aur neeche Ground hai! 😱', set: { cube: { y: 0, color: 'linear-gradient(135deg,#ff4fa3,#ff8a3d)' } } },
    { l: 'void OnCollisionEnter', note: '💥 <b>Takkar!</b> Physics engine ne dekha ki do colliders touch hue, toh Unity ne khud <code>OnCollisionEnter()</code> call kiya aur jisse takraye uski info <code>other</code> mein di.', set: F('OnCollisionEnter()', { 'Collision other': '~Ground' }) },
    { l: 'Debug.Log("Takra gaye', note: 'Console: "Takra gaye: Ground". Yahi poore chapter ka base hai — <b>functions</b>, jo koi aur (Unity, ya tumhara code) sahi time pe call karta hai.', log: 'Takra gaye: Ground' }
  ]
};

/* ---------- Topic 1: Functions ---------- */
ANIMS.funcBasic = {
  title: 'Function call ka safar', file: 'Player.cs',
  code: `
public class Player : MonoBehaviour
{
    void Start()
    {
        int total = AddNumbers(5, 3);
        Debug.Log("Total: " + total);
        SayHello();
    }

    int AddNumbers(int a, int b)
    {
        int sum = a + b;
        return sum;
    }

    void SayHello()
    {
        Debug.Log("Hello Bhai!");
    }
}`,
  steps: [
    { l: 'void Start()', note: 'Unity ne <code>Start()</code> call kiya. Memory mein Start() ka ek <b>dabba (frame)</b> bana jisme iske variables rahenge.', set: F('Start()', {}) },
    { l: 'int total = AddNumbers(5, 3);', note: '<code>=</code> ka right side pehle chalta hai. <code>AddNumbers(5, 3)</code> call hua → code wahan <b>jump</b> karega.' },
    { l: 'int AddNumbers(int a, int b)', note: 'AddNumbers ka naya dabba bana. Parameters <code>a = 5</code>, <code>b = 3</code> aa gaye — ye hi <b>ingredients</b> hain 🧂', set: F('AddNumbers()', { 'int a': 5, 'int b': 3 }) },
    { l: 'int sum = a + b;', note: '5 + 3 = 8. Naya variable <code>sum</code> bana.', set: F('AddNumbers()', { 'int sum': 8 }) },
    { l: 'return sum;', note: '<code>return</code> = "ye lo result, main chala" 👋. Value <b>8</b> wapas Start() ko gayi aur AddNumbers ka dabba <b>delete</b> ho gaya.', set: { frames: { 'AddNumbers()': null, 'Start()': { 'int total': 8 } } }, f: 'Start()' },
    { l: 'Debug.Log("Total: "', note: '"Total: " + 8 → Console pe print.', log: 'Total: 8' },
    { l: 'SayHello();', note: 'Ab <code>SayHello()</code> call. Koi parameter nahi, khaali brackets <code>()</code>.' },
    { l: 'void SayHello()', note: '<code>void</code> function — kaam karega, kuch return nahi karega.', set: F('SayHello()', {}) },
    { l: 'Debug.Log("Hello Bhai!");', note: 'Console mein "Hello Bhai!" 🙋', log: 'Hello Bhai!' },
    { l: 19, note: 'Function khatam <code>}</code> → wapas Start() mein, uska kaam bhi poora. Done! ✅', set: { frames: { 'SayHello()': null } } }
  ]
};

ANIMS.updateMove = {
  title: 'Update() har frame', file: 'Mover.cs',
  intro: 'Samjhane ke liye maan lo har frame <code>Time.deltaTime = 0.5</code> sec hai (asli mein ~0.016 hota hai).',
  code: `
public class Mover : MonoBehaviour
{
    float speed = 4f;
    int frame = 0;

    void Update()
    {
        frame++;
        MoveRight(speed * Time.deltaTime);
    }

    void MoveRight(float amount)
    {
        transform.position += new Vector3(amount, 0, 0);
    }
}`,
  steps: [
    { l: 'float speed = 4f;', note: 'Class ke variables (fields) bane. Ye pura game chalne tak zinda rehte hain.', set: { frames: { 'Mover (fields)': { 'float speed': 4, 'int frame': 0 } }, cube: { x: 0, y: 2, label: '🚗' }, loop: { items: ['F1', 'F2', 'F3'], cur: -1, label: 'Update calls: 0' } } },
    { l: 'void Update()', note: 'Frame 1 → Unity ne Update() bulaya.', set: { loop: { cur: 0, label: 'Update calls: 1' } } },
    { l: 'frame++;', note: '<code>++</code> matlab 1 badhao. frame: 0 → 1', set: F('Mover (fields)', { 'int frame': 1 }) },
    { l: 'MoveRight(speed', note: '4 × 0.5 = <b>2</b>. Ye value MoveRight ko bheji.', set: F('MoveRight()', { 'float amount': 2 }) },
    { l: 'transform.position +=', note: 'Car 2 unit right gayi! 🚗💨', set: { cube: { x: 2 }, frames: { 'MoveRight()': null } }, f: 'Mover (fields)' },
    { l: 'void Update()', note: 'Frame 2 → Update() <b>dobara</b>. Har frame ye repeat hoga jab tak game chal raha hai.', set: { loop: { cur: 1, label: 'Update calls: 2' } } },
    { l: 'frame++;', note: 'frame: 1 → 2', set: F('Mover (fields)', { 'int frame': 2 }) },
    { l: 'MoveRight(speed', note: 'Phir se amount = 2', set: F('MoveRight()', { 'float amount': 2 }) },
    { l: 'transform.position +=', note: 'x: 2 → 4', set: { cube: { x: 4 }, frames: { 'MoveRight()': null } }, f: 'Mover (fields)' },
    { l: 'void Update()', note: 'Frame 3 🔁', set: { loop: { cur: 2, label: 'Update calls: 3' } } },
    { l: 'frame++;', note: 'frame: 2 → 3', set: F('Mover (fields)', { 'int frame': 3 }) },
    { l: 'transform.position +=', note: 'x: 4 → 6. Dekha? Ek chhota function, har frame thoda thoda kaam → <b>smooth movement</b>! 🎮', set: { cube: { x: 6 } } }
  ]
};

/* ---------- Topic 2: Return types ---------- */
ANIMS.moveTo = {
  title: 'void function + parameters = cube move', file: 'Teleporter.cs',
  code: `
void Start()
{
    MoveTo(5f, 0f, 0f);
    MoveTo(5f, 3f, 0f);
    MoveTo(10f, 1f, 0f);
}

void MoveTo(float x, float y, float z)
{
    transform.position = new Vector3(x, y, z);
}`,
  steps: [
    { l: 'void Start()', note: 'Cube abhi (0, 0, 0) pe hai.', set: { cube: { x: 0, y: 0, label: '🧊' }, frames: { 'Start()': {} } } },
    { l: 'MoveTo(5f, 0f, 0f);', note: 'MoveTo ko 3 values bheji: 5, 0, 0' },
    { l: 'void MoveTo(float x', note: 'Parameters ke dabbe bane: x=5, y=0, z=0', set: F('MoveTo()', { 'float x': 5, 'float y': 0, 'float z': 0 }) },
    { l: 'transform.position =', note: '🚀 Cube teleport hua (5, 0, 0) pe! <code>void</code> hai toh kuch return nahi — bas kaam kiya.', set: { cube: { x: 5, y: 0 }, frames: { 'MoveTo()': null } }, f: 'Start()' },
    { l: 'MoveTo(5f, 3f, 0f);', note: 'Same function, <b>alag values</b>. Yahi reuse ki power hai!' },
    { l: 'void MoveTo(float x', note: 'x=5, y=3, z=0', set: F('MoveTo()', { 'float x': 5, 'float y': 3, 'float z': 0 }) },
    { l: 'transform.position =', note: 'Cube upar uda ⬆️ (5, 3, 0)', set: { cube: { x: 5, y: 3 }, frames: { 'MoveTo()': null } }, f: 'Start()' },
    { l: 'MoveTo(10f, 1f, 0f);', note: 'Teesri call…' },
    { l: 'void MoveTo(float x', note: 'x=10, y=1, z=0', set: F('MoveTo()', { 'float x': 10, 'float y': 1, 'float z': 0 }) },
    { l: 'transform.position =', note: 'Cube (10, 1, 0) pe! Ek function, 3 jagah use. ✨', set: { cube: { x: 10, y: 1, color: 'linear-gradient(135deg,#2ee59d,#00d4ff)' }, frames: { 'MoveTo()': null } }, f: 'Start()' }
  ]
};

ANIMS.healthStatus = {
  title: 'return + if-else: raasta kaise chuna jaata hai', file: 'PlayerHealth.cs',
  code: `
int health = 40;

void Start()
{
    string s = GetHealthStatus();
    Debug.Log("Status: " + s);
}

string GetHealthStatus()
{
    if (health > 75) return "Healthy";
    if (health > 50) return "Wounded";
    if (health > 25) return "Critical";
    return "Dying";
}`,
  steps: [
    { l: 'int health = 40;', note: 'Player ki health = 40 (thoda pit chuka hai 🤕)', set: { frames: { 'Player (fields)': { 'int health': 40 } } } },
    { l: 'void Start()', note: 'Start() chala.', set: F('Start()', {}) },
    { l: 'string s = GetHealthStatus();', note: 'Function call → jo <b>string</b> return hogi woh <code>s</code> mein jayegi.' },
    { l: 'string GetHealthStatus()', note: 'Return type <code>string</code> hai — matlab ye function pakka ek text wapas dega.', set: { frames: { 'GetHealthStatus()': {} }, branch: { cond: 'health = 40 → kaunsa raasta?', paths: ['> 75 Healthy', '> 50 Wounded', '> 25 Critical', 'else Dying'], checked: [], taken: -1 } } },
    { l: 'if (health > 75)', note: '40 > 75? <b>Nahi</b> ❌ → agli line', set: { branch: { checked: [0] } } },
    { l: 'if (health > 50)', note: '40 > 50? <b>Nahi</b> ❌ → agli line', set: { branch: { checked: [0, 1] } } },
    { l: 'if (health > 25)', note: '40 > 25? <b>HAAN</b> ✅ → <code>return "Critical"</code>. Return hote hi function <b>turant band</b> — neeche ki line kabhi nahi chalegi!', set: { branch: { taken: 2 } } },
    { l: 'string s = GetHealthStatus();', note: '"Critical" wapas aaya aur <code>s</code> mein store hua.', set: { frames: { 'GetHealthStatus()': null, 'Start()': { 'string s': 'Critical' } } }, f: 'Start()' },
    { l: 'Debug.Log("Status: "', note: 'Console: <b>Status: Critical</b>. (Interactive demo mein slider se health badal ke dekhna!)', log: 'Status: Critical' }
  ]
};

/* ---------- Topic 3: value vs ref vs out ---------- */
ANIMS.valueRef = {
  title: 'Copy vs Reference', file: 'DamageTest.cs',
  code: `
void Start()
{
    int myHealth = 100;
    ApplyDamage(myHealth, 30);
    Debug.Log("After copy: " + myHealth);
    ApplyDamageRef(ref myHealth, 30);
    Debug.Log("After ref: " + myHealth);
}

void ApplyDamage(int health, int damage)
{
    health -= damage;
}

void ApplyDamageRef(ref int health, int damage)
{
    health -= damage;
}`,
  steps: [
    { l: 'int myHealth = 100;', note: '<code>myHealth</code> ka dabba bana, value 100.', set: F('Start()', { 'int myHealth': 100 }) },
    { l: 'ApplyDamage(myHealth, 30);', note: 'Normal call. C# by default value ki <b>photocopy</b> 📄 bhejta hai.' },
    { l: 'void ApplyDamage(int health', note: 'Naya dabba <code>health</code> bana jisme 100 ki <b>COPY</b> hai. Original se koi connection nahi.', set: F('ApplyDamage()', { 'int health': 100, 'int damage': 30 }) },
    { l: 'health -= damage;', note: 'Copy 100 → 70 hui. Lekin Start() wala <code>myHealth</code> abhi bhi 100 hai! 😎', set: F('ApplyDamage()', { 'int health': 70 }) },
    { l: 'Debug.Log("After copy: "', note: 'Function khatam, copy kachre mein 🗑️. Console: <b>100</b> — original safe!', set: { frames: { 'ApplyDamage()': null } }, f: 'Start()', log: 'After copy: 100' },
    { l: 'ApplyDamageRef(ref myHealth, 30);', note: 'Ab <code>ref</code> ke saath! Copy nahi, <b>asli dabbe ka address</b> 🔗 bheja ja raha hai.' },
    { l: 'void ApplyDamageRef(ref int health', note: 'Dekho — <code>health</code> ab ek <b>link</b> hai jo seedha myHealth ko point karta hai (pink glow).', set: F('ApplyDamageRef()', { 'ref int health': { ref: 'myHealth' }, 'int damage': 30 }) },
    { l: 17, note: '<code>health -= 30</code> → link ke through <b>original myHealth</b> 100 → 70 ho gaya! 💥', set: F('Start()', { 'int myHealth': 70 }) },
    { l: 'Debug.Log("After ref: "', note: 'Console: <b>70</b>. ref = "ye lo asli cheez, change karo, wapas do" (two-way).', set: { frames: { 'ApplyDamageRef()': null } }, f: 'Start()', log: 'After ref: 70' }
  ]
};

ANIMS.outDemo = {
  title: 'out: function se extra value bahar nikalo', file: 'ScoreBoard.cs',
  code: `
void Start()
{
    bool found = TryGetScore("Raju", out int score);
    if (found)
        Debug.Log("Score: " + score);
}

bool TryGetScore(string name, out int score)
{
    if (name == "Raju")
    {
        score = 100;
        return true;
    }
    score = 0;
    return false;
}`,
  steps: [
    { l: 'bool found = TryGetScore', note: '<code>out int score</code> — khaali dabba bana (koi value nahi) aur function ko bola "isme result bhar dena".', set: F('Start()', { 'int score': '~(khaali)' }) },
    { l: 'bool TryGetScore(string name', note: 'Function ke andar <code>score</code> bahar wale dabbe se linked hai.', set: F('TryGetScore()', { 'string name': 'Raju', 'out int score': { ref: 'score' } }) },
    { l: 'if (name == "Raju")', note: '"Raju" == "Raju"? ✅ Haan!', set: { branch: { cond: 'name == "Raju" ?', paths: ['true → score = 100', 'false → score = 0'], checked: [], taken: 0 } } },
    { l: 'score = 100;', note: '<code>out</code> ka rule: function ko score <b>set karna hi padega</b>. Bahar wala dabba 100 se bhar gaya!', set: F('Start()', { 'int score': 100 }) },
    { l: 'return true;', note: 'Return value <code>true</code> → <code>found</code> mein. Ek function se <b>do cheezein</b> mili: bool + score! 🎁', set: { frames: { 'TryGetScore()': null, 'Start()': { 'bool found': true } } }, f: 'Start()' },
    { l: 'if (found)', note: 'found true hai…' },
    { l: 'Debug.Log("Score: "', note: 'Console: Score: 100. Unity mein <code>Physics.Raycast(..., out hit)</code> aur <code>TryGetComponent(out rb)</code> bilkul yahi pattern hain!', log: 'Score: 100' }
  ]
};

/* ---------- Topic 4: params + default ---------- */
ANIMS.paramsLoop = {
  title: 'params + foreach loop', file: 'MathHelper.cs',
  code: `
void Start()
{
    int sum = AddAll(10, 20, 30, 40);
    Debug.Log("Sum: " + sum);
}

int AddAll(params int[] numbers)
{
    int total = 0;
    foreach (int num in numbers)
    {
        total += num;
    }
    return total;
}`,
  steps: [
    { l: 'int sum = AddAll', note: '4 numbers bheje — bina array banaye! <code>params</code> khud array bana dega.', set: F('Start()', {}) },
    { l: 'int AddAll(params', note: 'Dekho: 10, 20, 30, 40 ek array <code>numbers</code> mein pack ho gaye 📦', set: { frames: { 'AddAll()': { 'int[] numbers': '~[10, 20, 30, 40]' } }, loop: { items: [10, 20, 30, 40], cur: -1, label: 'total = ?' } } },
    { l: 'int total = 0;', note: 'Gullak 🐷 khaali se shuru: total = 0', set: { frames: { 'AddAll()': { 'int total': 0 } }, loop: { label: 'total = 0' } } },
    { l: 'foreach (int num', note: 'Loop round 1: num = 10', set: { frames: { 'AddAll()': { 'int num': 10 } }, loop: { cur: 0 } } },
    { l: 'total += num;', note: '0 + 10 = 10', set: { frames: { 'AddAll()': { 'int total': 10 } }, loop: { label: 'total = 10' } } },
    { l: 'foreach (int num', note: 'Round 2: num = 20', set: { frames: { 'AddAll()': { 'int num': 20 } }, loop: { cur: 1 } } },
    { l: 'total += num;', note: '10 + 20 = 30', set: { frames: { 'AddAll()': { 'int total': 30 } }, loop: { label: 'total = 30' } } },
    { l: 'foreach (int num', note: 'Round 3: num = 30', set: { frames: { 'AddAll()': { 'int num': 30 } }, loop: { cur: 2 } } },
    { l: 'total += num;', note: '30 + 30 = 60', set: { frames: { 'AddAll()': { 'int total': 60 } }, loop: { label: 'total = 60' } } },
    { l: 'foreach (int num', note: 'Round 4: num = 40 (last wala)', set: { frames: { 'AddAll()': { 'int num': 40 } }, loop: { cur: 3 } } },
    { l: 'total += num;', note: '60 + 40 = 100 💯', set: { frames: { 'AddAll()': { 'int total': 100 } }, loop: { label: 'total = 100' } } },
    { l: 'return total;', note: 'Array khatam → loop band → 100 return.', set: { frames: { 'AddAll()': null, 'Start()': { 'int sum': 100 } }, loop: { cur: 4, label: '✅ done: 100' } }, f: 'Start()' },
    { l: 'Debug.Log("Sum: "', note: 'Console: Sum: 100', log: 'Sum: 100' }
  ]
};

ANIMS.defaults = {
  title: 'Default + named parameters', file: 'Spawner.cs',
  code: `
void Start()
{
    SpawnEnemy("Goblin");
    SpawnEnemy("Orc", 5);
    SpawnEnemy(health: 500, name: "Dragon", level: 10);
}

void SpawnEnemy(string name, int level = 1, int health = 100)
{
    Debug.Log($"Spawned {name} (Lv.{level}, HP:{health})");
}`,
  steps: [
    { l: 'SpawnEnemy("Goblin");', note: 'Sirf naam bheja. Level aur health? Default use honge!', set: F('Start()', {}) },
    { l: 'void SpawnEnemy(string name', note: 'level = <b>1</b> (default), health = <b>100</b> (default)', set: F('SpawnEnemy()', { 'string name': 'Goblin', 'int level': 1, 'int health': 100 }) },
    { l: 'Debug.Log($"Spawned', note: '👺 Goblin spawn!', log: 'Spawned Goblin (Lv.1, HP:100)', set: { frames: { 'SpawnEnemy()': null } } },
    { l: 'SpawnEnemy("Orc", 5);', note: 'Naam + level bheja, health default rahegi.' },
    { l: 'void SpawnEnemy(string name', note: 'level = 5 (humne diya), health = 100 (default)', set: F('SpawnEnemy()', { 'string name': 'Orc', 'int level': 5, 'int health': 100 }) },
    { l: 'Debug.Log($"Spawned', note: '👹 Orc spawn!', log: 'Spawned Orc (Lv.5, HP:100)', set: { frames: { 'SpawnEnemy()': null } } },
    { l: 'SpawnEnemy(health: 500', note: '<b>Named arguments</b>! Order ulta hai, phir bhi chalega kyunki naam se bata diya kaunsi value kahan jayegi.' },
    { l: 'void SpawnEnemy(string name', note: 'name ← "Dragon", level ← 10, health ← 500 — naam se match hue ✨', set: F('SpawnEnemy()', { 'string name': 'Dragon', 'int level': 10, 'int health': 500 }) },
    { l: 'Debug.Log($"Spawned', note: '🐉 BOSS spawn!', log: 'Spawned Dragon (Lv.10, HP:500)', set: { frames: { 'SpawnEnemy()': null } } }
  ]
};

/* ---------- Topic 5: Overloading ---------- */
const OVR = ['Attack()', 'Attack(int)', 'Attack(int, bool)'];
ANIMS.overload = {
  title: 'Compiler sahi overload kaise chunta hai', file: 'Fighter.cs',
  code: `
void Start()
{
    Attack();
    Attack(25);
    Attack(25, true);
}

void Attack()
{ Debug.Log("Basic attack! Damage: 10"); }

void Attack(int damage)
{ Debug.Log($"Attack! Damage: {damage}"); }

void Attack(int damage, bool isCritical)
{
    int finalDmg = isCritical ? damage * 2 : damage;
    Debug.Log($"Attack! Damage: {finalDmg} CRIT!");
}`,
  steps: [
    { l: '    Attack();', note: 'Call: <code>Attack()</code> — 0 arguments. Compiler teeno Attack dekhta hai…', set: { frames: { 'Start()': {} }, branch: { cond: 'Attack() → 0 args', paths: OVR, checked: [], taken: -1 } } },
    { l: 'void Attack()', note: '0 parameters wala match! ✅', set: { branch: { checked: [1, 2], taken: 0 } } },
    { l: '{ Debug.Log("Basic', note: 'Basic attack 🗡️', log: 'Basic attack! Damage: 10' },
    { l: '    Attack(25);', note: 'Call: <code>Attack(25)</code> — 1 int argument', set: { branch: { cond: 'Attack(25) → 1 int', checked: [], taken: -1 } } },
    { l: 'void Attack(int damage)', note: '(int) wala match ✅', set: { branch: { checked: [0, 2], taken: 1 } } },
    { l: '{ Debug.Log($"Attack!', note: '⚔️ 25 damage', log: 'Attack! Damage: 25' },
    { l: '    Attack(25, true);', note: 'Call: <code>Attack(25, true)</code> — int + bool', set: { branch: { cond: 'Attack(25, true) → int, bool', checked: [], taken: -1 } } },
    { l: 'void Attack(int damage, bool', note: '(int, bool) wala match ✅', set: { branch: { checked: [0, 1], taken: 2 }, frames: { 'Attack(int,bool)': { 'int damage': 25, 'bool isCritical': true } } } },
    { l: 'int finalDmg', note: 'isCritical true hai → 25 × 2 = 50 (ternary <code>? :</code> = chhota if-else)', set: F('Attack(int,bool)', { 'int finalDmg': 50 }) },
    { l: 'CRIT!");', note: '💥 CRITICAL HIT! Same naam, 3 alag kaam — yahi overloading hai.', log: 'Attack! Damage: 50 CRIT!' }
  ]
};

/* ---------- Topic 6: Lambda ---------- */
ANIMS.lambda = {
  title: 'Lambdas: chhote inline functions', file: 'Leaderboard.cs',
  code: `
void Start()
{
    Func<int, int, int> add = (a, b) => a + b;
    int result = add(10, 20);
    List<int> scores = new List<int> {90, 30, 70, 50, 80};
    int first = scores.Find(s => s > 75);
    scores.RemoveAll(s => s < 60);
    scores.Sort((a, b) => b.CompareTo(a));
}`,
  steps: [
    { l: 'Func<int, int, int> add', note: 'Ek bina naam ka function bana aur <code>add</code> variable mein rakh diya. <code>=></code> ko padho "goes to": (a, b) jaate hain a + b mein.', set: F('Start()', { 'Func add': '~(a,b) => a+b' }) },
    { l: 'int result = add(10, 20);', note: 'Variable ko function ki tarah call kiya! 10 + 20 = 30', set: F('Start()', { 'int result': 30 }) },
    { l: 'List<int> scores', note: '5 scores ki list bani 📊', set: { frames: { 'Start()': { 'List scores': '~[90,30,70,50,80]' } }, bars: { vals: [90, 30, 70, 50, 80], hl: [], out: [] } } },
    { l: 'scores.Find(s => s > 75)', note: 'Find har item pe lambda chalata hai: 90 > 75? ✅ Mil gaya! Pehla match return.', set: { frames: { 'Start()': { 'int first': 90 } }, bars: { hl: [0] } } },
    { l: 'scores.RemoveAll(s => s < 60)', note: 'Har score check: 30 < 60 ❌ hatao, 50 < 60 ❌ hatao. Baaki bache.', set: { bars: { hl: [], out: [1, 3] } } },
    { l: 'scores.RemoveAll(s => s < 60)', note: 'List ab: [90, 70, 80]', set: { frames: { 'Start()': { 'List scores': '~[90,70,80]' } }, bars: { vals: [90, 70, 80], out: [] } } },
    { l: 'scores.Sort((a, b)', note: 'Sort ko bataya kaise compare karna hai: <code>b.CompareTo(a)</code> = bada pehle (descending). 🏆', set: { frames: { 'Start()': { 'List scores': '~[90,80,70]' } }, bars: { vals: [90, 80, 70], hl: [0] } } }
  ]
};

/* ---------- Topic 7: Delegates ---------- */
ANIMS.delegate = {
  title: 'Multicast delegate: ek call, kai functions', file: 'ComboSystem.cs',
  code: `
public delegate void DamageAction(int damage);

void Start()
{
    DamageAction combo = TakePhysicalDamage;
    combo += ShowDamageNumber;
    combo += PlayHitSound;
    combo(30);
    combo -= ShowDamageNumber;
    combo(20);
}

void TakePhysicalDamage(int d) { Debug.Log($"Physical: -{d} HP"); }
void ShowDamageNumber(int d)   { Debug.Log($"POW! {d} damage!"); }
void PlayHitSound(int d)       { Debug.Log("Hit sound played!"); }`,
  steps: [
    { l: 'public delegate void', note: 'Delegate ka <b>type</b> define kiya: "aisa koi bhi function jo int le aur void de". Ye ek <b>shape</b> hai 🔲', set: { frames: { 'Start()': {} } } },
    { l: 'DamageAction combo = TakePhysicalDamage;', note: 'Function ko variable mein rakha! (Dhyan do: <code>()</code> nahi lagaye — call nahi kiya, sirf <b>address</b> rakha)', set: { chips: { name: 'combo', list: ['TakePhysicalDamage'], run: '' } } },
    { l: 'combo += ShowDamageNumber;', note: '<code>+=</code> se doosra function <b>jod</b> diya ➕', set: { chips: { list: ['TakePhysicalDamage', 'ShowDamageNumber'] } } },
    { l: 'combo += PlayHitSound;', note: 'Teesra bhi jod diya. Ab combo ek <b>playlist</b> 🎵 hai.', set: { chips: { list: ['TakePhysicalDamage', 'ShowDamageNumber', 'PlayHitSound'] } } },
    { l: '    combo(30);', note: 'Ek call… aur dekho kya hota hai!' },
    { l: 'void TakePhysicalDamage', note: '1️⃣ pehla function chala', set: { chips: { run: 'TakePhysicalDamage' } }, log: 'Physical: -30 HP' },
    { l: 'void ShowDamageNumber', note: '2️⃣ doosra', set: { chips: { run: 'ShowDamageNumber' } }, log: 'POW! 30 damage!' },
    { l: 'void PlayHitSound', note: '3️⃣ teesra! <b>Order wahi jisme jode the.</b>', set: { chips: { run: 'PlayHitSound' } }, log: 'Hit sound played!' },
    { l: 'combo -= ShowDamageNumber;', note: '<code>-=</code> se ShowDamageNumber hata diya ➖', set: { chips: { list: ['TakePhysicalDamage', 'PlayHitSound'], run: '' } } },
    { l: '    combo(20);', note: 'Ab sirf 2 bache hain…' },
    { l: 'void TakePhysicalDamage', note: '1️⃣', set: { chips: { run: 'TakePhysicalDamage' } }, log: 'Physical: -20 HP' },
    { l: 'void PlayHitSound', note: '2️⃣ — ShowDamageNumber skip, kyunki list se nikal diya tha. ✅', set: { chips: { run: 'PlayHitSound' } }, log: 'Hit sound played!' }
  ]
};

/* ---------- Topic 8: Events ---------- */
ANIMS.event = {
  title: 'Event: Publisher → Subscribers', file: 'PlayerHealth.cs + UIManager.cs + Enemy.cs',
  code: `
// ===== PlayerHealth.cs (Publisher) =====
public int currentHealth = 100;
public event Action<int> onHealthChanged;
public event Action onDeath;

public void TakeDamage(int damage)
{
    currentHealth -= damage;
    onHealthChanged?.Invoke(currentHealth);
    if (currentHealth <= 0)
        onDeath?.Invoke();
}

// ===== UIManager.cs (Subscriber) =====
void OnEnable()  { player.onHealthChanged += UpdateHealthBar; }
void OnDisable() { player.onHealthChanged -= UpdateHealthBar; }
void UpdateHealthBar(int hp) { Debug.Log("UI: Health = " + hp); }

// ===== Enemy.cs =====
void OnCollisionEnter(Collision c) { player.TakeDamage(60); }`,
  steps: [
    { l: 'public int currentHealth', note: 'Player ki health 100.', set: { frames: { 'PlayerHealth': { 'int currentHealth': 100 } }, chips: { name: 'onHealthChanged', list: [], run: '' } } },
    { l: 'public event Action<int> onHealthChanged;', note: '📢 Event declare hua. Abhi koi sunne wala (subscriber) nahi → list khaali (null).' },
    { l: 'void OnEnable()', note: 'UIManager active hua → <code>+=</code> se <b>subscribe</b> kiya. "Bhai, health badle toh mujhe batana!"', set: { chips: { list: ['UIManager.UpdateHealthBar'] } } },
    { l: 'void OnCollisionEnter', note: '💥 Enemy player se takraya → <code>TakeDamage(60)</code>', set: F('TakeDamage()', { 'int damage': 60 }) },
    { l: 'currentHealth -= damage;', note: '100 − 60 = 40', set: F('PlayerHealth', { 'int currentHealth': 40 }), f: 'PlayerHealth' },
    { l: 'onHealthChanged?.Invoke', note: '📡 <b>Broadcast!</b> Event fire hua → saare subscribers ko call gaya. Player ko pata bhi nahi UI hai ya nahi!', set: { chips: { run: 'UIManager.UpdateHealthBar' } } },
    { l: 'void UpdateHealthBar', note: 'UIManager ka handler chala aur bar update kiya 📊', log: 'UI: Health = 40' },
    { l: 'if (currentHealth <= 0)', note: '40 <= 0? Nahi → onDeath fire nahi hoga.', set: { chips: { run: '' } } },
    { l: 'void OnCollisionEnter', note: '💥 Enemy phir se takraya! Ek aur TakeDamage(60)', set: F('TakeDamage()', { 'int damage': 60 }) },
    { l: 'currentHealth -= damage;', note: '40 − 60 = −20 💀', set: F('PlayerHealth', { 'int currentHealth': -20 }), f: 'PlayerHealth' },
    { l: 'onHealthChanged?.Invoke', note: 'Broadcast again…', set: { chips: { run: 'UIManager.UpdateHealthBar' } } },
    { l: 'void UpdateHealthBar', note: 'UI updated', log: 'UI: Health = -20' },
    { l: 'onDeath?.Invoke();', note: '-20 <= 0 ✅ → onDeath fire! Lekin <b>onDeath ka koi subscriber nahi</b>… <code>?.</code> ne check kiya "null hai?" → haan → chupchaap skip. <b>Crash nahi hua!</b> 🛡️', set: { chips: { run: '' } }, log: { t: 'onDeath = null → ?. ne crash bachaya', c: 'warn' } },
    { l: 'void OnDisable()', note: 'UIManager disable hua → <code>-=</code> se unsubscribe. Ye bhoole toh memory leak! 🧹', set: { chips: { list: [] }, frames: { 'TakeDamage()': null } } }
  ]
};

/* ---------- Topic 9: Action & Func ---------- */
ANIMS.func = {
  title: 'Func = return wala, Action = void wala', file: 'DamageCalc.cs',
  code: `
void Start()
{
    Func<int, int, int> normal   = (dmg, def) => dmg - def;
    Func<int, int, int> critical = (dmg, def) => dmg * 2 - def;
    Func<int, int, int> formula = normal;
    int hit1 = formula(50, 10);
    formula = critical;
    int hit2 = formula(50, 10);
    Action<string> shout = msg => Debug.Log(msg + "!!!");
    shout("Hit2 = " + hit2);
}`,
  steps: [
    { l: 'Func<int, int, int> normal', note: '<code>Func&lt;int, int, int&gt;</code> = 2 int lo, <b>last wala</b> int return karo. Normal formula: dmg − def', set: F('Start()', { 'Func normal': '~dmg - def' }) },
    { l: 'Func<int, int, int> critical', note: 'Critical formula: dmg × 2 − def', set: F('Start()', { 'Func critical': '~dmg*2 - def' }) },
    { l: 'Func<int, int, int> formula = normal;', note: '<code>formula</code> ab normal ko point kar raha hai 👉', set: { frames: { 'Start()': { 'Func formula': { ref: 'normal' } } } } },
    { l: 'int hit1 = formula(50, 10);', note: '50 − 10 = <b>40</b>', set: F('Start()', { 'int hit1': 40 }) },
    { l: 'formula = critical;', note: 'Formula <b>swap</b>! Same variable, alag function 🔄', set: { frames: { 'Start()': { 'Func formula': { ref: 'critical' } } } } },
    { l: 'int hit2 = formula(50, 10);', note: '50 × 2 − 10 = <b>90</b> 💥', set: F('Start()', { 'int hit2': 90 }) },
    { l: 'Action<string> shout', note: '<code>Action&lt;string&gt;</code> = string lo, <b>kuch return mat karo</b> (void).', set: F('Start()', { 'Action shout': '~msg => Log(msg+"!!!")' }) },
    { l: 'shout("Hit2 = "', note: 'Console mein chillaya 📣', log: 'Hit2 = 90!!!' }
  ]
};

/* ---------- Topic 10: Callbacks ---------- */
ANIMS.callback = {
  title: 'Callback: "kaam ho jaye toh call back karna"', file: 'PizzaShop.cs',
  code: `
void Start()
{
    Debug.Log("Pizza order kiya");
    DoAfterDelay(3f, OnPizzaReady);
    Debug.Log("Main game khelta rahunga...");
}

void DoAfterDelay(float seconds, Action callback)
{
    StartCoroutine(Wait(seconds, callback));
}

IEnumerator Wait(float seconds, Action callback)
{
    yield return new WaitForSeconds(seconds);
    callback?.Invoke();
}

void OnPizzaReady()
{
    Debug.Log("Ding dong! Pizza aa gaya!");
}`,
  steps: [
    { l: 'Debug.Log("Pizza order', note: '🍕 Order kiya', set: F('Start()', {}), log: 'Pizza order kiya' },
    { l: 'DoAfterDelay(3f, OnPizzaReady);', note: 'Function ko <b>parameter</b> ki tarah bheja — apna "phone number" 📞 de diya. Dhyan do: <code>OnPizzaReady</code> bina <code>()</code>!' },
    { l: 'void DoAfterDelay(float', note: 'callback ab OnPizzaReady ko point kar raha hai.', set: F('DoAfterDelay()', { 'float seconds': 3, 'Action callback': '~OnPizzaReady' }) },
    { l: 'StartCoroutine(Wait', note: 'Ek background timer shuru hua ⏱️ aur DoAfterDelay turant return ho gaya — game <b>ruka nahi</b>!', set: { frames: { 'DoAfterDelay()': null, 'Wait() ⏱': { 'float seconds': 3 } }, loop: { items: ['0s', '1s', '2s', '3s'], cur: 0, label: '⏳ waiting…' } }, f: 'Start()' },
    { l: 'Debug.Log("Main game', note: 'Dekho! Pizza ka intezaar karte hue bhi game chal raha hai 🎮', log: 'Main game khelta rahunga...' },
    { l: 'yield return new WaitForSeconds', note: '1 second…', set: { loop: { cur: 1 } } },
    { l: 'yield return new WaitForSeconds', note: '2 seconds…', set: { loop: { cur: 2 } } },
    { l: 'yield return new WaitForSeconds', note: '3 seconds! ⏰', set: { loop: { cur: 3, label: '✅ time up!' } } },
    { l: 'callback?.Invoke();', note: '📞 <b>Call back!</b> Jo function diya tha woh ab chala.' },
    { l: 'Debug.Log("Ding dong', note: '🔔 Pizza aa gaya! Yahi callback hai: "kaam ho jaye toh mera ye function chala dena".', set: { frames: { 'Wait() ⏱': null, 'OnPizzaReady()': {} } }, log: 'Ding dong! Pizza aa gaya!' }
  ]
};

/* ---------- Topic 11: Event chain ---------- */
const CHAIN = [
  { e: '👾', t: 'EnemyDeath.Die()' }, { e: '📡', t: 'GameEvents.onEnemyKilled' }, { e: '🧮', t: 'ScoreManager.OnEnemyKilled()' },
  { e: '📡', t: 'GameEvents.onScoreChanged' }, { e: '🖼️', t: 'GameUI.UpdateScoreUI()' }
];
ANIMS.chain = {
  title: 'Event chain: enemy mara → score → UI', file: 'Event-driven architecture',
  code: `
// ===== EnemyDeath.cs =====
public void Die()
{
    GameEvents.FireEnemyKilled(100, transform.position);
    Destroy(gameObject);
}
// ===== ScoreManager.cs =====
void OnEnemyKilled(int points, Vector3 pos)
{
    score += points;
    GameEvents.FireScoreChanged(score);
}
// ===== GameUI.cs =====
void UpdateScoreUI(int score)
{
    scoreText.text = $"Score: {score}";
}`,
  steps: [
    { l: 'public void Die()', note: '👾 Enemy mara. Ise <b>nahi pata</b> ki score ya UI exist karte bhi hain!', set: { flow: { nodes: CHAIN, on: [0] }, frames: { 'ScoreManager': { 'int score': 200 } } } },
    { l: 'GameEvents.FireEnemyKilled', note: 'Bas ek global event fire kiya: "Ek enemy mara, 100 points ka". 📡', set: { flow: { on: [0, 1] } } },
    { l: 'void OnEnemyKilled', note: 'ScoreManager ne <code>onEnemyKilled</code> subscribe kiya tha → uska handler chala.', set: { flow: { on: [1, 2] }, frames: { 'OnEnemyKilled()': { 'int points': 100 } } } },
    { l: 'score += points;', note: '200 + 100 = 300', set: F('ScoreManager', { 'int score': 300 }) },
    { l: 'GameEvents.FireScoreChanged', note: 'ScoreManager <b>khud bhi</b> ek event fire karta hai — chain reaction! 🔗', set: { flow: { on: [2, 3] } } },
    { l: 'void UpdateScoreUI', note: 'GameUI sun raha tha → handler chala', set: { flow: { on: [3, 4] }, frames: { 'OnEnemyKilled()': null, 'UpdateScoreUI()': { 'int score': 300 } } } },
    { l: 'scoreText.text', note: 'Screen pe "Score: 300" 🎉', log: 'UI → Score: 300', set: { flow: { on: [0, 1, 2, 3, 4] } } },
    { l: 'Destroy(gameObject);', note: 'Aur enemy destroy. Har script apna kaam karti hai, koi kisi ko directly nahi jaanta = <b>decoupled</b> code. Ek hata do, baaki kuch nahi tootega!', set: { frames: { 'UpdateScoreUI()': null } } }
  ]
};

/* ---------- Topic 12: Lambda capture bug ---------- */
ANIMS.capture = {
  title: 'Lambda capture galti (aur fix)', file: 'Buttons.cs',
  code: `
// ❌ GALAT
for (int i = 0; i < 3; i++)
{
    buttons[i].onClick.AddListener(() => Debug.Log(i));
}
// ...baad mein player Button 0 dabata hai

// ✅ SAHI
for (int i = 0; i < 3; i++)
{
    int index = i;
    buttons[i].onClick.AddListener(() => Debug.Log(index));
}`,
  steps: [
    { l: 2, note: 'Loop shuru: i = 0', set: { frames: { 'loop': { 'int i': 0 } }, loop: { items: ['B0', 'B1', 'B2'], cur: 0, label: 'i = 0' } } },
    { l: 4, note: 'Button 0 ko lambda diya. Lambda <code>i</code> ki <b>value nahi</b>, <code>i</code> ka <b>dabba</b> yaad rakhta hai!', set: { chips: { name: 'listeners', list: ['B0 → Log(i)'] } } },
    { l: 2, note: 'i = 1', set: { frames: { 'loop': { 'int i': 1 } }, loop: { cur: 1, label: 'i = 1' } } },
    { l: 4, note: 'B1 ko bhi same <code>i</code> dabba', set: { chips: { list: ['B0 → Log(i)', 'B1 → Log(i)'] } } },
    { l: 2, note: 'i = 2', set: { frames: { 'loop': { 'int i': 2 } }, loop: { cur: 2, label: 'i = 2' } } },
    { l: 4, note: 'B2 bhi same dabba', set: { chips: { list: ['B0 → Log(i)', 'B1 → Log(i)', 'B2 → Log(i)'] } } },
    { l: 2, note: 'i++ → i = 3. 3 < 3? Nahi → loop khatam. Lekin <code>i</code> ka dabba ab <b>3</b> pe atka hai!', set: { frames: { 'loop': { 'int i': 3 } }, loop: { cur: 3, label: 'i = 3 (final)' } } },
    { l: 6, note: 'Player ne Button 0 dabaya… expect kiya "0"…', set: { chips: { run: 'B0 → Log(i)' } } },
    { l: 4, note: '😱 Print hua <b>3</b>! Kyunki lambda ne dabba padha, jo ab 3 hai.', log: { t: '3   ← expected 0!', c: 'err' } },
    { l: 9, note: 'Ab fix wala loop. i = 0', set: { frames: { 'loop': null, 'fix loop': { 'int i': 0 } }, chips: { list: [], run: '' }, loop: { cur: 0, label: 'i = 0' } } },
    { l: 11, note: '<code>int index = i;</code> — har round ka <b>apna naya dabba</b> 📦', set: { frames: { 'fix loop': { 'int index#0': 0 } } } },
    { l: 12, note: 'B0 ka lambda <code>index#0</code> pakadta hai', set: { chips: { list: ['B0 → index#0'] } } },
    { l: 11, note: 'Round 2: naya dabba index#1 = 1', set: { frames: { 'fix loop': { 'int i': 1, 'int index#1': 1 } }, chips: { list: ['B0 → index#0', 'B1 → index#1'] }, loop: { cur: 1, label: 'i = 1' } } },
    { l: 11, note: 'Round 3: index#2 = 2', set: { frames: { 'fix loop': { 'int i': 2, 'int index#2': 2 } }, chips: { list: ['B0 → index#0', 'B1 → index#1', 'B2 → index#2'] }, loop: { cur: 2, label: 'i = 2' } } },
    { l: 12, note: 'Ab Button 0 dabao → index#0 = <b>0</b> ✅. Har button ka apna sahi number!', set: { chips: { run: 'B0 → index#0' }, loop: { cur: 3, label: 'fixed ✅' } }, log: '0   ← sahi! ✅' }
  ]
};
Object.keys(ANIMS).forEach(k => ANIMS[k].id = k);
