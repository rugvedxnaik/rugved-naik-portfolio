(function () {
  const DATA_URL = "data/portfolio.json";
  const body = document.body;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollBehavior = prefersReducedMotion ? "auto" : "smooth";

  let portfolioData = null;
  let activeCaseId = null;
  let soundEnabled = false;
  let audioContext = null;

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function textElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined && text !== null) element.textContent = text;
    return element;
  }

  function cases() {
    return portfolioData?.cases || [];
  }

  function caseById(id) {
    return cases().find((item) => item.id === id) || cases()[0];
  }

  function caseTheme(item) {
    return item?.dossierKey || item?.theme?.replace("theme-", "") || "miutine";
  }

  function projectLine(item) {
    return item?.project || item?.company || item?.caseTitle || "Portfolio inquiry";
  }

  function validationClass(item) {
    return `validation-${item.validationType || "independent"}`;
  }

  function renderCurrentFocus(data) {
    const focus = qs("[data-current-focus]");
    if (!focus || !data.currentFocus) return;

    focus.replaceChildren();
    focus.hidden = false;
    focus.append(
      textElement("span", "", `${data.currentFocus.label} / ${data.currentFocus.date}`),
      textElement("p", "", data.currentFocus.text),
    );
  }

  function renderWorkingAreas(data) {
    const strip = qs("[data-working-areas]");
    if (!strip || !data.workingAreas) return;

    strip.replaceChildren(
      ...data.workingAreas.map((area) => textElement("span", "", area)),
    );
  }

  function renderLenses(data) {
    const notes = qs("[data-lens-notes]");
    if (!notes) return;

    notes.replaceChildren();
    data.lenses.forEach((lens, index) => {
      const article = textElement("article", "reveal");
      article.dataset.mood = lens.mood;
      article.append(
        textElement("span", "", `${String(index + 1).padStart(2, "0")} / ${lens.label}`),
        textElement("p", "", lens.text),
      );
      notes.append(article);
    });
  }

  function renderUnroutedSignals(data) {
    const grid = qs("[data-unrouted-signals]");
    if (!grid) return;

    grid.replaceChildren();
    data.unroutedSignals.forEach((note) => {
      const article = textElement("article", "unrouted-card reveal");
      article.append(
        textElement("span", "", note.date),
        textElement("blockquote", "", note.signal),
        textElement("p", "", note.note),
      );
      grid.append(article);
    });
  }

  function renderSwitchboardRows(data) {
    const list = qs("[data-switchboard-list]");
    const count = qs("[data-signal-count]");
    if (!list) return;

    list.replaceChildren();
    list.setAttribute("aria-activedescendant", "");

    data.cases.forEach((item, index) => {
      const row = textElement("button", "switchboard-row");
      row.type = "button";
      row.id = `signal-row-${item.id}`;
      row.dataset.caseId = item.id;
      row.dataset.mood = caseTheme(item);
      row.setAttribute("role", "option");
      row.setAttribute("aria-selected", "false");
      row.setAttribute("tabindex", "-1");
      row.style.setProperty("--signal-strength", `${item.evidenceStrength || 50}%`);

      const number = textElement("span", "switchboard-row-number", String(index + 1).padStart(2, "0"));
      const quote = textElement("span", "switchboard-row-quote", item.signalQuote);
      const routeStatus = textElement("span", `switchboard-row-status ${item.routeStatus === "routed" ? "is-routed" : "is-routing"}`, item.routeStatus);
      const meter = textElement("span", "switchboard-row-meter", "");

      row.append(number, quote, routeStatus, meter);
      list.append(row);
    });

    if (count) count.textContent = String(data.cases.length);
  }

  function setText(selector, value) {
    const element = qs(selector);
    if (element) element.textContent = value || "";
  }

  function updateValidationStrip(item) {
    const strip = qs("[data-validation-strip]");
    if (!strip) return;

    strip.replaceChildren();
    [
      item.validation,
      item.status,
      `Updated ${item.lastUpdatedLabel}`,
      `${item.evidenceStrength}% evidence`,
    ].forEach((label) => {
      strip.append(textElement("span", "", label));
    });
    strip.className = `validation-strip ${validationClass(item)}`;
  }

  function updateDossierLink(item) {
    const link = qs("[data-panel-link]");
    if (!link) return;

    if (item.caseLink) {
      link.hidden = false;
      link.href = item.caseLink;
      link.textContent = item.caseLinkLabel || "Open dossier";
    } else {
      link.hidden = true;
      link.removeAttribute("href");
    }
  }

  function updateHero(item) {
    setText("[data-hero-quote]", item.signalQuote);
    setText("[data-hero-evidence]", item.signal.evidence);
    setText("[data-hero-tension]", item.signal.tension);
    setText("[data-hero-translation]", item.signal.translation);
    setText("[data-hero-project]", projectLine(item));
  }

  function updatePanel(item) {
    setText("[data-panel-evidence]", item.signal.evidence);
    setText("[data-panel-tension]", item.signal.tension);
    setText("[data-panel-translation]", item.signal.translation);
    setText("[data-panel-output]", item.signal.output);
    setText("[data-panel-project]", projectLine(item));
    setText("[data-selected-status]", item.routeStatus);
    setText("[data-evidence-strength]", `${item.evidenceStrength}%`);
    updateValidationStrip(item);
    updateDossierLink(item);
  }

  function updateRows(item, options = {}) {
    const rows = qsa("[data-case-id]");
    rows.forEach((row) => {
      const isActive = row.dataset.caseId === item.id;
      row.classList.toggle("is-active", isActive);
      row.setAttribute("aria-selected", String(isActive));
      row.setAttribute("tabindex", isActive ? "0" : "-1");
      if (isActive && options.focus) row.focus();
    });

    const list = qs("[data-switchboard-list]");
    if (list) list.setAttribute("aria-activedescendant", `signal-row-${item.id}`);
  }

  function activateCase(id, options = {}) {
    const item = caseById(id);
    if (!item) return;

    activeCaseId = item.id;
    body.dataset.signal = caseTheme(item);
    updateHero(item);
    updatePanel(item);
    updateRows(item, options);

    if (options.playSound) playRouteTone(item);
  }

  function setupSwitchboardRows() {
    const rows = qsa("[data-case-id]");
    rows.forEach((row, index) => {
      row.addEventListener("click", () => {
        activateCase(row.dataset.caseId, { playSound: true });
      });

      row.addEventListener("keydown", (event) => {
        let nextIndex = index;

        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
          nextIndex = (index + 1) % rows.length;
        } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          nextIndex = (index - 1 + rows.length) % rows.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = rows.length - 1;
        } else if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activateCase(row.dataset.caseId, { playSound: true });
          return;
        } else {
          return;
        }

        event.preventDefault();
        activateCase(rows[nextIndex].dataset.caseId, { focus: true, playSound: true });
      });
    });
  }

  function setupMoodTargets() {
    qsa("[data-mood]").forEach((target) => {
      target.addEventListener("mouseenter", () => {
        const key = target.getAttribute("data-mood");
        if (key) body.dataset.signal = key;
      });

      target.addEventListener("mouseleave", () => {
        const item = caseById(activeCaseId);
        if (item) body.dataset.signal = caseTheme(item);
      });
    });
  }

  function ensureAudioContext() {
    if (!audioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      audioContext = new AudioContext();
    }
    if (audioContext.state === "suspended") audioContext.resume();
    return audioContext;
  }

  function playRouteTone(item) {
    if (!soundEnabled) return;

    const context = ensureAudioContext();
    if (!context) return;

    const now = context.currentTime;
    const master = context.createGain();
    const filter = context.createBiquadFilter();
    const validation = item.validationType || "independent";
    const routed = item.routeStatus === "routed";

    const profile = {
      academic: { base: 196, top: 392, duration: 0.22, gain: 0.034, q: 0.7 },
      competition: { base: 262, top: 524, duration: 0.16, gain: 0.028, q: 1.1 },
      independent: { base: routed ? 330 : 294, top: routed ? 495 : 349, duration: routed ? 0.15 : 0.12, gain: 0.022, q: 1.3 },
    }[validation] || { base: 294, top: 440, duration: 0.13, gain: 0.02, q: 1.2 };

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(routed ? 1800 : 1150, now);
    filter.Q.setValueAtTime(profile.q, now);
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(profile.gain, now + 0.012);
    master.gain.exponentialRampToValueAtTime(0.0001, now + profile.duration);
    master.connect(filter);
    filter.connect(context.destination);

    [profile.base, profile.top].forEach((frequency, index) => {
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = index === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(frequency, now);
      osc.frequency.exponentialRampToValueAtTime(frequency * (routed ? 1.002 : 0.992), now + profile.duration);
      gain.gain.setValueAtTime(index === 0 ? 1 : 0.34, now);
      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + profile.duration + 0.02);
    });
  }

  function setupSoundToggle(data) {
    const toggle = qs("[data-sound-toggle]");
    if (!toggle) return;

    toggle.textContent = data.switchboard?.soundOffLabel || "Sound off";
    toggle.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      toggle.setAttribute("aria-pressed", String(soundEnabled));
      toggle.setAttribute("aria-label", soundEnabled ? "Turn route tone off" : "Turn route tone on");
      toggle.textContent = soundEnabled
        ? data.switchboard?.soundOnLabel || "Sound on"
        : data.switchboard?.soundOffLabel || "Sound off";
      if (soundEnabled) ensureAudioContext();
    });
  }

  function setupReveal() {
    const revealElements = qsa(".reveal");
    if (!revealElements.length) return;

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );

    revealElements.forEach((element) => observer.observe(element));
  }

  function renderSiteUpdated(data) {
    const updated = qs("[data-site-updated]");
    if (updated && data.site?.lastUpdatedLabel) {
      updated.textContent = data.site.lastUpdatedLabel;
    }
  }

  function renderSwitchboardText(data) {
    if (data.switchboard?.thesis) setText("[data-switchboard-thesis]", data.switchboard.thesis);
    if (data.switchboard?.instruction) setText("[data-switchboard-instruction]", data.switchboard.instruction);
  }

  function setupJumpLinks() {
    qsa('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const target = qs(link.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: scrollBehavior, block: "start" });
      });
    });
  }

  function renderPortfolio(data) {
    portfolioData = data;
    activeCaseId = data.switchboard?.defaultCaseId || data.cases[0]?.id;

    renderSwitchboardText(data);
    renderCurrentFocus(data);
    renderWorkingAreas(data);
    renderLenses(data);
    renderUnroutedSignals(data);
    renderSwitchboardRows(data);
    renderSiteUpdated(data);
    setupSoundToggle(data);
    setupSwitchboardRows();
    setupMoodTargets();
    setupReveal();
    setupJumpLinks();
    activateCase(activeCaseId);
    body.classList.add("is-data-ready");
  }

  async function init() {
    try {
      const response = await fetch(DATA_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`Portfolio data failed to load: ${response.status}`);
      const data = await response.json();
      renderPortfolio(data);
    } catch (error) {
      console.error(error);
    }
  }

  init();
})();
