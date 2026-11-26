'use strict';
const B=require('./verification57'),O=require('./origin53'),C=require('./community52'),P=require('./progression60');
const ACTIONS=new Set(['friends82','search82','invite82','respond82']);
const visible=`NOT EXISTS (SELECT 1 FROM evo52_blocks b WHERE (b.owner=$1 AND b.target=u.name) OR (b.owner=u.name AND b.target=$1))`;
const fields='u.name,u.public_id51,u.badge_verified57';
const mutual=`EXISTS (SELECT 1 FROM evo44_friends f WHERE f.name=$1 AND f.friend=u.name) AND EXISTS (SELECT 1 FROM evo44_friends f WHERE f.name=u.name AND f.friend=$1)`;
function roomOf(rooms,name){for(const r of rooms.values())if([...r.members].some(([id,m])=>m.account?.name===name&&r.clients.has(id)))return r;return null;}
function available(r){return !!(r?.expedition74&&r.waiting&&r.settings.party74>1&&r.members.size<r.settings.party74);}
function make(clock=Date.now){const seen=new Map();
 function touch(name){const now=clock();for(const [n,t] of seen)if(now-t>45000)seen.delete(n);seen.set(name,now);if(seen.size>10000)seen.delete(seen.keys().next().value);}
 function status(rooms,name){const r=roomOf(rooms,name);return r?(r.waiting?'lobby':'playing'):seen.has(name)&&clock()-seen.get(name)<=45000?'online':'offline';}
 async function request(q,m,u,rooms,fail){if(!u)fail('Inicia sesión primero');const n=u.name;touch(n);
 if(m.action==='friends82'){
 const [f,a,i]=await Promise.all([
 q(`SELECT ${fields} FROM evo44_users u WHERE ${mutual} AND ${visible} ORDER BY u.name LIMIT 100`,[n]),
 q(`SELECT ${fields} FROM evo52_requests r JOIN evo44_users u ON u.name=r.sender WHERE r.recipient=$1 AND ${visible} ORDER BY r.created DESC LIMIT 50`,[n]),
 q(`SELECT ${fields},i.code FROM evo44_invites i JOIN evo44_users u ON u.name=i.sender WHERE i.recipient=$1 AND i.expires>now() AND ${mutual} AND ${visible} ORDER BY i.expires DESC LIMIT 20`,[n])]);
 return {friends82:{friends:f.rows.map(x=>({...B.publicPlayer(x),status:status(rooms,x.name)})),requests:a.rows.map(B.publicPlayer),invites:i.rows.filter(x=>{const r=rooms.get(x.code);return available(r)&&roomOf(rooms,x.name)===r&&roomOf(rooms,n)!==r;}).map(x=>({...B.publicPlayer(x),code:x.code,party:rooms.get(x.code).settings.party74,nightmare:!!rooms.get(x.code).nightmare80}))}};
 }
 if(m.action==='search82'){const term=typeof m.query==='string'?m.query.trim():'';if(!term||term.length>36)fail('Introduce el usuario o ID completo');const {rows}=await q(`SELECT ${fields},u.xp,u.best,u.wins,u.kills,u.games,u.bosses,(${mutual}) AS friend,EXISTS(SELECT 1 FROM evo52_requests WHERE sender=$1 AND recipient=u.name) AS sent,EXISTS(SELECT 1 FROM evo52_requests WHERE sender=u.name AND recipient=$1) AS received FROM evo44_users u WHERE (u.name=$2 OR u.public_id51::text=$3) AND ${visible} LIMIT 1`,[n,term.toLowerCase(),O.alias(term).toLowerCase()]);if(!rows[0])fail('Jugador no encontrado');const x=rows[0];return {found82:{...B.publicPlayer(x),self:x.name===n,friend:x.name!==n&&x.friend,sent:x.name!==n&&x.sent,received:x.name!==n&&x.received,status:status(rooms,x.name),level:P.level(x.xp,O.isFounder(x)).level60,xp:Number(x.xp||0),best:Number(x.best||0),wins:Number(x.wins||0),kills:Number(x.kills||0),games:Number(x.games||0),bosses:Number(x.bosses||0)}};}
 const publicId=O.alias(m.publicId);if(typeof publicId!=='string'||! /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(publicId))fail('ID de jugador inválido');
 const target=(await q(`SELECT ${fields} FROM evo44_users u WHERE u.public_id51=$2 AND u.name<>$1 AND ${mutual} AND ${visible}`,[n,publicId])).rows[0];if(!target)fail('Necesitas una amistad aceptada por ambos');const code=String(m.code||'').toUpperCase();if(!/^[A-Z0-9]{4,12}$/.test(code))fail('Código inválido');const r=rooms.get(code);
 if(m.action==='invite82'){if(!available(r)||roomOf(rooms,n)!==r)fail('Abre una sala de expedición con espacio libre');if(roomOf(rooms,target.name)===r)fail('Tu amigo ya está en la sala');if(status(rooms,target.name)==='playing')fail('Tu amigo está jugando');if(status(rooms,target.name)==='offline')fail('Tu amigo está desconectado');await q('DELETE FROM evo44_invites WHERE expires<=now()');await q("INSERT INTO evo44_invites(recipient,sender,code,mode,expires) VALUES($1,$2,$3,'invasion',now()+interval '5 minutes') ON CONFLICT(recipient,sender,code) DO NOTHING",[target.name,n,code]);return {message:'Invitación enviada'};}
 if(m.action==='respond82'){if(typeof m.accept!=='boolean')fail('Respuesta inválida');if(m.accept&&(!available(r)||roomOf(rooms,target.name)!==r||roomOf(rooms,n)===r))fail('La sala ya no está disponible');const result=await q('DELETE FROM evo44_invites WHERE recipient=$1 AND sender=$2 AND code=$3 AND expires>now() RETURNING code',[n,target.name,code]);if(!result.rowCount)fail('Invitación vencida o no disponible');return m.accept?{join82:{code,party:r.settings.party74}}:{message:'Invitación rechazada'};}
 fail('Acción desconocida');
 }
 return {request,status,touch,forget:name=>seen.delete(name)};
}
module.exports={ACTIONS,make,roomOf,available};
