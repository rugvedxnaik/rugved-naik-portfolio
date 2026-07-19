(function () {
  const DATA_URL = "data/portfolio.json";
  const body = document.body;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollBehavior = prefersReducedMotion ? "auto" : "smooth";
  const archiveFilters = {
    category: "all",
    company: "all",
    capability: "all",
  };
  let portfolioData = null;
  let activeDossier = body.dataset.signal || "miutine";

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

  function padNumber(number) {
    return String(number).padStart(2, "0");
  }

  function displayTitle(item) {
    return item.displayTitle || item.title;
  }

  function targetKey(item) {
    return item.dossierKey || item.relatedDossierKey;
  }

  function highlightCases() {
    return (portfolioData?.cases || []).filter((item) => item.isHighlight && item.detail);
  }

  function caseForDossier(key) {
    return highlightCases().find((item) => item.dossierKey === key);
  }

  function signalStrength(item) {
    if (typeof item?.signalWeight === "number") return item.signalWeight;
    if (item?.status?.includes("Finished")) return 82;
    if (item?.status?.includes("Framework")) return 70;
    if (item?.status?.includes("Active")) return 64;
    return 56;
  }

  function signatureRows(item) {
    const signature = item?.signature || {};
    return [
      ["Behavior", signature.behavior],
      ["Evidence", signature.evidence],
      ["Tension", signature.tension],
      ["Move", signature.move],
      ["System", signature.system],
    ].filter(([, value]) => value);
  }

  function setSignalMood(key) {
    body.dataset.signal = key;
    const currentCase = caseForDossier(key);
    const activeSignalName = qs(".active-signal-name");
    const currentObservation = qs(".current-observation");

    if (activeSignalName && currentCase) {
      const index = highlightCases().findIndex((item) => item.dossierKey === key);
      activeSignalName.textContent = `Highlight ${padNumber(index + 1)}`;
    }

    if (currentObservation && currentCase) {
      currentObservation.textContent = currentCase.note;
    }

    updateSignalConsole(key);
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

  function renderProofSignals(data) {
    const ledger = qs("[data-proof-ledger]");
    if (!ledger) return;

    const label = qs(".ledger-label", ledger) || textElement("p", "ledger-label", "Proof signals");
    const proofRows = data.cases.filter((item) => item.isProofSignal);
    ledger.replaceChildren(label);

    proofRows.forEach((item) => {
      const row = textElement("div", "proof-row");
      row.dataset.mood = targetKey(item);
      row.tabIndex = 0;
      row.style.setProperty("--signal-strength", `${signalStrength(item)}%`);

      row.append(
        textElement("span", "", item.proofName || item.company || displayTitle(item)),
        textElement("p", "", item.proof),
        textElement("small", "proof-detail", `${item.validation} / Updated ${item.lastUpdatedLabel}`),
      );
      ledger.append(row);
    });
  }

  function renderSignalConsole(data) {
    const consoleCard = qs("[data-signal-console]");
    if (!consoleCard) return;

    const bars = qs("[data-signal-bars]", consoleCard);
    if (bars) {
      bars.replaceChildren();
      highlightCases().forEach((item, index) => {
        const button = textElement("button", "signal-track");
        button.type = "button";
        button.dataset.consoleSignal = item.dossierKey;
        button.dataset.mood = item.dossierKey;
        button.style.setProperty("--signal-strength", `${signalStrength(item)}%`);
        button.setAttribute("aria-label", `Open signal ${displayTitle(item)}`);
        button.append(
          textElement("span", "", padNumber(index + 1)),
          textElement("strong", "", displayTitle(item)),
          textElement("em", "", item.label),
        );
        bars.append(button);
      });
    }

    const headline = data.signalSystem?.headline;
    const subtitle = qs("[data-active-signal-subtitle]", consoleCard);
    if (subtitle && headline) subtitle.textContent = headline;
  }

  function updateSignalConsole(key) {
    const consoleCard = qs("[data-signal-console]");
    const currentCase = caseForDossier(key);
    if (!consoleCard || !currentCase) return;

    const title = qs("[data-active-signal-title]", consoleCard);
    const subtitle = qs("[data-active-signal-subtitle]", consoleCard);
    const readout = qs("[data-active-readout]", consoleCard);

    if (title) title.textContent = displayTitle(currentCase);
    if (subtitle) subtitle.textContent = currentCase.note || currentCase.hook;

    if (readout) {
      const rows = signatureRows(currentCase).slice(0, 4);
      readout.replaceChildren(
        ...rows.map(([label, value]) => {
          const row = document.createElement("div");
          row.append(textElement("span", "", label), textElement("p", "", value));
          return row;
        }),
      );
    }

    qsa("[data-console-signal]").forEach((track) => {
      const isActive = track.dataset.consoleSignal === key;
      track.classList.toggle("is-active", isActive);
      track.setAttribute("aria-pressed", String(isActive));
    });
  }

  function renderLenses(data) {
    const notes = qs("[data-lens-notes]");
    if (!notes) return;

    notes.replaceChildren();
    data.lenses.forEach((lens, index) => {
      const article = textElement("article", "reveal");
      article.dataset.mood = lens.mood;
      article.append(
        textElement("span", "", `${padNumber(index + 1)} / ${lens.label}`),
        textElement("p", "", lens.text),
      );
      notes.append(article);
    });
  }

  function renderFieldNotes(data) {
    const notes = qs("[data-field-notes]");
    if (!notes) return;

    notes.replaceChildren();
    data.fieldNotes.forEach((note) => {
      const article = textElement("article", "reveal");
      article.append(
        textElement("span", "", note.date),
        textElement("h3", "", note.title),
        textElement("p", "", note.text),
      );
      notes.append(article);
    });
  }

  function renderDepthLedger(data) {
    const ledger = qs("[data-depth-ledger]");
    if (!ledger || !data.statusGroups) return;

    ledger.replaceChildren();
    data.statusGroups.forEach((group) => {
      const article = document.createElement("article");
      article.append(
        textElement("span", "", group.label),
        textElement("p", "", group.text),
      );
      ledger.append(article);
    });
  }

  function sortedUnique(values, preferredOrder = []) {
    const unique = Array.from(new Set(values.filter(Boolean)));
    return unique.sort((a, b) => {
      const aIndex = preferredOrder.indexOf(a);
      const bIndex = preferredOrder.indexOf(b);
      if (aIndex !== -1 || bIndex !== -1) {
        return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
      }
      return a.localeCompare(b);
    });
  }

  function renderFilterButton(groupKey, value, label, isActive = false) {
    const button = textElement("button", isActive ? "is-active" : "", label);
    button.type = "button";
    button.dataset.archiveFilter = groupKey;
    button.dataset.filterValue = value;
    button.setAttribute("aria-pressed", String(isActive));
    return button;
  }

  function renderArchiveControls(data) {
    const controls = qs("[data-archive-controls]");
    if (!controls) return;

    const categories = sortedUnique(
      data.cases.map((item) => item.category),
      ["Strategic Frameworks", "Brand & Product Architecture", "Market & Data Reading", "Applied to Target House"],
    );
    const companies = sortedUnique(
      data.cases.map((item) => item.company),
      ["L'Oréal", "Danone", "LVMH"],
    );
    const capabilities = sortedUnique(
      data.cases.flatMap((item) => item.capabilities || []),
      ["Strategy", "Analysis", "CRM", "Design"],
    );

    const groups = [
      ["category", "Category", categories, (value) => ({
        "Strategic Frameworks": "Frameworks",
        "Brand & Product Architecture": "Brand and product",
        "Market & Data Reading": "Market and data",
        "Applied to Target House": "Target house",
      })[value] || value],
      ["company", "Company", companies, (value) => value],
      ["capability", "Capability", capabilities, (value) => value],
    ];

    controls.replaceChildren();
    groups.forEach(([groupKey, label, values, labelFor]) => {
      const group = textElement("div", "archive-control-group");
      const buttons = document.createElement("div");
      buttons.append(renderFilterButton(groupKey, "all", "All", true));
      values.forEach((value) => buttons.append(renderFilterButton(groupKey, value, labelFor(value))));
      group.append(textElement("span", "", label), buttons);
      controls.append(group);
    });

    const count = textElement("div", "archive-count");
    const strong = textElement("strong", "", String(data.cases.length));
    strong.dataset.caseCount = "";
    count.append(strong, textElement("span", "", "visible cases"));
    controls.append(count);
  }

  function renderArchiveRows(data) {
    const grid = qs("[data-case-grid]");
    if (!grid) return;

    grid.replaceChildren();
    data.cases.forEach((item, index) => {
      const row = textElement("article", "case-archive-row");
      row.dataset.caseRow = "";
      row.dataset.caseId = item.id;
      row.dataset.category = item.category || "";
      row.dataset.company = item.company || "";
      row.dataset.capabilities = (item.capabilities || []).join(" ");
      row.dataset.dossier = targetKey(item) || "";
      row.dataset.mood = targetKey(item) || "";
      row.style.setProperty("--signal-strength", `${signalStrength(item)}%`);

      const main = textElement("div", "case-row-main");
      main.append(
        textElement("span", "", item.category),
        textElement("h4", "", item.title),
        textElement("p", "", item.hook),
        textElement("small", "case-row-detail", `${item.status} / ${item.validation} / Updated ${item.lastUpdatedLabel}`),
      );

      const tags = textElement("div", "case-row-tags");
      const tagValues = [
        item.company,
        item.status,
        ...(item.capabilities || []),
        item.validation,
      ].filter(Boolean);
      tagValues.forEach((tag) => tags.append(textElement("span", "", tag)));

      const button = textElement("button", "", item.actionLabel || "Preview");
      button.type = "button";
      button.dataset.openSignal = targetKey(item);

      row.append(
        textElement("span", "case-id", `Case ${padNumber(index + 1)}`),
        main,
        tags,
        button,
      );
      row.append(textElement("span", "case-signal-meter", ""));
      grid.append(row);
    });
  }

  function renderHighlightTabs(data) {
    const tabs = qs("[data-highlight-tabs]");
    const panels = qs("[data-highlight-panels]");
    const highlights = data.cases.filter((item) => item.isHighlight && item.detail);
    if (!tabs || !panels || !highlights.length) return;

    tabs.replaceChildren();
    panels.replaceChildren();
    activeDossier = highlights.some((item) => item.dossierKey === activeDossier)
      ? activeDossier
      : highlights[0].dossierKey;
    body.dataset.signal = activeDossier;

    highlights.forEach((item, index) => {
      const isActive = item.dossierKey === activeDossier;
      const tab = textElement("button", `signal-chip${isActive ? " is-active" : ""}`);
      tab.type = "button";
      tab.dataset.dossier = item.dossierKey;
      tab.id = `tab-${item.dossierKey}`;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", String(isActive));
      tab.setAttribute("aria-controls", `dossier-${item.dossierKey}`);
      tab.setAttribute("tabindex", isActive ? "0" : "-1");
      tab.append(
        textElement("span", "signal-number", `Highlight ${padNumber(index + 1)}`),
        textElement("span", "signal-status", item.status),
        textElement("span", "signal-title", displayTitle(item)),
        textElement("span", "signal-field", item.field),
        textElement("span", "signal-note-label", item.label),
        textElement("span", "signal-note", item.note),
        textElement("span", "signal-hover", `${item.validation} / Updated ${item.lastUpdatedLabel}`),
      );
      tabs.append(tab);

      const panel = textElement("article", `signal-dossier ${item.theme || ""}${isActive ? " is-active" : ""}`.trim());
      panel.id = `dossier-${item.dossierKey}`;
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", `tab-${item.dossierKey}`);
      panel.hidden = !isActive;

      const meta = textElement("div", "dossier-meta");
      item.detail.meta.forEach((entry) => meta.append(textElement("span", "", entry)));

      const fields = textElement("div", "dossier-fields");
      item.detail.fields.forEach(([label, value]) => {
        const field = document.createElement("div");
        field.append(textElement("span", "", label), textElement("p", "", value));
        fields.append(field);
      });

      panel.append(
        meta,
        textElement("h3", "", item.detail.heading || displayTitle(item)),
        textElement("p", "dossier-kicker", item.detail.kicker),
        textElement("p", "dossier-context", item.detail.context),
        fields,
      );

      if (item.caseLink) {
        const link = textElement("a", "dossier-link", item.caseLinkLabel || "Open the dossier");
        link.href = item.caseLink;
        panel.append(link);
      }

      const signature = signatureRows(item);
      if (signature.length) {
        const trace = textElement("div", "dossier-signal-trace");
        signature.forEach(([label, value]) => {
          const traceRow = document.createElement("div");
          traceRow.append(textElement("span", "", label), textElement("p", "", value));
          trace.append(traceRow);
        });
        panel.insertBefore(trace, fields);
      }

      panels.append(panel);
    });
  }

  function renderSiteUpdated(data) {
    const updated = qs("[data-site-updated]");
    if (updated && data.site?.lastUpdatedLabel) {
      updated.textContent = data.site.lastUpdatedLabel;
    }
  }

  function updateArchive() {
    const archiveRows = qsa("[data-case-row]");
    const caseCount = qs("[data-case-count]");
    const emptyState = qs("[data-archive-empty]");
    let visible = 0;

    archiveRows.forEach((row) => {
      const capabilities = (row.dataset.capabilities || "").split(/\s+/).filter(Boolean);
      const isVisible =
        (archiveFilters.category === "all" || row.dataset.category === archiveFilters.category) &&
        (archiveFilters.company === "all" || row.dataset.company === archiveFilters.company) &&
        (archiveFilters.capability === "all" || capabilities.includes(archiveFilters.capability));

      row.setAttribute("aria-hidden", String(!isVisible));
      if (isVisible) {
        visible += 1;
        row.hidden = false;
        window.requestAnimationFrame(() => row.classList.remove("is-exiting"));
      } else if (prefersReducedMotion) {
        row.hidden = true;
      } else {
        row.classList.add("is-exiting");
        window.setTimeout(() => {
          if (row.classList.contains("is-exiting")) row.hidden = true;
        }, 220);
      }
    });

    if (caseCount) caseCount.textContent = String(visible);
    if (emptyState) emptyState.hidden = visible !== 0;
  }

  function activateDossier(key, options = {}) {
    const tabs = qsa("[data-dossier]");
    const panels = qsa(".signal-dossier");
    if (!tabs.length || !panels.length) return;

    activeDossier = key;
    setSignalMood(key);

    tabs.forEach((tab) => {
      const isActive = tab.dataset.dossier === key;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.setAttribute("tabindex", isActive ? "0" : "-1");
      if (isActive && options.focus) tab.focus();
    });

    panels.forEach((panel) => {
      const isActive = panel.id === `dossier-${key}`;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
      if (isActive) {
        panel.classList.remove("is-opening");
        void panel.offsetWidth;
        panel.classList.add("is-opening");
        window.setTimeout(() => panel.classList.remove("is-opening"), 720);
      }
    });
  }

  function setupArchiveFilters() {
    const archiveButtons = qsa("[data-archive-filter]");
    archiveButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const group = button.dataset.archiveFilter;
        const value = button.dataset.filterValue || "all";
        if (!group) return;

        archiveFilters[group] = value;
        archiveButtons.forEach((peer) => {
          if (peer.dataset.archiveFilter === group) {
            const isActive = peer === button;
            peer.classList.toggle("is-active", isActive);
            peer.setAttribute("aria-pressed", String(isActive));
          }
        });
        updateArchive();
      });
    });
    updateArchive();
  }

  function setupTabs() {
    const tabs = qsa("[role='tab'][data-dossier]");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        activateDossier(tab.dataset.dossier);
        if (window.innerWidth <= 1100) {
          const stage = qs(".signal-stage");
          if (stage) {
            window.setTimeout(() => {
              stage.scrollIntoView({ behavior: scrollBehavior, block: "start" });
            }, 120);
          }
        }
      });

      tab.addEventListener("keydown", (event) => {
        const currentIndex = tabs.indexOf(tab);
        let nextIndex = currentIndex;

        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
          nextIndex = (currentIndex + 1) % tabs.length;
        } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = tabs.length - 1;
        } else {
          return;
        }

        event.preventDefault();
        activateDossier(tabs[nextIndex].dataset.dossier, { focus: true });
      });
    });
  }

  function setupJumpLinks() {
    qsa("[data-open-signal]").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const key = link.getAttribute("data-open-signal");
        if (!key) return;

        activateDossier(key);
        const signalRoom = qs("#signal-room");
        if (signalRoom) {
          signalRoom.scrollIntoView({ behavior: scrollBehavior, block: "start" });
        }
      });
    });
  }

  function setupMoodTargets() {
    qsa("[data-mood]").forEach((target) => {
      target.addEventListener("mouseenter", () => {
        const key = target.getAttribute("data-mood");
        if (key) setSignalMood(key);
      });

      target.addEventListener("mouseleave", () => setSignalMood(activeDossier));

      target.addEventListener("focusin", () => {
        const key = target.getAttribute("data-mood");
        if (key) setSignalMood(key);
      });

      target.addEventListener("focusout", (event) => {
        if (target.contains(event.relatedTarget)) return;
        setSignalMood(activeDossier);
      });
    });
  }

  function setupSignalConsole() {
    qsa("[data-console-signal]").forEach((track) => {
      track.addEventListener("click", () => {
        const key = track.dataset.consoleSignal;
        if (key) activateDossier(key);
      });
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

    window.requestAnimationFrame(() => {
      revealElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          element.classList.add("is-visible");
        }
      });
    });
  }

  function setupCursor() {
    const dot = qs(".cursor-dot");
    const ring = qs(".cursor-ring");
    if (!dot || !ring || !window.matchMedia("(pointer:fine)").matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    body.classList.add("cursor-ready");

    window.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    qsa("a, button, .signal-chip, .signal-track, .archive-entry, .case-archive-row, .proof-row").forEach((target) => {
      target.addEventListener("mouseenter", () => body.classList.add("cursor-hover"));
      target.addEventListener("mouseleave", () => body.classList.remove("cursor-hover"));
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      window.requestAnimationFrame(animateRing);
    }

    animateRing();
  }

  function setupInteractions() {
    setupArchiveFilters();
    setupTabs();
    setupJumpLinks();
    setupSignalConsole();
    setupMoodTargets();
    setupReveal();
    setupCursor();
  }

  function renderPortfolio(data) {
    portfolioData = data;
    renderCurrentFocus(data);
    renderWorkingAreas(data);
    renderProofSignals(data);
    renderLenses(data);
    renderFieldNotes(data);
    renderDepthLedger(data);
    renderArchiveControls(data);
    renderArchiveRows(data);
    renderHighlightTabs(data);
    renderSignalConsole(data);
    renderSiteUpdated(data);
    setSignalMood(activeDossier);
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
    } finally {
      setupInteractions();
    }
  }

  init();
})();
