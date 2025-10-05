
/*
SPDX-License-Identifier: MPL-2.0
Copyright (c) 2025 Nick Chiaravalle
This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/

const toggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
function setOpen(open){ nav.classList.toggle('open', open); toggle.setAttribute('aria-expanded', String(open)); }
toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));

nav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A' && window.matchMedia('(max-width: 979px)').matches){
    setOpen(false);
  }
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if (target){ e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
