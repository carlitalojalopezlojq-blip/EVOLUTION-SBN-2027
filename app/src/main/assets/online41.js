/* Online visual prediction only. The server remains authoritative for every rule. */
(function(root){'use strict';
const physics=typeof module!=='undefined'&&module.exports?require('./engine'):root.Game;
const clamp=(x,l,h)=>Math.max(l,Math.min(h,x)), angle=(a,b)=>Math.atan2(Math.sin(b-a),Math.cos(b-a));
function ranges(q,old,visible){const result=[];for(const [offset,part] of q.parts||[]){let start=-1;for(let i=0;i<part.length;i++){let j=offset+i;if(!q.body[j])continue;if(visible(q.body[j])||visible(old?.body[j])){if(start<0)start=Math.max(0,i-2);}else if(start>=0){result.push([offset+start,offset+Math.min(part.length,i+2)]);start=-1;}}if(start>=0)result.push([offset+start,offset+part.length]);}return result;}
function estimate(q,dir,boost,age,ping,bounds){const h=q.body[0],maxAge=200;if(!h||age>350)return {head:h,angle:q.a};let steps=clamp(Math.max(0,age)+clamp((ping??70)/2,35,120),0,maxAge)/50;let x=h[0],y=h[1],a=q.a;let v=boost&&q.energy>1?12:7; // only visual; hazards and collisions are resolved by server
for(let k=0;k<Math.ceil(steps);k++){let f=Math.min(1,steps-k);a=physics.turnToward59(a,dir,q.m,f);x+=Math.cos(a)*v*f;y+=Math.sin(a)*v*f;}let [lo,hi]=bounds||[0,4000];return {head:[clamp(x,lo,hi),clamp(y,lo,hi)],angle:a};}
class Motion{
 constructor(){this.reset();}
 reset(){this.head=null;this.rotation=null;this.at=null;this.id=null;this.life=null;this.lastArrival=null;this.interval=100;this.shift=[0,0];}
 arrival(t){if(this.lastArrival!==null){let gap=t-this.lastArrival;if(gap>=25&&gap<350){const weight=gap<this.interval?.45:.25;this.interval=this.interval*(1-weight)+gap*weight;}else if(gap>=350)this.interval=100;}this.lastArrival=t;return clamp(this.interval,45,160);}
 frame(q,base,t,stamp,dir,boost,ping,bounds){
  const e=estimate(q,serverHeading(q),q.b===true,t-stamp,ping,bounds),dt=clamp(t-(this.at??t-16),1,50),[lo,hi]=bounds||[0,4000];
  if(this.id!==q.id||this.life!==q.life||!this.head||Math.hypot(e.head[0]-this.head[0],e.head[1]-this.head[1])>150){const first=estimate(q,dir,boost,t-stamp,ping,bounds);this.head=first.head.slice();this.rotation=first.angle;}
  else{
   // Advance continuously in the current input direction, never replay a new turn into an old snapshot.
   this.rotation=physics.turnToward59(this.rotation,dir,q.m,dt/50);
   const speed=(boost&&q.energy>1?12:7)*dt/50;
   let x=this.head[0]+Math.cos(this.rotation)*speed,y=this.head[1]+Math.sin(this.rotation)*speed;
   // Bounded reconciliation: a normal packet must not drag the displayed head backwards.
   let dx=e.head[0]-x,dy=e.head[1]-y,len=Math.hypot(dx,dy),correction=Math.min(len*(1-Math.exp(-dt/95)),speed*.45);
   if(len>0){x+=dx/len*correction;y+=dy/len*correction;}
   this.head=[clamp(x,lo,hi),clamp(y,lo,hi)];
  }
  this.at=t;this.id=q.id;this.life=q.life;let dx=this.head[0]-base[0],dy=this.head[1]-base[1],len=Math.hypot(dx,dy);if(len>85){dx*=85/len;dy*=85/len;this.head=[base[0]+dx,base[1]+dy];}this.shift=[dx,dy];return this.rotation;
 }
 point(p,i){let k=Math.max(0,1-i/16);return [p[0]+this.shift[0]*k,p[1]+this.shift[1]*k];}
}
function cameraFactor59(dt,online){return 1-Math.exp(-clamp(dt,1,100)/(online?20:45));}
function serverHeading(q){return Number.isFinite(q.t)?q.t:Number.isFinite(q.a)?q.a:0;}
// RTT is the measured application round trip; smoothing is used only for prediction.
class Latency87{
 constructor(){this.reset();}
 reset(){this.sent=null;this.pending=false;this.last=null;this.raw=null;this.samples=[];}
 probe(now,ws){if(ws?.readyState!==1||ws.bufferedAmount>0)return false;if(this.sent!==null&&now-this.sent<(this.pending?6000:1500))return false;this.sent=now;this.pending=true;ws.send(JSON.stringify({type:'ping',t:now}));return true;}
 receive(echo,now){if(!this.pending||echo!==this.sent||!Number.isFinite(echo)||now<echo||now-echo>6000)return false;this.pending=false;this.raw=Math.round(now-echo);this.last=now;this.samples.push(this.raw);if(this.samples.length>5)this.samples.shift();return true;}
 current(now){return this.last!==null&&now-this.last<=5500?this.raw:null;}
 prediction(now){if(this.current(now)===null)return null;const sorted=this.samples.slice().sort((a,b)=>a-b);return sorted[Math.floor(sorted.length/2)];}
}
function pingLevel87(ping){return ping===null?'unknown':ping<=60?'good':ping<=100?'fair':ping<=150?'warm':'bad';}
const api={ranges,estimate,Motion,serverHeading,cameraFactor59,Latency87,pingLevel87};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.EvolutionOnline41=api;
})(typeof window==='undefined'?globalThis:window);
