(function(root){'use strict';
const missions=[{id:'fruits',name:'Come 100 frutas',target:100,coins:2},{id:'games',name:'Juega 3 partidas',target:3,coins:2},{id:'infernal',name:'Sobrevive al rey infernal',target:1,coins:5},{id:'score',name:'Alcanza 1000 puntos en una partida',target:1000,coins:3}];
const ranks=['Bronce','Plata','Oro','Platino','Diamante','Maestro','Legendario','Élite','Rey supremo'],thresholds=[0,100,250,500,900,1500,2500,4000,6500];
function day(now=new Date()){return [now.getFullYear(),now.getMonth()+1,now.getDate()].join('-');}
function number(x){return Number.isSafeInteger(x)&&x>=0?x:0;}
function init(p,raw={},now=new Date()){raw=raw||{};p.xp=number(raw.xp);const c=raw.controls||{};p.controls={size:[.8,1,1.2].includes(c.size)?c.size:1,sensitivity:[.7,1,1.3].includes(c.sensitivity)?c.sensitivity:1,side:c.side==='right'?'right':'left'};p.daily={date:day(now),counts:{},claimed:[]};if(raw.daily?.date===p.daily.date){for(const m of missions)p.daily.counts[m.id]=number(raw.daily.counts?.[m.id]);p.daily.claimed=missions.filter(m=>raw.daily.claimed?.includes(m.id)).map(m=>m.id);}return p;}
function ensure(p,now){if(p.daily?.date!==day(now))p.daily={date:day(now),counts:{},claimed:[]};}
function record(p,delta={},now=new Date()){ensure(p,now);for(const m of missions){const n=number(delta[m.id]);const old=p.daily.counts[m.id]||0;p.daily.counts[m.id]=Math.min(m.target,m.id==='score'?Math.max(old,n):old+n);}p.xp=number(p.xp)+number(delta.fruits)+20*number(delta.infernal)+20*number(delta.glacial);}
function claim(p,id,now=new Date()){ensure(p,now);const m=missions.find(x=>x.id===id);if(!m||p.daily.claimed.includes(id)||(p.daily.counts[id]||0)<m.target)return false;p.daily.claimed.push(id);p.coins+=m.coins;return true;}
function rank(p){let i=0;while(i+1<thresholds.length&&p.xp>=thresholds[i+1])i++;return {name:ranks[i],xp:p.xp,next:thresholds[i+1]??null};}
const api={missions,init,ensure,record,claim,rank};if(typeof module!=='undefined')module.exports=api;else root.Progression=api;})(globalThis);
