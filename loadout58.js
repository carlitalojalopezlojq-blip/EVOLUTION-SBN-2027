'use strict';
const G=require('./app/src/main/assets/engine'), M=require('./app/src/main/assets/mutations');
function selection(k,tournament=false){return !tournament&&M.mutations.some(m=>m[0]===k)?k:null;}
function equip(s,p,mem){if(!p||p.mutationApplied)return;const old=s.equipped;s.equipped=selection(mem?.mutation);M.equip(s,p);s.equipped=old;}
function tick(s){if(s.online42)return;for(const p of Object.values(s.p)){if(G.isKing(p)||G.isBot(p))continue;if(p.inputAt50&&Date.now()-p.inputAt50>1200)p.b=false;if(p.mutation==='cyber')p.energy=Math.min(100,p.energy+.3);if(p.mutation==='cosmic'&&s.tick%2===0){const [x,y]=p.body[0];for(const f of s.f){const dx=x-f[0],dy=y-f[1],d2=dx*dx+dy*dy;if(d2>1&&d2<8100&&f[3]!==53){const d=Math.sqrt(d2);f[0]+=dx/d*2;f[1]+=dy/d*2;}}}}}
module.exports={selection,equip,tick};
