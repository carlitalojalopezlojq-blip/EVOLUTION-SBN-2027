/* Founder portrait only. No media is loaded during matches. */
(function(){'use strict';
const E=id=>document.getElementById(id), poster='ruby72/portrait.jpg', movie='ruby72/arrival.mp4';
let active=null,played=false,observer;
const isFounder=p=>p?.founder53===true||p?.badge==='F'; // server-authenticated profile/visit response only
function visible(el){return !!el?.isConnected&&!document.hidden&&!el.closest('[hidden]')&&el.getClientRects().length>0;}
function sound(v){v.volume=Math.max(0,Math.min(1,Number(localStorage.getItem('fxVol')??70)/100||0));v.muted=localStorage.getItem('muted')==='1'||v.volume===0;}
function stop(){if(!active)return;const {v,box}=active;active=null;v.pause();v.removeAttribute('src');v.load();v.remove();box.classList.remove('rubyPlaying72');}
function play(box){if(!visible(box))return;stop();const v=document.createElement('video');v.className='rubyVideo72';v.playsInline=true;v.setAttribute('playsinline','');v.preload='none';v.poster=poster;v.disablePictureInPicture=true;v.setAttribute('aria-hidden','true');sound(v);active={box,v};box.append(v);box.classList.add('rubyPlaying72');const finish=()=>{if(active?.v===v)stop();};v.addEventListener('ended',finish,{once:true});v.addEventListener('error',finish,{once:true});v.src=movie;v.play().catch(()=>{if(active?.v!==v)return;if(!v.muted){v.muted=true;v.play().catch(finish);}else finish();});}
function decorate(box){if(box.classList.contains('rubyPortrait72'))return;box.classList.add('rubyPortrait72');const img=box.querySelector('img')||document.createElement('img');img.src=poster;img.alt='RUBY ORIGIN · Dragón Rubí Supremo';if(!img.parentNode)box.append(img);const replay=document.createElement('button');replay.type='button';replay.className='rubyReplay72';replay.textContent='↻';replay.setAttribute('aria-label','Reproducir rugido del dragón');replay.title='Reproducir rugido';replay.onclick=()=>play(box);box.append(replay);}
function sync(){const own=E('publicProfile51')?.querySelector('.founderCard54 .playerPortrait54');if(own)decorate(own);const current=visible(own);if(active&&!visible(active.box))stop();if(!current){played=false;return;}if(!played){played=true;play(own);}}
function visit(parent,p){if(!parent?.isConnected)return;parent.querySelector('.rubyVisit72')?.remove();if(!isFounder(p)){sync();return;}const box=document.createElement('div');box.className='playerPortrait54 rubyVisit72';decorate(box);parent.append(box);play(box);}
// Observe only view transitions, profile replacement and visit removal; no per-frame work.
observer=new MutationObserver(sync);for(const id of ['menu','pane','profile','universe70','cloudPanel51']){const e=E(id);if(e)observer.observe(e,{attributes:true,attributeFilter:['hidden']});}for(const id of ['publicProfile51','universe70','cloudData']){const e=E(id);if(e)observer.observe(e,{childList:true,subtree:id==='universe70'});}
document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();return;}sync();});window.addEventListener('pagehide',stop);document.addEventListener('input',()=>{if(active)sound(active.v);});document.addEventListener('click',()=>{if(active)sound(active.v);});window.Ruby72={visit};sync();
})();
