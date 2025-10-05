// Desktop with Browser app that loads geocities.html
const logon = document.getElementById('logon');
const desktop = document.getElementById('desktop');
const userBtn = document.getElementById('userBtn');
const bootAudio = document.getElementById('bootAudio');
const themeSelect = document.getElementById('themeSelect');
const clockEl = document.getElementById('clock');
const tasks = document.getElementById('tasks');
const hotCorner = document.querySelector('.hot-corner');

const wins = {
  browser: document.getElementById('win-browser'),
  explorer: document.getElementById('win-explorer'),
  notepad: document.getElementById('win-notepad'),
  doom: document.getElementById('win-doom'),
  about: document.getElementById('win-about'),
};

// Theme persistence
const THEME_KEY = 'xp_theme';
function setTheme(t){ document.body.setAttribute('data-theme', t); themeSelect.value=t; localStorage.setItem(THEME_KEY, t); }
themeSelect.addEventListener('change', e => setTheme(e.target.value));
setTheme(localStorage.getItem(THEME_KEY) || 'xp');

// Clock
function fmtClock(d){ let h=d.getHours(),m=d.getMinutes(); const am=h<12?'AM':'PM'; h=h%12; if(h===0) h=12; return h+':'+String(m).padStart(2,'0')+' '+am; }
function startClock(){ const tick=()=> clockEl.textContent = fmtClock(new Date()); tick(); setInterval(tick,1000); }

// Start menu
function toggleStart(){ const m=document.getElementById('startMenu'); m.classList.toggle('hide'); }
function closeStart(){ const m=document.getElementById('startMenu'); m.classList.add('hide'); }
window.addEventListener('click',(e)=>{ const m=document.getElementById('startMenu'); const s=document.getElementById('startBtn'); if(!m.contains(e.target)&&!s.contains(e.target)) m.classList.add('hide'); });

// Icons -> windows
document.querySelectorAll('.icon').forEach(ic => { ic.addEventListener('dblclick', ()=> { const t=ic.dataset.open; if(t) openWin(t); }); });

// Window helpers
let zCounter = 50; const z = () => (++zCounter).toString();
function openWin(name){ const w=wins[name]; if(!w) return; w.classList.remove('hide'); w.style.zIndex=z(); ensureTask(name); if(!w.style.left) centerWin(name); closeStart(); if(name==='browser') browserGo(true); }
function centerWin(name){ const w=wins[name]; if(!w) return; const r=w.getBoundingClientRect(); const vw=document.documentElement.clientWidth; const vh=document.documentElement.clientHeight; w.style.left=Math.max(8,(vw-r.width)/2)+'px'; if(!w.style.top) w.style.top=Math.max(8,(vh-r.height)/3)+'px'; w.style.zIndex=z(); }
function minimize(name){ const w=wins[name]; if(!w) return; w.classList.add('hide'); }
function closeWin(name){ const w=wins[name]; if(!w) return; w.classList.add('hide'); removeTask(name); }
function ensureTask(name){ const id='task-'+name; if(document.getElementById(id)) return; const btn=document.createElement('button'); btn.className='task-btn'; btn.id=id; btn.textContent='■ '+titleFor(name); btn.onclick=()=>{ const w=wins[name]; if(w.classList.contains('hide')) w.classList.remove('hide'); w.style.zIndex=z(); }; tasks.appendChild(btn); }
function removeTask(name){ const t=document.getElementById('task-'+name); if(t) t.remove(); }
function titleFor(n){ return {browser:'Browser', explorer:'Explorer', notepad:'Notepad', doom:'DOOM', about:'About'}[n]||n; }

// Drag move
(function enableDrag(){ const HANDLE='[data-drag-handle]'; function clamp(n,min,max){ return Math.max(min,Math.min(max,n)); } function bring(el){ el.style.zIndex=z(); }
  Object.values(wins).forEach(win=>{ const handle=win.querySelector(HANDLE); if(!handle) return; let sx=0,sy=0,sl=0,st=0,drag=false;
    function down(e){ if(e.target.closest('.controls')) return; drag=true; bring(win); const r=win.getBoundingClientRect(); sl=r.left+window.scrollX; st=r.top+window.scrollY; sx=e.clientX; sy=e.clientY; win.style.left=sl+'px'; win.style.top=st+'px'; document.addEventListener('mousemove',move); document.addEventListener('mouseup',up); }
    function move(e){ if(!drag) return; const dx=e.clientX-sx, dy=e.clientY-sy; const vw=document.documentElement.clientWidth; const vh=document.documentElement.clientHeight; const rect=win.getBoundingClientRect(); win.style.left=clamp(sl+dx,0,vw-rect.width)+'px'; win.style.top=clamp(st+dy,0,vh-rect.height-42)+'px'; }
    function up(){ drag=false; document.removeEventListener('mousemove',move); document.removeEventListener('mouseup',up); }
    handle.addEventListener('mousedown',down); handle.addEventListener('click',()=>bring(win)); }); })();

// Notepad
const PAD_KEY='xp_notepad'; function padSave(){ localStorage.setItem(PAD_KEY, document.getElementById('pad').value||''); } function padLoad(){ document.getElementById('pad').value = localStorage.getItem(PAD_KEY)||''; } window.padSave=padSave; window.padLoad=padLoad;

// Explorer demo
function explorerOpen(path){ const pane=document.getElementById('explorerPane'); const views={'C:/':'<ul><li>Program Files</li><li>Users</li><li>Windows</li></ul>','Documents':'<ul><li>notes.txt</li><li>todo.txt</li></ul>','Pictures':'<ul><li>bliss.jpeg</li></ul>','Games':'<ul><li><button class="btn-pill" onclick="openWin(\'doom\')">Launch DOOM</button></li></ul>'}; pane.innerHTML=views[path]||'<p>(empty)</p>'; } window.explorerOpen=explorerOpen;

// Browser app (restricted to geocities.html)
function browserGo(force=false){ const addr=document.getElementById('addressBar'); const view=document.getElementById('webView'); const status=document.getElementById('browserStatus'); let url=(addr.value||'geocities.html').trim(); // only allow local geocities.html
  if(!/geocities\.html$/i.test(url)) url='geocities.html'; if(force||view.getAttribute('src')!==url){ status.textContent='Loading…'; view.setAttribute('src', url); view.addEventListener('load', ()=> status.textContent='Done', {once:true}); }}
function browserReload(){ const view=document.getElementById('webView'); const status=document.getElementById('browserStatus'); status.textContent='Refreshing…'; const src=view.getAttribute('src')||'geocities.html'; view.setAttribute('src', src); view.addEventListener('load', ()=> status.textContent='Done', {once:true}); }
window.browserGo=browserGo; window.browserReload=browserReload;

// DOOM loader
async function loadScript(src){ return new Promise((resolve,reject)=>{ const s=document.createElement('script'); s.src=src; s.onload=resolve; s.onerror=reject; document.head.appendChild(s); }); }
async function loadDoom(){ const mount=document.getElementById('doomMount'); mount.innerHTML='<span style="opacity:.7">Loading…</span>'; try{ if(!window.Dos){ await loadScript('https://js-dos.com/6.22/current/js-dos.js'); } const pkgUrl='games/doom/doom.jsdos'; const head=await fetch(pkgUrl,{method:'HEAD'}); if(head.ok){ const canvas=document.createElement('canvas'); canvas.width=640; canvas.height=480; canvas.style.width='100%'; mount.innerHTML=''; mount.appendChild(canvas); const ci=await Dos(canvas,{wdosboxUrl:'https://js-dos.com/6.22/current/wdosbox.js'}); await ci.run(pkgUrl); } else { throw new Error('Local jsdos not found'); } }catch(e){ mount.innerHTML='<div style="padding:18px"><p>Local <code>doom.jsdos</code> not found. Use the Internet Archive version:</p><p><a class="btn-pill" href="https://archive.org/details/msdos_Doom_Shareware_1993" target="_blank" rel="noopener">▶ Play on Internet Archive</a></p></div>'; } }
window.loadDoom=loadDoom;

// Easter egg
let hc=0,hcTimer=null; hotCorner?.addEventListener('click',()=>{ hc++; clearTimeout(hcTimer); hcTimer=setTimeout(()=>hc=0,1200); if(hc>=5){ hc=0; toggleAbout(); }});
function toggleAbout(){ const w=wins.about; if(w.classList.contains('hide')) openWin('about'); else closeWin('about'); }
window.addEventListener('keydown', (e)=>{ if(e.ctrlKey&&e.altKey&&(e.key==='a'||e.key==='A')){ e.preventDefault(); toggleAbout(); } });

// Logon -> Desktop
function bootToDesktop(){ bootAudio?.play?.().catch(()=>{}); logon.classList.add('hide'); desktop.classList.remove('hide'); document.getElementById('taskbar').classList.add('show'); startClock(); padLoad(); }
userBtn.addEventListener('click', bootToDesktop);

// Global
window.openWin=openWin; window.centerWin=centerWin; window.minimize=minimize; window.closeWin=closeWin; window.toggleStart=toggleStart; window.logout=function(){ location.reload(); };
startClock();
