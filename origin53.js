'use strict';
const crypto=require('node:crypto');
const NAME='sabino~gian',DISPLAY='SABINO~GIAN',ID='SBN-000001',UUID='00000000-0000-4000-8000-000000000001';
const isFounder=a=>a?.name===NAME&&a?.public_id51===UUID;
const reserved=n=>String(n||'').normalize('NFKC').replace(/[\s\u200b-\u200f\u202a-\u202e\u2060-\u206f]/g,'').toLowerCase()===NAME;
function canRegister(email,code,env=process.env){const key=env.EVO_FOUNDER_SETUP_CODE,mail=env.EVO_FOUNDER_EMAIL;if(typeof key!=='string'||key.length<24||!mail||typeof code!=='string'||code.length>256||email!==mail.trim().toLowerCase())return false;return crypto.timingSafeEqual(crypto.createHash('sha256').update(key).digest(),crypto.createHash('sha256').update(code).digest());}
function identity(a){return isFounder(a)?{founder53:true,display53:DISPLAY,publicAlias53:ID}:{};}
function guest(n){return reserved(n)?'Invitado':n;}
function alias(id){return typeof id==='string'&&id.toUpperCase()===ID?UUID:id;}
function eliminations(r,before){const out=[];for(const [id,p] of before){if(r.s.p[id])continue;const d=r.s.deaths[id];if(!d||d.tick!==r.s.tick||!d.killerId||d.killerId===id)continue;const k=before.get(d.killerId);if(!k)continue;out.push({killer:k.name,victim:p.name,gold:isFounder(r.members.get(d.killerId)?.account),victimGold:isFounder(r.members.get(id)?.account),killerBadge57:isFounder(r.members.get(d.killerId)?.account)?'F':r.members.get(d.killerId)?.account?.badge_verified57===true?'V':null,victimBadge57:isFounder(r.members.get(id)?.account)?'F':r.members.get(id)?.account?.badge_verified57===true?'V':null});}return out.slice(0,8);}
module.exports={NAME,DISPLAY,ID,UUID,isFounder,reserved,canRegister,identity,guest,alias,eliminations};
