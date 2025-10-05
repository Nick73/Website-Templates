/*
SPDX-License-Identifier: MPL-2.0
Copyright (c) 2025 Nick Chiaravalle

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/

const form = document.getElementById('searchForm');
const q    = document.getElementById('q');
const inline = document.getElementById('inlineResult');
const chips  = document.getElementById('chips');
const modeBtn = document.getElementById('modeBtn');

// -------- Theme toggle --------
const ROOT = document.documentElement;
function setTheme(t){ ROOT.setAttribute('data-theme', t); localStorage.setItem('lumen_theme', t); }
(function initTheme(){
  setTheme(localStorage.getItem('lumen_theme') || 'dark');
})();
modeBtn.addEventListener('click', () => {
  setTheme(ROOT.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// -------- Provider shortcuts --------
// Map prefixes to search URLs; default = DuckDuckGo (good privacy, simple)
const providers = {
  'g':   q => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
  'ddg': q => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
  'b':   q => `https://www.bing.com/search?q=${encodeURIComponent(q)}`,
  'w':   q => `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(q)}`,
  'yt':  q => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
  'img': q => `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q)}`,
  'maps':q => `https://www.google.com/maps/search/${encodeURIComponent(q)}`
};
function routeQuery(raw){
  const m = raw.match(/^(\w+):\s*(.+)$/); // e.g., "g: rust lifetimes"
  if (m && providers[m[1]]) return providers[m[1]](m[2]);
  return providers['ddg'](raw);
}

// -------- Tiny inline math (safe-ish) --------
function safeMath(expr){
  // Only allow numbers, + - * / % . ( ) and spaces
  if (!/^[\d\+\-\*\/%\.\s\(\)]+$/.test(expr)) return null;
  try {
    // eslint-disable-next-line no-new-func
    const val = Function(`"use strict"; return (${expr});`)();
    if (typeof val === 'number' && Number.isFinite(val)) return val;
  } catch {}
  return null;
}
function updateInline(){
  const v = q.value.trim();
  // Show chips when input empty or ends with '#'
  if (v === '' || v.endsWith('#')) {
    inline.classList.add('hidden');
    chips.classList.remove('hidden');
    return;
  } else {
    chips.classList.add('hidden');
  }
  // Show math result if expression
  const val = safeMath(v);
  if (val !== null) {
    inline.textContent = `= ${val}`;
    inline.classList.remove('hidden');
  } else {
    inline.classList.add('hidden');
  }
}
q.addEventListener('input', updateInline);
updateInline();

// Accept inline result into the box with Tab
q.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && !inline.classList.contains('hidden')) {
    e.preventDefault();
    const t = inline.textContent.replace(/^=\s*/, '');
    q.value = t;
    updateInline();
  }
});

// Chips insertion
chips.addEventListener('click', (e) => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  const ins = btn.getAttribute('data-insert');
  const v = q.value.trim().replace(/#$/, '');
  q.value = (v ? v + ' ' : '') + ins;
  q.focus();
  updateInline();
});

// Keyboard helpers: focus with '/', clear with Esc
window.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement !== q) {
    e.preventDefault();
    q.focus();
  }
  if (e.key === 'Escape') {
    q.value = '';
    updateInline();
  }
});

// Submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const raw = q.value.trim();
  if (!raw) { q.focus(); return; }
  const url = routeQuery(raw);
  // Navigate in the same tab for app-like feel
  window.location.href = url;
});