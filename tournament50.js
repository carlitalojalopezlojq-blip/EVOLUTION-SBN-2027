'use strict';
const crypto=require('node:crypto');
const PRIZE=Object.freeze({coins:500,xp:250}),MIN_PLAYERS=3,MIN_TICKS=600;
const SCHEMA=`\nCREATE TABLE IF NOT EXISTS evo50_tournament_prizes (id uuid PRIMARY KEY,name text NOT NULL REFERENCES evo44_users(name),day date NOT NULL,players integer NOT NULL CHECK(players BETWEEN 3 AND 10),created timestamptz NOT NULL DEFAULT now(),UNIQUE(name,day));
CREATE INDEX IF NOT EXISTS evo50_prizes_day ON evo50_tournament_prizes(day);`;
const AWARD=`WITH won AS (INSERT INTO evo50_tournament_prizes(id,name,day,players) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING RETURNING name) UPDATE evo44_users u SET coins=u.coins+$5,xp=u.xp+$6 FROM won WHERE u.name=won.name RETURNING u.name`;
const RANK=`SELECT name,count(*) AS wins FROM evo50_tournament_prizes WHERE day >= date_trunc('month',now() AT TIME ZONE 'UTC')::date GROUP BY name ORDER BY wins DESC,name LIMIT 50`;
function start(r){r.tournament50={id:crypto.randomUUID(),entries:[...r.members].map(([id,m])=>({id,name:m.account?.name})),done:false,dead:new Set()};}
function observe(r){const t=r.tournament50;if(t)for(const x of t.entries)if(r.s.deaths[x.id])t.dead.add(x.id);}
function outcome(r){observe(r);const t=r.tournament50,s=r.s;if(!t||t.done||!s.winner)return null;t.done=true;const id=s.winner.id,w=t.entries.find(x=>x.id===id);if(!w?.name||t.entries.length<MIN_PLAYERS||s.tick<MIN_TICKS||!r.clients.has(id)||new Set(t.entries.map(x=>x.name)).size!==t.entries.length||t.entries.some(x=>!x.name||x.id!==id&&!t.dead.has(x.id)))return {eligible:false,id};return {eligible:true,id,args:[t.id,w.name,new Date().toISOString().slice(0,10),t.entries.length,PRIZE.coins,PRIZE.xp]};}
async function award(q,args){const res=await q(AWARD,args);if(res.rowCount)return 'awarded';const previous=await q('SELECT id FROM evo50_tournament_prizes WHERE id=$1 AND name=$2',[args[0],args[1]]);return previous.rowCount?'awarded':'daily-limit';}
async function ranking(q){const {rows}=await q(RANK);return {tournamentRank:rows.map(r=>({name:r.name,wins:Number(r.wins)})),month:new Date().toISOString().slice(0,7),prize:PRIZE};}
function blocks(q){const out=[];for(let i=0;i<q.body.length;i+=32){const part=[];let x0=Infinity,x1=-Infinity,y0=Infinity,y1=-Infinity;for(let j=i;j<Math.min(i+33,q.body.length);j++){const b=q.body[j],x=Math.round(b[0]),y=Math.round(b[1]);part.push([x,y]);if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}out.push({i,part,x0,x1,y0,y1});}return out;}
module.exports={SCHEMA,AWARD,RANK,PRIZE,MIN_PLAYERS,MIN_TICKS,start,observe,outcome,award,ranking,blocks};
