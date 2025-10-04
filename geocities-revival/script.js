/*
SPDX-License-Identifier: MPL-2.0
Copyright (c) 2025 Nick Chiaravalle

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/

// Fake hit counter (per page, stored in localStorage)
(function(){
  const key = 'geo_hits_' + location.pathname;
  const n = +localStorage.getItem(key) || 0;
  localStorage.setItem(key, n + 1);
  const el = document.getElementById('hitCounter');
  if (el) el.textContent = String(n + 1).padStart(6, '0');
})();

// Tiny “Under Construction” flasher
(function(){
  const uc = document.querySelectorAll('.uc');
  uc.forEach(node => {
    setInterval(() => node.classList.toggle('blink'), 600);
  });
})();

// Guestbook logic (only on guestbook.html)
(function(){
  const form = document.getElementById('guestForm');
  const list = document.getElementById('guestList');
  if (!form || !list) return;

  const KEY = 'geocities_guestbook_entries';
  const read = () => JSON.parse(localStorage.getItem(KEY) || '[]');
  const write = (arr) => localStorage.setItem(KEY, JSON.stringify(arr.slice(0, 200)));

  function render(){
    const entries = read();
    list.innerHTML = '';
    entries.forEach(e => {
      const li = document.createElement('div');
      li.className = 'guest-entry';
      li.innerHTML = `
        <div class="name">${escapeHTML(e.name)} <span style="color:#008800">(${e.date})</span></div>
        <div class="msg">${escapeHTML(e.msg)}</div>
      `;
      list.prepend(li);
    });
  }

  function escapeHTML(s){
    return String(s).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim() || 'Anonymous';
    const msg  = form.message.value.trim();
    if (!msg) return;
    const entries = read();
    entries.push({ name, msg, date: new Date().toLocaleString() });
    write(entries);
    form.reset();
    render();
  });

  render();
})();