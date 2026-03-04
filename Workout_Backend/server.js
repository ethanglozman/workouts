require("dotenv").config();

const express = require("express");
const session = require("express-session");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 10000;

// ================================
// Supabase Setup
// ================================
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ================================
// Middleware
// ================================
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallbacksecret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);

// ================================
// Serve Frontend
// ================================

// Adjust this path if needed depending on your folder structure
const frontendPath = path.join(__dirname, "Workout App");

app.use(express.static(frontendPath));

// Root route → login page
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "login.html"));
});

// ================================
// Auth Middleware
// ================================
function requireLogin(req, res, next) {
  if (!req.session.username) {
    return res.status(401).json({ error: "Not logged in" });
  }
  next();
}

// ================================
// AUTH ROUTES
// ================================

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

// Check current user
app.get("/me", (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ error: "Not logged in" });
  }

  res.json({ username: req.session.username });
});

// ================================
// WORKOUT ROUTES
// ================================

// Get workouts for logged in user
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
  const { exercise, reps, weight } = req.body;

  if (!exercise || !reps || !weight) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const { error } = await supabase.from("workouts").insert([
    {
      username: req.session.username,
      exercise,
      reps,
      weight
    }
  ]);

  if (error) return res.status(500).json(error);

  res.json({ success: true });
});

// ================================
// EXERCISE ROUTES
// ================================

// Get exercises by category
app.get("/exercises/:category", requireLogin, async (req, res) => {
  const { category } = req.params;

  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("category", category)
    .order("name");

  if (error) return res.status(500).json(error);

  res.json(data);
});

// Admin – Get all exercises
app.get("/admin/exercises", requireLogin, async (req, res) => {
  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .order("category")
    .order("name");

  if (error) return res.status(500).json(error);

  res.json(data);
});

// Admin – Add exercise
app.post("/admin/exercises", requireLogin, async (req, res) => {
  const { name, category } = req.body;

  if (!name || !category) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const { error } = await supabase
    .from("exercises")
    .insert([{ name, category }]);

  if (error) return res.status(500).json(error);

  res.json({ success: true });
});

// ================================
// Start Server
// ================================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
