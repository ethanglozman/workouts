// ===== i18n.js — load and apply translations =====
// Add data-i18n="Your English text" to any element you want translated.
// This script collects all those strings, fetches translations, and swaps them in.

const RTL_LANGS = ["he"];

async function applyTranslations() {
  // Collect all translatable strings from the page
  const elements = document.querySelectorAll("[data-i18n]");
  const strings = [...new Set([...elements].map(el => el.getAttribute("data-i18n")))];

  // Also collect placeholder strings
  const placeholderEls = document.querySelectorAll("[data-i18n-placeholder]");
  const placeholderStrings = [...new Set([...placeholderEls].map(el => el.getAttribute("data-i18n-placeholder")))];

  const allStrings = [...new Set([...strings, ...placeholderStrings])];
  if (allStrings.length === 0) return;

  try {
    const res = await fetch("/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ strings: allStrings })
    });

    if (!res.ok) return;
    const { lang, translations } = await res.json();

    // Apply RTL for Hebrew
    if (RTL_LANGS.includes(lang)) {
      document.documentElement.setAttribute("dir", "rtl");
      document.documentElement.setAttribute("lang", lang);
    } else {
      document.documentElement.setAttribute("dir", "ltr");
      document.documentElement.setAttribute("lang", lang);
    }

    // Apply text translations
    elements.forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (translations[key]) el.textContent = translations[key];
    });

    // Apply placeholder translations
    placeholderEls.forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (translations[key]) el.placeholder = translations[key];
    });

  } catch (err) {
    console.error("i18n error:", err);
  }
}

applyTranslations();
