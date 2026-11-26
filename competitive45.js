'use strict';
// Server-owned catalogue; offline purchases remain separate.
const catalog=Object.freeze([
{id:'jade',name:'Jade celestial',color:'#13bb83',price:300},
{id:'crimson',name:'Carmesí imperial',color:'#c32448',price:500},
{id:'azure',name:'Zafiro estelar',color:'#255ed7',price:750},
{id:'aurora',name:'Aurora legendaria',color:'#cb63ef',price:1000},
{id:'solar',name:'Sol ancestral',color:'#e8a42c',price:1500},
{id:'infernal60',name:'Dragón infernal',color:'#ef4c19',price:1200},
{id:'cyber60',name:'Cibernético X',color:'#19d4fa',price:1600},
{id:'galaxy60',name:'Devorador de galaxias',color:'#8b45ef',price:2000}
].map(Object.freeze));
const SCHEMA=`\nALTER TABLE evo44_users ADD COLUMN IF NOT EXISTS skins45 text[] NOT NULL DEFAULT '{}';
ALTER TABLE evo44_users ADD COLUMN IF NOT EXISTS skin45 text;
CREATE INDEX IF NOT EXISTS evo45_results_created ON evo44_results(created);`;
// A single conditional UPDATE serializes concurrent purchases on the account row.
const BUY='UPDATE evo44_users SET coins=coins-$3,skins45=array_append(skins45,$2) WHERE name=$1 AND coins >= $3 AND NOT ($2=ANY(skins45)) RETURNING name';
const EQUIP='UPDATE evo44_users SET skin45=$2 WHERE name=$1 AND ($2::text IS NULL OR $2=ANY(skins45)) RETURNING name';
const SEASON=`SELECT name,MAX(mass) AS best,COUNT(*) FILTER (WHERE win AND mode IN ('duel','royale')) AS wins,COUNT(*) AS games FROM evo44_results WHERE created >= (date_trunc('month',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC') GROUP BY name ORDER BY wins DESC,best DESC,name LIMIT 50`;
const find=id=>catalog.find(x=>x.id===id);
function skinFor(account,requested){if(require("./origin53").isFounder(account))return "#a66bf5";const item=find(account?.skin45);if(item&&account?.skins45?.includes(item.id))return item.color;return typeof requested==='string'&&/^#[0-9a-f]{6}$/i.test(requested)&&requested.toLowerCase()!=='#a66bf5'&&!catalog.some(x=>x.color===requested.toLowerCase())?requested:undefined;}
async function request(q,action,u,m,fail){if(action==='season'){const {rows}=await q(SEASON);return {season:rows.map(r=>({...r,best:Number(r.best),wins:Number(r.wins),games:Number(r.games)})),seasonLabel:new Date().toISOString().slice(0,7)};}const item=find(m.skinId);if(action==='buySkin'){if(!item)fail('Piel desconocida');const r=await q(BUY,[u.name,item.id,item.price]);if(!r.rowCount)fail('Saldo insuficiente o piel ya comprada');return {message:'Piel comprada'};}if(action==='equipSkin'){if(m.skinId!==null&&!item)fail('Piel desconocida');const r=await q(EQUIP,[u.name,item?.id??null]);if(!r.rowCount)fail('Primero compra esta piel');return {message:'Piel seleccionada'};}return null;}
module.exports={catalog,SCHEMA,BUY,EQUIP,SEASON,skinFor,request};
