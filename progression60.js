'use strict';
const O=require('./origin53');
const cap=100, threshold=l=>100*(Math.max(1,Math.min(cap,l))-1)*Math.max(1,Math.min(cap,l))/2;
function level(xp,founder=false){xp=Math.max(0,Number(xp)||0);let l=founder?100:Math.min(100,Math.floor((1+Math.sqrt(1+xp/12.5))/2));return {level60:l,xp60:xp,nextXp60:l===100?null:threshold(l+1),baseXp60:threshold(l),founderMax60:founder};}
const rank=p=>p>=3000?'Legendario':p>=1500?'Maestro':p>=750?'Diamante':p>=350?'Oro':p>=100?'Plata':'Bronce';
const missions=[{id:'time',label:'Sobrevive 10 minutos',goal:600,reward:250,field:'seconds'},{id:'games',label:'Completa 3 partidas de al menos 30 s',goal:3,reward:150,field:'games'},{id:'win',label:'Gana una partida competitiva',goal:1,reward:500,field:'wins'},{id:'mass',label:'Alcanza 300 de masa',goal:300,reward:200,field:'best'}];
const SCHEMA=`
CREATE TABLE IF NOT EXISTS evo60_claims(name text REFERENCES evo44_users(name),day date NOT NULL,mission text NOT NULL,PRIMARY KEY(name,day,mission));
CREATE TABLE IF NOT EXISTS evo60_season_claims(name text REFERENCES evo44_users(name),season date NOT NULL,PRIMARY KEY(name,season));
CREATE TABLE IF NOT EXISTS evo60_news(id bigserial PRIMARY KEY,author text REFERENCES evo44_users(name),message text NOT NULL,created timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS evo60_admin(id bigserial PRIMARY KEY,actor text REFERENCES evo44_users(name),target text REFERENCES evo44_users(name),action text NOT NULL,detail text NOT NULL,created timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS evo60_suspensions(name text PRIMARY KEY REFERENCES evo44_users(name),until_at timestamptz NOT NULL);
CREATE INDEX IF NOT EXISTS evo60_results_name_created ON evo44_results(name,created);
`;
const today="(now() AT TIME ZONE 'America/Lima')::date";
const dayFilter=`created >= (${today}::timestamp AT TIME ZONE 'America/Lima') AND created < ((${today}+1)::timestamp AT TIME ZONE 'America/Lima')`;
const summary=`SELECT COALESCE(SUM(seconds),0) AS seconds,COUNT(*) FILTER (WHERE seconds>=30) AS games,COUNT(*) FILTER (WHERE win AND mode IN ('duel','royale','duos')) AS wins,COALESCE(MAX(mass),0) AS best FROM evo44_results WHERE name=$1 AND ${dayFilter}`;
const season=`SELECT name,COALESCE(SUM(CASE WHEN win THEN 50 ELSE 5 END + LEAST(25,mass/100)),0) AS points,COUNT(*) FILTER (WHERE win) AS wins FROM evo44_results WHERE mode IN ('duel','royale','duos') AND seconds>=10 AND created>=date_trunc('month',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' GROUP BY name ORDER BY points DESC,name LIMIT 50`;
const ACTIONS=new Set(['progress60','claim60','season60','news60','admin60','gift60','publish60','suspend60','seasonReward60']);
async function request(q,m,u,rooms,fail){
 if(m.action==='news60')return {news60:(await q('SELECT message,created FROM evo60_news ORDER BY id DESC LIMIT 5')).rows};
 if(!u)fail('Inicia sesión primero');
 if(m.action==='progress60'){
  const [stats,claimed,points]=await Promise.all([q(summary,[u.name]),q(`SELECT mission FROM evo60_claims WHERE name=$1 AND day=${today}`,[u.name]),q(`SELECT COALESCE(SUM(CASE WHEN win THEN 50 ELSE 5 END + LEAST(25,mass/100)),0) AS points FROM evo44_results WHERE name=$1 AND mode IN ('duel','royale','duos') AND seconds>=10 AND created>=date_trunc('month',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC'`,[u.name])]);
  const p=Number(points.rows[0]?.points)||0;return {missions60:missions.map(x=>({...x,progress:Math.min(x.goal,Number(stats.rows[0]?.[x.field])||0),claimed:claimed.rows.some(y=>y.mission===x.id)})),points60:p,rank60:rank(p)};
 }
 if(m.action==='claim60'){
  const x=missions.find(x=>x.id===m.mission);if(!x)fail('Misión desconocida');
  const r=await q(`WITH stats AS (${summary}), claim AS (INSERT INTO evo60_claims(name,day,mission) SELECT $1,${today},$2 FROM stats WHERE ${x.field}>=$3 ON CONFLICT DO NOTHING RETURNING name) UPDATE evo44_users u SET coins=u.coins+$4 FROM claim WHERE u.name=claim.name RETURNING u.name`,[u.name,x.id,x.goal,x.reward]);if(!r.rowCount)fail('Misión incompleta o ya reclamada');return {message:`+${x.reward} monedas`};
 }
 if(m.action==='seasonReward60'){const r=await q(`WITH scores AS (SELECT COALESCE(SUM(CASE WHEN win THEN 50 ELSE 5 END + LEAST(25,mass/100)),0) AS points FROM evo44_results WHERE name=$1 AND mode IN ('duel','royale','duos') AND seconds>=10 AND created >= ((date_trunc('month',now() AT TIME ZONE 'UTC')-interval '1 month') AT TIME ZONE 'UTC') AND created < (date_trunc('month',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC')), claim AS (INSERT INTO evo60_season_claims(name,season) SELECT $1,(date_trunc('month',now() AT TIME ZONE 'UTC')-interval '1 month')::date FROM scores WHERE points>=100 ON CONFLICT DO NOTHING RETURNING name) UPDATE evo44_users u SET coins=u.coins+CASE WHEN scores.points>=3000 THEN 2000 WHEN scores.points>=1500 THEN 1200 WHEN scores.points>=750 THEN 750 WHEN scores.points>=350 THEN 400 ELSE 200 END FROM claim,scores WHERE u.name=claim.name RETURNING u.name`,[u.name]);if(!r.rowCount)fail('Premio no disponible: necesitas al menos 100 puntos la temporada anterior y no haberlo reclamado.');return {message:'Recompensa de temporada anterior guardada'};}
 if(m.action==='season60'){const r=await q(season);const B=require('./verification57'),dir=await B.directory(q,r.rows.map(x=>x.name));return {season60:r.rows.map(x=>({...x,...B.named(dir,x.name),points:Number(x.points),rank:rank(Number(x.points))})),month60:new Date().toISOString().slice(0,7)};}
 if(!O.isFounder(u))fail('Solo el fundador puede administrar el juego');
 if(m.action==='admin60'){
  const reports=await q('SELECT reporter,target,reason,created FROM evo52_reports ORDER BY created DESC LIMIT 30');const audit=await q('SELECT action,target,detail,created FROM evo60_admin ORDER BY id DESC LIMIT 25');
  const players=new Set();for(const r of rooms.values())for(const [id,mem] of r.members)if(r.clients.has(id)&&mem.account)players.add(mem.name);return {online60:[...players],reports60:reports.rows,audit60:audit.rows};
 }
 if(m.action==='publish60'){
  const text=typeof m.text==='string'?m.text.trim():'';if(text.length<5||text.length>180)fail('Anuncio: 5–180 caracteres');await q(`WITH n AS (INSERT INTO evo60_news(author,message) VALUES($1,$2) RETURNING author) INSERT INTO evo60_admin(actor,action,detail) SELECT author,'anuncio',$2 FROM n`,[u.name,text]);return {message:'Anuncio publicado',announcement60:text};
 }
 const target=typeof m.target==='string'?m.target.trim().toLowerCase():'';if(!target||target.length>36||target===O.NAME||target===O.UUID||target===O.ID.toLowerCase())fail('Jugador inválido o protegido');
 const r=await q('SELECT name,public_id51 FROM evo44_users WHERE name=$1 OR public_id51::text=$1 LIMIT 1',[target]);if(!r.rows[0]||O.isFounder(r.rows[0]))fail('Jugador no encontrado o protegido');const n=r.rows[0].name;
 if(m.action==='gift60'){
  const amount=m.amount;if(!Number.isInteger(amount)||amount<1||amount>10000)fail('Regalo: 1–10 000 monedas');await q(`WITH g AS (UPDATE evo44_users SET coins=coins+$3::bigint WHERE name=$2 RETURNING name) INSERT INTO evo60_admin(actor,target,action,detail) SELECT $1,name,'regalo',($3::bigint)::text FROM g`,[u.name,n,amount]);return {message:'Regalo enviado'};
 }
 if(m.action==='suspend60'){
  const hours=m.hours;if(!Number.isInteger(hours)||hours<0||hours>168)fail('Suspensión: 0–168 horas');await q(`WITH s AS (INSERT INTO evo60_suspensions(name,until_at) VALUES($2,now()+$3::integer*interval '1 hour') ON CONFLICT(name) DO UPDATE SET until_at=excluded.until_at RETURNING name) INSERT INTO evo60_admin(actor,target,action,detail) SELECT $1,name,'suspension',($3::integer)::text FROM s`,[u.name,n,hours]);return {message:hours?'Suspensión guardada':'Suspensión retirada',suspended60:hours?n:null};
 }
 fail('Acción desconocida');
}
module.exports={level,threshold,rank,missions,SCHEMA,ACTIONS,request,summary,season};
