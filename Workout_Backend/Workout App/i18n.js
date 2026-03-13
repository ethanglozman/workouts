// ===== i18n.js — translations + language picker =====

const RTL_LANGS = ["he"];

async function applyTranslations() {
  const elements = document.querySelectorAll("[data-i18n]");
  const placeholderEls = document.querySelectorAll("[data-i18n-placeholder]");

  const strings = [...new Set([
    ...[...elements].map(el => el.getAttribute("data-i18n")),
    ...[...placeholderEls].map(el => el.getAttribute("data-i18n-placeholder"))
  ])];

  if (strings.length === 0) return;

  try {
    const res = await fetch("/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ strings })
    });

    if (!res.ok) return;
    const { lang, translations } = await res.json();

    // RTL for Hebrew
    document.documentElement.setAttribute("dir", RTL_LANGS.includes(lang) ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang);

    elements.forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (translations[key]) el.textContent = translations[key];
    });

    placeholderEls.forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (translations[key]) el.placeholder = translations[key];
    });

    // Update active flag highlight
    highlightActiveLang(lang);

  } catch (err) {
    console.error("i18n error:", err);
  }
}

async function setLang(lang) {
  await fetch("/language", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lang })
  });
  applyTranslations();
}

function highlightActiveLang(lang) {
  document.querySelectorAll(".lang-picker button").forEach(btn => {
    const match = btn.getAttribute("onclick") === `setLang('${lang}')`;
    btn.classList.toggle("lang-active", match);
  });
}

async function highlightCurrentLang() {
  try {
    const res = await fetch("/language");
    const { lang } = await res.json();
    highlightActiveLang(lang);
  } catch (err) {}
}

// Run on every page load
highlightCurrentLang();
applyTranslations();
