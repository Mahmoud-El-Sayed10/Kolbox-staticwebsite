(() => {
  const form = document.getElementById("contact-form");
  const err = document.getElementById("form-error");
  if (!form) return;

  const TO_EMAIL = "hello@kolbox.lb";

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const phone = (data.get("phone") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const topic = (data.get("topic") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    const ok = name && email && topic && message;
    if (!ok) {
      if (err) err.hidden = false;
      return;
    }
    if (err) err.hidden = true;

    const subject = encodeURIComponent(`[KOLBOX] ${topic} — ${name}`);
    const body = encodeURIComponent(
`Name: ${name}
Email: ${email}
Phone: ${phone || "-"}
Topic: ${topic}

Message:
${message}
`
    );

    // Opens user's email client
    window.location.href = `mailto:${TO_EMAIL}?subject=${subject}&body=${body}`;
  });
})();
