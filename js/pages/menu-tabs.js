(() => {
  const tabs = document.querySelector("[data-tabs]");
  if (!tabs) return;

  const buttons = Array.from(tabs.querySelectorAll(".tab"));
  const panels = Array.from(document.querySelectorAll("[data-panel]"));
  const indicator = tabs.querySelector(".tab-indicator");

  function updateIndicator(activeBtn) {
    if (!activeBtn || !indicator) return;

    // Use rAF so layout values are correct after class toggles
    requestAnimationFrame(() => {
      indicator.style.width = `${activeBtn.offsetWidth}px`;
      indicator.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
    });
  }

  function activate(name) {
    // Guard: if already active, do nothing (prevents unnecessary reflow)
    const current = buttons.find(b => b.classList.contains("is-active"));
    if (current && current.dataset.tab === name) {
      updateIndicator(current);
      return;
    }

    buttons.forEach(b => b.classList.toggle("is-active", b.dataset.tab === name));
    panels.forEach(p => p.classList.toggle("is-active", p.dataset.panel === name));

    const activeBtn = buttons.find(b => b.dataset.tab === name);
    updateIndicator(activeBtn);
  }

  // Initial: respect any pre-set .is-active, otherwise default to specials
  const initialBtn =
    buttons.find(b => b.classList.contains("is-active")) ||
    buttons.find(b => b.dataset.tab === "specials") ||
    buttons[0];

  if (initialBtn) activate(initialBtn.dataset.tab);

  buttons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      // Buttons don't navigate, but prevent any weird default/focus scroll
      e.preventDefault();

      // Keep focus nice without scrolling the page
      btn.focus({ preventScroll: true });

      activate(btn.dataset.tab);
    });
  });

  window.addEventListener("resize", () => {
    const active = buttons.find(b => b.classList.contains("is-active"));
    if (active) updateIndicator(active);
  });
})();
