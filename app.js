'use strict';
const light = document.getElementById('flicker-box');
const frequency = document.getElementById('frequency');
const warmth = document.getElementById('mode-slider');
const acknowledge = document.getElementById('acknowledge');
const start = document.getElementById('start-btn');
const stop = document.getElementById('stop-btn');
const status = document.getElementById('status');
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
let timer = null;
let bright = false;

function color(high) {
  const factor = Number(warmth.value) / 100;
  const from = high ? [255, 255, 255] : [240, 240, 240];
  const to = high ? [255, 213, 128] : [255, 171, 77];
  return `rgb(${from.map((v, i) => Math.round(v + (to[i] - v) * factor)).join(', ')})`;
}

function updateControls() {
  start.disabled = timer !== null || !acknowledge.checked || motion.matches;
  stop.disabled = timer === null;
}

function stopFlicker() {
  if (timer !== null) clearInterval(timer);
  timer = null;
  light.style.backgroundColor = '#25312d';
  status.textContent = motion.matches
    ? 'Stopped. Playback is disabled by your reduced-motion preference.'
    : 'Stopped. The light stays still until you press Start.';
  updateControls();
}

start.addEventListener('click', () => {
  const hz = Number(frequency.value);
  if (timer !== null || !acknowledge.checked || motion.matches || document.hidden || ![10, 40].includes(hz)) return;
  bright = false;
  light.style.backgroundColor = color(bright);
  timer = setInterval(() => {
    bright = !bright;
    light.style.backgroundColor = color(bright);
  }, 1000 / (hz * 2));
  status.textContent = `Running at a requested ${hz} Hz. Press Stop or Escape to stop.`;
  updateControls();
});
stop.addEventListener('click', stopFlicker);
frequency.addEventListener('change', stopFlicker);
acknowledge.addEventListener('change', () => {
  if (!acknowledge.checked) stopFlicker();
  else updateControls();
});
motion.addEventListener('change', stopFlicker);
document.addEventListener('keydown', event => { if (event.key === 'Escape') stopFlicker(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) stopFlicker(); });
stopFlicker();
