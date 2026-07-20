(function () {
  const DATA_URL = "data/portfolio.json";
  const body = document.body;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollBehavior = prefersReducedMotion ? "auto" : "smooth";
  const connectorDelay = prefersReducedMotion ? 0 : 380;

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
    return cases().find((item) => item.id === id) || null;
  }

  function projectLine(item) {
    return item?.project || item?.company || item?.caseTitle || "Portfolio inquiry";
  }

  function evidenceHint(item) {
    return item?.signal?.evidence || "Evidence is being gathered.";
  }

  function classificationLine(item) {
    const capability = item?.capabilities?.length ? item.capabilities.join(" / ") : "Strategy";
    return `${item.category || "Portfolio inquiry"} / ${capability} / ${item.validation || "In progress"}${item.readingTime ? ` / ${item.readingTime}` : ""}`;
  }

  function setText(selector, value) {
    const element = qs(selector);
    if (element) element.textContent = value || "";
  }

  function renderHero(data) {
    if (data.hero?.eyebrow) setText("[data-hero-eyebrow]", data.hero.eyebrow);
    if (data.hero?.title) setText("[data-hero-title]", data.hero.title);
    if (data.hero?.lens) setText("[data-hero-lens]", data.hero.lens);
    if (data.hero?.proofLine) setText("[data-hero-proof]", data.hero.proofLine);
    if (data.hero?.primaryCta) setText("[data-hero-primary]", data.hero.primaryCta);
    if (data.hero?.secondaryCta) setText("[data-hero-secondary]", data.hero.secondaryCta);
    if (data.switchboard?.thesis) setText("[data-switchboard-thesis]", data.switchboard.thesis);
    if (data.switchboard?.instruction) setText("[data-switchboard-instruction]", data.switchboard.instruction);
    if (data.cases?.length) {
      setText("[data-signal-heading]", `${data.cases.length} consumer signals, filed as evidence.`);
    }
  }

  function renderLenses(data) {
    const notes = qs("[data-lens-notes]");
    if (!notes || !data.lenses) return;

    notes.replaceChildren();
    data.lenses.forEach((lens, index) => {
      const article = textElement("article", "reveal");
      article.dataset.mood = lens.mood || lens.id || "";
      article.append(
        textElement("span", "", `${String(index + 1).padStart(2, "0")} / ${lens.label}`),
        textElement("p", "", lens.text),
      );
      notes.append(article);
    });
  }

  function createEvidenceDetails(item) {
    const details = textElement("details", "signal-evidence-details");
    const summary = textElement("summary", "", "See the evidence");
    const evidence = textElement("div", "");
    evidence.append(
      textElement("span", "", "Evidence"),
      textElement("p", "", item.signal.evidence),
    );
    const tension = textElement("div", "");
    tension.append(
      textElement("span", "", "Tension"),
      textElement("p", "", item.signal.tension),
    );
    const meta = textElement(
      "p",
      "signal-meta",
      `${item.validation} · ${item.status} · Updated ${item.lastUpdatedLabel}`,
    );
    details.append(summary, evidence, tension, meta);
    return details;
  }

  function createSignalEntry(item, index, isOpen) {
    const entry = textElement("article", `signal-entry${isOpen ? " is-open" : ""}`);
    entry.dataset.signalEntry = "";
    entry.dataset.caseId = item.id;
    entry.dataset.signal = item.dossierKey || item.theme || item.category || "";
    if (item.evidenceStrength) {
      entry.style.setProperty("--signal-strength", `${item.evidenceStrength}%`);
    }
    if (item.theme) entry.classList.add(item.theme);

    const trigger = textElement("button", "signal-entry-trigger");
    trigger.type = "button";
    trigger.setAttribute("aria-expanded", String(isOpen));
    trigger.setAttribute("aria-controls", `signal-panel-${item.id}`);
    trigger.append(
      textElement("span", "signal-entry-number", String(index + 1).padStart(2, "0")),
      textElement("span", "signal-entry-quote", item.signalQuote),
      textElement(
        "span",
        `signal-entry-status ${item.routeStatus === "routed" ? "is-routed" : "is-routing"}`,
        item.routeStatus,
      ),
    );

    const panel = textElement("div", "signal-entry-panel");
    panel.id = `signal-panel-${item.id}`;
    panel.hidden = !isOpen;

    const connector = textElement("div", "signal-connector");
    connector.setAttribute("aria-hidden", "true");

    const content = textElement("div", "signal-entry-content");
    const translation = textElement("div", "signal-translation");
    translation.append(
      textElement("span", "", "Translation"),
      textElement("p", "", item.signal.translation),
    );
    const output = textElement("div", "signal-output");
    output.append(
      textElement("span", "", "Output"),
      textElement("p", "", item.signal.output),
    );
    const archiveNote = item.archiveNote ? textElement("p", "signal-archive-note", item.archiveNote) : null;
    const hint = textElement("p", "signal-evidence-hint");
    hint.append(textElement("span", "", "Evidence:"), document.createTextNode(` ${evidenceHint(item)}`));
    const classification = textElement("p", "signal-classification");
    classification.append(
      textElement("span", "", "Classification:"),
      document.createTextNode(` ${classificationLine(item)}`),
    );

    const project = textElement("div", "signal-project");
    project.append(textElement("span", "", "Project"), textElement("p", "", projectLine(item)));
    if (item.caseLink) {
      const link = textElement("a", "", item.caseLinkLabel || "Open dossier");
      link.href = item.caseLink;
      project.append(link);
    } else {
      project.append(textElement("small", "", "Dossier in progress"));
    }

    content.append(
      ...[translation, output, archiveNote, hint, createEvidenceDetails(item), classification, project].filter(Boolean),
    );
    panel.append(connector, content);
    entry.append(trigger, panel);
    return entry;
  }

  function renderSignalList(data) {
    const list = qs("[data-signal-list]");
    if (!list) return;

    const defaultId = data.switchboard?.defaultCaseId || data.cases[0]?.id;
    list.replaceChildren(
      ...data.cases.map((item, index) => createSignalEntry(item, index, item.id === defaultId)),
    );
    activeCaseId = defaultId;
  }

  function renderUnroutedSignals(data) {
    const grid = qs("[data-unrouted-signals]");
    if (!grid || !data.unroutedSignals) return;

    grid.replaceChildren();
    data.unroutedSignals.forEach((note) => {
      const article = textElement("article", "note-card reveal");
      article.append(
        textElement("span", "", note.date),
        textElement("blockquote", "", note.signal),
        textElement("p", "", note.note),
      );
      grid.append(article);
    });
  }

  function renderSiteUpdated(data) {
    const updated = qs("[data-site-updated]");
    if (updated && data.site?.lastUpdatedLabel) updated.textContent = data.site.lastUpdatedLabel;
  }

  function closeEntry(entry) {
    if (!entry) return;
    const trigger = qs(".signal-entry-trigger", entry);
    const panel = qs(".signal-entry-panel", entry);
    const details = qs(".signal-evidence-details", entry);
    entry.classList.remove("is-open", "is-animating");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
    if (panel) panel.hidden = true;
    if (details) details.open = false;
  }

  function openEntry(entry, options = {}) {
    if (!entry) return;
    const id = entry.dataset.caseId;
    const panel = qs(".signal-entry-panel", entry);
    const trigger = qs(".signal-entry-trigger", entry);

    qsa("[data-signal-entry]").forEach((candidate) => {
      if (candidate !== entry) closeEntry(candidate);
    });

    activeCaseId = id;
    if (panel) panel.hidden = false;
    if (trigger) trigger.setAttribute("aria-expanded", "true");
    entry.classList.add("is-open");
    entry.classList.remove("is-animating");
    window.requestAnimationFrame(() => {
      entry.classList.add("is-animating");
    });

    if (options.focus && trigger) trigger.focus();
    if (options.playSound) {
      window.setTimeout(playRouteTone, connectorDelay);
    }
  }

  function toggleEntry(entry, options = {}) {
    const isOpen = entry.classList.contains("is-open");
    if (isOpen) {
      closeEntry(entry);
      activeCaseId = null;
      return;
    }
    openEntry(entry, options);
  }

  function setupSignalArchive() {
    const entries = qsa("[data-signal-entry]");
    entries.forEach((entry, index) => {
      const trigger = qs(".signal-entry-trigger", entry);
      if (!trigger) return;

      trigger.addEventListener("click", () => {
        toggleEntry(entry, { playSound: true });
      });

      trigger.addEventListener("keydown", (event) => {
        let nextIndex = index;
        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
          nextIndex = (index + 1) % entries.length;
        } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          nextIndex = (index - 1 + entries.length) % entries.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = entries.length - 1;
        } else if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleEntry(entry, { playSound: true });
          return;
        } else {
          return;
        }

        event.preventDefault();
        const nextTrigger = qs(".signal-entry-trigger", entries[nextIndex]);
        if (nextTrigger) nextTrigger.focus();
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

  function playRouteTone() {
    if (!soundEnabled) return;

    const context = ensureAudioContext();
    if (!context) return;

    const now = context.currentTime;
    const master = context.createGain();
    const filter = context.createBiquadFilter();
    const fundamental = context.createOscillator();
    const overtone = context.createOscillator();
    const overtoneGain = context.createGain();

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1450, now);
    filter.Q.setValueAtTime(1.4, now);
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.032, now + 0.012);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

    fundamental.type = "triangle";
    overtone.type = "sine";
    fundamental.frequency.setValueAtTime(220, now);
    fundamental.frequency.exponentialRampToValueAtTime(217, now + 0.4);
    overtone.frequency.setValueAtTime(447, now);
    overtone.frequency.exponentialRampToValueAtTime(441, now + 0.32);
    overtoneGain.gain.setValueAtTime(0.32, now);

    fundamental.connect(master);
    overtone.connect(overtoneGain);
    overtoneGain.connect(master);
    master.connect(filter);
    filter.connect(context.destination);

    fundamental.start(now);
    overtone.start(now);
    fundamental.stop(now + 0.45);
    overtone.stop(now + 0.36);
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

  function validateUnroutedSignals(data) {
    const routedSignals = new Set(
      data.cases
        .filter((item) => item.routeStatus === "routed")
        .map((item) => item.signalQuote.trim().toLowerCase()),
    );
    const duplicates = data.unroutedSignals.filter((note) =>
      routedSignals.has(note.signal.trim().toLowerCase()),
    );
    if (duplicates.length) {
      console.warn("Unrouted signals duplicate routed archive entries:", duplicates);
    }
  }

  function renderPortfolio(data) {
    portfolioData = data;
    validateUnroutedSignals(data);
    renderHero(data);
    renderLenses(data);
    renderSignalList(data);
    renderUnroutedSignals(data);
    renderSiteUpdated(data);
    setupSoundToggle(data);
    setupSignalArchive();
    setupReveal();
    setupJumpLinks();
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
