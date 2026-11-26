'use strict';
const O=require('./origin53');
const SCHEMA=`\nALTER TABLE evo44_users ADD COLUMN IF NOT EXISTS badge_verified57 boolean NOT NULL DEFAULT false;\n`;
const ACTIONS=new Set(['badgeFind57','badgeList57','badgeSet57']);
function role(a){return O.isFounder(a)?'F':a?.badge_verified57===true?'V':null;}
function identity(a){return {badge57:role(a)};}
function publicPlayer(a){return {name:O.isFounder(a)?O.DISPLAY:a.name,id:O.isFounder(a)?O.ID:a.public_id51,...identity(a)};}
const fields='name,public_id51,badge_verified57';
async function request(q,m,u,fail){
 if(!O.isFounder(u))fail('Solo el fundador puede administrar insignias.');
 if(m.action==='badgeList57'){
  const after=typeof m.after==='string'?m.after.trim().toLowerCase():'';
  if(after.length>20)fail('Página inválida');
  const {rows}=await q(`SELECT ${fields} FROM evo44_users WHERE badge_verified57=true AND name<>$1 AND name>$2 ORDER BY name LIMIT 51`,[O.NAME,after]);
  return {badgePlayers57:rows.slice(0,50).map(publicPlayer),next57:rows.length>50?rows[49].name:null};
 }
 if(m.action==='badgeFind57'){
  const term=typeof m.query==='string'?m.query.trim():'';
  if(!term||term.length>36)fail('Introduce el usuario o ID público completo.');
  const {rows}=await q(`SELECT ${fields} FROM evo44_users WHERE name=$1 OR public_id51::text=$2 LIMIT 1`,[term.toLowerCase(),O.alias(term).toLowerCase()]);
  if(!rows[0])fail('Jugador no encontrado');
  return {badgePlayer57:publicPlayer(rows[0])};
 }
 if(m.action==='badgeSet57'){
  if(typeof m.enabled!=='boolean'||typeof m.publicId!=='string'||! /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(m.publicId))fail('Solicitud de insignia inválida');
  if(m.publicId.toLowerCase()===O.UUID)fail('La F del fundador es permanente.');
  const {rows}=await q(`UPDATE evo44_users SET badge_verified57=$2 WHERE public_id51=$1 AND name<>$3 RETURNING ${fields}`,[m.publicId,m.enabled,O.NAME]);
  if(!rows[0])fail('Jugador no encontrado o protegido');
  return {badgePlayer57:publicPlayer(rows[0]),badgeChanged57:true,message:m.enabled?'V otorgada correctamente.':'V retirada correctamente.'};
 }
 fail('Acción desconocida');
}
module.exports={SCHEMA,ACTIONS,role,identity,publicPlayer,request};
