// === CLIENT UPDATE (unchanged HTML/CSS, add server calls) ===
// Add to your existing client code, replacing mock signup/login/reset logic:

const api = async (path, data) => {
  const res = await fetch(`/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error((await res.json()).error || res.statusText);
  return res.json();
};

function handleSignUp(e) {
  e.preventDefault();
  const f = e.target;
  const agreed = f.querySelector("#agree-terms").checked;
  if (f.password.value !== f.confirm.value || !agreed) {
    card.querySelector("#signup-err").style.display = "block";
    card.querySelector("#signup-ok").style.display = "none";
    return;
  }
  api("/signup", {
    username: f.username.value.trim(),
    email: f.email.value.trim().toLowerCase(),
    password: f.password.value
  }).then(({ message }) => {
    f.reset();
    card.querySelector("#signup-ok").textContent = message;
    card.querySelector("#signup-ok").style.display = "block";
    card.querySelector("#signup-err").style.display = "none";
  }).catch(err => {
    card.querySelector("#signup-err").textContent = `❌ ${err.message}`;
    card.querySelector("#signup-err").style.display = "block";
  });
}

function handleLogIn(e) {
  e.preventDefault();
  const f = e.target;
  api("/login", {
    identifier: f.identifier.value.trim(),
    password: f.password.value
  }).then(({ username }) => {
    const userDisplay = document.getElementById("user-display");
    if (userDisplay) {
      userDisplay.textContent = `👤 ${username}`;
      userDisplay.style.display = "block";
    }
    card.querySelector("#login-ok").style.display = "block";
    card.querySelector("#login-err").style.display = "none";
    setTimeout(buildWelcome, 1200);
  }).catch(err => {
    card.querySelector("#login-err").textContent = `❌ ${err.message}`;
    card.querySelector("#login-err").style.display = "block";
  });
}

function showResetForm() {
  card.innerHTML = `
    ${backBtn()}
    <h1 class="title">Reset Password</h1>
    <form id="reset-form" class="signup-form">
      <input type="email" name="email" placeholder="Enter your email" required />
      <button class="start" type="submit">Send Reset Link</button>
    </form>
    <p id="reset-msg" style="display:none;color:#4caf50;margin-top:18px">
      📧 Password reset email sent.
    </p>`;
  card.querySelector("#back-arrow").onclick = buildWelcome;
  card.querySelector("#reset-form").onsubmit = e => {
    e.preventDefault();
    api("/reset-request", { email: e.target.email.value.trim() })
      .then(() => {
        e.target.reset();
        card.querySelector("#reset-msg").style.display = "block";
      })
      .catch(err => alert("❌ " + err.message));
  };
}


// === SERVER (Express) ===
const express = require("express");
const crypto = require("crypto");
const app = express();
app.use(express.json());

const users = new Map(); // { email: { username, passwordHash, verified, token } }

const hash = str => crypto.createHash("sha256").update(str).digest("hex");
const uuid = () => crypto.randomUUID();

app.post("/api/signup", (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: "Missing fields" });
  if (users.has(email)) return res.status(400).json({ error: "User already exists" });
  users.set(email, {
    username,
    passwordHash: hash(password),
    verified: true, // auto-verified for now
    token: uuid()
  });
  res.json({ message: "✅ Sign-up successful. You may now log in." });
});

app.post("/api/login", (req, res) => {
  const { identifier, password } = req.body;
  const user = [...users.values()].find(
    u => u.username === identifier || identifier === [...users.entries()].find(([k, v]) => v.username === u.username)?.[0]
  );
  if (!user || user.passwordHash !== hash(password))
    return res.status(401).json({ error: "Invalid credentials" });
  res.json({ username: user.username });
});

app.post("/api/reset-request", (req, res) => {
  const { email } = req.body;
  const user = users.get(email);
  if (!user) return res.status(400).json({ error: "User not found" });
  // Just simulate: you'd send an actual email here
  console.log(`📧 Reset password link for ${email}: https://yourapp.com/reset?token=${user.token}`);
  res.json({ message: "Reset link sent." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
