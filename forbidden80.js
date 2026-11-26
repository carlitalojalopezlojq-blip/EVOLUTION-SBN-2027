'use strict';
const crypto=require('node:crypto');
const roles={attack:{name:'Atacante',damage:1.25},guard:{name:'Defensor',damage:.85},heal:{name:'Sanador',damage:.85},special:{name:'Especialista',damage:1.05}};
const role=k=>Object.hasOwn(roles,k)?k:'attack';
const fusions=[
 ['king73_fusion_balance','Dragón del equilibrio','#b6baff',['king73_fire','king73_ice']],
 ['king73_fusion_hydra','Hidra del apocalipsis','#f35057',['king73_world3_1','king73_world6_1']],
 ['king73_fusion_angel','Ángel del exterminio','#f6dfad',['king73_world4_2','king73_world10_2']],
 ['king73_fusion_gods','Devorador de dioses','#dbaf67',['king73_world7_1','king73_world10_3']],
 ['king73_fusion_reality','Destructor de realidades','#ba79ef',['king73_world9_2','king73_world9_3']]
].map(([id,name,color,requires])=>({id,name:'Fusión · '+name,color,requires,rewardOnly:true,form73:true}));
// Original forms from the current route are also valid ingredients for the fire/ice fusion.
fusions[0].requires=['king73_world6_1','king73_world4_1'];
const rareForms=[['king73_egg_diamond','Diamante viviente','#66d7fa'],['king73_egg_divine','Serpiente divina','#e9d38b'],['king73_egg_apocalypse','Apocalipsis escarlata','#e54e56'],['king73_egg_unknown','Entidad desconocida','#986fff']].map(([id,name,color])=>({id,name:'Transformación · '+name,color,rewardOnly:true,form73:true}));
const tiers=[['Dorado','#f5b536',0],['Diamante','#62dfff',2],['Mítico','#c65af5',3],['Divino','#ffed9b',4],['Apocalíptico','#ff485c',5],['Desconocido','#8970ff',6]];
function tier(world){return world>=11?5:world>=10?4:world>=8?3:world>=6?2:world>=4?1:0;}
// Integer roll: published odds; higher worlds improve item odds modestly, never guaranteed.
function odds(t){t=Math.max(0,Math.min(5,t|0));return [7000-400*t,2300+200*t,500+100*t,180+75*t,20+25*t];}
function roll(t,n=crypto.randomInt(10000),pick=crypto.randomInt(2)){const o=odds(t);let i=0;while(i<4&&n>=o[i])n-=o[i++];if(i<3){const xp=[250,750,1500][i];return {xp,coins:0,label:xp+' XP multijugador'};}if(i===3)return {xp:0,coins:0,item:pick?'egg73_lunar':'egg73_solar',label:'Skin legendaria'};const item=t>=4?rareForms[t-2]:t>=1?rareForms[t-1]:null;return {xp:0,coins:0,item:item?.id||'king73_mythic',label:item?.name||'Transformación mítica · Emperador del eclipse'};}
const phase=b=>b.hp/b.maxHp<=.2?3:b.hp/b.maxHp<=.6?2:1;
const attackRadius=b=>[0,105,125,150][phase(b)];
const cadence=(b,world)=>Math.max(48,150-world*7-(phase(b)-1)*24);
function roleHit(r,p,b,damage){if(!r.s.expedition80)return damage;const s=r.s,key=role(r.members.get(p.id)?.role80);if(key==='special')b.slowUntil=Math.max(b.slowUntil||0,s.tick+35);if(key==='guard'||key==='heal')for(const q of Object.values(s.p)){if(q.king73||Math.hypot(q.body[0][0]-p.body[0][0],q.body[0][1]-p.body[0][1])>190)continue;if(key==='guard')q.shieldUntil=Math.max(q.shieldUntil||0,s.tick+30);else {q.energy=Math.min(100,q.energy+18);if(q!==p)q.m+=3;}}const mastered=(r.members.get(p.id)?.account?.skins45||[]).filter(x=>/^king73_world\d+_\d+$/.test(x)).length;return Math.max(1,Math.round(damage*roles[key].damage*(1+Math.min(3,Math.floor(mastered/5))*.05)));}
function rescue(r,id,G){const s=r.s,p=s.p[id];if(!s.expedition80||!p||!r.clients.has(id)||p.energy<45||s.tick<(p.rescue80||0))return null;const target=[...r.members.keys()].find(k=>k!==id&&r.clients.has(k)&&!s.p[k]&&s.deaths[k]?.position80&&Math.hypot(p.body[0][0]-s.deaths[k].position80[0],p.body[0][1]-s.deaths[k].position80[1])<=180);if(!target)return null;const d=s.deaths[target],m=r.members.get(target),q=G.revive(s,target,m.name,m.skin);if(!q)return null;p.energy-=45;p.rescue80=s.tick+200;q.m=Math.max(24,Math.floor((d.m||24)*.55));q.body=[[...p.body[0]]];q.a=q.t=p.a;q.shieldUntil=s.tick+100;delete s.deaths[target];return {target,q};}
let eventUntil=0;const eventActive=()=>Date.now()<eventUntil;
const ruby={id:'king73_ruby_event',name:'Transformación · Guardián rubí',color:'#c6344d',rewardOnly:true,form73:true};
const nemesis={id:'king73_nemesis80',name:'Transformación · Némesis del origen',color:'#a654e9',rewardOnly:true,form73:true};
const ACTIONS=new Set(['fuse80','bestiary80','records80','rubyEvent80']);
async function request(q,m,u,fail){if(!u)fail('Inicia sesión primero');if(m.action==='rubyEvent80'){if(!require('./origin53').isFounder(u))fail('Solo el fundador');eventUntil=m.active===true?Date.now()+3600000:0;return {message:eventActive()?'Evento rubí activo durante una hora para nuevas expediciones':'Evento rubí desactivado'};}if(m.action==='fuse80'){const f=fusions.find(x=>x.id===m.id);if(!f)fail('Fusión desconocida');const res=await q('UPDATE evo44_users SET skins45=array_append(skins45,$2) WHERE name=$1 AND skins45 @> $3::text[] AND NOT ($2=ANY(skins45)) RETURNING name',[u.name,f.id,f.requires]);if(!res.rowCount)fail('Necesitas las dos transformaciones o ya tienes esta fusión');return {message:'Fusión desbloqueada · '+f.name};}if(m.action==='records80'){const res=await q("SELECT name,count(*)::int AS completadas,MIN(duration80)::int AS mejor FROM evo73_awards WHERE kind='complete80' GROUP BY name ORDER BY mejor ASC NULLS LAST,completadas DESC,name LIMIT 30");return {records80:res.rows};}const res=await q("SELECT item,count(*)::int AS defeats FROM evo73_awards WHERE name=$1 AND kind='kill' AND item IS NOT NULL GROUP BY item",[u.name]);const achievements=await q("SELECT kind,count(*)::int AS total FROM evo73_awards WHERE name=$1 AND kind IN ('complete80','rescue80','secret80','immortal80') GROUP BY kind",[u.name]);return {bestiary80:res.rows,achievements80:achievements.rows,fusions80:fusions};}
module.exports={nemesis,ruby,eventActive,roles,role,fusions,rareForms,tiers,tier,odds,roll,phase,attackRadius,cadence,roleHit,rescue,ACTIONS,request};
