async function checkLogin() {
  const res = await fetch("/me");
  if (!res.ok) {
    window.location.href = "/login.html";
  }
}
checkLogin();

async function logout() {
  await fetch("/logout", { method: "POST" });
  window.location.href = "/login.html";
}

const API_URL = "";

const dateInput = document.getElementById("dateInput");
const daySelect = document.getElementById("daySelect");
const exerciseSelect = document.getElementById("exerciseSelect");
const table = document.getElementById("workoutTable");
const notesInput = document.getElementById("notes");

dateInput.value = new Date().toISOString().slice(0, 10);

daySelect.addEventListener("change", () => {
  loadExercises();
  loadLastSession();
});

// ===== Exercises dropdown =====
async function loadExercises() {
  const day = daySelect.value;
  if (!day) return;

  exerciseSelect.innerHTML = '<option value="">Loading...</option>';

  try {
    const res = await fetch(`/exercises/${day}`);
    if (!res.ok) {
      exerciseSelect.innerHTML = '<option value="">Failed to load</option>';
      console.error("Failed to load exercises:", res.status, await res.text());
      return;
    }

    const data = await res.json();
    exerciseSelect.innerHTML = '<option value="">Select Exercise</option>';

    if (data.length === 0) {
      exerciseSelect.innerHTML = `<option value="">No exercises found for ${day}</option>`;
      return;
    }

    data.forEach(e => {
      const opt = document.createElement("option");
      opt.value = e.name;
      opt.textContent = e.name;
      exerciseSelect.appendChild(opt);
    });
  } catch (err) {
    console.error("Error loading exercises:", err);
    exerciseSelect.innerHTML = '<option value="">Error loading</option>';
  }
}

// ===== Last session for selected day =====
async function loadLastSession() {
  const day = daySelect.value;
  const wrap = document.getElementById("lastSessionWrap");
  const tbody = document.getElementById("lastSessionTable");
  const label = document.getElementById("lastSessionDay");

  if (!day) { wrap.style.display = "none"; return; }

  try {
    const res = await fetch(`/workouts/last-session/${day}`);
    if (!res.ok) { wrap.style.display = "none"; return; }

    const data = await res.json();
    if (!data || data.length === 0) { wrap.style.display = "none"; return; }

    label.textContent = day;
    tbody.innerHTML = "";

    data.forEach(w => {
      const vol = (parseFloat(w.reps) * parseFloat(w.weight)).toFixed(1);
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td data-label="Exercise">${w.exercise}</td>
        <td data-label="Reps">${w.reps}</td>
        <td data-label="Wt">${w.weight}</td>
        <td data-label="Vol">${vol}</td>
        <td data-label="Notes">${w.notes || ''}</td>
      `;
      tbody.appendChild(tr);
    });

    wrap.style.display = "block";
  } catch (err) {
    console.error("Error loading last session:", err);
    wrap.style.display = "none";
  }
}

// ===== Add workout =====
async function addWorkout() {
  const workout = {
    date: dateInput.value,
    day: daySelect.value,
    exercise: exerciseSelect.value,
    reps: document.getElementById("reps").value,
    weight: document.getElementById("weight").value,
    notes: notesInput.value.trim()
  };

  if (!workout.day || !workout.exercise || !workout.reps || !workout.weight) {
    alert("Please fill in day, exercise, reps and weight.");
    return;
  }

  await fetch(`/workouts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workout)
  });

  // Clear inputs
  document.getElementById("reps").value = "";
  document.getElementById("weight").value = "";
  notesInput.value = "";

  loadWorkouts();
  loadLastSession();
}

// ===== Load all workouts =====
async function loadWorkouts() {
  const res = await fetch(`/workouts`);

  if (!res.ok) {
    console.error("Failed to load workouts:", res.status, await res.text());
    return;
  }

  const data = await res.json();
  if (!Array.isArray(data)) {
    console.error("Unexpected workouts response:", data);
    return;
  }

  table.innerHTML = "";

  data.forEach(w => {
    const tr = document.createElement("tr");
    const volume = (parseFloat(w.reps) * parseFloat(w.weight)).toFixed(1);

    tr.innerHTML = `
      <td data-label="Date"><input type="date" value="${w.date.slice(0,10)}"></td>
      <td data-label="Day">${w.day}</td>
      <td data-label="Exercise">${w.exercise}</td>
      <td data-label="Reps"><input type="number" value="${w.reps}" step="1"></td>
      <td data-label="Wt"><input type="number" value="${w.weight}" step="0.5"></td>
      <td data-label="Vol">${volume}</td>
      <td data-label="Notes"><input type="text" value="${w.notes || ''}" placeholder="notes"></td>
      <td class="actions-cell"><div class="actions">
        <button class="save-btn" onclick="updateWorkout(${w.id}, this)">Save</button>
        <button class="delete-btn" onclick="deleteWorkout(${w.id})">Delete</button>
      </div></td>
    `;

    table.appendChild(tr);
  });
}

// ===== Update workout =====
async function updateWorkout(id, btn) {
  const row = btn.closest("tr");
  const date = row.children[0].querySelector("input").value;
  const reps = row.children[3].querySelector("input").value;
  const weight = row.children[4].querySelector("input").value;
  const notes = row.children[6].querySelector("input").value;

  await fetch(`/workouts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, reps, weight, notes })
  });

  loadWorkouts();
  loadLastSession();
}

// ===== Delete workout =====
async function deleteWorkout(id) {
  await fetch(`/workouts/${id}`, { method: "DELETE" });
  loadWorkouts();
  loadLastSession();
}

// ===== Export to Excel =====
function exportToExcel() {
  const rows = [["Date", "Day", "Exercise", "Reps", "Weight", "Volume", "Notes"]];

  document.querySelectorAll("#workoutTable tr").forEach(tr => {
    const cells = tr.children;
    const date = cells[0].querySelector("input")?.value || "";
    const day = cells[1].textContent.trim();
    const exercise = cells[2].textContent.trim();
    const reps = parseFloat(cells[3].querySelector("input")?.value || 0);
    const weight = parseFloat(cells[4].querySelector("input")?.value || 0);
    const volume = (reps * weight).toFixed(1);
    const notes = cells[6].querySelector("input")?.value || "";
    rows.push([date, day, exercise, reps, weight, volume, notes]);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Workouts");
  XLSX.writeFile(wb, "workouts.xlsx");
}

loadWorkouts();
