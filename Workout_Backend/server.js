require("dotenv").config();

const express = require("express");
const session = require("express-session");
const path = require("path");
const { Pool } = require("pg");

const app = express();

/* --------------------------
   BASIC MIDDLEWARE
---------------------------*/

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "workout-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true only in production HTTPS
      httpOnly: true
    }
  })
);

/* --------------------------
   DATABASE CONNECTION
---------------------------*/

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

/* --------------------------
   SERVE FRONTEND
   (Workout App is beside Workout_Backend)
---------------------------*/

const frontendPath = path.join(__dirname, "..", "Workout App");
console.log("Serving frontend from:", frontendPath);

app.use(express.static(frontendPath));

/* --------------------------
   HARDCODED USERS
---------------------------*/

const allowedUsers = ["Ethan", "Hubert", "Liron"];

/* --------------------------
   AUTH MIDDLEWARE
---------------------------*/

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login.html");
  }
  next();
}

/* --------------------------
   LOGIN
---------------------------*/

app.post("/login", (req, res) => {
  const { username } = req.body;

  if (allowedUsers.includes(username)) {
    req.session.user = username;
    return res.redirect("/index.html");
  }

  return res.status(401).send("Invalid username");
});

/* --------------------------
   LOGOUT
---------------------------*/

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login.html");
  });
});

/* --------------------------
   GET CURRENT USER
---------------------------*/

app.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }

  res.json({ user: req.session.user });
});

/* --------------------------
   GET WORKOUTS (PER USER)
---------------------------*/

app.get("/workouts", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM workouts
       WHERE username = $1
       ORDER BY date DESC`,
      [req.session.user]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

/* --------------------------
   ADD WORKOUT (PER USER)
---------------------------*/

app.post("/workouts", requireAuth, async (req, res) => {
  try {
    const { date, day, exercise, reps, weight } = req.body;

    await pool.query(
      `INSERT INTO workouts (date, day, exercise, reps, weight, username)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [date, day, exercise, reps, weight, req.session.user]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Insert failed" });
  }
});

/* --------------------------
   UPDATE WORKOUT (OWN ONLY)
---------------------------*/

app.put("/workouts/:id", requireAuth, async (req, res) => {
  try {
    const { date, reps, weight } = req.body;

    await pool.query(
      `UPDATE workouts
       SET date=$1, reps=$2, weight=$3
       WHERE id=$4 AND username=$5`,
      [date, reps, weight, req.params.id, req.session.user]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

/* --------------------------
   GET EXERCISES BY DAY
---------------------------*/

app.get("/exercises/:day", requireAuth, async (req, res) => {
  try {
    const { day } = req.params;

    const result = await pool.query(
      "SELECT name FROM exercises WHERE day = $1 ORDER BY name",
      [day]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Exercise fetch failed" });
  }
});

/* --------------------------
   DELETE WORKOUT (OWN ONLY)
---------------------------*/

app.delete("/workouts/:id", requireAuth, async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM workouts
       WHERE id=$1 AND username=$2`,
      [req.params.id, req.session.user]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

/* --------------------------
   START SERVER
---------------------------*/

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});