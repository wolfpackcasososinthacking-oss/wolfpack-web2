// script.js (general)
const $ = (sel, root = document) => root.querySelector(sel);

function setYear() {
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
}

function initMobileNav() {
  const toggle = $("#navToggle");
  const menu = $("#navMenu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("isOpen");
    toggle.setAttribute("aria-expanded", String(open));
  });

  menu.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    menu.classList.remove("isOpen");
    toggle.setAttribute("aria-expanded", "false");
  });
}

setYear();
initMobileNav();