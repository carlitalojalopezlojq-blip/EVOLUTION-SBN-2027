'use strict';
const assert=require('node:assert/strict'), G=require('../app/src/main/assets/engine'), N=require('../app/src/main/assets/online41'), fs=require('node:fs');
const near=(x,y)=>assert(Math.abs(x-y)<1e-8,`${x} != ${y}`);
const diff=(a,b)=>Math.atan2(Math.sin(b-a),Math.cos(b-a));
let seed=123;Math.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
for(const mass of [24,100,324,1000])for(const boost of [false,true])for(const dir of [Math.PI/2,-Math.PI/2,Math.PI]){
 const s=G.world(),p=G.spawn(s,'p','Jugador');p.m=mass;p.body=[[2000,2000]];p.a=0;p.t=dir;p.b=boost;s.f=[];
 const max=Math.ceil(Math.abs(dir)/G.turnLimit59(mass));
 for(let i=0;i<max;i++){
  const before=p.body[0].slice(), oldAngle=p.a;
  const prediction=N.estimate(p,dir,boost,15,0,[0,4000]); // 15 ms age + 35 ms minimum lead = one tick
  G.step(s);near(p.a,prediction.angle);near(p.body[0][0],prediction.head[0]);near(p.body[0][1],prediction.head[1]);
  near(Math.hypot(p.body[0][0]-before[0],p.body[0][1]-before[1]),boost?12:7);
  assert(Math.abs(diff(oldAngle,p.a))<=G.turnLimit59(mass)+1e-8 || boost);s.f=[];
 }
 near(diff(p.a,dir),0);
}
assert.equal(Math.ceil(Math.PI/G.turnLimit59(24))*50,300);
assert.equal(Math.ceil(Math.PI/G.turnLimit59(324))*50,450);
near(G.turnLimit59(24,true),.095);near(G.turnToward59(Math.PI-.02,-Math.PI+.03,24),Math.PI+.03);
const q={id:'p',life:1,m:24,a:0,energy:100,body:[[500,500],[493,500]]};
const motion=new N.Motion();motion.frame(q,q.body[0],100,100,0,false,100);let rotation=motion.frame(q,q.body[0],116,100,Math.PI/2,false,100);assert(rotation>0);let turn=motion.frame(q,q.body[0],132,132,Math.PI/2,false,100);assert(turn>rotation,'stale snapshots must not turn the visual heading backwards');
turn=motion.frame(q,q.body[0],148,132,-Math.PI/2,false,100);assert(turn<rotation+.01,'new opposite input is handled on the next frame');
assert(Math.hypot(...motion.shift)<=85);assert.deepEqual(N.estimate(q,0,false,400,100).head,q.body[0]);
const newLife={...q,life:2,a:Math.PI};motion.frame(newLife,q.body[0],164,164,Math.PI,false,100);near(diff(motion.rotation,Math.PI),0);
near(1-(1-N.cameraFactor59(1000/60,true))**60,1-(1-N.cameraFactor59(1000/30,true))**30);
const html=fs.readFileSync(require.resolve('../app/src/main/assets/index.html'),'utf8');assert(html.includes('if(!paused&&!photo24)input41()'));assert(html.includes('if(!predict58&&priorPredict59)onlineMotion41.reset()'));assert(html.includes('cameraFactor59(frameDt59,predict58)'));
console.log('OK v5.9: turn timing, shared physics and predictor, unchanged movement speed, direction changes, respawn, prediction bounds, camera frame-rate independence.');
