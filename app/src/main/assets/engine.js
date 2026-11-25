(function(root){
'use strict';
const W=4000, colors=['#43ffd1','#ff527d','#ad80ff','#ffcf55','#49aaff','#a5df41','#d86b36'], KING='__king__', KING_INTERVAL=6000, KING_DURATION=3600, CELL=48;
const key=(x,y)=>Math.floor(x/CELL)+Math.floor(y/CELL)*128;
const dist=(a,b)=>(a[0]-b[0])**2+(a[1]-b[1])**2;
function fruit(x=Math.random()*W,y=Math.random()*W,m=0.25+Math.random()*0.35){return [Math.max(12,Math.min(W-12,x)),Math.max(12,Math.min(W-12,y)),m,Math.random()*20|0];}
const isKing=id=>id===KING||id===KING+2;
const POWER_TYPES=["shield","speed","magnet","ghost","freeze","double"],DUR=[100,100,200,60,100,300];
function pickup(){return [100+Math.random()*(W-200),100+Math.random()*(W-200),Math.random()*6|0];}
const MODES=["classic","survival","royale","teams","competitive"];
function world(mode="classic"){mode=MODES.includes(mode)?mode:"classic";return {mode,participants:0,started:false,result:null,teamScores:[0,0],nextKing:mode==="survival"?1200:KING_INTERVAL,p:Object.create(null),f:Array.from({length:950},()=>fruit()),tick:0,kingUntil:0,round:0,eligible:new Set(),bosses:[],rewards:{},map:"classic",items:Array.from({length:24},pickup),extra:null,nextExtra:1200,meteors:[]};}
function spawn(s,id,name,c){const old=s.p[id];const team=old?.team??(isKing(id)?-1:s.participants++%2);let x=400+Math.random()*3200,y=400+Math.random()*3200;let m=isKing(id)?150:24;let a=Math.random()*Math.PI*2; if(isKing(id)){x=W/2;y=W/2;}return s.p[id]={id,name,team,c:c||colors[Math.random()*colors.length|0],a,t:a,b:false,m,shield:0,powers:{},score:0, deaths:0, reward:0, wins:[0,0],body:Array.from({length:m},(_,i)=>[x-Math.cos(a)*i*5,y-Math.sin(a)*i*5])};}
function bounds(s){const inset=s.mode==="royale"&&s.started?Math.min(1700,Math.max(0,(s.tick-400)*.35)):0;return [inset,W-inset];}
function info(s){return {mode:s.mode,started:s.started,result:s.result,bounds:bounds(s),teamScores:s.teamScores,king:s.bosses.length>0,bosses:s.bosses.map(id=>({id,head:s.p[id]?.body[0]})),map:s.map,extra:s.extra?.type||null,meteors:s.meteors,items:s.items,seconds:Math.max(0,Math.ceil(((s.bosses.length?s.kingUntil:s.nextKing)-s.tick)/20))};}
function step(s){if(s.result)return;if(s.mode==="royale"&&!s.started){if(Object.values(s.p).filter(p=>!isKing(p.id)).length<2)return;s.started=true;}s.tick++;
 if(s.extra&&s.tick>=s.extra.until){s.extra=null;s.meteors=[];}
 if(s.tick>=s.nextExtra){s.nextExtra=s.tick+1800;if(!s.bosses.length&&!s.extra){s.extra={type:['golden','dark','meteor'][Math.random()*3|0],until:s.tick+600};}}
 if(s.extra?.type==='golden'&&s.tick%20===0){for(let i=0;i<12;i++){let f=fruit();f[4]=1;s.f.push(f);}}
 if(s.extra?.type==='meteor'&&s.tick%40===0){for(let i=0;i<12;i++)s.meteors.push([Math.random()*W,Math.random()*W,s.tick+30]);}
 s.meteors=s.meteors.filter(m=>m[2]+8>=s.tick);

 if(s.bosses.length&&s.tick>=s.kingUntil){for(const id of s.eligible){const p=s.p[id];if(!p)continue;p.reward+=s.bosses.length===2?30:10;for(const k of s.bosses)p.wins[k===KING?0:1]++;}for(const k of s.bosses)delete s.p[k];s.bosses=[];s.eligible.clear();}
 if(s.mode!=="royale"&&s.mode!=="teams"&&s.tick>=s.nextKing){s.nextKing+=KING_INTERVAL;if(!s.bosses.length){s.bosses=Math.random()<.05?[KING,KING+2]:[s.round++%2?KING+2:KING];s.eligible=new Set(Object.keys(s.p));for(const k of s.bosses){const p=spawn(s,k,k===KING?'REY INFERNAL':'REY GLACIAL',k===KING?'#ff512d':'#71dfff');if(k!==KING)p.body=p.body.map(q=>[q[0]+400,q[1]+400]);}s.kingUntil=s.tick+KING_DURATION;s.extra=null;s.meteors=[];}}
 const ps=Object.values(s.p),dead=new Set(),grid=new Map(),fg=new Map(),eaten=new Set();
 for(let i=0;i<s.f.length;i++){const f=s.f[i],k=key(f[0],f[1]);let v=fg.get(k);if(!v)fg.set(k,v=[]);v.push(i);}
 for(const king of ps.filter(p=>isKing(p.id))){let h=king.body[0],best=Infinity,v=null;for(const p of ps){if(isKing(p.id))continue;const d=dist(h,p.body[0]);if(d<best){best=d;v=p.body[0];}}if(v)king.t=Math.atan2(v[1]-h[1],v[0]-h[0]);if(h[0]<100||h[1]<100||h[0]>W-100||h[1]>W-100)king.t=Math.atan2(W/2-h[1],W/2-h[0]);}
 for(const p of ps){const boss=isKing(p.id);let d=Math.atan2(Math.sin(p.t-p.a),Math.cos(p.t-p.a));p.a+=Math.max(boss?-.16:-.25,Math.min(boss?.16:.25,d));let h=p.body[0],power=k=>(p.powers[k]||0)>s.tick,boost=!boss&&p.b&&p.m>24,v=boss?10.5:boost?12:power('speed')?10:7;
 if(!boss){for(let i=s.items.length-1;i>=0;i--){let it=s.items[i];if(dist(h,it)<30**2){let k=POWER_TYPES[it[2]];if(!s.bosses.length||!['shield','ghost','freeze'].includes(k)){p.powers[k]=s.tick+DUR[it[2]];s.items.splice(i,1);}}}if(!s.bosses.length&&ps.some(q=>q!==p&&!isKing(q.id)&&(q.powers.freeze||0)>s.tick&&dist(h,q.body[0])<150**2))v*=.65;if(s.meteors.some(m=>m[2]<=s.tick&&dist(h,m)<65**2)&&p.shield<=s.tick)dead.add(p.id);}

 if(boost){p.m=Math.max(24,p.m-.15);}
 h=[h[0]+Math.cos(p.a)*v,h[1]+Math.sin(p.a)*v];p.body.unshift(h);while(p.body.length>Math.floor(p.m))p.body.pop();const [lo,hi]=bounds(s);if(h[0]<lo||h[1]<lo||h[0]>hi||h[1]>hi)dead.add(p.id);
 const cx=Math.floor(h[0]/CELL),cy=Math.floor(h[1]/CELL),r=boss?45:power("magnet")?85:23;
 for(let i=-2;i<=2;i++)for(let j=-2;j<=2;j++){const list=fg.get(cx+i+(cy+j)*128);if(!list)continue;for(const n of list){if(!eaten.has(n)&&dist(h,s.f[n])<r*r){eaten.add(n);p.fruits=(p.fruits||0)+1;const gain=(s.f[n][4]?5:1+s.f[n][3]%3)*(power("double")?2:1);p.score+=gain;if(s.mode==="teams"&&!boss)s.teamScores[p.team]+=gain;p.m=Math.min(boss?200:180,p.m+s.f[n][2]);}}}
 for(let n=0;n<p.body.length;n+=2){const q=p.body[n],k=key(q[0],q[1]);let list=grid.get(k);if(!list)grid.set(k,list=[]);list.push([p.id,q[0],q[1]]);} }
 for(const p of ps){if(isKing(p.id)||p.shield>s.tick)continue;const h=p.body[0],cx=Math.floor(h[0]/CELL),cy=Math.floor(h[1]/CELL);outer:for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const list=grid.get(cx+i+(cy+j)*128);if(!list)continue;for(const q of list){if(q[0]===p.id)continue;if(s.mode==="teams"&&!isKing(q[0])&&s.p[q[0]]?.team===p.team)continue;if(!isKing(q[0])&&!s.bosses.length&&(p.powers.ghost||0)>s.tick)continue;let r=isKing(q[0])?46:19;if((h[0]-q[1])**2+(h[1]-q[2])**2<r*r){if(!isKing(q[0])&&!s.bosses.length&&(p.powers.shield||0)>s.tick){p.powers.shield=0;p.shield=s.tick+10;break outer;}dead.add(p.id);break outer;}}}}
 if(eaten.size)s.f=s.f.filter((_,i)=>!eaten.has(i));
 for(const id of dead){const p=s.p[id];if(!p)continue;for(let i=0;i<p.body.length;i+=4)s.f.push(fruit(p.body[i][0],p.body[i][1],3));if(isKing(id)){p.a=p.t=Math.atan2(W/2-p.body[0][1],W/2-p.body[0][0]);p.body=p.body.map(q=>[Math.max(50,Math.min(W-50,q[0])),Math.max(50,Math.min(W-50,q[1]))]);continue;}s.eligible.delete(id);if(s.mode==="royale"){delete s.p[id];continue;}const n=spawn(s,id,p.name,p.c);n.skin=p.skin;n.shield=s.tick+60;n.deaths=p.deaths+1;n.reward=p.reward;n.wins=p.wins;n.fruits=p.fruits||0;}
 if(s.mode==="royale"&&s.started){const alive=Object.values(s.p).filter(p=>!isKing(p.id));if(alive.length<=1)s.result={winner:alive[0]?.name||null};}if(s.mode==="teams"&&s.tick>=6000)s.result={team:s.teamScores[0]===s.teamScores[1]?-1:s.teamScores[0]>s.teamScores[1]?0:1};
 while(s.items.length<24)s.items.push(pickup());while(s.f.length<950)s.f.push(fruit());if(s.f.length>1500)s.f.splice(0,s.f.length-1500);
}
root.Game={MODES,bounds,W,colors,KING,isKing,world,spawn,step,info};if(typeof module!=='undefined')module.exports=root.Game;
})(typeof window==='undefined'?globalThis:window);
