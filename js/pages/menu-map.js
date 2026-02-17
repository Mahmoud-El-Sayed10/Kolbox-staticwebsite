(() => {
  const mapEl = document.getElementById("lb-map");
  if (!mapEl || !window.L) return;

  const msg = document.getElementById("region-msg");
  const choufBtn = document.getElementById("region-chouf");
  const specialsGrid = document.querySelector(".specials-grid");

  // --- Keep scroll stable when hiding/showing big blocks (fixes zoom jump) ---
  function preserveScroll(fn) {
    const y = window.scrollY;
    fn();

    // Restore after layout recalculations (rAF twice is more reliable)
    requestAnimationFrame(() => {
      window.scrollTo(0, y);
      requestAnimationFrame(() => window.scrollTo(0, y));
    });
  }

  function showMessageOnly() {
    preserveScroll(() => {
      if (msg) msg.hidden = false;
      if (specialsGrid) specialsGrid.style.display = "none";
    });
  }

  function showSpecialsOnly() {
    preserveScroll(() => {
      if (msg) msg.hidden = true;
      if (specialsGrid) specialsGrid.style.display = "";
    });
  }

  // Prevent weird click bubbling
  L.DomEvent.disableClickPropagation(mapEl);
  L.DomEvent.disableScrollPropagation(mapEl);

  // Lebanon map
  const map = L.map("lb-map", {
    zoomControl: true,
    scrollWheelZoom: false,
    dragging: true,
    tap: true,
  }).setView([33.90, 35.86], 8);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap",
  }).addTo(map);

  // Bigger, touch-friendly marker
  function markerIcon(color) {
    return L.divIcon({
      className: "",
      html: `
        <div style="
          width: 1.55rem;
          height: 1.55rem;
          border-radius: 999rem;
          background: ${color};
          box-shadow: 0 0.9rem 2rem rgba(0,0,0,0.22);
          border: 2px solid rgba(255,255,255,0.92);
        "></div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  }

  const RED = "#E90000";
  const GREY = "rgba(255,255,255,0.55)";

  // Regions (demo coords)
  const regions = [
    { key: "beirut", name: "Beirut", latlng: [33.8938, 35.5018], active: false },
    { key: "mount", name: "Mount Lebanon", latlng: [33.95, 35.70], active: true },
    { key: "bekaa", name: "Bekaa", latlng: [33.85, 35.95], active: false },
    { key: "north", name: "North", latlng: [34.45, 35.85], active: false },
    { key: "south", name: "South", latlng: [33.30, 35.30], active: false },
  ];

  function handleRegionClick(region, e) {
    if (e?.originalEvent) {
      e.originalEvent.preventDefault?.();
      e.originalEvent.stopPropagation?.();
      e.originalEvent.stopImmediatePropagation?.();
    }

    if (region.active) {
      showSpecialsOnly();
    } else {
      showMessageOnly();
    }
  }

  regions.forEach((r) => {
    const dot = L.marker(r.latlng, { icon: markerIcon(r.active ? RED : GREY) }).addTo(map);
    dot.setZIndexOffset(r.active ? 1000 : 0);

    // Invisible larger hit zone for fingers
    const hit = L.circleMarker(r.latlng, {
      radius: 20,
      opacity: 0,
      fillOpacity: 0,
    }).addTo(map);

    dot.on("click", (e) => handleRegionClick(r, e));
    hit.on("click", (e) => handleRegionClick(r, e));
  });

  // Clicking "Chouf" shows specials
  if (choufBtn) {
    choufBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showSpecialsOnly();
    });
  }

  // Initial state
  showSpecialsOnly();
})();
