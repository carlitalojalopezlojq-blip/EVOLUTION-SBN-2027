'use strict';
const crypto=require('node:crypto'),G=require('./app/src/main/assets/engine');
const X74=require('./expedition74');
const PREP=6000, FIGHT=3600, EGG=1800, dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const forms=[['gold','Rey dorado','#d9a728'],['fire','Rey infernal','#ec562f'],['ice','Rey glacial','#70d7fa'],['venom','Rey tóxico','#80c932'],['shadow','Rey del vacío','#8954ba'],['electric','Rey eléctrico','#456bef'],['ancient','Rey ancestral','#cbb995']];
const catalog=[...forms.map(([k,n,color])=>({id:'king73_'+k,name:'Transformación · '+n,color,rewardOnly:true,form73:true})),{id:'king73_mythic',name:'Transformación · Emperador del eclipse',color:'#b34ed8',rewardOnly:true,form73:true},{id:'egg73_solar',name:'Skin legendaria · Escamas solares',color:'#e8c25a',rewardOnly:true},{id:'egg73_lunar',name:'Skin legendaria · Cristal lunar',color:'#9fb6f8',rewardOnly:true}];
catalog.push(...X74.worlds.flatMap(w=>w.bosses.map(b=>({id:b.form74,name:'Transformación · '+b.name,color:b.c,rewardOnly:true,form73:true}))));
const SCHEMA=`CREATE TABLE IF NOT EXISTS evo73_awards(id uuid PRIMARY KEY,name text NOT NULL REFERENCES evo44_users(name),xp integer NOT NULL,coins integer NOT NULL,item text,kind text NOT NULL,created timestamptz NOT NULL DEFAULT now());`;
// The award and inventory update are one atomic, idempotent statement.
const AWARD=`WITH a AS (INSERT INTO evo73_awards(id,name,xp,coins,item,kind) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING RETURNING *) UPDATE evo44_users u SET xp=u.xp+a.xp+CASE WHEN a.item=ANY(u.skins45) AND a.kind='egg' THEN 300 ELSE 0 END,coins=u.coins+a.coins,bosses=u.bosses+CASE WHEN a.kind='kill' THEN 1 ELSE 0 END,skins45=CASE WHEN a.item IS NULL OR a.item=ANY(u.skins45) THEN u.skins45 ELSE array_append(u.skins45,a.item) END FROM a WHERE u.name=a.name RETURNING u.name`;
const award=(q,a)=>q(AWARD,[a.id,a.name,a.xp,a.coins,a.item||null,a.kind]);
function roll(n=crypto.randomInt(10000),pick=crypto.randomInt(2)){
 if(n<7000)return {xp:250,coins:0,label:'250 XP multijugador'};
 if(n<9300)return {xp:750,coins:0,label:'750 XP multijugador'};
 if(n<9800)return {xp:1500,coins:0,label:'1500 XP multijugador'};
 if(n<9980){const x=catalog.find(x=>x.id===(pick?'egg73_lunar':'egg73_solar'));return {xp:0,coins:0,item:x.id,label:x.name};}
 return {xp:0,coins:0,item:'king73_mythic',label:'Transformación mítica · Emperador del eclipse'};
}
const stage=m=>m>=1000?4:m>=500?3:m>=250?2:m>=100?1:0;
const names=['Nacimiento','Mutante','Depredador','Bestia legendaria','Monstruo ancestral'];
const elements={fire:{name:'Fuego',cd:100,range:310,mul:1},ice:{name:'Hielo',cd:160,range:330,mul:1.25},electric:{name:'Rayo',cd:120,range:330,mul:1.15},nature:{name:'Naturaleza',cd:200,range:300,mul:1},dark:{name:'Oscuridad',cd:140,range:360,mul:1.3},crystal:{name:'Cristal',cd:240,range:300,mul:1.2}};
const weak={fire:'ice',ice:'fire',venom:'electric',shadow:'crystal',electric:'nature',gold:'dark',ancient:'crystal'};
const humans=r=>Object.values(r.s.p).filter(p=>!G.isKing(p)&&!G.isBot(p)&&r.clients.has(p.id));
const element=k=>Object.hasOwn(elements,k)?k:'fire';
function init(s,party74){if(s.mode!=='invasion')return;s.kings73={phase:'prep',until:s.tick+PREP,wave:0,eggs:[],shots:[],serial:0};if(party74)X74.init(s.kings73,party74);s.nextKing=Number.MAX_SAFE_INTEGER;s.nextApocalypse=Number.MAX_SAFE_INTEGER;if(s.domination)s.domination.nextTitan=Number.MAX_SAFE_INTEGER;s.betaFruitTarget=950;if(s.domination)s.domination.fruitTarget=950;}
function notify(r,send,text){for(const ws of r.clients.values())send(ws,{notice73:text});}
function rewardFor(r,p,reward,enqueue,kind){const account=r.members.get(p.id)?.account;if(!account)return;enqueue({id:crypto.randomUUID(),name:account.name,...reward,kind},r,p.id);}
function hit(r,id,send,enqueue){const s=r.s,v=s.kings73,p=s.p[id];if(!v||v.phase!=='fight'||!p||!r.clients.has(id)||G.isKing(p)||stage(p.m)===0||s.tick<(p.attackAt73||0))return false;
 const k=element(r.members.get(id)?.element73),e=elements[k],h=p.body[0];const boss=Object.values(s.p).filter(q=>q.king73&&q.hp>0&&dist(h,q.body[0])<=e.range).sort((a,b)=>dist(h,a.body[0])-dist(h,b.body[0]))[0];if(!boss)return false;
 p.attackAt73=s.tick+e.cd;const base=[0,100,155,230,350][stage(p.m)];const damage=Math.min(boss.hp,Math.round(base*e.mul*(100/e.cd)*(weak[boss.type]===k?1.55:1)));boss.hp-=damage;
 boss.damage73[id]=(boss.damage73[id]||0)+damage;v.contributors[id]=(v.contributors[id]||0)+damage;
 if(k==='ice')boss.slowUntil=s.tick+55;if(k==='electric')p.energy=Math.min(100,p.energy+30);if(k==='nature')for(const a of humans(r))if(dist(h,a.body[0])<190){a.energy=Math.min(100,a.energy+25);if(a!==p){a.m+=2;boss.support73??={};boss.support73[id]=(boss.support73[id]||0)+1;}a.shieldUntil=Math.max(a.shieldUntil||0,s.tick+25);}if(k==='crystal')p.shieldUntil=Math.max(p.shieldUntil||0,s.tick+65);if(k==='dark')p.ghostUntil=Math.max(p.ghostUntil||0,s.tick+25);
 v.shots.push({from:h.slice(),to:boss.body[0].slice(),element:k,damage,until:s.tick+9});if(v.shots.length>20)v.shots.shift();
 if(boss.hp>0)return true;
 delete s.p[boss.id];v.defeated++;X74.cleared(v,boss);const participants=Object.keys(boss.damage73).filter(pid=>boss.damage73[pid]>0);for(const pid of participants){const mem=r.members.get(pid);if(!mem?.account)continue;const last=pid===id;rewardFor(r,{id:pid},{xp:last?1000:Math.max(100,Math.min(500,Math.floor(boss.damage73[pid]/3))),coins:last?500:100,item:last?(boss.form74||'king73_'+boss.type):null,label:last?'Transformación permanente · '+boss.name:'Premio por colaborar'},enqueue,last?'kill':'assist');}
 const top=participants.sort((a,b)=>boss.damage73[b]-boss.damage73[a])[0];if(top)rewardFor(r,{id:top},{xp:300,coins:150,label:'Mayor daño · 300 XP y 150 monedas'},enqueue,'bonus');const support=Object.keys(boss.support73||{}).sort((a,b)=>boss.support73[b]-boss.support73[a])[0];if(support)rewardFor(r,{id:support},{xp:200,coins:100,label:'Mejor apoyo · 200 XP y 100 monedas'},enqueue,'support');
 const eligible=[...new Set(participants.map(pid=>r.members.get(pid)?.account?.name).filter(Boolean))];v.eggs.push({id:crypto.randomUUID(),x:boss.body[0][0],y:boss.body[0][1],eligible,until:s.tick+EGG});notify(r,send,'¡'+boss.name+' derrotado por '+p.name+'! · Huevo dorado');return true;
}
function spawnWave(r,send){const s=r.s,v=s.kings73,ps=humans(r);if(v.expedition74)return X74.spawn(r,text=>notify(r,send,text));v.phase='fight';v.until=s.tick+FIGHT;v.wave++;v.contributors={};v.defeated=0;const count=Math.min(3,Math.max(1,Math.ceil(ps.length/3)));v.total=count;for(let i=0;i<count;i++){const spec=G.bosses[((v.wave-1)*3+i)%G.bosses.length],boss=G.spawn(s,G.KING+'-73-'+i,spec.name,spec.c);Object.assign(boss,spec,{king73:true,hp:3000+1500*ps.length,maxHp:3000+1500*ps.length,expires:v.until,damage73:{},attack:null,nextAttack73:s.tick+100+i*30});}notify(r,send,'¡INVASIÓN DE REYES! · 3 minutos para vencerlos');}
function before(r){const s=r.s,v=s.kings73;if(!v)return;for(const p of humans(r))p.team=0;}
function tick(r,send,enqueue){const s=r.s,v=s.kings73;if(!v)return;const ps=humans(r);if((v.phase==='prep'||v.phase==='retry')&&s.tick>=v.until&&ps.length)spawnWave(r,send);
 if(v.phase==='fight'){
  const kings=Object.values(s.p).filter(q=>q.king73);if(s.tick>=v.until||!kings.length){const cleared=v.defeated===v.total;for(const k of kings)delete s.p[k.id];for(const pid of Object.keys(v.contributors||{}))rewardFor(r,{id:pid},{xp:cleared?500:100,coins:cleared?250:25,label:cleared?'Invasión superada · 500 XP y 250 monedas':'Participación en la invasión'},enqueue,'wave');if(v.expedition74)X74.endFight(r,text=>notify(r,send,text));else{v.phase='prep';v.until=s.tick+PREP;notify(r,send,cleared?'¡Invasión superada! · Nueva preparación':'Los reyes se retiran · Nueva preparación');}}
  else for(const k of kings){if(!k.attack&&s.tick>=k.nextAttack73){const target=ps.filter(p=>dist(p.body[0],k.body[0])<500).sort((a,b)=>dist(a.body[0],k.body[0])-dist(b.body[0],k.body[0]))[0];if(target)k.attack={x:target.body[0][0],y:target.body[0][1],at:s.tick+40};k.nextAttack73=s.tick+(v.expedition74?Math.max(75,150-v.expedition74.world*7):140);}if(k.attack&&s.tick>=k.attack.at){for(const p of ps){if(dist(p.body[0],[k.attack.x,k.attack.y])>105||p.shieldUntil>s.tick||p.ghostUntil>s.tick)continue;p.m=Math.max(24,p.m-(k.type==='fire'?14:8)*(v.expedition74?1+(v.expedition74.world-1)*.12:1));p.energy=Math.max(0,p.energy-18);if(k.type==='ice'||k.type==='venom')p.slowUntil=s.tick+45;}k.attack=null;}}
 }
 v.shots=v.shots.filter(x=>x.until>s.tick);v.eggs=v.eggs.filter(e=>{if(e.until<=s.tick)return false;const p=ps.find(p=>e.eligible.includes(r.members.get(p.id)?.account?.name)&&dist(p.body[0],[e.x,e.y])<G.radius(p)+20);if(!p)return true;rewardFor(r,p,roll(),enqueue,'egg');return false;});if(v.expedition74)X74.portal(r,text=>notify(r,send,text));
}
function event(s){const v=s.kings73;if(!v)return {};return {seconds:Math.max(0,Math.ceil((v.until-s.tick)/20)),kings73:{phase:v.phase,wave:v.wave,tick:s.tick,...X74.event(v),eggs:v.eggs.map(({x,y})=>({x,y})),shots:v.shots,attacks:Object.values(s.p).filter(q=>q.king73&&q.attack).map(q=>q.attack),bosses:Object.values(s.p).filter(q=>q.king73).map(q=>({name:q.name,hp:q.hp,maxHp:q.maxHp}))}};}
function extra(r,q){if(!r.s.kings73)return {};return {worldBoss74:q.world74||0,stage73:stage(q.m),attackWait73:Math.max(0,Math.ceil(((q.attackAt73||0)-r.s.tick)/20)),element73:element(r.members.get(q.id)?.element73)};}
module.exports={PREP,FIGHT,EGG,SCHEMA,AWARD,award,roll,catalog,stage,names,elements,element,init,before,tick,event,extra,hit};
