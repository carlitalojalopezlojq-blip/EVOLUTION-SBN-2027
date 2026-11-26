'use strict';
// Expedition abilities are authoritative, per run and never accepted as client stats.
const TREE={guardian:{cost:1,mass:100},storm:{cost:1,mass:100},hunter:{cost:1,mass:100},giant:{cost:2,mass:300}};
const RECIPES={shield:4,energy:3};
const EMOTES=['wave','heart','cheer','help'];
function init(p){p.evo86={unlocked:[],spent:0,fruit:0,materials:0,form:null,until:0,cooldown:0,emote:null,emoteUntil:0};}
function points(p){return Math.max(0,Math.min(8,Math.floor((p.evo86?.fruit||0)/15))-(p.evo86?.spent||0));}
function fruit(p){const e=p.evo86;if(!e)return;e.fruit++;if(e.fruit%3===0)e.materials=Math.min(99,e.materials+1);}
function act(s,p,m){const e=p?.evo86;if(!e)return 'No disponible';const t=s.tick,k=m.key;
 if(m.action==='unlock'){const node=Object.hasOwn(TREE,k)?TREE[k]:null;if(!node||e.unlocked.includes(k)||points(p)<node.cost||p.m<node.mass||(k==='giant'&&!e.unlocked.includes('guardian')))return 'Requisitos de evolución pendientes';e.unlocked.push(k);e.spent+=node.cost;return 'Evolución desbloqueada';}
 if(m.action==='form'){if(!e.unlocked.includes(k)||t<e.cooldown||p.energy<35)return 'Forma no disponible: revisa energía y recarga';p.energy-=35;e.form=k;e.until=t+(k==='giant'?160:200);e.cooldown=t+600;if(k==='guardian')p.shieldUntil=Math.max(p.shieldUntil||0,t+100);if(k==='storm')p.energy=Math.min(100,p.energy+25);if(k==='giant')p.shieldUntil=Math.max(p.shieldUntil||0,t+60);return 'Transformación activada';}
 if(m.action==='craft'){const cost=Object.hasOwn(RECIPES,k)?RECIPES[k]:0;if(!cost||e.materials<cost||t<(e.craftAt||0))return 'Materiales insuficientes o recarga activa';e.materials-=cost;e.craftAt=t+100;if(k==='shield')p.shieldUntil=Math.max(p.shieldUntil||0,t+100);else p.energy=Math.min(100,p.energy+60);return 'Objeto fabricado y utilizado';}
 if(m.action==='emote'&&EMOTES.includes(k)&&t>=(e.emoteAt||0)){e.emote=k;e.emoteUntil=t+50;e.emoteAt=t+60;return null;}return null;
}
function tick(s){for(const p of Object.values(s.p)){const e=p.evo86;if(!e)continue;if(e.until<=s.tick)e.form=null;p.giant86=e.form==='giant';if(e.emoteUntil<=s.tick)e.emote=null;if(e.form==='storm')p.energy=Math.min(100,p.energy+.7);}}
function damage(s,p){return p.evo86?.form==='hunter'&&p.evo86.until>s.tick?1.3:p.evo86?.form==='giant'&&p.evo86.until>s.tick?1.2:1;}
function publicState(p,s){const e=p.evo86;if(!e)return {};return {giant86:!!p.giant86,form86:e.form,emote86:e.emote};}
function privateState(p,s){const e=p.evo86;if(!e)return {};return {unlocked:e.unlocked,points:points(p),materials:e.materials,fruit:e.fruit,form:e.form,remaining:Math.max(0,Math.ceil((e.until-s.tick)/20)),cooldown:Math.max(0,Math.ceil((e.cooldown-s.tick)/20))};}
function canCheckpoint(r,id){const v=r.s.kings73,e=v?.expedition74;return !!(r.s.p[id]?.evo86&&v.phase==='portal'&&e&&e.world<10&&r.settings.party74===1&&r.members.size===1);}
function checkpoint(r,id){if(!canCheckpoint(r,id))return null;const s=r.s,e=s.kings73.expedition74,p=s.p[id];return {world:e.world+1,mass:p.m,elapsed:s.tick,nightmare:!!e.nightmare80,fallen:!!s.fallenEver80?.[id],evo:{unlocked:p.evo86.unlocked.slice(),spent:p.evo86.spent,fruit:p.evo86.fruit,materials:p.evo86.materials}};}
function restore(p,c){p.m=Math.max(24,Math.min(100000,Number(c.mass)||24));Object.assign(p.evo86,c.evo);}
module.exports={init,fruit,act,tick,damage,publicState,privateState,points,canCheckpoint,checkpoint,restore,TREE,RECIPES};
