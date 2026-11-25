(function(root){
'use strict';
const W=4000, colors=['#43ffd1','#ff527d','#ad80ff','#ffcf55','#49aaff','#a5df41','#d86b36'], KING='__king__', KING_INTERVAL=6000, KING_DURATION=1200, CELL=48;
const key=(x,y)=>Math.floor(x/CELL)+Math.floor(y/CELL)*128;
const dist=(a,b)=>(a[0]-b[0])**2+(a[1]-b[1])**2;
function fruit(x=Math.random()*W,y=Math.random()*W,m=1+Math.random()*2){return [Math.max(12,Math.min(W-12,x)),Math.max(12,Math.min(W-12,y)),m,Math.random()*9|0];}
function world(){return {p:Object.create(null),f:Array.from({length:950},()=>fruit()),tick:0,nextKing:KING_INTERVAL,kingUntil:0};}
function spawn(s,id,name,c){let x=400+Math.random()*3200,y=400+Math.random()*3200;let m=id===KING?90:24;let a=Math.random()*Math.PI*2; if(id===KING){x=W/2;y=W/2;}return s.p[id]={id,name,c:c||colors[Math.random()*colors.length|0],a,t:a,b:false,m,body:Array.from({length:m},(_,i)=>[x-Math.cos(a)*i*5,y-Math.sin(a)*i*5])};}
function info(s){return {king:!!s.p[KING],seconds:Math.max(0,Math.ceil(((s.p[KING]?s.kingUntil:s.nextKing)-s.tick)/20))};}
function step(s){s.tick++;
 if(s.tick>=s.nextKing){s.nextKing+=KING_INTERVAL; if(!s.p[KING]){spawn(s,KING,'REY DEVORADOR','#c79b39');s.kingUntil=s.tick+KING_DURATION;}}
 if(s.p[KING]&&s.tick>=s.kingUntil)delete s.p[KING];
 const ps=Object.values(s.p),dead=new Set(),grid=new Map(),fg=new Map(),eaten=new Set();
 for(let i=0;i<s.f.length;i++){const f=s.f[i],k=key(f[0],f[1]);let v=fg.get(k);if(!v)fg.set(k,v=[]);v.push(i);}
 const king=s.p[KING];if(king){let h=king.body[0],best=Infinity,v=null;for(const p of ps){if(p===king)continue;const d=dist(h,p.body[0]);if(d<best){best=d;v=p.body[0];}}if(v)king.t=Math.atan2(v[1]-h[1],v[0]-h[0]);if(h[0]<180||h[1]<180||h[0]>W-180||h[1]>W-180)king.t=Math.atan2(W/2-h[1],W/2-h[0]);}
 for(const p of ps){const boss=p.id===KING;let d=Math.atan2(Math.sin(p.t-p.a),Math.cos(p.t-p.a));p.a+=Math.max(boss?-.24:-.25,Math.min(boss?.24:.25,d));let h=p.body[0],boost=!boss&&p.b&&p.m>24,v=boss?13.2:boost?12:7;
 if(boost){p.m=Math.max(24,p.m-.15);}
 h=[h[0]+Math.cos(p.a)*v,h[1]+Math.sin(p.a)*v];p.body.unshift(h);while(p.body.length>Math.floor(p.m))p.body.pop();if(h[0]<0||h[1]<0||h[0]>W||h[1]>W)dead.add(p.id);
 const cx=Math.floor(h[0]/CELL),cy=Math.floor(h[1]/CELL),r=boss?33:23;
 for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const list=fg.get(cx+i+(cy+j)*128);if(!list)continue;for(const n of list){if(!eaten.has(n)&&dist(h,s.f[n])<r*r){eaten.add(n);p.m=Math.min(boss?130:180,p.m+s.f[n][2]);}}}
 for(let n=0;n<p.body.length;n+=2){const q=p.body[n],k=key(q[0],q[1]);let list=grid.get(k);if(!list)grid.set(k,list=[]);list.push([p.id,q[0],q[1]]);} }
 for(const p of ps){if(p.id===KING)continue;const h=p.body[0],cx=Math.floor(h[0]/CELL),cy=Math.floor(h[1]/CELL);outer:for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const list=grid.get(cx+i+(cy+j)*128);if(!list)continue;for(const q of list){if(q[0]===p.id)continue;let r=q[0]===KING?34:19;if((h[0]-q[1])**2+(h[1]-q[2])**2<r*r){dead.add(p.id);break outer;}}}}
 if(eaten.size)s.f=s.f.filter((_,i)=>!eaten.has(i));
 for(const id of dead){const p=s.p[id];if(!p)continue;for(let i=0;i<p.body.length;i+=4)s.f.push(fruit(p.body[i][0],p.body[i][1],3));delete s.p[id];}
 while(s.f.length<950)s.f.push(fruit());if(s.f.length>1500)s.f.splice(0,s.f.length-1500);
}
root.Game={W,colors,KING,world,spawn,step,info};if(typeof module!=='undefined')module.exports=root.Game;
})(typeof window==='undefined'?globalThis:window);
