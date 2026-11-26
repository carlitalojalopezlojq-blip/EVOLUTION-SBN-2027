/* Founder Edition: presentation only; server remains authoritative. */
(function(){'use strict';
const el=id=>document.getElementById(id),make=(tag,t,c)=>{const x=document.createElement(tag);if(t!=null)x.textContent=t;if(c)x.className=c;return x;};
const play=el('play'),toggle=make('button','⋯','matchMenu54');toggle.id='matchMenu54';toggle.type='button';toggle.setAttribute('aria-label','Opciones de partida');toggle.setAttribute('aria-expanded','false');const drawer=make('div',null,'matchDrawer54');drawer.hidden=true;
function open(v){drawer.hidden=!v;toggle.setAttribute('aria-expanded',String(v));}
// Move existing elements, preserving all original handlers and availability rules.
for(const k of ['exit','sound','invitePlay','share41','online3d41']){const b=el(k);if(b)drawer.append(b);}
const rankToggle=el('originRank53');if(rankToggle)drawer.append(rankToggle);
toggle.onclick=()=>open(drawer.hidden);drawer.addEventListener('click',e=>{if(e.target.closest('button'))open(false);});play.append(toggle,drawer);
const warning=make('div',null,'matchWarning54');warning.hidden=true;warning.setAttribute('role','status');play.append(warning);
const count56=make('div',null,'matchCount56');count56.hidden=true;count56.setAttribute('role','status');play.append(count56);
const leave56=make('button','↩ Menú','leave56');leave56.type='button';leave56.setAttribute('aria-label','Regresar al menú');leave56.onclick=()=>menu();play.append(leave56);
let startUntil56=0;
function phase(ev,started=false){if(!ev||!Number.isInteger(ev.connected56)){count56.hidden=true;return;}if(started)startUntil56=performance.now()+3000;count56.hidden=false;count56.textContent=(ev.practice56?'Esperando rivales · ':performance.now()<startUntil56?'¡Comienza la competición! · ':'')+ev.connected56+'/'+ev.capacity56+' jugadores';}
function disconnected(){if(local||!active)return;warning.textContent='Conexión perdida · reconectando…';warning.hidden=false;}
let last=performance.now(),closing=false,renderNotice=0;
function networkReset(){last=performance.now();closing=false;warning.hidden=true;count56.hidden=true;startUntil56=0;open(false);}
function snapshot(){last=performance.now();closing=false;if(performance.now()>renderNotice)warning.hidden=true;}
function network(){if(local||!active||!sessionToken||roundEnded)return;if(socket?.readyState!==1){disconnected();return;}if(defeated&&!watching)return;const now=performance.now(),age=now-last;if(age>3500){warning.hidden=false;warning.textContent='Conexión inestable · intentando recuperar…';}if(age>10000&&!closing&&socket?.readyState===1){closing=true;socket.close();}}
function renderWarning(){renderNotice=performance.now()+5000;warning.textContent='Modo 2D de recuperación';warning.hidden=false;setTimeout(()=>{if(performance.now()>=renderNotice&&(local||performance.now()-last<3500))warning.hidden=true;},5100);}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)last=performance.now();});
const emblem57=new Image();emblem57.src='founder-f57.svg';const reduce57=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
function canvasName(g,name,x,y,t,role='F'){g.save();g.font='bold 13px sans-serif';g.textAlign='left';const width=g.measureText(name).width,xx=x-(width+23)/2,bx=xx+width+12,by=y-5;g.fillStyle=role==='F'?'#ffe27c':'#ecfff9';g.shadowColor='#000';g.shadowBlur=3;g.fillText(name,xx,y);g.shadowBlur=0;if(role==='F'&&emblem57.complete&&emblem57.naturalWidth){g.shadowColor='#b579ff';g.shadowBlur=reduce57?2:2+3*(1+Math.sin(t/380))/2;g.drawImage(emblem57,bx-11,by-11,22,22);g.shadowBlur=0;if(!reduce57){g.strokeStyle='#c794ff';g.globalAlpha=.7;g.beginPath();g.arc(bx,by,11,t/1100,t/1100+1.3);g.stroke();}}else{const grad=g.createLinearGradient(bx-7,by-7,bx+7,by+7);grad.addColorStop(0,role==='F'?'#d6b4ff':'#fff8bc');grad.addColorStop(1,role==='F'?'#482077':'#ad660b');g.fillStyle=grad;g.strokeStyle='#fff0a1';g.lineWidth=.7;g.beginPath();for(let i=0;i<16;i++){const angle=-Math.PI/2+i*Math.PI/8,r=i%2?6:8;const px=bx+Math.cos(angle)*r,py=by+Math.sin(angle)*r;if(!i)g.moveTo(px,py);else g.lineTo(px,py);}g.closePath();g.fill();g.stroke();g.fillStyle=role==='F'?'#ffe7a4':'#522900';g.font='900 11px sans-serif';g.textAlign='center';g.fillText(role,bx,by+4);}g.restore();}
function mutationCard(b,n,desc,equipped,owned){b.classList.add('mutationCard54');const gem=make('span','⬡','mutationGem54');gem.setAttribute('aria-hidden','true');b.replaceChildren(gem,make('strong',n),make('small',desc),make('span',equipped?'EQUIPADA':owned?'EQUIPAR':'BLOQUEADA','mutationState54'));if(equipped)b.classList.add('selected');}
window.Founder54={canvasName,mutationCard,network,networkReset,snapshot,renderWarning,phase,disconnected};
})();
