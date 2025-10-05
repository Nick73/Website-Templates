
// Mobile nav toggle
const toggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
if (toggle && nav){
  function setOpen(open){ nav.classList.toggle('open', open); toggle.setAttribute('aria-expanded', String(open)); }
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && window.matchMedia('(min-width: 960px)').matches === false){
      setOpen(false);
    }
  });
}

// Showcase filters and modal
const gallery = document.getElementById('gallery');
if (gallery){
  const chips = document.querySelectorAll('.chip');
  const search = document.getElementById('search');
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalCat = document.getElementById('modalCat');
  const modalClose = document.getElementById('modalClose');

  function applyFilters(){
    const active = document.querySelector('.chip.active')?.dataset.filter || 'all';
    const q = (search?.value || '').toLowerCase();
    gallery.querySelectorAll('.shot').forEach(card => {
      const cat = card.dataset.cat;
      const text = card.innerText.toLowerCase();
      const matchCat = active === 'all' || cat === active;
      const matchSearch = !q || text.includes(q);
      card.style.display = (matchCat && matchSearch) ? '' : 'none';
    });
  }

  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(x => x.classList.remove('active'));
    c.classList.add('active');
    applyFilters();
  }));
  if (search) search.addEventListener('input', applyFilters);

  gallery.addEventListener('click', (e) => {
    const fig = e.target.closest('.shot');
    if (!fig) return;
    const img = fig.querySelector('img');
    const t = fig.innerText.trim();
    modalImg.src = img.src;
    modalTitle.textContent = t;
    modalCat.textContent = fig.dataset.cat;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  });

  if (modal && modalClose){
    function close(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }
    modalClose.addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
  }
}

// Smooth scroll for same-page anchors
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if (target){ e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
