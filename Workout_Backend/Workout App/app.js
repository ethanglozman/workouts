async function checkLogin() {
  const res = await fetch("/me");
  if (!res.ok) {
    window.location.href = "/login.html";
  }
}

checkLogin();

const API_URL = "";

const dateInput = document.getElementById("dateInput");
const daySelect = document.getElementById("daySelect");
const exerciseSelect = document.getElementById("exerciseSelect");
const table = document.getElementById("workoutTable");

dateInput.value = new Date().toISOString().slice(0, 10);

daySelect.addEventListener("change", loadExercises);

async function loadExercises() {
  const day = daySelect.value;
  if (!day) return;

  exerciseSelect.innerHTML = '<option value="">Loading...</option>';

  try {
    const res = await fetch(`/exercises/${day}`);

    if (!res.ok) {
      const text = await res.text();
      console.error("Failed to load exercises:", res.status, text);
      exerciseSelect.innerHTML = '<option value="">Failed to load</option>';
      return;
    }

    const data = await res.json();
    exerciseSelect.innerHTML = '<option value="">Select Exercise</option>';

    if (data.length === 0) {
      exerciseSelect.innerHTML = '<option value="">No exercises found for ' + day + '</option>';
      return;
    }

    data.forEach(e => {
      const option = document.createElement("option");
      option.value = e.name;
      option.textContent = e.name;
      exerciseSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading exercises:", err);
    exerciseSelect.innerHTML = '<option value="">Error loading</option>';
  }
}

async function addWorkout() {
  const workout = {
    date: dateInput.value,
    day: daySelect.value,
    exercise: exerciseSelect.value,
    reps: document.getElementById("reps").value,
    weight: document.getElementById("weight").value
  };

  await fetch(`/workouts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workout)
  });

  loadWorkouts();
}

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
    const volume = w.reps * w.weight;

    tr.innerHTML = `
      <td><input type="date" value="${w.date.slice(0,10)}"></td>
      <td>${w.day}</td>
      <td>${w.exercise}</td>
      <td><input type="number" value="${w.reps}"></td>
      <td><input type="number" value="${w.weight}"></td>
      <td>${volume}</td>
      <td class="actions">
        <button onclick="updateWorkout(${w.id}, this)">Save</button>
        <button onclick="deleteWorkout(${w.id})">Delete</button>
      </td>
    `;

    table.appendChild(tr);
  });
}

async function updateWorkout(id, btn) {
  const row = btn.closest("tr");
  const date = row.children[0].querySelector("input").value;
  const reps = row.children[3].querySelector("input").value;
  const weight = row.children[4].querySelector("input").value;

  await fetch(`/workouts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, reps, weight })
  });

  loadWorkouts();
}

async function deleteWorkout(id) {
  await fetch(`/workouts/${id}`, { method: "DELETE" });
  loadWorkouts();
}

loadWorkouts();
