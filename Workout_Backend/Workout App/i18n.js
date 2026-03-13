// ===== i18n.js — hardcoded translations =====

const TRANSLATIONS = {
  en: {},  // fallback, use original text
  fr: {
    "💪 Workout Tracker": "💪 Suivi d'entraînement",
    "Select your profile to continue": "Sélectionnez votre profil pour continuer",
    "Choose user...": "Choisir un utilisateur...",
    "Let's Go": "C'est parti",
    "📅 History": "📅 Historique",
    "🏃 Cardio": "🏃 Cardio",
    "➕ Exercise": "➕ Exercice",
    "Logout": "Déconnexion",
    "Select Day": "Choisir le jour",
    "Push": "Poussée",
    "Pull": "Tirage",
    "Legs": "Jambes",
    "Core": "Abdos",
    "Select Exercise": "Choisir un exercice",
    "📈 Last times you did this": "📈 Dernières fois",
    "Reps": "Reps",
    "Weight (lbs)": "Poids (lbs)",
    "Notes (optional)": "Notes (facultatif)",
    "+ Add Set": "+ Ajouter une série",
    "📝 Today's sets": "📝 Séries d'aujourd'hui",
    "📝 Last 5 sets": "📝 5 dernières séries",
    "Exercise": "Exercice",
    "Wt": "Poids",
    "Vol": "Vol",
    "Notes": "Notes",
    "Save": "Sauvegarder",
    "Del": "Suppr",
    "← Back": "← Retour",
    "Add Exercise": "Ajouter un exercice",
    "Exercise Name": "Nom de l'exercice",
    "Day": "Jour",
    "Current Exercises": "Exercices actuels",
    "Duration (min)": "Durée (min)",
    "Speed / Level": "Vitesse / Niveau",
    "Distance (km)": "Distance (km)",
    "+ Log Cardio": "+ Ajouter Cardio",
    "📝 Today's cardio": "📝 Cardio d'aujourd'hui",
    "All Days": "Tous les jours",
    "All Exercises": "Tous les exercices",
    "Clear Filters": "Effacer les filtres",
    "From": "De",
    "To": "À",
    "Duration (min)": "Durée (min)",
    "Speed / Level": "Vitesse / Niveau",
    "Distance (km)": "Distance (km)",
    "📝 Today's cardio": "📝 Cardio d'aujourd'hui",
  },
  de: {
    "💪 Workout Tracker": "💪 Trainings-Tracker",
    "Select your profile to continue": "Profil auswählen um fortzufahren",
    "Choose user...": "Benutzer wählen...",
    "Let's Go": "Los geht's",
    "📅 History": "📅 Verlauf",
    "🏃 Cardio": "🏃 Cardio",
    "➕ Exercise": "➕ Übung",
    "Logout": "Abmelden",
    "Select Day": "Tag wählen",
    "Push": "Drücken",
    "Pull": "Ziehen",
    "Legs": "Beine",
    "Core": "Rumpf",
    "Select Exercise": "Übung wählen",
    "📈 Last times you did this": "📈 Letzte Einheiten",
    "Reps": "Wdh",
    "Weight (lbs)": "Gewicht (lbs)",
    "Notes (optional)": "Notizen (optional)",
    "+ Add Set": "+ Satz hinzufügen",
    "📝 Today's sets": "📝 Heutige Sätze",
    "📝 Last 5 sets": "📝 Letzte 5 Sätze",
    "Exercise": "Übung",
    "Wt": "Gew",
    "Vol": "Vol",
    "Notes": "Notizen",
    "Save": "Speichern",
    "Del": "Löschen",
    "← Back": "← Zurück",
    "Add Exercise": "Übung hinzufügen",
    "Exercise Name": "Übungsname",
    "Day": "Tag",
    "Current Exercises": "Aktuelle Übungen",
    "Duration (min)": "Dauer (min)",
    "Speed / Level": "Geschwindigkeit / Level",
    "Distance (km)": "Distanz (km)",
    "+ Log Cardio": "+ Cardio eintragen",
    "📝 Today's cardio": "📝 Heutiges Cardio",
    "All Days": "Alle Tage",
    "All Exercises": "Alle Übungen",
    "Clear Filters": "Filter löschen",
    "From": "Von",
    "To": "Bis",
    "Duration (min)": "Dauer (min)",
    "Speed / Level": "Geschwindigkeit / Level",
    "Distance (km)": "Distanz (km)",
    "📝 Today's cardio": "📝 Heutiges Cardio",
  },
  ru: {
    "💪 Workout Tracker": "💪 Трекер тренировок",
    "Select your profile to continue": "Выберите профиль для продолжения",
    "Choose user...": "Выбрать пользователя...",
    "Let's Go": "Вперёд",
    "📅 History": "📅 История",
    "🏃 Cardio": "🏃 Кардио",
    "➕ Exercise": "➕ Упражнение",
    "Logout": "Выйти",
    "Select Day": "Выбрать день",
    "Push": "Жим",
    "Pull": "Тяга",
    "Legs": "Ноги",
    "Core": "Пресс",
    "Select Exercise": "Выбрать упражнение",
    "📈 Last times you did this": "📈 Последние разы",
    "Reps": "Повт",
    "Weight (lbs)": "Вес (фунты)",
    "Notes (optional)": "Заметки (необязательно)",
    "+ Add Set": "+ Добавить подход",
    "📝 Today's sets": "📝 Подходы сегодня",
    "📝 Last 5 sets": "📝 Последние 5 подходов",
    "Exercise": "Упражнение",
    "Wt": "Вес",
    "Vol": "Объём",
    "Notes": "Заметки",
    "Save": "Сохранить",
    "Del": "Удалить",
    "← Back": "← Назад",
    "Add Exercise": "Добавить упражнение",
    "Exercise Name": "Название упражнения",
    "Day": "День",
    "Current Exercises": "Текущие упражнения",
    "Duration (min)": "Длительность (мин)",
    "Speed / Level": "Скорость / Уровень",
    "Distance (km)": "Дистанция (км)",
    "+ Log Cardio": "+ Записать кардио",
    "📝 Today's cardio": "📝 Кардио сегодня",
    "All Days": "Все дни",
    "All Exercises": "Все упражнения",
    "Clear Filters": "Сбросить фильтры",
    "From": "С",
    "To": "По",
    "Duration (min)": "Длительность (мин)",
    "Speed / Level": "Скорость / Уровень",
    "Distance (km)": "Дистанция (км)",
    "📝 Today's cardio": "📝 Кардио сегодня",
  },
  he: {
    "💪 Workout Tracker": "💪 מעקב אימונים",
    "Select your profile to continue": "בחר פרופיל להמשך",
    "Choose user...": "בחר משתמש...",
    "Let's Go": "יאללה",
    "📅 History": "📅 היסטוריה",
    "🏃 Cardio": "🏃 קרדיו",
    "➕ Exercise": "➕ תרגיל",
    "Logout": "התנתק",
    "Select Day": "בחר יום",
    "Push": "דחיפה",
    "Pull": "משיכה",
    "Legs": "רגליים",
    "Core": "בטן",
    "Select Exercise": "בחר תרגיל",
    "📈 Last times you did this": "📈 פעמים אחרונות",
    "Reps": "חזרות",
    "Weight (lbs)": "משקל (פאונד)",
    "Notes (optional)": "הערות (אופציונלי)",
    "+ Add Set": "+ הוסף סט",
    "📝 Today's sets": "📝 סטים של היום",
    "📝 Last 5 sets": "📝 5 סטים אחרונים",
    "Exercise": "תרגיל",
    "Wt": "משקל",
    "Vol": "נפח",
    "Notes": "הערות",
    "Save": "שמור",
    "Del": "מחק",
    "← Back": "← חזור",
    "Add Exercise": "הוסף תרגיל",
    "Exercise Name": "שם התרגיל",
    "Day": "יום",
    "Current Exercises": "תרגילים נוכחיים",
    "Duration (min)": "משך (דקות)",
    "Speed / Level": "מהירות / רמה",
    "Distance (km)": "מרחק (ק״מ)",
    "+ Log Cardio": "+ הוסף קרדיו",
    "📝 Today's cardio": "📝 קרדיו של היום",
    "All Days": "כל הימים",
    "All Exercises": "כל התרגילים",
    "Clear Filters": "נקה פילטרים",
    "From": "מ",
    "To": "עד",
    "Duration (min)": "משך (דקות)",
    "Speed / Level": "מהירות / רמה",
    "Distance (km)": "מרחק (ק״מ)",
    "📝 Today's cardio": "📝 קרדיו של היום",
  }
};

const RTL_LANGS = ["he"];

async function applyTranslations() {
  try {
    const res = await fetch("/language");
    const { lang } = await res.json();
    const t = TRANSLATIONS[lang] || {};

    // Apply RTL for Hebrew
    document.documentElement.setAttribute("dir", RTL_LANGS.includes(lang) ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang);

    // Translate text content
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (t[key]) el.textContent = t[key];
    });

    // Translate placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (t[key]) el.placeholder = t[key];
    });

    highlightActiveLang(lang);
    window._currentLang = lang;
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
  // Helper for translating strings in dynamically generated HTML
window._currentLang = "en";
window.i18nT = function(key) {
  const t = TRANSLATIONS[window._currentLang] || {};
  return t[key] || key;
};

applyTranslations();
}

function highlightActiveLang(lang) {
  document.querySelectorAll(".lang-picker button").forEach(btn => {
    btn.classList.toggle("lang-active", btn.getAttribute("onclick") === `setLang('${lang}')`);
  });
}

// Helper for translating strings in dynamically generated HTML
window._currentLang = "en";
window.i18nT = function(key) {
  const t = TRANSLATIONS[window._currentLang] || {};
  return t[key] || key;
};

applyTranslations();
