async function checkLogin() {
  const res = await fetch("/me");
  if (!res.ok) window.location.href = "/login.html";
}
checkLogin();

async function logout() {
  await fetch("/logout", { method: "POST" });
  window.location.href = "/login.html";
}

const dateInput = document.getElementById("dateInput");
const daySelect = document.getElementById("daySelect");
const exerciseSelect = document.getElementById("exerciseSelect");
const table = document.getElementById("workoutTable");
const notesInput = document.getElementById("notes");

const today = new Date().toISOString().slice(0, 10);
dateInput.value = today;

// Track which date we're showing in the live table
let activeDate = today;

daySelect.addEventListener("change", () => {
  loadExercises();
  loadLastSession();
  clearExerciseHistory();
});

exerciseSelect.addEventListener("change", () => {
  loadExerciseHistory();
});

dateInput.addEventListener("change", () => {
  activeDate = dateInput.value;
  loadCurrentTable();
});

// ===== Exercises dropdown =====
async function loadExercises() {
  const day = daySelect.value;
  if (!day) return;
  exerciseSelect.innerHTML = '<option value="">Loading...</option>';
  try {
    const res = await fetch(`/exercises/${day}`);
    if (!res.ok) { exerciseSelect.innerHTML = '<option value="">Failed to load</option>'; return; }
    const data = await res.json();
    exerciseSelect.innerHTML = '<option value="">Select Exercise</option>';
    if (data.length === 0) { exerciseSelect.innerHTML = `<option value="">No exercises for ${day}</option>`; return; }
    data.forEach(e => {
      const opt = document.createElement("option");
      opt.value = e.name;
      opt.textContent = e.name;
      exerciseSelect.appendChild(opt);
    });
  } catch (err) {
    exerciseSelect.innerHTML = '<option value="">Error loading</option>';
  }
}

// ===== Mini exercise history =====
let allWorkoutsCache = [];

async function ensureCache() {
  if (allWorkoutsCache.length === 0) {
    const res = await fetch("/workouts");
    if (!res.ok) return;
    allWorkoutsCache = await res.json();
  }
}

async function loadExerciseHistory() {
  const exercise = exerciseSelect.value;
  const wrap = document.getElementById("exerciseHistoryWrap");
  const list = document.getElementById("exerciseHistoryList");

  if (!exercise) { wrap.style.display = "none"; return; }

  await ensureCache();

  const history = allWorkoutsCache.filter(w => w.exercise === exercise).slice(0, 10);
  if (history.length === 0) { wrap.style.display = "none"; return; }

  list.innerHTML = "";
  history.forEach(w => {
    const vol = (parseFloat(w.reps) * parseFloat(w.weight)).toFixed(1);
    const div = document.createElement("div");
    div.className = "mini-history-row";
    div.innerHTML = `
      <span class="mini-date">${w.date.slice(0,10)}</span>
      <span>${w.reps} reps</span>
      <span>@ ${w.weight} lbs</span>
      <span class="mini-vol">${vol} vol</span>
      ${w.notes ? `<span class="mini-note">💬 ${w.notes}</span>` : ''}
    `;
    list.appendChild(div);
  });

  wrap.style.display = "block";
}

function clearExerciseHistory() {
  document.getElementById("exerciseHistoryWrap").style.display = "none";
  document.getElementById("exerciseHistoryList").innerHTML = "";
  allWorkoutsCache = [];
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
    wrap.style.display = "none";
  }
}

// ===== Current table: today's sets + last 5 on first load =====
async function loadCurrentTable() {
  await ensureCache();

  const todaySets = allWorkoutsCache.filter(w => w.date.slice(0,10) === activeDate);

  // If no sets today yet, show last 5 across all days as a reference
  const toShow = todaySets.length > 0
    ? todaySets
    : allWorkoutsCache.slice(0, 5);

  const sectionLabel = document.querySelector(".section-label:last-of-type");
  if (sectionLabel) {
    sectionLabel.textContent = todaySets.length > 0
      ? `📝 ${activeDate === today ? "Today's" : dateInput.value} sets`
      : "📝 Last 5 sets";
  }

  renderTable(toShow, todaySets.length > 0);
}

function renderTable(data, showActions) {
  table.innerHTML = "";

  if (data.length === 0) {
    table.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#bbb;padding:24px;">No sets yet — add your first one above!</td></tr>`;
    return;
  }

  data.forEach(w => {
    const tr = document.createElement("tr");
    const volume = (parseFloat(w.reps) * parseFloat(w.weight)).toFixed(1);

    if (showActions) {
      tr.innerHTML = `
        <td data-label="Exercise">${w.exercise}</td>
        <td data-label="Reps"><input type="number" value="${w.reps}" step="1"></td>
        <td data-label="Wt"><input type="number" value="${w.weight}" step="0.5"></td>
        <td data-label="Vol">${volume}</td>
        <td data-label="Notes"><input type="text" value="${w.notes || ''}" placeholder="notes"></td>
        <td class="actions-cell"><div class="actions">
          <button class="save-btn" onclick="updateWorkout(${w.id}, this)">Save</button>
          <button class="delete-btn" onclick="deleteWorkout(${w.id})">Del</button>
        </div></td>
      `;
    } else {
      // Read-only last 5
      tr.innerHTML = `
        <td data-label="Exercise">${w.exercise}</td>
        <td data-label="Reps">${w.reps}</td>
        <td data-label="Wt">${w.weight}</td>
        <td data-label="Vol">${volume}</td>
        <td data-label="Notes">${w.notes || ''}</td>
        <td></td>
      `;
      tr.style.opacity = "0.6";
    }

    table.appendChild(tr);
  });
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

  document.getElementById("reps").value = "";
  document.getElementById("weight").value = "";
  notesInput.value = "";

  allWorkoutsCache = [];
  await ensureCache();
  loadCurrentTable();
  loadLastSession();
  loadExerciseHistory();
}

// ===== Update workout =====
async function updateWorkout(id, btn) {
  const row = btn.closest("tr");
  const reps = row.children[1].querySelector("input").value;
  const weight = row.children[2].querySelector("input").value;
  const notes = row.children[4].querySelector("input").value;

  await fetch(`/workouts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reps, weight, notes })
  });

  allWorkoutsCache = [];
  await ensureCache();
  loadCurrentTable();
}

// ===== Delete workout =====
async function deleteWorkout(id) {
  await fetch(`/workouts/${id}`, { method: "DELETE" });
  allWorkoutsCache = [];
  await ensureCache();
  loadCurrentTable();
  loadLastSession();
}

// ===== Export to Excel =====
function exportToExcel() {
  const rows = [["Date", "Day", "Exercise", "Reps", "Weight", "Volume", "Notes"]];
  allWorkoutsCache.forEach(w => {
    const vol = (parseFloat(w.reps) * parseFloat(w.weight)).toFixed(1);
    rows.push([w.date.slice(0,10), w.day, w.exercise, w.reps, w.weight, vol, w.notes || ""]);
  });
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Workouts");
  XLSX.writeFile(wb, "workouts.xlsx");
}

// ===== Init =====
ensureCache().then(() => loadCurrentTable());
