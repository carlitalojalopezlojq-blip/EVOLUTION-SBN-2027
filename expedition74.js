'use strict';
const G=require('./app/src/main/assets/engine');
const RETRY=2400, FIGHT=3600, PREP=6000;
// Original kaiju-inspired creatures; type reuses the existing elemental AI/audio.
const worlds=[
 ['jungle','Selva del despertar',[['gold','Rey de la selva','#c79b39']]],
 ['desert','Desierto de los huesos',[['fire','Devorador de dunas','#d77a40'],['gold','Escorpión colosal','#b59b58']]],
 ['swamp','Pantano de la peste',[['venom','Hidra de la peste','#83bc39'],['shadow','Garra putrefacta','#657950']]],
 ['ice','Glaciar de las mandíbulas',[['ice','Colmillo glacial','#55c9ef'],['ancient','Gigante de hueso','#b1d3df']]],
 ['ocean','Abismo sin luz',[['shadow','Leviatán abisal','#515c92'],['electric','Anguila del terror','#478cff']]],
 ['lava','Caldera del coloso',[['fire','Coloso de magma','#f35e32'],['venom','Bestia de ceniza','#b8653e']]],
 ['jurassic','Tierra de los kaijus',[['ancient','Kaiju de obsidiana','#596963'],['fire','Tirano nuclear','#e28c37'],['electric','Rex de tormenta','#546abf']]],
 ['haunted','Bosque de las pesadillas',[['shadow','Horror sin rostro','#80629e'],['venom','Hidra de pesadilla','#677d45'],['ice','Esqueleto de escarcha','#92c9d8']]],
 ['alien','Dimensión del vacío',[['electric','Parásito cósmico','#9567de'],['shadow','Devorador de estrellas','#6c499b'],['ancient','Aberración del vacío','#a58aa6']]],
 ['temple','Templo del fin',[['fire','Apocalipsis rubí','#d14154'],['ice','Serafín del terror','#72bcd7'],['ancient','KAION · Devorador de mundos','#a66dcd']]]
].map(([arena,name,bosses],i)=>({arena,name,bosses:bosses.map(([type,name,c],j)=>({type,name,c,slot:j,form74:`king73_world${i+1}_${j+1}`}))}));
const partySize=n=>n===4?4:2;
function canStart(r){const n=r.settings.party74;return (n===2||n===4)&&r.members.size===n&&r.clients.size===n&&[...r.members].every(([id,m])=>r.clients.has(id)&&m.ready===true);}
function configure(r,n){r.settings={arena:worlds[0].arena,mode:'invasion',bots:0,difficulty:'normal',advanced:false,party74:partySize(n)};r.expedition74=true;return r;}
function init(v,n){v.expedition74={world:1,party:partySize(n),cleared:[],portal:null,entered:[],attempt:0};}
const secret={arena:'alien',name:'Dimensión prohibida',bosses:[{type:'ancient',name:'NÉMESIS · Horror del origen',c:'#a654e9',slot:0,form74:'king73_nemesis80'}]};
const current=v=>v.expedition74.world===11?secret:worlds[v.expedition74.world-1];
function hp(world,party){return Math.round((900+(world-1)*240)*party);}
function position(s,p,i=0){const x=G.W/2-200+i*115,y=G.W/2+200;p.a=p.t=-Math.PI/2;p.b=false;p.body=Array.from({length:Math.max(1,Math.min(Math.floor(p.m),p.body.length))},(_,j)=>[x,y+j*5]);p.teleport43=(p.teleport43||0)+1;p.shieldUntil=s.tick+100;p.attackAt73=s.tick;}
function spawn(r,notify){const s=r.s,v=s.kings73,e=v.expedition74,w=current(v);v.phase='fight';v.until=s.tick+FIGHT;v.wave=e.world;v.contributors={};v.defeated=e.cleared.length;v.total=w.bosses.length;e.attempt++;for(const spec of w.bosses){if(e.cleared.includes(spec.slot))continue;const actual=s.expedition80&&e.ruby80&&e.world===1?{...spec,type:'fire',name:'Guardián rubí · Evento del fundador',c:'#c6344d',form74:'king73_ruby_event'}:spec;const boss=G.spawn(s,G.KING+'-74-'+spec.slot,actual.name,actual.c);Object.assign(boss,actual,{king73:true,world74:e.world,hp:hp(e.world,e.party),maxHp:hp(e.world,e.party),expires:v.until,damage73:{},attack:null,nextAttack73:s.tick+100+spec.slot*35});boss.m=90+e.world*8;boss.phase80=1;if(s.expedition80&&e.nightmare80){boss.hp=Math.round(boss.hp*1.6);boss.maxHp=boss.hp;}}
 notify(`MUNDO ${e.world}/10 · ${w.name} · ${w.bosses.length-e.cleared.length} reyes · 3 minutos`);}
function cleared(v,boss){const e=v.expedition74;if(e&&!e.cleared.includes(boss.slot))e.cleared.push(boss.slot);}
function endFight(r,notify){const s=r.s,v=s.kings73,e=v.expedition74;if(e.cleared.length===v.total){if(e.world===10&&s.expedition80&&[...r.members.values()].every(m=>m.account?.public_id51)&&require('node:crypto').randomInt(10)===0){e.secret80=true;}if(e.world===11||e.world===10&&!e.secret80){v.phase='complete';v.until=s.tick;e.portal=null;notify(e.world===11?'¡DIMENSIÓN PROHIBIDA SUPERADA!':'¡LOS DIEZ MUNDOS SUPERADOS! · Recoge los últimos huevos dorados');return;}v.phase='portal';v.until=s.tick;e.portal={x:G.W/2,y:G.W/2};e.entered=[];notify('¡MUNDO SUPERADO! · Cruza la puerta dorada con tu equipo');}else{v.phase='retry';v.until=s.tick+RETRY;notify('Los reyes restantes volverán en 2 minutos');}}
function portal(r,notify){const s=r.s,v=s.kings73,e=v.expedition74;if(v.phase!=='portal'||!e.portal)return false;for(const [id,p] of Object.entries(s.p)){if(!r.clients.has(id)||e.entered.includes(id))continue;if(Math.hypot(p.body[0][0]-e.portal.x,p.body[0][1]-e.portal.y)<=65)e.entered.push(id);}if(![...r.members.keys()].every(id=>r.clients.has(id)&&e.entered.includes(id)&&s.p[id]))return false;
 e.world++;if(s.expedition80)e.chest80={x:300+Math.random()*3400,y:300+Math.random()*3400};e.cleared=[];e.entered=[];e.portal=null;e.attempt=0;v.eggs=[];v.shots=[];s.hazards=[];s.f=Array.from({length:950},()=>G.fruit());let i=0;for(const id of r.members.keys())position(s,s.p[id],i++);r.arena70=current(v).arena;r.settings.arena=r.arena70;spawn(r,notify);return true;}
function event(v){const e=v.expedition74;if(!e)return {};const w=current(v);return {world74:e.world,worldName74:w.name,arena74:w.arena,party74:e.party,secret80:!!e.secret80,ruby80:!!e.ruby80,chest80:e.chest80||null,nightmare80:!!e.nightmare80,portal74:e.portal,entered74:e.entered.length,total74:w.bosses.length,cleared74:e.cleared.length,attempt74:e.attempt};}
module.exports={worlds,RETRY,FIGHT,PREP,partySize,canStart,configure,init,current,hp,position,spawn,cleared,endFight,portal,event};
