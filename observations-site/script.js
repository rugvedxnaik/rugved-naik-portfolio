(function () {
  const body = document.body;
  const signalLabels = {
    givenchy: "Signal 028",
    1903: "Signal 029",
    brandstorm: "Signal 021",
    seo: "Signal 017",
    personalization: "Signal 002",
  };
  const activeSignalName = document.querySelector(".active-signal-name");
  let activeDossier = body.dataset.signal || "givenchy";

  function setSignalMood(key) {
    body.dataset.signal = key;
    if (activeSignalName && signalLabels[key]) {
      activeSignalName.textContent = signalLabels[key];
    }
  }

  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.16 }
    );

    revealElements.forEach((element) => observer.observe(element));

    requestAnimationFrame(() => {
      revealElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          element.classList.add("is-visible");
        }
      });
    });
  }

  const tabs = document.querySelectorAll("[data-dossier]");
  const panels = document.querySelectorAll(".signal-dossier");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollBehavior = prefersReducedMotion ? "auto" : "smooth";

  function activateDossier(key, options = {}) {
    activeDossier = key;
    setSignalMood(key);

    tabs.forEach((tab) => {
      const isActive = tab.dataset.dossier === key;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.setAttribute("tabindex", isActive ? "0" : "-1");
      if (isActive && options.focus) {
        tab.focus();
      }
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

  tabs.forEach((tab) => {
    tab.setAttribute("tabindex", tab.classList.contains("is-active") ? "0" : "-1");
    tab.addEventListener("click", () => activateDossier(tab.dataset.dossier));
    tab.addEventListener("keydown", (event) => {
      const currentIndex = Array.from(tabs).indexOf(tab);
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

  const moodTargets = document.querySelectorAll("[data-mood]");
  moodTargets.forEach((target) => {
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

  const jumpLinks = document.querySelectorAll("[data-open-signal]");
  jumpLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const key = link.getAttribute("data-open-signal");
      if (!key) return;
      activateDossier(key);
      const signalRoom = document.getElementById("signal-room");
      if (signalRoom) {
        signalRoom.scrollIntoView({ behavior: scrollBehavior, block: "start" });
      }
    });
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (window.innerWidth <= 1100) {
        const stage = document.querySelector(".signal-stage");
        if (stage) {
          window.setTimeout(() => {
            stage.scrollIntoView({ behavior: scrollBehavior, block: "start" });
          }, 120);
        }
      }
    });
  });

  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (dot && ring && window.matchMedia("(pointer:fine)").matches) {
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

    const hoverTargets = document.querySelectorAll("a, button, .signal-chip, .archive-entry");
    hoverTargets.forEach((target) => {
      target.addEventListener("mouseenter", () => body.classList.add("cursor-hover"));
      target.addEventListener("mouseleave", () => body.classList.remove("cursor-hover"));
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(animateRing);
    }

    animateRing();
  }
})();
