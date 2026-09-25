const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function page(reduced = false) {
  const elements = new Map();
  const events = new Map();
  const timers = new Map();
  let nextTimer = 0;
  const get = id => {
    if (!elements.has(id)) elements.set(id, {
      style: {}, value: id === 'frequency' ? '10' : '0', checked: false,
      disabled: false, textContent: '', listeners: {},
      addEventListener(event, callback) { this.listeners[event] = callback; },
      fire(event) { this.listeners[event]?.({ target: this }); },
    });
    return elements.get(id);
  };
  const motion = { matches: reduced, addEventListener(event, fn) { this.change = fn; } };
  const document = { hidden: false, getElementById: get,
    addEventListener(event, fn) { events.set(event, fn); } };
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const file = path.join(__dirname, '../app.js');
  const script = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : html.match(/<script>([\s\S]*?)<\/script>/)[1];
  vm.runInNewContext(script, { document, window: { matchMedia: () => motion },
    setInterval(fn, delay) { timers.set(++nextTimer, { fn, delay }); return nextTimer; },
    clearInterval(id) { timers.delete(id); } });
  return { get, timers, motion, document, events,
    start() { get('acknowledge').checked = true; get('acknowledge').fire('change'); get('start-btn').fire('click'); } };
}

test('page remains still until the visitor explicitly starts it', () => {
  const p = page();
  assert.equal(p.timers.size, 0, 'opening the page must not start flashing');
  p.get('start-btn').fire('click');
  assert.equal(p.timers.size, 0, 'start requires acknowledgement');
});
test('start, frequency changes and stop do not leave duplicate timers', () => {
  const p = page(); p.start();
  assert.equal(p.timers.size, 1);
  assert.equal([...p.timers.values()][0].delay, 50);
  p.get('frequency').value = '40'; p.get('frequency').fire('change');
  assert.equal(p.timers.size, 0, 'changing mode stops playback');
  p.start(); assert.equal([...p.timers.values()][0].delay, 12.5);
  p.get('stop-btn').fire('click'); assert.equal(p.timers.size, 0);
});
test('Escape stops playback', () => {
  const p = page(); p.start(); p.events.get('keydown')({ key: 'Escape' });
  assert.equal(p.timers.size, 0);
});
test('hiding the page stops it; returning does not restart it', () => {
  const p = page(); p.start(); p.document.hidden = true;
  p.events.get('visibilitychange')(); p.document.hidden = false;
  p.events.get('visibilitychange')(); assert.equal(p.timers.size, 0);
});
test('reduced motion blocks playback and stops an active session', () => {
  const p = page(true); p.start(); assert.equal(p.timers.size, 0);
  const active = page(); active.start(); active.motion.matches = true;
  active.motion.change(); assert.equal(active.timers.size, 0);
});
test('withdrawing acknowledgement stops playback', () => {
  const p = page(); p.start(); p.get('acknowledge').checked = false;
  p.get('acknowledge').fire('change'); assert.equal(p.timers.size, 0);
});
