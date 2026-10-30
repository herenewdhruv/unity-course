/* ==========================================================
   COURSE CONTENT — Part 15: C# Functions, Delegates & Events
   Har topic: kya · kyun · kaise (step by step) · game · quiz
   ========================================================== */
const code = src => `<pre class="code">${CS.block(src)}</pre>`;
const anim = id => `<div data-anim="${id}"></div>`;
const demo = id => `<div data-demo="${id}"></div>`;
const editor = id => `<div data-editor="${id}"></div>`;
const callout = (type, icon, html) => `<div class="callout ${type}"><span class="ic">${icon}</span><div>${html}</div></div>`;
const analogies = items => `<div class="analogy-grid">${items.map(([e, b, s]) => `<div class="analogy"><span class="e">${e}</span><b>${b}</b><span>${s}</span></div>`).join('')}</div>`;
const whys = items => `<ul class="why-list">${items.map(([e, t]) => `<li><span class="e">${e}</span><div>${t}</div></li>`).join('')}</ul>`;
const stepsL = items => `<ol class="steps-list">${items.map(t => `<li>${t}</li>`).join('')}</ol>`;

const SECTION_META = {
  kya: ['🤔', 'Kya hai?'], kyun: ['💡', 'Kyun zaroori hai?'], kaise: ['🪜', 'Step by step'], game: ['🎮', 'Real game example'], quiz: ['🧠', 'Mini Quiz']
};

const TOPICS = [
/* ================================================================ T0 */
{
  id: 't0', icon: '🎮', title: 'Shuruaat: Unity Editor aur Functions ka rishta', short: 'Unity Editor tour', mins: 10,
  intro: 'Bro, code likhne se pehle ghar dekh lete hain jahan code rehta hai — Unity Editor. Aur samjhenge ki Unity tumhare functions ko khud kaise call karta hai.',
  kya: `
    <p>Bro, <b>Unity</b> ek game engine hai — matlab ek aisa software jisme tum games banate ho. Aur Unity ke andar jo logic chalta hai (player kaise chalega, enemy kab marega, score kaise badhega) woh sab <b>C# scripts</b> mein likha jaata hai.</p>
    <p>Aur un scripts ka <b>sabse basic building block</b> hai — <b>Function</b>. Ye poora chapter (Part 15) isi ke baare mein hai: functions, unko values kaise dete hain, functions ko variable mein kaise rakhte hain (delegates), aur ek script doosri ko "announcement" kaise karti hai (events).</p>
    ${analogies([['🏠', 'Unity Editor', 'Tumhara workshop jahan game banta hai'], ['📜', 'C# Script', 'Instructions ki diary'], ['🔧', 'Function', 'Diary ka ek page — ek kaam ki recipe']])}
    ${callout('fun', '😎', '<p><b>Secret:</b> Tumne shayad <code>Start()</code> aur <code>Update()</code> naam suna hoga. Ye dono bhi functions hi hain! Bas inko tum call nahi karte — <b>Unity khud call karta hai</b>. Yahi is chapter ka pehla "aha!" moment hai.</p>')}`,
  kyun: `
    ${whys([
      ['🧭', '<b>Editor samjhe bina kuch nahi hoga.</b> Script kahan banti hai, GameObject pe kaise lagti hai, Console mein output kahan dikhta hai — ye sab har topic mein kaam aayega.'],
      ['🔁', '<b>Game = ek bada loop.</b> Har second 60 baar Unity tumhare functions call karta hai. Ye samajh liya toh aage sab easy.'],
      ['💥', '<b>Physics bhi functions bulati hai.</b> Do cheezein takrayi? Unity <code>OnCollisionEnter()</code> call karega. Matlab functions = game ki jaan.']
    ])}`,
  kaise: `
    <p>Neeche asli Unity Editor jaisa mockup hai. <b>"Guided tour shuru karo"</b> dabao — main arrow se dikhaunga kya kahan hai. Tour ke baad khud bhi khelo: Hierarchy mein objects pe click karo, Inspector mein <b>Use Gravity</b> checkbox dabao, aur <b>▶ Play</b> karo!</p>
    ${editor('tour')}
    <p>Ab dekhte hain Play dabane ke baad <b>code ke andar</b> kya hota hai — line by line:</p>
    ${anim('lifecycle')}
    ${callout('tip', '📌', '<p><b>Yaad rakho:</b> <code>Start()</code> = ek baar, game shuru hote hi. <code>Update()</code> = har frame. <code>OnCollisionEnter()</code> = jab takkar ho. Teeno ko Unity khud bulata hai.</p>')}`,
  game: `
    <p>Socho tum ek racing game bana rahe ho 🏎️. Car ko har frame thoda aage badhana hai. Ye kaam <code>Update()</code> karta hai. Lekin problem: kisi ka PC 30 FPS chalata hai, kisi ka 144 FPS. Toh fast PC pe car tez bhaagegi?! 😱</p>
    <p>Iska solution hai <code>Time.deltaTime</code> — pichle frame ko kitna time laga. Neeche khud try karo:</p>
    ${demo('updateLoop')}`,
  quiz: [
    { q: 'Unity mein <code>Update()</code> kitni baar chalta hai?', o: ['Sirf ek baar, game shuru hone pe', 'Har frame (60 FPS pe ~60 baar per second)', 'Jab hum button dabayein', 'Sirf jab collision ho'], a: 1, why: 'Update() har frame chalta hai. Start() sirf ek baar.' },
    { q: 'Script ka output (<code>Debug.Log</code>) Unity mein kahan dikhta hai?', o: ['Inspector', 'Hierarchy', 'Console', 'Scene view'], a: 2, why: 'Console window mein saare logs, warnings aur errors aate hain.' },
    { q: 'Object pe gravity lagane ke liye kaunsa component chahiye?', o: ['Transform', 'Rigidbody', 'Camera', 'Light'], a: 1, why: 'Rigidbody lagate hi object physics engine ke control mein aa jaata hai aur gravity lagti hai.' },
    { q: 'Do objects takrate hain toh Unity kaunsa function khud call karta hai?', o: ['OnCollisionEnter()', 'Start()', 'Awake()', 'Debug.Log()'], a: 0, why: 'Collision hone par Unity OnCollisionEnter(Collision other) call karta hai (dono pe Collider aur kam se kam ek pe Rigidbody chahiye).' }
  ]
},
/* ================================================================ T1 */
{
  id: 't1', icon: '🔧', title: 'Functions / Methods kya hote hain?', short: 'Functions basics', mins: 10, part: '15.1',
  intro: 'Code ka ek reusable dabba — ek baar likho, baar baar use karo. Recipe ki tarah!',
  kya: `
    <p>Bro, <b>Function</b> basically code ka ek <b>reusable block</b> hai jo ek specific kaam karta hai. <b>Ek baar likho, baar baar use karo!</b></p>
    ${analogies([['📖', 'Function = Recipe', 'Ek baar likhi, baar baar banao'], ['🧂', 'Parameters = Ingredients', 'Har baar alag daal sakte ho'], ['🍛', 'Return = Final Dish', 'Result wapas milta hai']])}
    <p>Function ki <b>anatomy</b> (body ke parts) aisi dikhti hai:</p>
    ${code(`[access] [return_type] Name([parameters])
{
    // Code yahan
    return value; // (agar return type void nahi hai)
}

// Example:
public int AddNumbers(int a, int b)
{
    return a + b;
}`)}
    <div class="table-wrap"><table class="cmp"><tr><th>Part</th><th>Example</th><th>Matlab</th></tr>
      <tr><td>Access</td><td><code>public</code></td><td>Kaun call kar sakta hai (sab / sirf ye class)</td></tr>
      <tr><td>Return type</td><td><code>int</code></td><td>Kya wapas dega (void = kuch nahi)</td></tr>
      <tr><td>Name</td><td><code>AddNumbers</code></td><td>Function ka naam (PascalCase mein)</td></tr>
      <tr><td>Parameters</td><td><code>(int a, int b)</code></td><td>Input jo function ko chahiye</td></tr>
      <tr><td>Body</td><td><code>{ return a + b; }</code></td><td>Asli kaam</td></tr></table></div>
    ${callout('', '🤓', '<p><b>Function vs Method:</b> Function = standalone (C/C++ style). Method = class ke andar ka function. C# mein sab kuch class ke andar hota hai, toh technically sab <b>methods</b> hain — lekin bolchaal mein dono same use hote hain.</p>')}`,
  kyun: `
    ${whys([
      ['♻️', '<b>Repeat mat karo (DRY).</b> 10 jagah damage lena hai? 10 baar same code mat likho — ek <code>TakeDamage()</code> banao, 10 jagah call karo.'],
      ['🐞', '<b>Bug ek jagah fix.</b> Damage formula galat hai? Sirf function ke andar theek karo, har jagah fix ho jayega.'],
      ['📚', '<b>Code padhne layak banta hai.</b> <code>Die()</code>, <code>Respawn()</code>, <code>PlaySound()</code> — naam padh ke hi samajh aata hai kya ho raha hai.'],
      ['🧩', '<b>Bada game = chhote functions ka jod.</b> Professional games mein hazaron functions hote hain, har ek ek chhota kaam karta hai.']
    ])}`,
  kaise: `
    <p><b>Function banane aur use karne ke steps:</b></p>
    ${stepsL([
      '<b>Script banao</b> — Project window mein Right-click → Create → C# Script.',
      '<b>Function define karo</b> — class ke andar: return type, naam, brackets, curly braces.',
      '<b>Function call karo</b> — naam likho + brackets: <code>SayHello();</code>. Parameters hain toh brackets mein values do.',
      '<b>Script ko GameObject pe lagao</b> aur <b>Play</b> dabao — Unity Start() bulayega, aur Start() tumhare functions.'
    ])}
    <p>Pehle Editor mein dekho ye kaise hota hai 👇</p>
    ${editor('script')}
    <p>Ab code ke andar ka safar dekho — jab function call hota hai toh memory mein kya banta hai aur kya mitata hai:</p>
    ${anim('funcBasic')}
    ${callout('tip', '🧠', '<p>Dhyan diya? Har function call pe ek naya <b>dabba (frame)</b> banta hai jisme uske variables rehte hain. Function khatam → dabba delete. Isliye ek function ke variables doosre ko dikhte nahi.</p>')}`,
  game: `
    <p>Asli game mein functions aise dikhte hain — har kaam ka apna function:</p>
    ${code(`void Die()
{
    Debug.Log("Player Dead!");
    GetComponent<Animator>().SetTrigger("Die");
    GetComponent<Collider>().enabled = false;
    GameManager.Instance.GameOver();
}

void Respawn(Vector3 spawnPoint)
{
    transform.position = spawnPoint;
    health = maxHealth;
    gameObject.SetActive(true);
}`)}
    <p>Ab khud function machine chalao — ingredients (parameters) badlo aur dekho output kaise badalta hai, function wahi rehta hai:</p>
    ${demo('funcMachine')}`,
  quiz: [
    { q: 'Function ka sabse bada fayda kya hai?', o: ['Game fast ho jaata hai', 'Ek baar likho, baar baar use karo', 'Graphics better hote hain', 'Kuch nahi'], a: 1, why: 'Reusability! Same code baar baar likhne ki zaroorat nahi.' },
    { q: '<code>public int AddNumbers(int a, int b)</code> mein return type kya hai?', o: ['public', 'AddNumbers', 'int', 'a, b'], a: 2, why: 'Naam se pehle wala type (int) batata hai function kya return karega.' },
    { q: 'Function khatam hone ke baad uske andar bane variables ka kya hota hai?', o: ['Hamesha ke liye save rehte hain', 'Delete ho jaate hain (frame khatam)', 'Doosre function mein chale jaate hain', 'Console mein print hote hain'], a: 1, why: 'Local variables sirf function ke chalne tak zinda rehte hain.' },
    { q: 'C# mein class ke andar ke function ko technically kya kehte hain?', o: ['Method', 'Variable', 'Component', 'Prefab'], a: 0, why: 'Class ke andar ka function = Method. C# mein sab methods hi hain.' }
  ]
},
/* ================================================================ T2 */
{
  id: 't2', icon: '📦', title: 'Function Types: void vs Return wale', short: 'void & return', mins: 12, part: '15.2',
  intro: 'Kuch functions bas kaam karte hain (void), kuch kaam karke result wapas dete hain (int, float, bool, string…).',
  kya: `
    <p>Functions do type ke hote hain bro:</p>
    <div class="table-wrap"><table class="cmp"><tr><th></th><th>🅰️ void functions</th><th>🅱️ Return type functions</th></tr>
      <tr><td>Kya hai</td><td>Kaam karo, kuch wapas mat do</td><td>Kaam karo aur <b>RESULT wapas bhejo</b></td></tr>
      <tr><td>Use</td><td>Actions, commands, setup, UI update</td><td>Calculations, checks, data nikalna</td></tr>
      <tr><td>Example</td><td><code>void Jump()</code>, <code>void Die()</code></td><td><code>int GetHealth()</code>, <code>bool IsAlive()</code></td></tr></table></div>
    ${analogies([['🧹', 'void = Naukar ko kaam', '"Kamra saaf karo" — kaam hua, kuch laana nahi'], ['🛒', 'Return = Dukaan bhejna', '"Doodh le aao" — result (doodh) wapas aata hai'], ['🚪', 'return = Exit door', 'return ke baad function turant band']])}
    ${code(`// void: bas kaam
void TakeDamage(int damage)
{
    health -= damage;
}

// int return: value wapas
int CalculateDamage(int baseDamage, int multiplier)
{
    return baseDamage * multiplier;
}

// bool return: haan/naa
bool IsAlive()
{
    return health > 0;
}`)}`,
  kyun: `
    ${whys([
      ['❓', '<b>Sawaal poochne ke liye return chahiye.</b> "Kya player zinda hai?" "Enemy kitni door hai?" — ye sab return wale functions hain: <code>IsAlive()</code>, <code>CalculateDistance()</code>.'],
      ['🔗', '<b>Results ko chain karo.</b> Return value seedha if mein use kar sakte ho: <code>if (CanAttack() && IsInRange(target, 10f)) Attack();</code>'],
      ['🚪', '<b>Early exit.</b> <code>return</code> se function beech mein hi rok sakte ho — "health 0 hai? toh aage kuch mat karo".']
    ])}
    ${callout('warn', '⚠️', '<p><b>Return ka rule:</b> <code>return</code> ke baad function <b>TURANT band</b> ho jaata hai. Uske neeche ka code kabhi nahi chalega! Aur agar return type <code>int</code> hai toh har raaste pe kuch na kuch return karna hi padega.</p>')}`,
  kaise: `
    ${stepsL([
      '<b>Decide karo:</b> kya function ko kuch wapas dena hai? Nahi → <code>void</code>. Haan → us value ka type (<code>int</code>, <code>float</code>, <code>bool</code>, <code>string</code>, <code>Vector3</code>, <code>GameObject</code>…).',
      '<b>Body mein <code>return</code> likho</b> us type ki value ke saath: <code>return health > 0;</code>',
      '<b>Call karke value pakdo:</b> <code>int dmg = CalculateDamage(10, 3);</code> ya seedha <code>if (IsAlive()) { … }</code>'
    ])}
    <p><b>Animation 1 — void function:</b> MoveTo kuch return nahi karta, bas cube ko move karta hai 🧊</p>
    ${anim('moveTo')}
    <p><b>Animation 2 — return + if-else:</b> dekho raasta kaise split hota hai aur pehla match milte hi function exit karta hai:</p>
    ${anim('healthStatus')}`,
  game: `
    <p>Har RPG game mein health status dikhta hai. Ye <code>GetHealthStatus()</code> function decide karta hai. Slider se health badlo aur dekho kaunsi line pe function <b>exit</b> karta hai:</p>
    ${demo('healthStatus')}
    <p>Ek aur real example — <b>sabse paas wala enemy dhoondo</b> (GameObject return karta hai):</p>
    ${code(`GameObject FindNearestEnemy()
{
    GameObject[] enemies = GameObject.FindGameObjectsWithTag("Enemy");
    GameObject nearest = null;
    float minDist = Mathf.Infinity;

    foreach (GameObject enemy in enemies)
    {
        float dist = Vector3.Distance(transform.position, enemy.transform.position);
        if (dist < minDist)
        {
            minDist = dist;
            nearest = enemy;
        }
    }
    return nearest; // null ho sakta hai agar koi enemy nahi!
}`)}`,
  quiz: [
    { q: '<code>void</code> function kya return karta hai?', o: ['int', 'Kuch nahi', 'null', 'true'], a: 1, why: 'void = khaali. Kaam karta hai par koi value wapas nahi deta.' },
    { q: 'Ye code kya print karega?<br><code>int GetScore() { return 10; Debug.Log("Hi"); }</code>', o: ['"Hi" print hoga', 'Kuch print nahi hoga — return ke baad code nahi chalta', 'Error, 10 print hoga', '"Hi" do baar'], a: 1, why: 'return ke baad function turant exit. Debug.Log kabhi nahi chalega (unreachable code).' },
    { q: 'health = 60 hai. <code>GetHealthStatus()</code> kya return karega? (>75 Healthy, >50 Wounded, >25 Critical, else Dying)', o: ['Healthy', 'Wounded', 'Critical', 'Dying'], a: 1, why: '60 > 75 nahi, 60 > 50 haan → "Wounded" return aur exit.' },
    { q: '<code>int result = DoWork();</code> — agar DoWork <code>void</code> hai toh?', o: ['result = 0', 'result = null', 'Compile ERROR', 'Chalega'], a: 2, why: 'void kuch return nahi karta, toh usse value nahi le sakte. Common galti #7!' },
    { q: '"Kya player zameen pe hai?" check karne ke liye best return type?', o: ['void', 'string', 'bool', 'Vector3'], a: 2, why: 'Haan/naa wale sawaal = bool. Jaise bool IsGrounded().' }
  ]
},
/* ================================================================ T3 */
{
  id: 't3', icon: '📥', title: 'Parameters: Value, ref aur out', short: 'value · ref · out', mins: 14, part: '15.3',
  intro: 'Function ko input dene ke 3 tarike: photocopy bhejo (value), asli cheez bhejo (ref), ya khaali dabba bhejo bharne ke liye (out).',
  kya: `
    <p>Parameter = function ka input. Lekin bhejne ke <b>3 tarike</b> hain bro, aur yahi beginners ko sabse zyada confuse karta hai. Chalo simple karte hain:</p>
    ${analogies([['📄', 'Pass by Value', 'Photocopy bhejo — original safe'], ['🔗', 'ref', 'Asli file bhejo — change wapas dikhega'], ['📦', 'out', 'Khaali dabba bhejo — function bhar ke dega']])}
    <div class="table-wrap"><table class="cmp"><tr><th></th><th>Value (default)</th><th>ref</th><th>out</th></tr>
      <tr><td>Kya jaata hai</td><td>COPY</td><td>Original ka REFERENCE</td><td>Original ka REFERENCE</td></tr>
      <tr><td>Pehle initialize?</td><td>✅ Haan</td><td>✅ Haan, zaroori</td><td>❌ Zaroori nahi</td></tr>
      <tr><td>Function mein set?</td><td>Optional</td><td>⚠️ Optional</td><td>✅ ZAROORI (har path pe)</td></tr>
      <tr><td>Direction</td><td>IN</td><td>IN + OUT (dono)</td><td>OUT only</td></tr>
      <tr><td>Example</td><td>Normal calls</td><td>Swap, Buff</td><td>TryGet, Raycast</td></tr></table></div>
    ${callout('tip', '🧠', '<p><b>Yaad rakho:</b> <code>ref</code> = "Ye lo, isko change karo, wapas do" (two-way). <code>out</code> = "Mujhe kuch nahi dena, bas result bhejo" (one-way).</p>')}`,
  kyun: `
    ${whys([
      ['🛡️', '<b>Value = safety.</b> Default mein copy jaati hai, toh koi function galti se tumhara original data nahi bigaad sakta.'],
      ['✏️', '<b>ref = original badalna.</b> Jaise <code>Swap(ref a, ref b)</code> ya <code>ApplyBuff(ref speed, ref damage, 1.5f)</code> — ek saath kai variables badlo.'],
      ['🎁', '<b>out = ek se zyada result.</b> Function sirf ek value return kar sakta hai. out se extra values nikalo — <code>TryGetScore(name, out score)</code> success (bool) bhi deta hai aur score bhi.'],
      ['🎯', '<b>Unity mein har jagah out!</b> <code>Physics.Raycast(..., out hit)</code>, <code>TryGetComponent(out rb)</code>, <code>dictionary.TryGetValue(key, out value)</code>.']
    ])}`,
  kaise: `
    ${stepsL([
      '<b>Value:</b> kuch special nahi — <code>void ApplyDamage(int health, int damage)</code>. Call: <code>ApplyDamage(myHealth, 30);</code>',
      '<b>ref:</b> definition <b>aur</b> call dono mein <code>ref</code> likho: <code>void ApplyDamageRef(ref int health, int damage)</code> → <code>ApplyDamageRef(ref myHealth, 30);</code>',
      '<b>out:</b> definition aur call dono mein <code>out</code>: <code>bool TryGetScore(string name, out int score)</code> → <code>TryGetScore("Raju", out int score)</code> (C# 7+ mein call mein hi declare kar sakte ho!)',
      '<b>out ka rule:</b> function ke andar <b>har raaste pe</b> out variable ko value dena zaroori hai, warna compile error.'
    ])}
    <p><b>Animation — copy vs reference:</b> pink link 🔗 pe dhyan do!</p>
    ${anim('valueRef')}
    <p><b>Animation — out se do values ek saath:</b></p>
    ${anim('outDemo')}`,
  game: `
    <p>Khud test karo — damage choose karo aur dono buttons dabake dekho original <code>myHealth</code> pe kya asar hota hai:</p>
    ${demo('refBox')}
    <p><b>Real game example:</b> chat box ya settings mein player number type karta hai. Galat input pe game crash na ho, isliye <code>int.TryParse</code> (out pattern) use karte hain:</p>
    ${demo('tryParse')}
    <p>Aur Unity ka sabse famous out — <b>Raycast</b> (bandook ki goli kahan lagi?):</p>
    ${code(`RaycastHit hit;
if (Physics.Raycast(transform.position, transform.forward, out hit, 100f))
{
    Debug.Log("Hit: " + hit.collider.name);
    Debug.Log("Distance: " + hit.distance);
}`)}`,
  quiz: [
    { q: '<code>int x = 10; Change(x);</code> aur <code>void Change(int n) { n = 99; }</code> — ab x kya hai?', o: ['99', '10', '0', 'Error'], a: 1, why: 'Default pass by value: n sirf copy hai. Original x 10 hi rahega.' },
    { q: '<code>ref</code> wala function call karte waqt kya likhna zaroori hai?', o: ['Kuch nahi', 'Call mein bhi ref: Modify(ref myVar)', 'out', 'new'], a: 1, why: 'ref definition aur call dono mein likhna padta hai, warna error (Galti #3).' },
    { q: '<code>out</code> parameter ke baare mein kya SAHI hai?', o: ['Pehle initialize karna zaroori', 'Function ke andar har path pe set karna zaroori', 'Sirf int ke saath chalta hai', 'Value change nahi hoti'], a: 1, why: 'out ko function ke andar har code path pe value dena compulsory hai.' },
    { q: 'Unity mein <code>Physics.Raycast(..., out hit, ...)</code> mein out kyun?', o: ['Raycast fast ho', 'bool return ke saath hit ki info bhi wapas mile', 'Memory bachane', 'Kuch nahi'], a: 1, why: 'Raycast bool deta hai (laga ya nahi) aur out hit mein kahan/kisse laga ki details.' }
  ]
},
/* ================================================================ T4 */
{
  id: 't4', icon: '🎁', title: 'params aur Default Parameters', short: 'params & defaults', mins: 10, part: '15.3 D-E',
  intro: 'Kitne bhi arguments bhejo (params), ya kuch bhejna bhool jao toh default value kaam aaye.',
  kya: `
    <p><b>🅰️ params</b> — kitne bhi arguments bhej sakte ho, C# khud unka <b>array</b> bana deta hai.</p>
    ${code(`int AddAll(params int[] numbers) { ... }

AddAll(1, 2, 3);           // 6
AddAll(10, 20, 30, 40, 50); // 150
AddAll();                  // 0 (empty bhi chalega!)`)}
    <p><b>🅱️ Default parameters</b> — parameter ki default value set karo. Na bhejo toh default use hogi.</p>
    ${code(`void SpawnEnemy(string name, int level = 1, int health = 100) { ... }

SpawnEnemy("Goblin");                  // level=1, health=100
SpawnEnemy("Orc", 5);                  // level=5, health=100
SpawnEnemy(health: 200, name: "Boss", level: 15); // named arguments!`)}
    ${analogies([['🍕', 'params = Pizza toppings', 'Jitne chahe utne daalo'], ['☕', 'Default = Chai ki cheeni', 'Na bolo toh 1 chammach default'], ['🏷️', 'Named args = Label', 'Order bhool jao, naam se bhejo']])}`,
  kyun: `
    ${whys([
      ['🧾', '<b>Flexible functions.</b> Log system, multiple enemies ko damage — pehle se pata nahi kitne items aayenge. params se ek hi function sab handle kare.'],
      ['😌', '<b>Kam typing.</b> 90% time <code>PlaySound(clip)</code> volume 1 pe hi chahiye. Default values se har baar <code>1f, 1f</code> likhne se chhutti.'],
      ['📖', '<b>Named arguments = readable code.</b> <code>TakeDamage(50, isCritical: true)</code> padh ke turant samajh aata hai true kis cheez ke liye hai.']
    ])}
    ${callout('warn', '⚠️', '<p><b>Rules:</b> (1) <code>params</code> hamesha <b>LAST</b> parameter hona chahiye. (2) Default value wale parameters, bina default walon ke <b>baad</b> aate hain.</p>')}`,
  kaise: `
    ${stepsL([
      '<b>params:</b> last parameter ke aage <code>params</code> + array type: <code>void DamageAll(int damage, params GameObject[] targets)</code>',
      'Andar <code>foreach</code> se har item pe kaam karo.',
      '<b>Default:</b> parameter ke aage <code>= value</code>: <code>bool isCritical = false</code>',
      '<b>Named call:</b> <code>naam: value</code> — order ki tension khatam.'
    ])}
    <p><b>Animation — params + loop counter:</b> dekho loop har round mein kaise total badhata hai 🐷</p>
    ${anim('paramsLoop')}
    <p><b>Animation — defaults aur named arguments:</b></p>
    ${anim('defaults')}`,
  game: `
    <p>Numbers jodo/hatao aur loop chalao — params kitne bhi items handle kar leta hai:</p>
    ${demo('paramsBuilder')}
    <p>Enemy spawner banao! Toggles se decide karo kaunse parameters bhejne hain — baaki default se aayenge:</p>
    ${demo('spawner')}`,
  quiz: [
    { q: '<code>params</code> parameter kahan hona chahiye?', o: ['Pehla', 'Kahin bhi', 'Hamesha LAST', 'Beech mein'], a: 2, why: 'params hamesha last parameter hota hai, warna compiler confuse ho jayega.' },
    { q: '<code>void Spawn(string n, int lv = 1, int hp = 100)</code> — <code>Spawn("Orc", 5)</code> mein hp kya hoga?', o: ['5', '1', '100', 'Error'], a: 2, why: 'hp bheja hi nahi, toh default 100 use hoga. lv = 5.' },
    { q: '<code>AddAll()</code> (koi argument nahi) call karne pe kya hoga?', o: ['Error', '0 return (empty array)', 'null', 'Crash'], a: 1, why: 'params ke saath zero arguments bhi valid hai — khaali array, total 0.' },
    { q: '<code>SpawnEnemy(health: 200, name: "Boss", level: 15)</code> — order ulta hai, kya chalega?', o: ['Nahi, error', 'Haan, named arguments se', 'Sirf health set hogi', 'Random'], a: 1, why: 'Named arguments mein naam se match hota hai, order matter nahi karta.' }
  ]
},
/* ================================================================ T5 */
{
  id: 't5', icon: '🔄', title: 'Function Overloading', short: 'Overloading', mins: 8, part: '15.4',
  intro: 'Ek hi naam ke kai functions, bas parameters alag. Chai banao — adrak wali, elaichi wali, masala wali!',
  kya: `
    <p><b>Overloading</b> = EK HI NAAM ke multiple functions, lekin <b>ALAG parameters</b> ke saath. Compiler call dekh ke khud decide karta hai kaunsa chalana hai.</p>
    ${analogies([['☕', '"Chai banao"', 'Adrak wali, elaichi wali, masala wali — sab chai hi hai'], ['🔢', 'Count alag', 'Attack() / Attack(int) / Attack(int, bool)'], ['🔤', 'Type alag', 'TakeDamage(int) / TakeDamage(float) / TakeDamage(string, int)']])}
    ${code(`void Attack()                           { /* basic, 10 dmg */ }
void Attack(int damage)                 { /* custom dmg */ }
void Attack(int damage, bool isCritical){ /* crit = x2 */ }

GameObject Spawn(GameObject prefab) { return Instantiate(prefab); }
GameObject Spawn(GameObject prefab, Vector3 position)
{ return Instantiate(prefab, position, Quaternion.identity); }`)}
    ${callout('warn', '⚠️', '<p>Sirf <b>return type alag</b> karne se overload nahi banta! <code>int Get()</code> aur <code>float Get()</code> — error. Parameters (count ya type) alag hone chahiye.</p>')}`,
  kyun: `
    ${whys([
      ['🧠', '<b>Yaad rakhna easy.</b> AttackBasic, AttackWithDamage, AttackCritical — 3 naam yaad karne ki jagah sirf <code>Attack</code>.'],
      ['🎛️', '<b>Flexible API.</b> Unity khud overloading bahut use karta hai: <code>Instantiate(prefab)</code>, <code>Instantiate(prefab, pos, rot)</code>, <code>Instantiate(prefab, parent)</code>…'],
      ['🧹', '<b>Clean code.</b> Same kaam ke different versions ek group mein rehte hain.']
    ])}`,
  kaise: `
    ${stepsL([
      'Same naam ka function dobara likho.',
      'Parameters ka <b>count</b> ya <b>type</b> ya <b>order</b> badlo.',
      'Call karo — compiler arguments dekh ke sahi version chunega (compile time pe hi!).'
    ])}
    ${anim('overload')}`,
  game: `
    <p>Damage ke alag types — physical (int), magic (float), elemental (string + int). Buttons dabao aur dekho compiler kaunsa overload chunta hai:</p>
    ${demo('overload')}`,
  quiz: [
    { q: 'Overloading mein kya alag hona ZAROORI hai?', o: ['Naam', 'Sirf return type', 'Parameters (count/type/order)', 'Access modifier'], a: 2, why: 'Naam same, parameters alag. Sirf return type alag karna kaafi nahi.' },
    { q: '<code>Attack(25, true)</code> kaunsa chalega?', o: ['Attack()', 'Attack(int)', 'Attack(int, bool)', 'Error'], a: 2, why: 'Do arguments: int + bool → Attack(int damage, bool isCritical).' },
    { q: '<code>TakeDamage(15.5f)</code> — options: TakeDamage(int), TakeDamage(float). Kaunsa?', o: ['int wala', 'float wala', 'Dono', 'Error'], a: 1, why: '15.5f float hai → float wala overload match.' }
  ]
},
/* ================================================================ T6 */
{
  id: 't6', icon: '⚡', title: 'Lambda Expressions', short: 'Lambdas =>', mins: 10, part: '15.5',
  intro: 'Bina naam ka chhota sa function — sticky note pe likha one-liner instruction.',
  kya: `
    <p><b>Lambda</b> = bina naam ka CHHOTA function. Syntax: <code>(parameters) => expression</code>. <code>=></code> ko padho <b>"goes to"</b>.</p>
    ${analogies([['🗒️', 'Sticky note', 'Chhota instruction, alag page ki zaroorat nahi'], ['🎯', '(a, b) => a + b', 'a aur b lo, a + b do'], ['🔍', 's => s > 75', 's lo, check karo 75 se bada hai?']])}
    ${code(`System.Action greet = () => Debug.Log("Hello!");            // 0 params
System.Action<string> sayName = name => Debug.Log(name);    // 1 param
System.Func<int, int, int> add = (a, b) => a + b;           // 2 params, return

// Multi-line lambda
System.Action<int, int> complex = (a, b) =>
{
    int sum = a + b;
    Debug.Log($"Sum: {sum}");
};`)}`,
  kyun: `
    ${whys([
      ['✂️', '<b>Chhote kaam ke liye poora function kyun?</b> List sort/filter karni hai — 1 line ka lambda kaafi.'],
      ['🖱️', '<b>UI buttons:</b> <code>playButton.onClick.AddListener(() => SceneManager.LoadScene("Game"));</code>'],
      ['⏳', '<b>Coroutines:</b> <code>yield return new WaitUntil(() => health <= 0);</code>'],
      ['📊', '<b>Lists & LINQ:</b> Find, RemoveAll, Sort, Where, OrderBy — sab lambdas khaate hain.']
    ])}`,
  kaise: `
    ${stepsL([
      'Parameters likho brackets mein: <code>(a, b)</code>. Ek hi hai toh brackets optional: <code>n</code>. Zero hai toh <code>()</code>.',
      '<code>=></code> lagao.',
      'Ek expression (auto return) ya <code>{ }</code> mein multiple lines.',
      'Lambda ko variable (Action/Func) mein rakho, ya seedha kisi method ko pass kar do.'
    ])}
    ${anim('lambda')}`,
  game: `
    <p>Leaderboard ke scores pe lambdas chalao — threshold slider se X badlo, buttons dabao:</p>
    ${demo('lambdaLab')}
    ${callout('tip', '🎮', '<p><b>Real game:</b> sabse paas ka enemy (LINQ ke saath): <code>enemies.OrderBy(e => Vector3.Distance(transform.position, e.transform.position)).First();</code></p>')}`,
  quiz: [
    { q: '<code>Func&lt;int, int, int&gt; add = (a, b) => a + b; add(10, 20)</code> = ?', o: ['1020', '30', 'Error', '10'], a: 1, why: '10 + 20 = 30. Lambda variable ko function ki tarah call karte hain.' },
    { q: '<code>scores.Find(s => s > 75)</code> list [90, 30, 80] pe kya dega?', o: ['80', '90', '[90, 80]', '30'], a: 1, why: 'Find PEHLA matching element deta hai = 90.' },
    { q: 'Lambda ka doosra naam kya hai?', o: ['Anonymous function', 'Static function', 'Constructor', 'Property'], a: 0, why: 'Bina naam ka function = anonymous function.' },
    { q: '<code>scores.RemoveAll(s => s < 60)</code> [90, 30, 70, 50] pe baad mein list?', o: ['[30, 50]', '[90, 70]', '[90, 30, 70, 50]', '[]'], a: 1, why: '60 se chhote (30, 50) hat gaye.' }
  ]
},
/* ================================================================ T7 */
{
  id: 't7', icon: '📡', title: 'Delegates — Function ko variable mein rakho', short: 'Delegates', mins: 12, part: '15.6',
  intro: 'Delegate = function ka phone number. Abhi call nahi karna, rakh lo — jab zaroorat ho tab call karna.',
  kya: `
    <p><b>Delegate</b> ek aisa variable hai jo <b>FUNCTION ka reference</b> store karta hai. Matlab function ko variable mein rakho, baad mein call karo!</p>
    ${analogies([['🗣️', 'Normal call', '"Raju ko bolo kaam karo" — direct'], ['📞', 'Delegate', '"Ye Raju ka number hai, jab zaroorat ho call karna"'], ['🎵', 'Multicast', 'Playlist — ek play, saare gaane']])}
    ${code(`// 1. Define (shape): int lo, void do
public delegate void DamageAction(int damage);

// 2. Assign (signature match honi chahiye!)
DamageAction action = TakeDamage;

// 3. Call
action(25); // TakeDamage(25) chalega!`)}
    ${callout('', '🔲', '<p><b>Signature match:</b> delegate <code>void X(int)</code> hai toh sirf woh functions assign honge jo <code>int</code> lein aur <code>void</code> return karein. Shape fit honi chahiye — jaise puzzle piece.</p>')}`,
  kyun: `
    ${whys([
      ['🔄', '<b>Behavior runtime pe badlo.</b> <code>calc = Add;</code> phir <code>calc = Multiply;</code> — same variable, alag kaam. Power-ups, AI modes, weapon types ke liye perfect.'],
      ['🎵', '<b>Multicast:</b> <code>+=</code> se kai functions jodo, ek call mein sab chalein. Hit hua → damage + number popup + sound, sab ek saath.'],
      ['🧩', '<b>Flexible architecture.</b> Callbacks, plugin systems, events — sab delegates pe khade hain. Ye samjha toh events ekdum easy.']
    ])}`,
  kaise: `
    ${stepsL([
      '<b>Define:</b> <code>public delegate void DamageAction(int damage);</code> (class ke andar ya bahar)',
      '<b>Matching functions banao:</b> <code>void TakePhysicalDamage(int d)</code>, <code>void ShowDamageNumber(int d)</code>…',
      '<b>Assign:</b> <code>DamageAction combo = TakePhysicalDamage;</code> — dhyan do, <code>()</code> NAHI lagana!',
      '<b>Jodo/hatao:</b> <code>combo += ShowDamageNumber;</code> / <code>combo -= ShowDamageNumber;</code>',
      '<b>Call:</b> <code>combo(30);</code> — saare jude functions order mein chalenge.'
    ])}
    ${anim('delegate')}`,
  game: `
    <p>Apna combo attack banao! Functions ko <code>+=</code> se playlist mein jodo, <code>-=</code> se hatao, aur fire karo:</p>
    ${demo('comboBuilder')}
    ${code(`// Calculator: same delegate, function swap
public delegate float CalculateFunc(float a, float b);
CalculateFunc calc = Add;
Debug.Log(calc(10, 5)); // 15
calc = Multiply;
Debug.Log(calc(10, 5)); // 50`)}`,
  quiz: [
    { q: 'Delegate kya store karta hai?', o: ['Number', 'String', 'Function ka reference', 'GameObject'], a: 2, why: 'Delegate = function pointer / function ka reference.' },
    { q: '<code>combo = A; combo += B; combo += C; combo -= B; combo(5);</code> — kaun kaun chalega?', o: ['A, B, C', 'A, C', 'Sirf C', 'B'], a: 1, why: 'B ko -= se hata diya. A aur C chalenge, isi order mein.' },
    { q: '<code>DamageAction a = TakeDamage();</code> (brackets ke saath) — kya galat hai?', o: ['Kuch nahi', 'Brackets se function CALL ho jata hai, reference nahi milta', 'Semicolon', 'Naam'], a: 1, why: 'Assign karte waqt sirf naam: = TakeDamage; Brackets lagane se function chal jayega.' },
    { q: '<code>delegate void D(int x)</code> mein kaunsa function assign ho sakta hai?', o: ['int F()', 'void F(string s)', 'void F(int n)', 'bool F(int n)'], a: 2, why: 'Signature match: int lo, void do → void F(int n).' }
  ]
},
/* ================================================================ T8 */
{
  id: 't8', icon: '📢', title: 'Events — Safe Delegates (Publisher / Subscriber)', short: 'Events', mins: 15, part: '15.7',
  intro: 'Event = radio station. Sirf station broadcast karta hai, baaki sab bas sunte hain.',
  kya: `
    <p><b>Event</b> delegate ka <b>SAFER version</b> hai. Bahar wale sirf <b>subscribe (+=)</b> aur <b>unsubscribe (-=)</b> kar sakte hain. <b>Invoke (fire)</b> sirf owner class kar sakti hai.</p>
    ${analogies([['🎤', 'Delegate = Open mic', 'Koi bhi aake bol sakta hai 😬'], ['📻', 'Event = Radio station', 'Sirf station bolta hai, tum sunte ho'], ['🔔', 'Subscribe', '"Mujhe batao jab kuch ho, main react karunga"']])}
    ${code(`// PUBLISHER (jo event fire karta hai)
public event Action onPlayerDeath;
onPlayerDeath?.Invoke();       // ?. = null check (koi sun nahi raha toh crash nahi)

// SUBSCRIBER (jo event sunta hai)
player.onPlayerDeath += HandleDeath;   // sunna shuru
player.onPlayerDeath -= HandleDeath;   // sunna band`)}
    <p><b>Event declare karne ke 3 tarike:</b></p>
    ${code(`public event Action onDeath;                    // 1. Action (BEST, most cases)
public event Action<int> onHealthChanged;       //    1 parameter
public event Action<int, int> onDamageTaken;    //    2 parameters

public delegate void DeathEvent(PlayerHealth p); // 2. Custom delegate
public event DeathEvent onPlayerDeath;

public event System.EventHandler onRespawn;     // 3. Standard C# pattern`)}`,
  kyun: `
    ${whys([
      ['🔌', '<b>Decoupling!</b> PlayerHealth ko pata hi nahi ki UI, Audio, Achievements exist karte hain. Bas announce karta hai. Kal naya system jodo — PlayerHealth ko chhuna bhi nahi padega.'],
      ['🛡️', '<b>Safety.</b> Enemy script galti se <code>player.onDeath.Invoke()</code> nahi kar sakta — compile error. Sirf player khud apni death announce kar sakta hai.'],
      ['🏗️', '<b>Professional architecture.</b> Badi games mein sab events pe chalta hai: onScoreChanged, onLevelComplete, onAchievementUnlocked…']
    ])}
    ${callout('warn', '⚠️', '<p><b>Golden rule:</b> <code>OnEnable()</code> mein <code>+=</code>, <code>OnDisable()</code> mein <code>-=</code>. Unsubscribe bhoole = <b>MEMORY LEAK</b> + destroyed objects ke handlers chalte rahenge!</p>')}`,
  kaise: `
    ${stepsL([
      '<b>Publisher</b> mein event declare karo: <code>public event Action&lt;int&gt; onHealthChanged;</code>',
      'Jab kuch ho, fire karo: <code>onHealthChanged?.Invoke(currentHealth);</code> — <code>?.</code> mat bhoolna!',
      '<b>Subscriber</b> mein publisher ka reference lo (Inspector mein drag karke): <code>public PlayerHealth playerHealth;</code>',
      '<code>OnEnable()</code> mein subscribe: <code>playerHealth.onHealthChanged += UpdateHealthBar;</code>',
      '<code>OnDisable()</code> mein unsubscribe: <code>playerHealth.onHealthChanged -= UpdateHealthBar;</code>',
      'Handler function ka signature event se match karo: <code>void UpdateHealthBar(int newHealth)</code>'
    ])}
    <p><b>Unity Editor mein setup</b> — dekho reference kaise drag karte hain aur bina reference ke kya hota hai:</p>
    ${editor('events')}
    <p><b>Code ke andar kya hota hai:</b></p>
    ${anim('event')}`,
  game: `
    <p>Radio station chalao! Subscribers ko ON/OFF karo aur <b>TakeDamage</b> dabao. Aur haan, "Bahar se Invoke" bhi try karna 😈</p>
    ${demo('eventRadio')}
    <p><b>Static events (global)</b> — kisi bhi script se access, reference drag karne ki zaroorat nahi:</p>
    ${code(`public class GameEvents
{
    public static event Action onGameStart;
    public static event Action<int> onScoreChanged;
    public static void FireScoreChanged(int score) => onScoreChanged?.Invoke(score);
}

// Kahin bhi:
GameEvents.onScoreChanged += CheckAchievements;
GameEvents.FireScoreChanged(1000);`)}`,
  quiz: [
    { q: 'Event aur delegate mein main fark?', o: ['Event fast hai', 'Event ko bahar se sirf += / -= kar sakte ho, Invoke nahi', 'Event mein parameters nahi hote', 'Koi fark nahi'], a: 1, why: 'Event = safe delegate. Fire sirf owner class kar sakti hai.' },
    { q: '<code>onDeath?.Invoke()</code> mein <code>?.</code> kya karta hai?', o: ['Event ko fast karta hai', 'Null check — koi subscriber nahi toh crash nahi', 'Event delete karta hai', 'Kuch nahi'], a: 1, why: '?. = null-conditional. Subscriber nahi hai toh chupchaap skip.' },
    { q: 'Subscribe/unsubscribe kahan karna best hai?', o: ['Start / Update', 'OnEnable / OnDisable', 'Awake / Start', 'Update / LateUpdate'], a: 1, why: 'OnEnable mein +=, OnDisable mein -=. Duplicate aur memory leak dono se bachoge.' },
    { q: 'UIManager mein <code>playerHealth</code> field Inspector mein khaali (None) hai aur OnEnable mein += kiya. Kya hoga?', o: ['Sab theek', 'NullReferenceException', 'Event apne aap ban jayega', 'Warning only'], a: 1, why: 'null object pe .onHealthChanged access karna = NullReferenceException.' },
    { q: 'Events ka sabse bada fayda?', o: ['Kam memory', 'Decoupling — publisher ko subscribers ka pata nahi hona chahiye', 'Graphics', 'Physics'], a: 1, why: 'Scripts ek doosre pe dependent nahi rehti. Naye systems jodna easy.' }
  ]
},
/* ================================================================ T9 */
{
  id: 't9', icon: '🎯', title: 'Action & Func — Built-in Delegates', short: 'Action & Func', mins: 10, part: '15.8',
  intro: 'Khud ka delegate type banane ki zaroorat nahi — C# ne ready-made de rakhe hain.',
  kya: `
    <p><b>System.Action</b> = void delegate (kuch return nahi). <b>System.Func</b> = return wala delegate. Dono built-in hain, 16 parameters tak support.</p>
    ${code(`using System;

Action onJump;                     // () → void
Action<int> onDamage;              // (int) → void
Action<int, string> onItemPickup;  // (int, string) → void

Func<int> getRandomScore;          // () → int
Func<int, bool> isEven;            // (int) → bool
Func<int, int, int> add;           // (int, int) → int`)}
    ${callout('warn', '⚠️', '<p><b>Func ka rule:</b> <code>Func&lt;...&gt;</code> mein <b>LAST type hamesha RETURN type</b> hota hai. <code>Func&lt;string, int&gt;</code> = string lo, int do.</p>')}
    <div class="table-wrap"><table class="cmp"><tr><th></th><th>delegate</th><th>Action</th><th>Func</th></tr>
      <tr><td>Return</td><td>Kuch bhi</td><td>void only</td><td>Kuch bhi (last type)</td></tr>
      <tr><td>Define</td><td>Manual</td><td>Built-in</td><td>Built-in</td></tr>
      <tr><td>Params</td><td>Kuch bhi</td><td>0–16</td><td>0–16 (+ return)</td></tr>
      <tr><td>Example</td><td><code>delegate void D()</code></td><td><code>Action&lt;int&gt;</code></td><td><code>Func&lt;int, bool&gt;</code></td></tr></table></div>`,
  kyun: `
    ${whys([
      ['⏱️', '<b>Time bachao.</b> <code>public delegate void DamageAction(int d);</code> likhne ki jagah seedha <code>Action&lt;int&gt;</code>.'],
      ['📏', '<b>90% rule:</b> 90% cases mein Action aur Func use karo. Custom delegate sirf tab jab special naam/signature chahiye.'],
      ['🤝', '<b>Sab samajhte hain.</b> Har C# developer Action/Func pehchanta hai — team mein code padhna easy.']
    ])}`,
  kaise: `
    ${stepsL([
      'Top pe <code>using System;</code> likho.',
      'Kuch return karna hai? Nahi → <code>Action&lt;params&gt;</code>. Haan → <code>Func&lt;params, Return&gt;</code>.',
      'Function ya lambda assign karo: <code>Func&lt;int, bool&gt; isEven = n => n % 2 == 0;</code>',
      'Call karo: <code>isEven(4)</code> → true. Null ho sakta hai? <code>onJump?.Invoke();</code>'
    ])}
    ${anim('func')}`,
  game: `
    <p>Damage formula ko runtime pe swap karo — normal, critical, magic (defense ignore), pierce:</p>
    ${demo('formula')}`,
  quiz: [
    { q: '<code>Func&lt;string, int&gt;</code> ka matlab?', o: ['int lo, string do', 'string lo, int do', 'Dono lo, void do', 'Kuch nahi'], a: 1, why: 'Last type = return. string input, int output.' },
    { q: 'Kuch return nahi karna — kaunsa use karoge?', o: ['Func', 'Action', 'Dono', 'Koi nahi'], a: 1, why: 'Action = void delegates.' },
    { q: '<code>Func&lt;int, bool&gt; isEven = n => n % 2 == 0; isEven(7)</code> = ?', o: ['true', 'false', '7', 'Error'], a: 1, why: '7 % 2 = 1, toh false.' },
    { q: 'Action/Func ke liye kaunsa namespace chahiye?', o: ['UnityEngine', 'System', 'System.Linq', 'UnityEditor'], a: 1, why: 'using System; (ya System.Action likho).' }
  ]
},
/* ================================================================ T10 */
{
  id: 't10', icon: '🔗', title: 'Callbacks — Function ko parameter mein bhejo', short: 'Callbacks', mins: 10, part: '15.9',
  intro: '"Pizza order karo, jab ready ho toh CALL BACK karo." Bas yahi callback hai.',
  kya: `
    <p><b>Callback</b> = ek function ko <b>parameter ke roop mein</b> doosre function mein bhejna, taaki kaam khatam hone pe woh tumhara function call kare.</p>
    ${analogies([['🍕', 'Pizza order', 'Number do, ready hone pe call aayega'], ['⏱️', 'Timer', '3 sec baad ye kaam kar dena'], ['🌐', 'Loading', 'Success pe ye, error pe woh']])}
    ${code(`void DoAfterDelay(float seconds, Action callback)
{
    StartCoroutine(DelayCoroutine(seconds, callback));
}

IEnumerator DelayCoroutine(float seconds, Action callback)
{
    yield return new WaitForSeconds(seconds);
    callback?.Invoke(); // Callback call karo!
}

// Use:
DoAfterDelay(3f, () => Debug.Log("3 seconds ho gaye!"));
DoAfterDelay(5f, SpawnEnemy);
DoAfterDelay(2f, () => SceneManager.LoadScene("Level2"));`)}`,
  kyun: `
    ${whys([
      ['⏳', '<b>Async kaam:</b> loading, timers, animations — kaam kab khatam hoga pata nahi. Callback se "jab ho jaye tab" wala logic likhte hain.'],
      ['🎮', '<b>Game rukta nahi.</b> Wait karte hue bhi game chalta rehta hai (coroutines ke saath).'],
      ['♻️', '<b>Reusable systems.</b> Ek <code>TimerSystem</code> banao — koi bhi script apna callback de ke use kare.']
    ])}`,
  kaise: `
    ${stepsL([
      'Function ke parameter mein <code>Action callback</code> (ya <code>Action&lt;T&gt;</code>) lo.',
      'Kaam karo (wait, load, animation…).',
      'End mein <code>callback?.Invoke();</code>',
      'Call karte waqt function ka naam (bina <code>()</code>) ya lambda bhejo.'
    ])}
    ${anim('callback')}
    ${code(`// Success / Error callbacks
void LoadData(string url, Action<string> onSuccess, Action<string> onError) { ... }

LoadData("https://api.example.com/data",
    onSuccess: data  => Debug.Log("✅ " + data),
    onError:   error => Debug.Log("❌ " + error));`)}`,
  game: `
    <p>Timer chalao aur callback choose karo. Saath mein data loading simulate karo — success chance slider se:</p>
    ${demo('callbacks')}
    ${code(`// Animation khatam hone ke baad movement wapas on
PlayAnimation("Attack", () => {
    Debug.Log("Attack animation complete!");
    canMove = true;
});`)}`,
  quiz: [
    { q: 'Callback kya hai?', o: ['Ek variable', 'Function jo parameter ki tarah bheja jaata hai aur baad mein call hota hai', 'Ek loop', 'Ek class'], a: 1, why: 'Callback = function as parameter, kaam ke baad call back.' },
    { q: '<code>DoAfterDelay(3f, SpawnEnemy);</code> mein SpawnEnemy ke aage <code>()</code> kyun nahi?', o: ['Typo hai', 'Hum function bhej rahe hain, abhi call nahi kar rahe', 'Optional hai', 'Error hai'], a: 1, why: '() lagate hi turant call ho jayega. Hume reference bhejna hai.' },
    { q: 'Callback ke liye usually kaunsa type use karte hain?', o: ['int', 'Action / Action<T>', 'string', 'Vector3'], a: 1, why: 'Action (void callback) ya Func (return wala).' }
  ]
},
/* ================================================================ T11 */
{
  id: 't11', icon: '🏗️', title: 'Real Game: Event-Driven Architecture', short: 'Real game system', mins: 15, part: '15.10',
  intro: 'Ab sab jodte hain — events, callbacks, delegates — ek asli game system mein. Aur end mein ek mini game khelo!',
  kya: `
    <p><b>Event-driven architecture</b> = game ke systems ek doosre ko directly call nahi karte. Sab ek central <b>GameEvents</b> "notice board" pe announce karte hain aur jo interested hai woh sunta hai.</p>
    ${code(`public static class GameEvents
{
    public static event Action onGameStart;
    public static event Action onGameOver;
    public static event Action<int> onScoreChanged;
    public static event Action<int, Vector3> onEnemyKilled;

    public static void FireGameStart() => onGameStart?.Invoke();
    public static void FireGameOver() => onGameOver?.Invoke();
    public static void FireScoreChanged(int s) => onScoreChanged?.Invoke(s);
    public static void FireEnemyKilled(int pts, Vector3 pos) => onEnemyKilled?.Invoke(pts, pos);
}`)}
    <div class="table-wrap"><table class="cmp"><tr><th>Script</th><th>Fire karta hai 📡</th><th>Sunta hai 👂</th></tr>
      <tr><td>👾 EnemyDeath</td><td>onEnemyKilled</td><td>—</td></tr>
      <tr><td>🧮 ScoreManager</td><td>onScoreChanged</td><td>onEnemyKilled, onGameStart</td></tr>
      <tr><td>🖼️ GameUI</td><td>—</td><td>onScoreChanged, onGameOver</td></tr></table></div>`,
  kyun: `
    ${whys([
      ['🧱', '<b>Lego jaisa game.</b> Har system alag block. UI hatao — score phir bhi count hoga. Naya AchievementSystem jodo — kisi purani script ko touch nahi karna.'],
      ['🐞', '<b>Debugging easy.</b> Har event ek clear "message" hai. Log karo aur poora flow dikh jayega.'],
      ['👥', '<b>Team work.</b> Ek banda UI banaye, doosra enemies — bas event names pe agree karna hai.']
    ])}`,
  kaise: `
    ${stepsL([
      '<b>GameEvents</b> static class banao — saare global events + Fire methods.',
      '<b>Publishers</b> (EnemyDeath) sirf <code>GameEvents.FireXxx()</code> call karein.',
      '<b>Listeners</b> (ScoreManager, GameUI) <code>OnEnable</code> mein <code>+=</code>, <code>OnDisable</code> mein <code>-=</code>.',
      'Chain bana sakte ho: ScoreManager sunta bhi hai aur naya event fire bhi karta hai.'
    ])}
    ${anim('chain')}
    <p><b>Bonus 1 — Callback-based Timer System:</b></p>
    ${code(`TimerSystem.Instance.SetTimer(5f,
    onComplete: () => Debug.Log("Timer done!"),
    onTick: remaining => Debug.Log($"{remaining:F1}s left"));`)}
    <p><b>Bonus 2 — Damage System with delegate modifiers (buffs/armor):</b></p>
    ${code(`public delegate float DamageModifier(float incomingDamage);
List<DamageModifier> modifiers = new List<DamageModifier>();

dmg.AddModifier(d => d * 1.5f); // +50% damage buff
dmg.AddModifier(d => d - 10f);  // -10 flat armor
float final = dmg.CalculateFinalDamage(100f); // (100 * 1.5) - 10 = 140`)}`,
  game: `
    <p>🎮 <b>Meteor Defense!</b> Asli event-driven game. Meteors gravity se girte hain (Rigidbody), zameen se takrate hain (OnCollisionEnter → damage event). Tap karke maaro → <code>onEnemyKilled</code> → ScoreManager → <code>onScoreChanged</code> → GameUI.</p>
    <p><b>Experiment:</b> khelte hue "GameUI" ko unsubscribe karo — score count hota rahega par screen pe update nahi hoga! Ye hai decoupling. 1000+ score karo toh secret badge 🎖️</p>
    ${demo('miniGame')}`,
  quiz: [
    { q: 'Event-driven architecture mein EnemyDeath ko ScoreManager ke baare mein kitna pata hona chahiye?', o: ['Sab kuch', 'Kuch nahi — bas event fire kare', 'Uska reference', 'Uske variables'], a: 1, why: 'Decoupling! Enemy bas announce karta hai.' },
    { q: 'GameUI unsubscribe kar de toh score ka kya hoga?', o: ['Game crash', 'Score count hota rahega, UI update nahi hoga', 'Score reset', 'Enemy nahi marenge'], a: 1, why: 'ScoreManager independent hai. Sirf display band hua.' },
    { q: 'Modifiers <code>d => d * 1.5f</code> phir <code>d => d - 10f</code>, base 100 → final?', o: ['150', '140', '90', '135'], a: 1, why: '100 × 1.5 = 150, phir −10 = 140.' }
  ]
},
/* ================================================================ T12 */
{
  id: 't12', icon: '⚠️', title: 'Common Mistakes + Cheat Sheet', short: 'Galtiyan & revision', mins: 12, part: '15.11–15.12',
  intro: 'Ye 7 galtiyan har beginner karta hai. Tum nahi karoge 😎 Saath mein poore chapter ki quick revision.',
  kya: `
    <p>Chalo un galtiyon ko dekhte hain jo <b>sabse zyada bugs</b> banati hain:</p>
    <div class="table-wrap"><table class="cmp"><tr><th>#</th><th>❌ Galti</th><th>✅ Sahi</th></tr>
      <tr><td>1</td><td>Event unsubscribe bhoolna (memory leak)</td><td><code>OnDisable()</code> mein <code>-=</code></td></tr>
      <tr><td>2</td><td><code>onDeath.Invoke()</code> — null pe crash</td><td><code>onDeath?.Invoke()</code></td></tr>
      <tr><td>3</td><td><code>Modify(myVar)</code> jab ref chahiye</td><td><code>Modify(ref myVar)</code></td></tr>
      <tr><td>4</td><td>out ko har path pe set na karna</td><td>Shuru mein default: <code>result = 0;</code></td></tr>
      <tr><td>5</td><td>Loop mein lambda ne <code>i</code> capture kiya</td><td><code>int index = i;</code> local copy</td></tr>
      <tr><td>6</td><td><code>Start()</code> mein += (scene reload pe duplicate)</td><td><code>OnEnable/OnDisable</code></td></tr>
      <tr><td>7</td><td>void se value lena: <code>int r = DoWork();</code></td><td>Return type do ya value mat lo</td></tr></table></div>`,
  kyun: `
    ${whys([
      ['🐛', '<b>Ye bugs chupe hote hain.</b> Compile ho jaate hain (5, 6, 1) lekin game mein ajeeb behavior — button galat number, Game Over screen do baar…'],
      ['⏰', '<b>Debugging mein ghante bachenge.</b> Pehle se pata hai toh dekhte hi pehchan loge.'],
      ['🏆', '<b>Interview favorite!</b> Lambda capture aur event leaks — Unity interviews mein bahut poochte hain.']
    ])}`,
  kaise: `
    <p><b>Galti #5 — Lambda capture</b>, line by line dekho kyun saare buttons galat number print karte hain:</p>
    ${anim('capture')}
    <p><b>Quick Reference Cheat Sheet 📋</b></p>
    <div class="table-wrap"><table class="cmp"><tr><th>Cheez</th><th>Syntax</th><th>Use</th></tr>
      <tr><td>Void</td><td><code>void Func()</code></td><td>Actions, commands</td></tr>
      <tr><td>Return</td><td><code>int Func()</code></td><td>Calculations, checks</td></tr>
      <tr><td>params</td><td><code>void F(params int[] a)</code></td><td>Kitne bhi arguments</td></tr>
      <tr><td>Default</td><td><code>void F(int x = 5)</code></td><td>Optional parameters</td></tr>
      <tr><td>Overload</td><td>Same naam, alag params</td><td>Flexible API</td></tr>
      <tr><td>ref</td><td>IN + OUT</td><td>Original modify</td></tr>
      <tr><td>out</td><td>OUT only</td><td>Extra return values</td></tr>
      <tr><td>Lambda</td><td><code>() => code</code></td><td>Inline function</td></tr>
      <tr><td>delegate</td><td><code>delegate void D()</code></td><td>Custom signature</td></tr>
      <tr><td>Action</td><td><code>Action&lt;int&gt;</code></td><td>Void callbacks</td></tr>
      <tr><td>Func</td><td><code>Func&lt;int, bool&gt;</code></td><td>Return callbacks</td></tr>
      <tr><td>event</td><td><code>event Action</code></td><td>Safe pub/sub</td></tr>
      <tr><td>Subscribe</td><td><code>event += Handler</code></td><td>Sunna shuru</td></tr>
      <tr><td>Fire</td><td><code>event?.Invoke()</code></td><td>Trigger event</td></tr></table></div>
    ${callout('tip', '🔟', `<p><b>Part 15 yaad karne ke tips:</b></p><ol style="margin:0">
      <li>void = kuch return nahi; int/float/bool = value return</li><li>return ke baad function TURANT exit</li>
      <li>ref = original modify (two-way), out = result nikalo (one-way)</li><li>params = kitne bhi arguments (last parameter!)</li>
      <li>Default params = na bhejo toh default</li><li>Overloading = same naam, alag parameters</li>
      <li>Lambda = <code>() => code</code></li><li>Delegate = function ka variable | Event = safe delegate</li>
      <li>Action = void delegate | Func = return delegate</li><li>Event += subscribe, -= unsubscribe (OnEnable/OnDisable mein!)</li></ol>`)}`,
  game: `
    <p><b>Bug #5 khud pakdo</b> — fix ke bina aur fix ke saath buttons dabao:</p>
    ${demo('captureBug')}
    <p><b>Bug #1 + #6</b> — scene reload karte jao aur onDeath fire karo. Zombie handlers dekho 🧟:</p>
    ${demo('leakDemo')}`,
  quiz: [
    { q: 'Loop mein <code>AddListener(() => Debug.Log(i))</code> — 5 buttons, sab kya print karte hain?', o: ['0,1,2,3,4', 'Sab 5', 'Sab 0', 'Random'], a: 1, why: 'Lambda i ka variable capture karta hai, value nahi. Loop ke end mein i = 5.' },
    { q: 'Event ko safely fire karne ka tarika?', o: ['onDeath.Invoke()', 'onDeath?.Invoke()', 'onDeath()', 'Invoke(onDeath)'], a: 1, why: '?. null check karta hai — koi subscriber nahi toh crash nahi.' },
    { q: '<code>void Start() { player.onDeath += HandleDeath; }</code> — problem?', o: ['Koi nahi', 'Kabhi unsubscribe nahi → reload pe duplicate / memory leak', 'Syntax error', 'Start chalta nahi'], a: 1, why: 'OnEnable/OnDisable pair use karo.' },
    { q: '<code>void GetData(out int r) { if (ok) r = 10; }</code> — kya hoga?', o: ['Chalega', 'Compile error — har path pe r set nahi', 'r = 0 auto', 'Runtime crash'], a: 1, why: 'out ko har code path pe assign karna zaroori. Shuru mein r = 0; likh do.' },
    { q: 'Delegate vs Event — "radio station" kaun?', o: ['Delegate', 'Event', 'Dono', 'Action'], a: 1, why: 'Event = radio station (sirf owner broadcast karta hai). Delegate = open mic.' }
  ]
}
];
