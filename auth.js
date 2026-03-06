// auth.js (ESM)
// 1) Crea proyecto en Firebase Console
// 2) Activa Authentication -> Email/Password
// 3) Copia tu firebaseConfig aquí

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

// ====== PEGA TU CONFIG AQUÍ ======
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  appId: "TU_APP_ID",
};
// ================================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Helpers UI
const $ = (s) => document.querySelector(s);
function setText(id, msg) {
  const el = $(id);
  if (el) el.textContent = msg;
}

// === LOGIN PAGE ===
const registerForm = $("#registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = $("#regName").value.trim();
    const email = $("#regEmail").value.trim();
    const pass = $("#regPass").value;

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(cred.user, { displayName: name });

      setText("#regMsg", "Cuenta creada. Entrando…");
      window.location.href = "dashboard.html";
    } catch (err) {
      setText("#regMsg", `Error: ${err.message}`);
    }
  });
}

const loginForm = $("#loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = $("#logEmail").value.trim();
    const pass = $("#logPass").value;

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      setText("#logMsg", "Entrando…");
      window.location.href = "dashboard.html";
    } catch (err) {
      setText("#logMsg", `Error: ${err.message}`);
    }
  });
}

const resetBtn = $("#resetBtn");
if (resetBtn) {
  resetBtn.addEventListener("click", async () => {
    const email = $("#logEmail")?.value.trim();
    if (!email) return setText("#logMsg", "Escribe tu email y pulsa otra vez.");

    try {
      await sendPasswordResetEmail(auth, email);
      setText("#logMsg", "Te enviamos un email para cambiar la contraseña.");
    } catch (err) {
      setText("#logMsg", `Error: ${err.message}`);
    }
  });
}

// === DASHBOARD PAGE ===
const logoutBtn = $("#logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
}

// Protección de páginas
onAuthStateChanged(auth, (user) => {
  const onDashboard = window.location.pathname.endsWith("dashboard.html");
  const onLogin = window.location.pathname.endsWith("login.html");

  if (onDashboard && !user) {
    window.location.href = "login.html";
  }

  if (onLogin && user) {
    // Si ya está logueado, lo mandamos al panel
    window.location.href = "dashboard.html";
  }

  const info = $("#userInfo");
  if (info && user) {
    const name = user.displayName || "(sin nombre)";
    info.textContent = `Nombre: ${name} · Email: ${user.email}`;
  }
});