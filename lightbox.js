/* ALI HALIM Portfolio Lightbox v1 */
(function(){
  'use strict';
  if (window.__ALI_HALIM_LIGHTBOX__) return;
  window.__ALI_HALIM_LIGHTBOX__ = true;

  const style = document.createElement('style');
  style.textContent = `
    .gisLightbox{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(2,10,14,.88);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);opacity:0;visibility:hidden;transition:opacity .22s ease,visibility .22s ease;touch-action:none}
    .gisLightbox.open{opacity:1;visibility:visible}
    .gisLightbox img{max-width:94vw;max-height:90vh;width:auto;height:auto;object-fit:contain;border-radius:12px;box-shadow:0 24px 80px rgba(0,0,0,.6);transform:scale(.94);transition:transform .22s ease;cursor:zoom-out;background:#fff}
    .gisLightbox.open img{transform:scale(1)}
    .gisLightboxClose{position:absolute;top:14px;right:14px;width:44px;height:44px;border:1px solid rgba(255,255,255,.2);border-radius:50%;background:rgba(5,20,27,.8);color:#fff;font-size:27px;line-height:1;display:grid;place-items:center;cursor:pointer;z-index:2}
    .gisLightboxHint{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);font:700 10px/1 ui-monospace,Consolas,monospace;letter-spacing:.1em;color:rgba(220,240,242,.55);white-space:nowrap;pointer-events:none}
    .lightboxTarget{cursor:zoom-in}
    .gisLightbox.open img.zoomed{max-width:none;max-height:none;cursor:move;transform:scale(1.65);transition:none}
    @media(max-width:680px){
      .gisLightbox{padding:12px}
      .gisLightbox img{max-width:96vw;max-height:84vh;border-radius:10px}
      .gisLightboxClose{top:10px;right:10px;width:40px;height:40px;font-size:24px}
      .gisLightboxHint{font-size:8px;bottom:12px}
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.className = 'gisLightbox';
  overlay.innerHTML = '<button class="gisLightboxClose" type="button" aria-label="Close image">×</button><img alt="Expanded GIS image"><div class="gisLightboxHint">TAP IMAGE TO ZOOM · TAP OUTSIDE TO CLOSE</div>';
  document.body.appendChild(overlay);

  const viewerImg = overlay.querySelector('img');
  const closeBtn = overlay.querySelector('.gisLightboxClose');

  function isEligible(img){
    if (!img || !img.src) return false;
    if (img.closest('.gisAnnotation')) return false;
    if (img.classList.contains('logo')) return false;
    if (img.naturalWidth < 120 || img.naturalHeight < 80) return false;
    return !!img.closest('.media,.tile,.layout,.analyticsCard,.toolShot,.project,.gallery,.layouts,#analytics,#projects');
  }

  function markImages(){
    document.querySelectorAll('img').forEach(img=>{
      if (isEligible(img)) img.classList.add('lightboxTarget');
    });
  }

  function open(img){
    viewerImg.src = img.currentSrc || img.src;
    viewerImg.alt = img.alt || 'Expanded GIS image';
    viewerImg.classList.remove('zoomed');
    overlay.classList.add('open');
    document.documentElement.style.overflow='hidden';
    document.body.style.overflow='hidden';
  }
  function close(){
    overlay.classList.remove('open');
    viewerImg.classList.remove('zoomed');
    document.documentElement.style.overflow='';
    document.body.style.overflow='';
    setTimeout(()=>{ if(!overlay.classList.contains('open')) viewerImg.removeAttribute('src'); },180);
  }

  document.addEventListener('click', function(e){
    const img = e.target.closest('img.lightboxTarget');
    if (img){ e.preventDefault(); open(img); return; }
    if (e.target === overlay || e.target === viewerImg) {
      if (e.target === viewerImg) viewerImg.classList.toggle('zoomed');
      else close();
      return;
    }
    if (e.target === closeBtn) close();
  }, true);

  document.addEventListener('keydown', function(e){
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === ' ') { e.preventDefault(); viewerImg.classList.toggle('zoomed'); }
  });

  let sx=0,sy=0;
  overlay.addEventListener('touchstart', e=>{ if(e.touches[0]){sx=e.touches[0].clientX;sy=e.touches[0].clientY;} }, {passive:true});
  overlay.addEventListener('touchend', e=>{
    if(!e.changedTouches[0]) return;
    const dx=e.changedTouches[0].clientX-sx, dy=e.changedTouches[0].clientY-sy;
    if(Math.abs(dx)<35 && Math.abs(dy)<35) return;
    if(Math.abs(dy)>Math.abs(dx) && dy>60) close();
  }, {passive:true});

  markImages();
  const mo = new MutationObserver(()=>markImages());
  mo.observe(document.body,{childList:true,subtree:true});
})();
