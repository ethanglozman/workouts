require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Supabase Setup =====
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ===== Middleware =====
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);

// Serve frontend
const frontendPath = path.join(__dirname, "Workout App");
app.use(express.static(frontendPath));

// Serve login page at root
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "login.html"));
});

// ===== Auth Middleware =====
function requireLogin(req, res, next) {
  if (!req.session.username) {
    return res.status(401).json({ error: "Not logged in" });
  }
  next();
}


// =============================
// TRANSLATION
// =============================

// Set language
app.post("/language", (req, res) => {
  const { lang } = req.body;
  const supported = ["en", "fr", "de", "ru", "he"];
  if (!supported.includes(lang)) return res.status(400).json({ error: "Unsupported language" });
  req.session.lang = lang;
  res.json({ success: true });
});

// Get current language
app.get("/language", (req, res) => {
  res.json({ lang: req.session.lang || "en" });
});

// =============================
// AUTH ROUTES
// =============================

// Login
app.post("/login", (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username required" });
  }

  req.session.username = username;
  res.json({ success: true });
});

// Logout
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// Get current user
app.get("/me", (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ error: "Not logged in" });
  }

  res.json({ username: req.session.username });
});

// =============================
// WORKOUT ROUTES
// =============================

// Get workouts
app.get("/workouts", requireLogin, async (req, res) => {
  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("username", req.session.username)
    .order("date", { ascending: false });

  if (error) return res.status(500).json(error);

  res.json(data);
});

// Add workout
app.post("/workouts", requireLogin, async (req, res) => {
  const { exercise, reps, weight, date, day, notes } = req.body;

  const { error } = await supabase.from("workouts").insert([
    {
      username: req.session.username,
      exercise,
      reps,
      weight,
      date,
      day,
      notes: notes || null
    }
  ]);

  if (error) return res.status(500).json(error);

  res.json({ success: true });
});


// Update workout
app.put("/workouts/:id", requireLogin, async (req, res) => {
  const { id } = req.params;
  const { date, reps, weight, notes } = req.body;

  const { error } = await supabase
    .from("workouts")
    .update({ date, reps, weight, notes: notes || null })
    .eq("id", id)
    .eq("username", req.session.username);

  if (error) return res.status(500).json(error);
  res.json({ success: true });
});

// Delete workout
app.delete("/workouts/:id", requireLogin, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("workouts")
    .delete()
    .eq("id", id)
    .eq("username", req.session.username);

  if (error) return res.status(500).json(error);
  res.json({ success: true });
});


// Get last session for a given day
app.get("/workouts/last-session/:day", requireLogin, async (req, res) => {
  const { day } = req.params;

  // Find the most recent date for this user + day
  const { data: dates, error: dateError } = await supabase
    .from("workouts")
    .select("date")
    .eq("username", req.session.username)
    .eq("day", day)
    .order("date", { ascending: false })
    .limit(1);

  if (dateError) return res.status(500).json(dateError);
  if (!dates || dates.length === 0) return res.json([]);

  const lastDate = dates[0].date;

  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("username", req.session.username)
    .eq("day", day)
    .eq("date", lastDate)
    .order("id", { ascending: true });

  if (error) return res.status(500).json(error);
  res.json(data);
});


// =============================
// CARDIO ROUTES
// =============================

// Get cardio entries
app.get("/cardio", requireLogin, async (req, res) => {
  const { data, error } = await supabase
    .from("cardio")
    .select("*")
    .eq("username", req.session.username)
    .order("date", { ascending: false });

  if (error) return res.status(500).json(error);
  res.json(data);
});

// Add cardio entry
app.post("/cardio", requireLogin, async (req, res) => {
  const { date, type, duration, speed, distance, notes } = req.body;

  const { error } = await supabase.from("cardio").insert([{
    username: req.session.username,
    date, type, duration,
    speed:    speed    || null,
    distance: distance || null,
    notes:    notes    || null
  }]);

  if (error) return res.status(500).json(error);
  res.json({ success: true });
});

// Delete cardio entry
app.delete("/cardio/:id", requireLogin, async (req, res) => {
  const { error } = await supabase
    .from("cardio")
    .delete()
    .eq("id", req.params.id)
    .eq("username", req.session.username);

  if (error) return res.status(500).json(error);
  res.json({ success: true });
});

// =============================
// EXERCISE ROUTES (Admin Page)
// =============================

// Get exercises by category
app.get("/exercises/:category", requireLogin, async (req, res) => {
  const { category } = req.params;

  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("day", category)
    .order("name");

  if (error) return res.status(500).json(error);

  res.json(data);
});

// Get ALL exercises (admin page)
app.get("/admin/exercises", requireLogin, async (req, res) => {
  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .order("day")
    .order("name");

  if (error) return res.status(500).json(error);

  res.json(data);
});

// Add exercise (admin page)
app.post("/admin/exercises", requireLogin, async (req, res) => {
  const { name, category, day: dayField } = req.body;
  const day = dayField || category;

  if (!name || !day) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const { error } = await supabase
    .from("exercises")
    .insert([{ name, day }]);

  if (error) return res.status(500).json(error);

  res.json({ success: true });
});

// =============================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
