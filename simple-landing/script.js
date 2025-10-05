
/*
SPDX-License-Identifier: MPL-2.0
Copyright (c) 2025 Nick Chiaravalle
This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/

// Optional: smooth-scroll for in-page anchors
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const el = document.querySelector(a.getAttribute('href'));
    if(el){ e.preventDefault(); el.scrollIntoView({ behavior:'smooth', block:'start' }); }
  });
});
