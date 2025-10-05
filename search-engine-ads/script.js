/*
SPDX-License-Identifier: MPL-2.0
Copyright (c) 2025 Nick Chiaravalle

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/

// ====== Search routing (keeps it simple) ======
const form = document.getElementById('searchForm');
const q    = document.getElementById('q');
const eng  = document.getElementById('engine');

const providers = {
  ddg:   (s) => `https://duckduckgo.com/?q=${encodeURIComponent(s)}`,
  images:(s) => `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(s)}`,
  news:  (s) => `https://news.google.com/search?q=${encodeURIComponent(s)}`,
  wiki:  (s) => `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(s)}`,
  maps:  (s) => `https://www.google.com/maps/search/${encodeURIComponent(s)}`
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const term = q.value.trim();
  if (!term) { q.focus(); return; }
  const url = (providers[eng.value] || providers.ddg)(term);
  window.location.href = url;
});

// Keyboard sugar: '/' to focus, 'Esc' to clear
window.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement !== q) { e.preventDefault(); q.focus(); }
  if (e.key === 'Escape') { q.value = ''; }
});

// ====== Faux Weather (local demo) ======
// This keeps it API-free for the template. You can replace with a real API later.
const locForm = document.getElementById('locForm');
const wCity   = document.getElementById('wCity');
const wTemp   = document.getElementById('wTemp');
const wCond   = document.getElementById('wCond');
const wExtra  = document.getElementById('wExtra');
const wHours  = document.getElementById('wHours');

function seedWeather(city){
  const conds = ['Sunny','Partly Cloudy','Cloudy','Light Rain','Thunderstorms','Windy','Fog'];
  const hi = 66 + Math.floor(Math.random()*20);
  const lo = hi - (8 + Math.floor(Math.random()*6));
  const now = lo + Math.floor((hi-lo)*0.8);
  wCity.textContent = city;
  wTemp.textContent = `${now}°`;
  wCond.textContent = conds[Math.floor(Math.random()*conds.length)];
  wExtra.textContent = `H:${hi}° L:${lo}° • NW ${3+Math.floor(Math.random()*8)} mph`;
  wHours.innerHTML = '';
  for (let i=0;i<5;i++){
    const t = now + (i===0?0: (Math.random()>.5?1:-1) * Math.floor(Math.random()*3));
    const li = document.createElement('li');
    li.innerHTML = `<span>${i===0?'Now':`+${i*3}h`}</span><b>${t}°</b>`;
    wHours.appendChild(li);
  }
}

locForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = (document.getElementById('loc').value || '').trim() || 'Your Town';
  seedWeather(city);
  localStorage.setItem('portal_city', city);
});

seedWeather(localStorage.getItem('portal_city') || 'Your Town');

// ====== (Optional) Wire real APIs later ======
/*
  Weather (OpenWeather, etc.)
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=KEY&units=imperial`)
    .then(r=>r.json()).then(data => { ...update DOM... });

  News (e.g., GNews, NewsAPI, RSS via a tiny proxy)
  fetch(`/your-proxy?feed=local&loc=${encodeURIComponent(city)}`).then(...)

  Keep the layout identical; just replace the filler content above.
*/