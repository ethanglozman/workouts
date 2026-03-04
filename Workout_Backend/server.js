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
const frontendPath = path.join(__dirname, "../workout_app");
app.use(express.static(frontendPath));

// ===== Auth Middleware =====
function requireLogin(req, res, next) {
  if (!req.session.username) {
    return res.status(401).json({ error: "Not logged in" });
  }
  next();
}

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
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json(error);

  res.json(data);
});

// Add workout
app.post("/workouts", requireLogin, async (req, res) => {
  const { exercise, reps, weight, date, day } = req.body;

  const { error } = await supabase.from("workouts").insert([
    {
      username: req.session.username,
      exercise,
      reps,
      weight,
      date,
      day
    }
  ]);

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

  if (!name || !category) {
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
