const tabButtons = Array.from(document.querySelectorAll("[data-tab]"));
const panels = Array.from(document.querySelectorAll("[data-panel]"));
const languageButtons = Array.from(document.querySelectorAll("[data-lang-button]"));

function setTab(nextId, focusTab = false) {
  for (const button of tabButtons) {
    const isActive = button.dataset.tab === nextId;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
    if (isActive && focusTab) {
      button.focus();
    }
  }

  for (const panel of panels) {
    const isActive = panel.dataset.panel === nextId;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  }
}

function setLanguage(nextLanguage) {
  const language = nextLanguage === "en" ? "en" : "fr";
  document.body.dataset.lang = language;
  document.documentElement.lang = language;

  for (const button of languageButtons) {
    const isActive = button.dataset.langButton === language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }

  try {
    window.localStorage.setItem("dossier-language", language);
  } catch {
    // Preference storage is optional.
  }
}

for (const button of tabButtons) {
  button.addEventListener("click", () => setTab(button.dataset.tab));
  button.addEventListener("keydown", (event) => {
    const currentIndex = tabButtons.indexOf(button);
    if (currentIndex < 0) {
      return;
    }

    let nextIndex = currentIndex;
    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % tabButtons.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabButtons.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    setTab(tabButtons[nextIndex].dataset.tab, true);
  });
}

for (const button of languageButtons) {
  button.addEventListener("click", () => setLanguage(button.dataset.langButton));
}

const urlLanguage = new URLSearchParams(window.location.search).get("lang");
let savedLanguage = null;
try {
  savedLanguage = window.localStorage.getItem("dossier-language");
} catch {
  savedLanguage = null;
}

setTab("profil");
setLanguage(urlLanguage || savedLanguage || "fr");
