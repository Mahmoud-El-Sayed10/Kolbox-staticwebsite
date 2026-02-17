(function () {
  const nav = document.querySelector("[data-nav]");
  if (!nav) return;

  const indicator = nav.querySelector(".nav-indicator");
  const links = Array.from(nav.querySelectorAll(".nav-link"));

  // Mark active link based on current page
  function setActiveFromPath() {
    const p = window.location.pathname.toLowerCase();
    links.forEach(a => a.classList.remove("is-active"));

    const match = links.find(a => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      return href && p.endsWith(href.replace("./", "").replace("../", ""));
    });

    (match || links[0]).classList.add("is-active");
  }

  function setIndicatorTo(el) {
    if (!el) return;

    // Use offset metrics: stable inside padded/blurred pills
    const x = el.offsetLeft;
    const w = el.offsetWidth;

    nav.style.setProperty("--indicator-x", `${x}px`);
    indicator.style.width = `${w}px`;
  }

  setActiveFromPath();
  setIndicatorTo(nav.querySelector(".nav-link.is-active") || links[0]);

  // Hover flow
  links.forEach((a) => {
    a.addEventListener("mouseenter", () => setIndicatorTo(a));
    a.addEventListener("mouseleave", () => {
      setIndicatorTo(nav.querySelector(".nav-link.is-active") || links[0]);
    });
  });

  // Click: lock indicator immediately
  links.forEach((a) => {
    a.addEventListener("click", () => {
      links.forEach(x => x.classList.remove("is-active"));
      a.classList.add("is-active");
      setIndicatorTo(a);
    });
  });

  window.addEventListener("resize", () => {
    setIndicatorTo(nav.querySelector(".nav-link.is-active") || links[0]);
  });
})();
