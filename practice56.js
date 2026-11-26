'use strict';
const G=require('./app/src/main/assets/engine'), Loadout=require('./loadout58');
const competitive=mode=>['duel','royale','teams'].includes(mode);
function create(mode){const s=G.world(mode);s.f.length=600;s.betaFruitTarget=600;s.practice56=true;s.nextKing=Number.MAX_SAFE_INTEGER;return s;}
function status(r){return {practice56:!!r.s.practice56,connected56:r.clients.size,minimum56:competitive(r.s.mode)?2:1,capacity56:r.s.mode==='duel'?2:10};}
function step(r){const s=r.s;for(const p of Object.values(s.p))if(p.inputAt50&&Date.now()-p.inputAt50>1200)p.b=false;Loadout.tick(s);G.step(s);for(const [id,m] of r.members)if(!s.p[id]&&r.clients.has(id)){const p=G.spawn(s,id,m.name,m.skin);p.shieldUntil=s.tick+100;Loadout.equip(s,p,m);} }
function begin(r,makeWorld){if(!r.s.practice56||r.clients.size<2||r.clients.size!==r.members.size)return false;const s=makeWorld(r.s.mode);s.started=true;for(const [id,m] of r.members){const previous=r.s.p[id],p=G.spawn(s,id,m.name,m.skin);if(previous&&Number.isFinite(previous.t)){p.t=previous.t;p.b=previous.b&&Date.now()-(previous.inputAt50||0)<1200;p.inputAt50=previous.inputAt50;}Loadout.equip(s,p,m);Object.assign(m,{best:24,start:0,saved:false,watching:false,ledger43:null,cursor43:null,credited44:null});}r.s=s;return true;}
module.exports={competitive,create,status,step,begin};
