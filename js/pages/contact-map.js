(() => {
  const el = document.getElementById("lb-contact-map");
  if (!el || !window.L) return;

  // Center around Beirut / Mazraa (approx)
  const mazraa = [33.8846, 35.4960];

  const map = L.map("lb-contact-map", {
    zoomControl: true,
    scrollWheelZoom: false,
    dragging: true,
    tap: true
  }).setView([33.90, 35.60], 9); // Lebanon-focused

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);

  // Premium marker (divIcon)
  const marker = L.marker(mazraa, {
    icon: L.divIcon({
      className: "",
      html: `
        <div style="
          width: 1.4rem;
          height: 1.4rem;
          border-radius: 999rem;
          background: #E90000;
          border: 3px solid rgba(255,255,255,0.9);
          box-shadow: 0 1.1rem 2.4rem rgba(233,0,0,0.22);
          position: relative;
        "></div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })
  }).addTo(map);

  marker.bindPopup("<b>Mazraa</b><br/>Beirut, Lebanon").openPopup();

  // Make sure map sizes correctly once visible (important if fonts load late)
  setTimeout(() => map.invalidateSize(), 150);
})();
