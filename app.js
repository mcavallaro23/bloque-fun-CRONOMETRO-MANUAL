// app.js v1.0.1

let startTime = 0;
let lastLapTime = 0;
let impulseCount = 0;
let totalImpulses = 3;
let timerInterval = null;
let running = false;

const timerDisplay = document.getElementById("timer");
const pulseBtn = document.getElementById("pulseBtn");
const resultsTable = document.getElementById("resultsTable");
const sensorInput = document.getElementById("sensorCount");

function formatTime(ms) {
  const totalCentiseconds = Math.floor(ms / 10);
  const cs = totalCentiseconds % 100;
  const totalSeconds = Math.floor(totalCentiseconds / 100);
  const s = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const m = totalMinutes % 60;
  const h = Math.floor(totalMinutes / 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

function updateTimer() {
  if (!running) return;
  const now = performance.now();
  const elapsed = now - startTime;
  timerDisplay.textContent = formatTime(elapsed);
  timerInterval = requestAnimationFrame(updateTimer);
}

function addSplitLap(now) {
  const totalElapsed = now - startTime;
  const lapTime = totalElapsed - lastLapTime;
  lastLapTime = totalElapsed;

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${impulseCount}</td>
    <td>${formatTime(totalElapsed)}</td>
    <td>${formatTime(lapTime)}</td>
  `;
  resultsTable.appendChild(row);
}

pulseBtn.addEventListener("click", () => {
  const inputVal = parseInt(sensorInput.value);
  if (isNaN(inputVal) || inputVal < 2 || inputVal > 5) {
    alert("Seleccioná entre 2 y 5 fotocélulas.");
    return;
  }

  totalImpulses = inputVal;

  if (!running) {
    // Primer impulso: arrancar cronómetro
    startTime = performance.now();
    lastLapTime = 0;
    impulseCount = 1;
    running = true;
    resultsTable.innerHTML = "";
    updateTimer();
  } else {
    impulseCount++;
    if (impulseCount <= totalImpulses) {
      addSplitLap(performance.now());
    }
    if (impulseCount === totalImpulses) {
      cancelAnimationFrame(timerInterval);
      timerDisplay.textContent = formatTime(performance.now() - startTime);
      running = false;
    }
  }
});
