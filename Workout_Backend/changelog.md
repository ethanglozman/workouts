# Changelog

All notable changes to the Workout Tracker app will be documented here.

---

## [0.7.0] - 2026-03-13
### Added
- Add Exercise page (`add-exercise.html`) — add new exercises to the DB from the app, no SQL needed
- New exercises: Super Incline Machine Press, Super Decline Machine Press, Top Down Cable Fly, Decline Barbell Bench Press, Rear Deltoid Fly, Machine Bicep Curl

### Changed
- Main page only shows today's sets — removed last session panel to reduce clutter
- History page rows now render cleanly on mobile (exercise name as full-width header, stats in 2-col grid below)
- Exercise names fixed to use DOM rendering instead of innerHTML to prevent display issues

### Fixed
- Add exercise route validation was checking wrong field name
- History exercise names rendering with encoding artifacts

---

## [0.6.0] - 2026-03-05
### Added
- History page (`history.html`) with filters by day, exercise, and date range
- Results grouped by session date with colour-coded Push/Pull/Legs/Core tags
- Summary bar showing total sets, sessions, and volume for active filter
- Mini exercise history panel on main page — selecting an exercise shows your last 10 sets of it
- Exercise history clears automatically when switching days

### Changed
- Main page table now shows only today's sets instead of all workouts
- On load with no sets today, shows last 5 sets as a read-only reference
- Changing the date input updates the table to show sets from that date
- Export to Excel now pulls from cache instead of scraping the DOM

---

## [0.5.0] - 2026-03-05
### Added
- Notes field on workout form (textarea) and inline editable in the table
- Notes saved and updated to database
- Export to Excel (📥) button — downloads full workout history as `.xlsx`
- Last session panel — when a day is selected, shows all sets from the most recent session of that day
- Decimal support for weight field (step 0.5)

### Changed
- Reps and weight fields now clear after adding a set
- Weight column in Supabase should be altered to `float8` to support decimals

### Database
- Run: `ALTER TABLE workouts ADD COLUMN IF NOT EXISTS notes text;`
- Run: `ALTER TABLE workouts ALTER COLUMN weight TYPE float8 USING weight::float8;`

---

## [0.4.0] - 2026-03-05
### Added
- Dedicated History link (📅) in header
- Bug report button (🐛) — prompts "Call Ethan?" and dials 647-929-0774
- George, Sebastian, and Jacob added to user list

### Changed
- User list sorted alphabetically: Ethan, George, Hubert, Igor, Jacob, Liron, Matvei, Sebastian

---

## [0.3.0] - 2026-03-05
### Added
- Mobile-first redesign — inputs, buttons, and text scaled for phone use
- Workout table switches to card-per-row layout on screens under 600px
- Each card shows field labels (Date, Day, Exercise, etc.)
- Logout button in header
- Save button (green) and Delete button (red) for visual clarity

### Changed
- Login page username input replaced with dropdown selector
- Users: Ethan, Hubert, Igor, Liron, Matvei

---

## [0.2.0] - 2026-03-05
### Added
- PUT `/workouts/:id` endpoint — update reps, weight, date per row
- DELETE `/workouts/:id` endpoint — delete a workout entry
- Error handling in `loadExercises()` — shows status in dropdown instead of crashing
- Error handling in `loadWorkouts()` — guards against non-array responses

### Fixed
- `exercises` table queried by wrong column name (`category`) — corrected to `day`
- `workouts` table ordered by `created_at` which didn't exist — corrected to `date`
- Workout insert was missing `date` and `day` fields
- Admin exercise insert was sending `category` instead of `day`

---

## [0.1.0] - 2026-03-05
### Added
- Initial deployment on Render
- Login page with username-based session auth
- Main workout logging page (`index.html`)
- Exercise dropdown populated from Supabase by day category (Push/Pull/Legs/Core)
- Add, view workouts tied to logged-in user
- Exercise manager admin page (`exercises.html`)
- SQL insert for full exercise list (Push/Pull/Legs/Core) based on McMaster DBAC equipment
- Duplicate exercises removed from database (kept IDs 18–62, removed legacy IDs 1–17)

### Fixed
- `login.html` and `exercises.html` referencing `styles.css` instead of `style.css`
- Missing `.card`, `.input`, `.btn`, `.error`, `.centered-page` CSS classes added
- Frontend path on Render corrected from `../workout_app` to `Workout App` (subfolder with space)
- Root route `GET /` added to serve `login.html` (was returning 404)
- Missing `SUPABASE_SERVICE_ROLE_KEY` environment variable on Render causing startup crash
