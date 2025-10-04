/*
SPDX-License-Identifier: MPL-2.0
Copyright (c) 2025 Nick Chiaravalle

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/

/* =========================================================
   MODULE: Starfield (tiny, no deps)
   ========================================================= */
(() => {
  const c = document.getElementById('starfield');
  const ctx = c.getContext('2d', { alpha: true });

  function resize(){
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const N = 560; // number of stars
  const stars = Array.from({length:N}, () => ({
    x: Math.random()*c.width,
    y: Math.random()*c.height,
    z: Math.random()*1 + 0.2, // depth for parallax
    s: Math.random()*1.2 + 0.2 // size
  }));

  function tick(){
    ctx.clearRect(0,0,c.width,c.height);
    for (const st of stars){
      st.x += 0.3 * st.z;         // horizontal drift
      if (st.x > c.width + 2) {   // wrap around
        st.x = -2;
        st.y = Math.random()*c.height;
        st.z = Math.random()*1 + 0.2;
      }
      ctx.globalAlpha = 0.6 + Math.sin((st.x + st.y) * 0.02) * 0.2;
      ctx.fillStyle = '#8bdcff';
      ctx.fillRect((st.x|0), (st.y|0), st.s, st.s);
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

/* =========================================================
   MODULE: Retro Coin Sound (WebAudio, no files)
   - Quick chime + pitch slide + short noise burst
   ========================================================= */
const CoinSFX = (() => {
  const AC = window.AudioContext || window.webkitAudioContext;
  let ctx;

  function ensureCtx() {
    if (!ctx) ctx = new AC();
    return ctx;
  }

  function beep(freq, t0, dur, type='square', gain=0.15) {
    const c = ensureCtx();
    const osc = c.createOscillator();
    const amp = c.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    // quick pitch rise for arcade feel
    osc.frequency.exponentialRampToValueAtTime(freq * 1.8, t0 + dur * 0.4);

    amp.gain.setValueAtTime(0, t0);
    amp.gain.linearRampToValueAtTime(gain, t0 + 0.01);
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(amp).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur);
  }

  function noise(t0, dur, gain=0.05) {
    const c = ensureCtx();
    const bufferSize = 0.1 * c.sampleRate;
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize); // quick decay

    const src = c.createBufferSource();
    src.buffer = buffer;

    const amp = c.createGain();
    amp.gain.setValueAtTime(gain, t0);
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    const hp = c.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(1200, t0);

    src.connect(hp).connect(amp).connect(c.destination);
    src.start(t0);
    src.stop(t0 + dur);
  }

  function play() {
    const c = ensureCtx();
    const now = c.currentTime + 0.02;

    // Layered "coin" sound
    beep(520, now, 0.12, 'square', 0.18);   // initial clink
    beep(880, now + 0.05, 0.14, 'triangle', 0.12); // shiny overtone
    noise(now + 0.02, 0.08, 0.04);          // short hiss
  }

  return { play };
})();

/* =========================================================
   MODULE: UI wiring (buttons, ring pulse)
   ========================================================= */
(() => {
  const playBtn  = document.getElementById('playBtn');
  const tokenBtn = document.getElementById('tokenBtn');
  const ring     = document.querySelector('.neon-ring');

  function pulseRing() {
    if (!ring || !ring.animate) return;
    ring.animate(
      [
        { filter: 'blur(24px) brightness(1)' },
        { filter: 'blur(10px) brightness(2)' },
        { filter: 'blur(24px) brightness(1)' }
      ],
      { duration: 550, easing: 'ease-in-out' }
    );
  }

  function handlePlay() {
    CoinSFX.play();
    pulseRing();
  }

  if (playBtn)  playBtn.addEventListener('click', handlePlay);
  if (tokenBtn) tokenBtn.addEventListener('click', handlePlay);
})();