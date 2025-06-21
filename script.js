/* ────────── QUIZ-APP CORE (self-contained) ────────── */
document.addEventListener("DOMContentLoaded", () => {
  /* ---------- helpers & DOM ---------- */
  const body  = document.body;
  const card  = document.getElementById("main-card");
  const btnTg = document.getElementById("theme-toggle");

  /* ────────── LIGHT / DARK THEME ────────── */
  const THEMES = { DARK: "dark", LIGHT: "light" };
  const getSavedOrPreferred = () => {
    const saved = localStorage.getItem("theme");
    if (saved === THEMES.DARK || saved === THEMES.LIGHT) return saved;
    return matchMedia("(prefers-color-scheme: dark)").matches ? THEMES.DARK : THEMES.LIGHT;
  };
  const applyTheme = t => {
    body.classList.remove(THEMES.DARK, THEMES.LIGHT);
    body.classList.add(t);
    if (btnTg) btnTg.textContent = t === THEMES.DARK ? "☀️" : "🌙";
    localStorage.setItem("theme", t);
  };
  applyTheme(getSavedOrPreferred());
  btnTg?.addEventListener("click", () => {
    applyTheme(body.classList.contains(THEMES.DARK) ? THEMES.LIGHT : THEMES.DARK);
  });

  /* ────────── QUIZ DATA & STATE ────────── */
  const QUESTIONS_URL =
    "https://dl.dropboxusercontent.com/scl/fi/zfe372bfs9q6qr7lyd9c1/questions.json?rlkey=brrb96o7zbz57k17pofh4w3r8&raw=1";
  let questions = [], idx = 0, score = 0;
  const shuffle = a => a.sort(() => Math.random() - 0.5);

  /* ────────── TIMER (per-question) ────────── */
  let timerId = null, timeLeft = 0;
  const clearTimer = () => { clearInterval(timerId); timerId = null; document.getElementById("quiz-timer")?.remove(); };

  const startTimer = seconds => {
    clearTimer();
    timeLeft = seconds;
    const el = document.createElement("div");
    el.id = "quiz-timer";
    el.style.cssText = `
      position:fixed;top:16px;left:50%;transform:translateX(-50%);
      background:rgba(0,0,0,.65);padding:6px 16px;border-radius:8px;
      font-weight:600;z-index:99;color:#fff;font-size:1rem`;
    body.appendChild(el);
    const tick = () => {
      el.textContent = `⏱️ ${timeLeft}s`;
      if (timeLeft-- <= 0) {
        clearTimer();
        autoTimeout();
      }
    };
    tick();
    timerId = setInterval(tick, 1000);
  };

  /* ────────── TERMS PAGE ────────── */
  function showTermsPage() {
    card.innerHTML = `
      ${backBtn()}
      <h1 class="title">Terms &amp; Services</h1>
      <div style="max-height:60vh;overflow:auto;text-align:left;line-height:1.6">
        <h3>1. Acceptance of Terms</h3>
        <p>By using QuizApp, you agree to abide by the following terms and conditions.</p>

        <h3>2. Eligibility</h3>
        <p>Users must be at least 13 years old or have guardian permission to register.</p>

        <h3>3. Data Usage</h3>
        <p>Your data will not be sold or shared. It is used solely for QuizApp functionality.</p>

        <h3>4. Content</h3>
        <p>All questions and user-generated content must be appropriate and respectful.</p>

        <h3>5. Disclaimer</h3>
        <p>QuizApp is provided "as-is" without warranty. Use at your own risk.</p>

        <p style="margin-top:24px;font-style:italic">Last updated: June 21, 2025</p>
      </div>`;
    card.querySelector("#back-arrow").onclick = showSignUpForm;
  }

  /* ────────── SCREEN BUILDERS ────────── */
  const buildWelcome = () => {
    clearTimer();
    card.innerHTML = `
      <h1 class="title">Welcome to <span class="brand">QuizApp</span></h1>
      <p class="subtitle">Test your knowledge • Sharpen your mind • Have fun</p>
      <button class="start" id="start-btn">Start Quiz</button>`;
    card.querySelector("#start-btn").onclick = startQuiz;
  };

  const buildError = msg => {
    clearTimer();
    card.innerHTML = `
      <h2>⚠️ Failed to Load Quiz</h2>
      <p>${msg}</p>
      <button class="retry" id="back-btn">🔙 Back</button>`;
    card.querySelector("#back-btn").onclick = buildWelcome;
  };

  const extractOptions = q => {
    if (Array.isArray(q.choices)) return q.choices;
    if (Array.isArray(q.answers)) return q.answers;
    return Object.keys(q).filter(k => /^[A-D]$/i.test(k)).sort()
             .map(k => ({ key:k, text:q[k] }));
  };
  const correctIndex = (q,o) => {
    if (typeof q.answer === "number") return q.answer;
    const k = q.answer || q.correct || q.correct_answer;
    return typeof o[0] === "string"
      ? ["A","B","C","D"].indexOf(k?.toUpperCase())
      : o.findIndex(z => z.key === k);
  };

  const buildQuestion = () => {
    clearTimer();
    const q = questions[idx];
    let opts = extractOptions(q); const corr = correctIndex(q,opts);
    if (!opts.length) return buildError("This question has no options.");
    if (typeof opts[0] !== "string") opts = opts.map(o => `${o.key}: ${o.text}`);

    card.innerHTML = `
      <h2>Question ${idx+1} of ${questions.length}</h2>
      <p>${q.question || "Untitled question"}</p>
      <div id="choices">
        ${opts.map((t,i)=>`<button class="choice-btn" data-i="${i}">${t}</button>`).join("")}
      </div>`;
    const btns = [...card.querySelectorAll(".choice-btn")];
    const lockButtons = () => btns.forEach(x => (x.disabled = true));

    btns.forEach(b => {
      b.onclick = e => {
        clearTimer();
        const sel = +e.target.dataset.i;
        lockButtons();
        if (sel === corr) { e.target.classList.add("correct"); score++; }
        else { e.target.classList.add("wrong"); corr>=0 && btns[corr].classList.add("correct"); }
        setTimeout(() => ++idx < questions.length ? buildQuestion() : buildResult(), 1500);
      };
    });

    /* start question timer if enabled in global settings */
    const settings = window.settings;
    if (settings?.timerOn) startTimer(Math.max(3, +settings.timePerQuestion || 15));

    /* if time runs out, pick "no answer" and continue */
    function autoTimeout(){
      lockButtons();
      if (corr>=0) btns[corr].classList.add("correct");
      setTimeout(()=>++idx<questions.length?buildQuestion():buildResult(),1500);
    }
  };

  const buildResult = () => {
    clearTimer();
    card.innerHTML = `
      <h2>Quic Complete</h2>
      <p class="score">${score} / ${questions.length}</p>
      <div class="btn-group">
        <button class="retry" id="retry-btn">Try Again</button>
        <button class="btn-home" id="home-btn">Return to Home</button>
      </div>`;
    card.querySelector("#retry-btn").onclick = startQuiz;
    card.querySelector("#home-btn").onclick  = buildWelcome;
  };

  /* ────────── SIGN-UP / LOG-IN (mock) ────────── */
  const users = [];
  const backBtn = () => `
    <button class="back-arrow" id="back-arrow">
      <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
    </button>`;

  function showSignUpForm(){
    card.innerHTML = `
      ${backBtn()}
      <h1 class="title">Create Account</h1>
      <form id="signup-form" class="signup-form">
        <input type="text"     name="username" placeholder="Username" required />
        <input type="email"    name="email"    placeholder="Email"    required />
        <input type="password" name="password" placeholder="Password" required />
        <input type="password" name="confirm"  placeholder="Confirm Password" required />

        <label class="terms-line" style="display:flex;align-items:center;gap:8px;font-size:.9rem">
          <input type="checkbox" id="agree-terms" required>
          I agree to the&nbsp;<a href="#" id="terms-link" style="color:#ffca28;text-decoration:underline;">Terms &amp; Services</a>
        </label>

        <button class="start" type="submit">Create Account</button>
      </form>
      <p id="signup-ok"  style="display:none;color:#4caf50">✅ Account created!</p>
      <p id="signup-err" style="display:none;color:#f44336">❌ Passwords do not match or terms not agreed.</p>`;
    card.querySelector("#back-arrow").onclick = buildWelcome;
    card.querySelector("#signup-form").onsubmit = handleSignUp;
    /* NEW — make link open Terms page */
    card.querySelector("#terms-link").onclick = e => { e.preventDefault(); showTermsPage(); };
  }

  function handleSignUp(e){
    e.preventDefault();
    const f = e.target;
    const agreed = f.querySelector("#agree-terms")?.checked;
    if (f.password.value !== f.confirm.value || !agreed) {
      card.querySelector("#signup-err").style.display = "block";
      card.querySelector("#signup-ok").style.display = "none";
      return;
    }
    users.push({
      username: f.username.value.trim().toLowerCase(),
      email:    f.email.value.trim().toLowerCase(),
      password: f.password.value
    });
    f.reset();
    card.querySelector("#signup-ok").style.display = "block";
    card.querySelector("#signup-err").style.display = "none";
  }

  function showResetForm(){
    card.innerHTML = `
      ${backBtn()}
      <h1 class="title">Reset Password</h1>
      <form id="reset-form" class="signup-form">
        <input type="email" name="email" placeholder="Enter your email" required />
        <button class="start" type="submit">Send Reset Link</button>
      </form>
      <p id="reset-msg" style="display:none;color:#4caf50;margin-top:18px">
        📧 If the email exists in our system, a reset link has been sent.
      </p>`;
    card.querySelector("#back-arrow").onclick = buildWelcome;
    card.querySelector("#reset-form").onsubmit = e=>{
      e.preventDefault(); e.target.reset();
      card.querySelector("#reset-msg").style.display = "block";
    };
  }

  function showLogInForm(){
    card.innerHTML = `
      ${backBtn()}
      <h1 class="title">Log In</h1>
      <form id="login-form" class="login-form">
        <input type="text"     name="identifier" placeholder="Username or Email" required />
        <input type="password" name="password"   placeholder="Password" required />

        <div style="display:flex;align-items:center;justify-content:space-between;margin:-6px 0 12px;font-size:.9rem">
          <label style="display:flex;align-items:center;gap:6px;">
            <input type="checkbox" id="remember-me" /> Remember Me
          </label>
          <a href="#" id="forgot-link" style="color:#64b5f6;text-decoration:underline;">Forgot&nbsp;Password?</a>
        </div>

        <button class="start" type="submit">Log In</button>
      </form>
      <p id="login-ok"  style="display:none;color:#4caf50">✅ Welcome back!</p>
      <p id="login-err" style="display:none;color:#f44336">❌ Login failed.</p>`;
    const saved = localStorage.getItem("rememberedUser");
    if (saved) card.querySelector("input[name='identifier']").value = saved;

    card.querySelector("#back-arrow").onclick = buildWelcome;
    card.querySelector("#login-form").onsubmit = handleLogIn;
    card.querySelector("#forgot-link").onclick = e => { e.preventDefault(); showResetForm(); };
  }

  function handleLogIn(e){
    e.preventDefault();
    const f=e.target,id=f.identifier.value.trim().toLowerCase(),pw=f.password.value;
    const ok=users.find(u=>(u.username===id||u.email===id)&&u.password===pw);
    card.querySelector("#login-ok").style.display = ok ? "block" : "none";
    card.querySelector("#login-err").style.display = ok ? "none"  : "block";
    if (ok) setTimeout(buildWelcome,1200);
  }

  /* ────────── DATA FETCH & FLOW ────────── */
  const sampleFallback = [
    { question:"What is the capital of France?", choices:["Berlin","Madrid","Paris","Rome"], answer:2 },
    { question:"2 + 2 = ?", choices:["3","4","5","6"], answer:1 }
  ];

  const fetchQuestions = async () => {
    try{
      const r = await fetch(QUESTIONS_URL,{cache:"no-store"});
      if(!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      if(!Array.isArray(data)||!data.length) throw new Error("Empty data");
      return shuffle(data).slice(0,10);
    }catch(err){
      console.warn("⚠️ Using fallback questions:",err.message);
      return shuffle(sampleFallback);
    }
  };

  async function startQuiz(){
    idx = score = 0;
    try{
      questions = await fetchQuestions();
      buildQuestion();
    }catch(err){
      buildError(err.message||"Unable to load quiz.");
    }
  }

  /* ────────── INIT ────────── */
  buildWelcome();
  Object.assign(window,{buildWelcome,showSignUpForm,showLogInForm});
});