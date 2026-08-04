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
  let signalFilterState = {
    status: "all",
    focus: "all",
  };

  const soundProfiles = {
    settled: {
      wave: "triangle",
      overtoneWave: "sine",
      fundamental: 220,
      endFrequency: 217,
      overtone: 447,
      overtoneEnd: 441,
      filter: 1450,
      q: 1.4,
      peak: 0.032,
      duration: 0.45,
    },
    tentative: {
      wave: "sine",
      overtoneWave: "triangle",
      fundamental: 196,
      endFrequency: 202,
      overtone: 311,
      overtoneEnd: 328,
      filter: 1180,
      q: 0.9,
      peak: 0.026,
      duration: 0.34,
    },
    clear: {
      wave: "triangle",
      overtoneWave: "sine",
      fundamental: 261.63,
      endFrequency: 264,
      overtone: 523.25,
      overtoneEnd: 528,
      filter: 1680,
      q: 1.1,
      peak: 0.03,
      duration: 0.38,
    },
    light: {
      wave: "sine",
      overtoneWave: "sine",
      fundamental: 329.63,
      endFrequency: 326,
      overtone: 659.25,
      overtoneEnd: 652,
      filter: 2100,
      q: 0.8,
      peak: 0.022,
      duration: 0.3,
    },
    deep: {
      wave: "triangle",
      overtoneWave: "square",
      fundamental: 164.81,
      endFrequency: 162,
      overtone: 329.63,
      overtoneEnd: 324,
      filter: 980,
      q: 1.6,
      peak: 0.028,
      duration: 0.5,
    },
    bright: {
      wave: "sine",
      overtoneWave: "triangle",
      fundamental: 293.66,
      endFrequency: 302,
      overtone: 587.33,
      overtoneEnd: 604,
      filter: 2350,
      q: 1,
      peak: 0.024,
      duration: 0.36,
    },
  };

  const signalIcons = {
    "1903": "⌁",
    commerce: "▣",
    danone: "◎",
    givenchy: "◆",
    loreal: "◌",
    lvmh: "◧",
    miutine: "◇",
    mobility: "△",
    recognition: "✦",
    siara: "◐",
    withings: "◍",
  };

  const lensIcons = {
    category: "◧",
    collection: "◇",
    identity: "◆",
    infrastructure: "◌",
    memory: "⌁",
    recognition: "✦",
  };

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

  function iconElement(className, icon) {
    const element = textElement("span", className || "ui-icon", icon || "◇");
    element.setAttribute("aria-hidden", "true");
    return element;
  }

  function labelElement(text, icon) {
    const label = textElement("span", "signal-label");
    label.append(iconElement("ui-icon signal-label-icon", icon), document.createTextNode(text));
    return label;
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

  function slugify(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function focusLabel(item) {
    const combined = `${item?.company || ""} ${item?.project || ""} ${item?.dossierKey || ""} ${item?.slug || ""}`.toLowerCase();
    if (combined.includes("l'oréal") || combined.includes("loreal")) return "L'Oréal";
    if (combined.includes("lvmh") || combined.includes("givenchy")) return "LVMH";
    if (combined.includes("danone")) return "Danone";
    if (combined.includes("withings")) return "Withings";
    if (combined.includes("miutine")) return "Miutine";
    if (combined.includes("mobility") || combined.includes("electric") || combined.includes("independent venture")) return "E-mobility venture";
    if (combined.includes("amazon") || combined.includes("commerce")) return "Amazon";
    return "Independent";
  }

  function focusKey(item) {
    return slugify(focusLabel(item)) || "independent";
  }

  function signalIconForItem(item) {
    const key = String(item?.dossierKey || item?.theme || item?.category || "").replace(/^theme-/, "");
    return signalIcons[key] || (item?.routeStatus === "routed" ? "◎" : "◌");
  }

  function lensIconForItem(lens) {
    const key = String(lens?.mood || lens?.id || lens?.label || "").toLowerCase();
    return lensIcons[key] || "◌";
  }

  function filterIconFor(group, value) {
    if (group === "status") {
      if (value === "routed") return "◎";
      if (value === "still routing") return "◌";
      return "◇";
    }
    if (value === "all") return "◇";
    return "◧";
  }

  function dossierStatus(item) {
    return item?.caseLink ? "Dossier open" : "Dossier in progress";
  }

  function classificationLine(item) {
    const capability = item?.capabilities?.length ? item.capabilities.join(" / ") : "Strategy";
    return `${capability}${item.readingTime ? ` / ${item.readingTime}` : ""}`;
  }

  function setText(selector, value) {
    const element = qs(selector);
    if (element) element.textContent = value || "";
  }

  function setActiveSignal(item) {
    const card = qs("[data-active-signal-card]");
    if (!item) {
      delete body.dataset.activeSignal;
      setText("[data-active-signal-title]", "No signal open");
      setText("[data-active-signal-translation]", "Open any archive line to route it through the system.");
      setText("[data-active-signal-icon]", "○");
      return;
    }

    body.dataset.activeSignal = String(item.dossierKey || focusKey(item) || "signal");
    if (card) card.dataset.activeCaseId = item.id;
    setText("[data-active-signal-title]", item.caseTitle || projectLine(item));
    setText("[data-active-signal-translation]", item.signal?.translation || item.signalQuote);
    setText("[data-active-signal-icon]", signalIconForItem(item));
  }

  function renderHero(data) {
    if (data.hero?.eyebrow) setText("[data-hero-eyebrow]", data.hero.eyebrow);
    if (data.hero?.title) setText("[data-hero-title]", data.hero.title);
    if (data.hero?.lens) setText("[data-hero-lens]", data.hero.lens);
    if (data.hero?.proofLine) setText("[data-hero-proof]", data.hero.proofLine);
    if (data.hero?.primaryCta) setText("[data-hero-primary-label]", data.hero.primaryCta);
    if (data.hero?.secondaryCta) setText("[data-hero-secondary-label]", data.hero.secondaryCta);
    if (data.switchboard?.thesis) setText("[data-switchboard-thesis]", data.switchboard.thesis);
    if (data.switchboard?.instruction) setText("[data-switchboard-instruction]", data.switchboard.instruction);
    if (data.switchboard?.statusLine) setText("[data-status-line]", data.switchboard.statusLine);
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
      const label = textElement("span", "lens-label");
      label.append(
        iconElement("ui-icon lens-icon", lensIconForItem(lens)),
        document.createTextNode(`${String(index + 1).padStart(2, "0")} / ${lens.label}`),
      );
      article.append(
        label,
        textElement("p", "", lens.text),
      );
      notes.append(article);
    });
  }

  function renderLensClosing(data) {
    if (data.lensClosing) setText("[data-lens-closing]", data.lensClosing);
  }

  function renderBackground(data) {
    const background = data.background;
    if (!background) return;

    setText("[data-background-eyebrow]", background.eyebrow);
    setText("[data-background-title]", background.title);

    const lines = qs("[data-background-lines]");
    if (!lines || !background.lines) return;

    lines.replaceChildren();
    background.lines.forEach((line) => {
      lines.append(textElement("p", "", line));
    });
  }

  function renderExperience(data) {
    const experience = data.experience;
    if (!experience) return;

    setText("[data-experience-eyebrow]", experience.eyebrow);
    setText("[data-experience-title]", experience.title);
    setText("[data-experience-meta]", experience.meta);
    setText("[data-experience-intro]", experience.intro);
    setText("[data-experience-closing]", experience.closing);

    const bullets = qs("[data-experience-bullets]");
    if (bullets && experience.bullets) {
      bullets.replaceChildren();
      experience.bullets.forEach((bullet) => {
        bullets.append(textElement("li", "", bullet));
      });
    }

    const link = qs("[data-experience-link]");
    if (link) {
      link.textContent = experience.linkLabel || "See the full signal";
      link.href = experience.link || "#signals";
    }
  }

  function createEvidenceDetails(item) {
    const details = textElement("details", "signal-evidence-details");
    const summary = textElement("summary", "");
    summary.append(iconElement("ui-icon signal-summary-icon", "⌁"), document.createTextNode("See tension and status"));
    const tension = textElement("div", "");
    tension.append(
      labelElement("Tension", "△"),
      textElement("p", "", item.signal.tension),
    );
    const meta = textElement("div", "signal-meta-tags");
    meta.append(
      textElement("span", "", item.routeStatus || "still routing"),
      textElement("span", "", item.validation || "Proof in progress"),
      textElement("span", "", dossierStatus(item)),
    );
    const date = item.lastUpdatedLabel
      ? textElement("small", "signal-meta-date", `Updated ${item.lastUpdatedLabel}`)
      : null;
    details.append(summary, tension, meta, date);
    return details;
  }

  function createSignalEntry(item, index, isOpen) {
    const entry = textElement("article", `signal-entry${isOpen ? " is-open" : ""}`);
    entry.dataset.signalEntry = "";
    entry.dataset.caseId = item.id;
    entry.dataset.signal = item.dossierKey || item.theme || item.category || "";
    entry.dataset.routeStatus = item.routeStatus || "";
    entry.dataset.focus = focusKey(item);
    if (item.theme) entry.classList.add(item.theme);

    const quoteBlock = textElement("span", "signal-entry-main");
    quoteBlock.append(
      textElement("span", "signal-entry-quote", item.signalQuote),
      textElement("span", "signal-entry-category", item.category || "Portfolio inquiry"),
    );

    const trigger = textElement("button", "signal-entry-trigger");
    trigger.type = "button";
    trigger.setAttribute("aria-expanded", String(isOpen));
    trigger.setAttribute("aria-controls", `signal-panel-${item.id}`);
    const numberWrap = textElement("span", "signal-entry-number-wrap");
    numberWrap.append(
      textElement("span", "signal-entry-number", String(index + 1).padStart(2, "0")),
      iconElement("ui-icon signal-entry-icon", signalIconForItem(item)),
    );
    trigger.append(
      numberWrap,
      quoteBlock,
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
      labelElement("Translation", "✦"),
      textElement("p", "", item.signal.translation),
    );
    const implications = textElement("div", "signal-implications");
    const productImplication = textElement("div", "signal-output");
    productImplication.append(
      labelElement("Product implication", "◎"),
      textElement("p", "", item.signal.productImplication || item.signal.output),
    );
    const gtmImplication = textElement("div", "signal-output");
    gtmImplication.append(
      labelElement("GTM implication", "◧"),
      textElement("p", "", item.signal.gtmImplication || item.signal.output),
    );
    implications.append(productImplication, gtmImplication);
    const archiveNote = item.archiveNote ? textElement("p", "signal-archive-note", item.archiveNote) : null;
    const hint = textElement("p", "signal-evidence-hint");
    hint.append(labelElement("Evidence", "◌"), document.createTextNode(` ${evidenceHint(item)}`));
    const classification = textElement("p", "signal-classification");
    classification.append(
      labelElement("Capability", "▣"),
      document.createTextNode(` ${classificationLine(item)}`),
    );

    const project = textElement("div", "signal-project");
    project.append(labelElement("Project", "↗"), textElement("p", "", projectLine(item)));
    if (item.caseLink) {
      const link = textElement("a", "", item.caseLinkLabel || "Open dossier");
      link.href = item.caseLink;
      project.append(link);
    } else {
      project.append(textElement("small", "", "Dossier in progress"));
    }

    content.append(
      ...[translation, implications, archiveNote, hint, createEvidenceDetails(item), classification, project].filter(Boolean),
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
    setActiveSignal(caseById(defaultId));
  }

  function buttonForFilter(group, value, label, isActive) {
    const button = textElement("button", "signal-filter-chip");
    button.type = "button";
    button.dataset.filterGroup = group;
    button.dataset.filterValue = value;
    button.setAttribute("aria-pressed", String(isActive));
    button.append(iconElement("ui-icon signal-filter-icon", filterIconFor(group, value)), document.createTextNode(label));
    return button;
  }

  function renderSignalFilters(data) {
    const panel = qs("[data-signal-filters]");
    if (!panel) return;

    const focusLabels = ["All", ...Array.from(new Set(data.cases.map(focusLabel)))];
    const statusOptions = [
      ["all", "All"],
      ["routed", "Routed"],
      ["still routing", "Still routing"],
    ];

    const statusGroup = textElement("div", "signal-filter-group");
    const statusLabel = textElement("span", "signal-filter-label");
    statusLabel.append(iconElement("ui-icon signal-filter-label-icon", "◎"), document.createTextNode("Status"));
    statusGroup.append(statusLabel);
    statusOptions.forEach(([value, label]) => {
      statusGroup.append(buttonForFilter("status", value, label, signalFilterState.status === value));
    });

    const focusGroup = textElement("div", "signal-filter-group");
    const focusLabelText = textElement("span", "signal-filter-label");
    focusLabelText.append(iconElement("ui-icon signal-filter-label-icon", "◧"), document.createTextNode("Company"));
    focusGroup.append(focusLabelText);
    focusLabels.forEach((label) => {
      const value = label === "All" ? "all" : slugify(label);
      focusGroup.append(buttonForFilter("focus", value, label, signalFilterState.focus === value));
    });

    const count = textElement("p", "signal-filter-count", "");
    count.dataset.signalFilterCount = "";

    panel.replaceChildren(statusGroup, focusGroup, count);
  }

  function matchesSignalFilter(entry) {
    const statusMatch =
      signalFilterState.status === "all" || entry.dataset.routeStatus === signalFilterState.status;
    const focusMatch = signalFilterState.focus === "all" || entry.dataset.focus === signalFilterState.focus;
    return statusMatch && focusMatch;
  }

  function applySignalFilters(options = {}) {
    const entries = qsa("[data-signal-entry]");
    let visibleEntries = [];

    entries.forEach((entry) => {
      const isVisible = matchesSignalFilter(entry);
      entry.hidden = !isVisible;
      entry.classList.toggle("is-filtered-out", !isVisible);
      if (isVisible) visibleEntries.push(entry);
      if (!isVisible && entry.classList.contains("is-open")) closeEntry(entry);
    });

    const count = qs("[data-signal-filter-count]");
    if (count) {
      const noun = visibleEntries.length === 1 ? "signal" : "signals";
      count.textContent = `${visibleEntries.length} visible ${noun}`;
    }

    const hasOpenVisible = visibleEntries.some((entry) => entry.classList.contains("is-open"));
    if (!hasOpenVisible && visibleEntries.length && options.openFirst !== false) {
      openEntry(visibleEntries[0], { focus: false, playSound: false });
    }

    qsa("[data-filter-group]").forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(signalFilterState[button.dataset.filterGroup] === button.dataset.filterValue),
      );
    });
  }

  function setupSignalFilters() {
    const panel = qs("[data-signal-filters]");
    if (!panel) return;

    panel.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter-group]");
      if (!button) return;
      const group = button.dataset.filterGroup;
      const value = button.dataset.filterValue;
      if (!group || !value) return;
      signalFilterState[group] = value;
      applySignalFilters();
    });

    applySignalFilters({ openFirst: false });
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

  function renderArchiveError() {
    const filters = qs("[data-signal-filters]");
    const list = qs("[data-signal-list]");
    if (filters) {
      const message = textElement("p", "signal-filter-count", "Archive data could not load.");
      message.dataset.signalFilterCount = "";
      filters.replaceChildren(message);
    }
    if (list) {
      list.replaceChildren(
        textElement(
          "p",
          "signal-loading signal-loading-error",
          "The signal archive could not load. Please refresh the page, or use the contact link if it keeps happening.",
        ),
      );
    }
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
    setActiveSignal(caseById(id));
    if (panel) panel.hidden = false;
    if (trigger) trigger.setAttribute("aria-expanded", "true");
    entry.classList.add("is-open");
    entry.classList.remove("is-animating");
    window.requestAnimationFrame(() => {
      entry.classList.add("is-animating");
    });

    if (options.focus && trigger) trigger.focus();
    if (options.playSound) {
      const item = caseById(id);
      window.setTimeout(() => playRouteTone(item?.soundProfile), connectorDelay);
    }
  }

  function toggleEntry(entry, options = {}) {
    const isOpen = entry.classList.contains("is-open");
    if (isOpen) {
      closeEntry(entry);
      activeCaseId = null;
      setActiveSignal(null);
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
        const visibleEntries = entries.filter((candidate) => !candidate.hidden);
        const visibleIndex = visibleEntries.indexOf(entry);
        let nextIndex = visibleIndex;
        if (visibleIndex < 0) return;
        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
          nextIndex = (visibleIndex + 1) % visibleEntries.length;
        } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          nextIndex = (visibleIndex - 1 + visibleEntries.length) % visibleEntries.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = visibleEntries.length - 1;
        } else if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleEntry(entry, { playSound: true });
          return;
        } else {
          return;
        }

        event.preventDefault();
        const nextTrigger = qs(".signal-entry-trigger", visibleEntries[nextIndex]);
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

  function playRouteTone(profileName = "settled") {
    if (!soundEnabled) return;

    const context = ensureAudioContext();
    if (!context) return;

    const profile = soundProfiles[profileName] || soundProfiles.settled;
    const now = context.currentTime;
    const master = context.createGain();
    const filter = context.createBiquadFilter();
    const fundamental = context.createOscillator();
    const overtone = context.createOscillator();
    const overtoneGain = context.createGain();

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(profile.filter, now);
    filter.Q.setValueAtTime(profile.q, now);
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(profile.peak, now + 0.012);
    master.gain.exponentialRampToValueAtTime(0.0001, now + profile.duration);

    fundamental.type = profile.wave;
    overtone.type = profile.overtoneWave;
    fundamental.frequency.setValueAtTime(profile.fundamental, now);
    fundamental.frequency.exponentialRampToValueAtTime(profile.endFrequency, now + profile.duration * 0.86);
    overtone.frequency.setValueAtTime(profile.overtone, now);
    overtone.frequency.exponentialRampToValueAtTime(profile.overtoneEnd, now + profile.duration * 0.72);
    overtoneGain.gain.setValueAtTime(0.32, now);

    fundamental.connect(master);
    overtone.connect(overtoneGain);
    overtoneGain.connect(master);
    master.connect(filter);
    filter.connect(context.destination);

    fundamental.start(now);
    overtone.start(now);
    fundamental.stop(now + profile.duration + 0.02);
    overtone.stop(now + profile.duration * 0.82);
  }

  function setupSoundToggle(data) {
    const toggle = qs("[data-sound-toggle]");
    if (!toggle) return;

    const label = qs("[data-sound-toggle-label]", toggle);
    const setToggleLabel = (value) => {
      if (label) label.textContent = value;
      else toggle.textContent = value;
    };

    setToggleLabel(data.switchboard?.soundOffLabel || "Sound off");
    toggle.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      toggle.setAttribute("aria-pressed", String(soundEnabled));
      toggle.setAttribute("aria-label", soundEnabled ? "Turn route tone off" : "Turn route tone on");
      setToggleLabel(
        soundEnabled
          ? data.switchboard?.soundOnLabel || "Sound on"
          : data.switchboard?.soundOffLabel || "Sound off",
      );
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

  function setupScrollProgress() {
    const progress = qs("[data-scroll-progress]");
    if (!progress) return;

    let frame = null;
    const update = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      progress.style.setProperty("--scroll-progress", String(ratio));
      frame = null;
    };
    const requestUpdate = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
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
    renderLensClosing(data);
    renderBackground(data);
    renderExperience(data);
    renderSignalList(data);
    renderSignalFilters(data);
    renderUnroutedSignals(data);
    setupSoundToggle(data);
    setupSignalArchive();
    setupSignalFilters();
    setupReveal();
    setupJumpLinks();
    setupScrollProgress();
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
      renderArchiveError();
    }
  }

  init();
})();
