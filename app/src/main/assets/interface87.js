(function(){'use strict';
const E=id=>document.getElementById(id), play=E('play');
const mk=(cls,parent)=>{const d=document.createElement('div');d.className=cls;parent.append(d);return d;};
const hud=mk('hud87',play), l=mk('hud87col',hud), c=mk('hud87col hud87center',hud), r=mk('hud87col hud87right',hud);
const lr=mk('hud87row',l), cr=mk('hud87row',c);
const move=(parent,...nodes)=>nodes.filter(Boolean).forEach(n=>parent.append(n));
move(l,E('hud'),lr);move(lr,play.querySelector('.matchDrawer54')); move(lr,E('matchMenu54'),E('pauseBtn')); E('matchMenu54').textContent='☰ Menú'; E('exit').textContent='Abandonar partida';
move(c,E('event'),play.querySelector('.kingsHud73'),cr); move(cr,play.querySelector('.matchCount56'),E('evo86'));
move(r,E('rank'),play.querySelector('.ping60'));
// Keep the existing actions and handlers; only change how the exit is requested.
const dialog=document.createElement('div');dialog.id='leave87';dialog.hidden=true;
dialog.innerHTML='<section role="dialog" aria-modal="true" aria-labelledby="leaveTitle87"><small>EVOLUTION · SBN 2027</small><h2 id="leaveTitle87">¿Abandonar partida?</h2><p id="leaveMessage87"></p><div class="leaveActions87"><button id="stay87" type="button">Regresar al juego</button><button id="quit87" type="button">Abandonar partida</button></div></section>';
document.body.append(dialog);
let wasPaused=false, pausedHere=false, lobbyHere=false;
function reset(){dialog.hidden=true;wasPaused=pausedHere=lobbyHere=false;}
function hide(){if(dialog.hidden)return;dialog.hidden=true;if(pausedHere&&active&&local){paused=wasPaused;music();}pausedHere=lobbyHere=false;}
function show(){if(!dialog.hidden)return true;const lobby=!E('lobby42').hidden;if(!active&&!lobby)return false;
 if(photo24)photoMode24(false);
 const drawer=play.querySelector('.matchDrawer54');if(drawer&&!drawer.hidden)E('matchMenu54').click();
 const evo=E('evo86')?.querySelector(':scope > div');if(evo)evo.hidden=true;
 releaseInput522();lobbyHere=lobby;wasPaused=paused;pausedHere=active&&local&&!defeated;
 if(pausedHere){paused=true;music();}
 E('leaveTitle87').textContent=lobby?'¿Abandonar sala?':'¿Abandonar partida?';
 E('leaveMessage87').textContent=lobby?'Saldrás de la sala de espera.':local?'Volverás al menú principal. El progreso de esta partida puede perderse.':'La partida online continúa mientras este menú está abierto. Si abandonas, saldrás de la arena.';
 E('stay87').textContent=lobby?'Regresar a la sala':'Regresar al juego'; E('quit87').textContent=lobby?'Abandonar sala':'Abandonar partida';
 dialog.hidden=false;return true;}
E('stay87').onclick=hide;E('quit87').onclick=()=>{reset();menu();};
for(const e of [E('exit'),play.querySelector('.leave56'),E('deathExit'),E('pauseExit'),E('lobbyExit42')])if(e)e.onclick=show;
// Hardware/gesture Back calls this via the Android Activity.
window.handleAndroidBack87=function(){if(!dialog.hidden){hide();return true;}if(active||!E('lobby42').hidden)return show();if(!E('intro').hidden)return true;if(connecting){cancelJoin();return true;}return false;};
window.Interface87={reset,isOpen:()=>!dialog.hidden};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&window.handleAndroidBack87()){e.preventDefault();e.stopPropagation();}});
// Disable native-looking copy/select UI on the arena, without breaking editable fields.
const editable=e=>e?.closest?.('input,textarea,[contenteditable="true"]');
for(const event of ['contextmenu','selectstart','dragstart'])document.addEventListener(event,e=>{if(!editable(e.target))e.preventDefault();},true);
document.addEventListener('selectionchange',()=>{const sel=window.getSelection();if(sel&&!sel.isCollapsed&&!editable(sel.anchorNode?.parentElement)&&!editable(document.activeElement))sel.removeAllRanges();});
function nativeMode(){try{window.EvolutionNative?.gameLongPressBlocked?.(!play.hidden||!dialog.hidden);}catch{}}
const observer=new MutationObserver(nativeMode);observer.observe(play,{attributes:true,attributeFilter:['hidden']});observer.observe(dialog,{attributes:true,attributeFilter:['hidden']});nativeMode();
})();
