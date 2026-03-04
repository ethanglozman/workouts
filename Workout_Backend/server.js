const express = require("express");
const session = require("express-session");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

/* =============================
   SUPABASE CLIENT
============================= */

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

/* =============================
   MIDDLEWARE
============================= */

app.use(express.json());

app.use(
  session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: false
  })
);

/* =============================
   SERVE FRONTEND
============================= */

const frontendPath = path.join(__dirname, "Workout App");
console.log("Serving frontend from:", frontendPath);
app.use(express.static(frontendPath));

/* =============================
   AUTH ROUTES
============================= */

// Simple login (stores username in session)
app.post("/login", (req, res) => {
  if (!req.body || !req.body.username) {
    return res.status(400).json({ error: "Username required" });
  }

  const username = req.body.username;

  req.session.user = username;
  res.json({ success: true });
});

app.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }

  res.json({ user: req.session.user });
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

/* =============================
   WORKOUT ROUTES
============================= */

// Get workouts for logged-in user
app.get("/workouts", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("username", req.session.user)
    .order("date", { ascending: false });

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// Add workout
app.post("/workouts", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const { date, day, exercise, reps, weight } = req.body;

  const { data, error } = await supabase
    .from("workouts")
    .insert([
      {
        date,
        day,
        exercise,
        reps,
        weight,
        username: req.session.user
      }
    ]);

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// Update workout
app.put("/workouts/:id", async (req, res) => {
  const { id } = req.params;
  const { date, reps, weight } = req.body;

  const { data, error } = await supabase
    .from("workouts")
    .update({ date, reps, weight })
    .eq("id", id);

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// Delete workout
app.delete("/workouts/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("workouts")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error });

  res.json({ success: true });
});

/* =============================
   EXERCISES ROUTE
============================= */

app.get("/exercises/:day", async (req, res) => {
  const { day } = req.params;

  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("day", day);

  if (error) return res.status(500).json({ error });

  res.json(data);
});

/* =============================
   START SERVER
============================= */

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
