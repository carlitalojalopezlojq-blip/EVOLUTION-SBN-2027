'use strict';
// Stable spawn layout for reproducible integration tests, not production randomness.
let fixtureSeed=123;Math.random=()=>((fixtureSeed=(fixtureSeed*1664525+1013904223)>>>0)/4294967296);
const assert=require('node:assert/strict'),N=require('../app/src/main/assets/online41');
const q={id:'x',a:0,m:30,energy:100,body:Array.from({length:100},(_,i)=>[500-i*7,500])};
q.parts=[[0,q.body.slice(0,32)],[60,q.body.slice(60,100)]];const visible=p=>p&&p[0]>=460&&p[0]<=520;
assert.deepEqual(N.ranges(q,null,visible),[[0,8]]);assert.deepEqual(N.ranges(q,null,()=>false),[]);
let e=N.estimate(q,Math.PI/2,false,30,210,[0,4000]);assert(e.head[1]>500&&e.head[0]>500&&e.angle>0);assert.deepEqual(q.body[0],[500,500]);
e=N.estimate(q,0,true,800,215,[0,4000]);assert.deepEqual(e.head,q.body[0]);
e=N.estimate({...q,body:[[3999,3999]]},0,true,190,215,[0,4000]);assert(e.head[0]<=4000);
let m=new N.Motion();assert.equal(m.arrival(100),100);assert(m.arrival(220)>100);m.frame(q,q.body[0],250,220,Math.PI/2,true,215,[0,4000]);assert(m.point(q.body[0],0)[1]>500);assert.deepEqual(m.point(q.body[20],20),q.body[20]);m.reset();assert.deepEqual(m.shift,[0,0]);
const {EventEmitter}=require('node:events'),Module=require('node:module');let wss,step;const oldLoad=Module._load,oldInterval=global.setInterval;
class WS extends EventEmitter{constructor(){super();this.clients=new Set();wss=this;}}
class Client extends EventEmitter{constructor(){super();this.readyState=1;this.bufferedAmount=0;this.out=[];wss.clients.add(this);wss.emit('connection',this,{socket:{remoteAddress:'127.0.0.1'}});}send(s){this.out.push(JSON.parse(s));}msg(m){this.emit('message',JSON.stringify(m));return this.out.at(-1);}close(){this.readyState=3;this.emit('close');}ping(){}}
Module._load=function(name,...args){if(name==='ws')return {WebSocketServer:WS};if(name==='http')return {createServer(){return {listen(){}};}};return oldLoad.call(this,name,...args);};global.setInterval=fn=>{if(!step)step=fn;return {unref(){}};};process.env.EVO_CLOUD_ACCOUNTS='0';try{require('../server');}finally{Module._load=oldLoad;global.setInterval=oldInterval;}
const a=new Client(),b=new Client();const join=a.msg({type:'join',intent:'create',name:'Uno',viewport:[768,345]});assert(join.id);assert(b.msg({type:'join',intent:'join',code:join.code,name:'Dos'}).id);step();step();let snap=a.out.at(-1),legacy=b.out.at(-1);assert.equal(snap.n,2);assert.equal(snap.markers.length,7);assert.equal(legacy.markers,undefined);let h=snap.p.find(x=>x.id===join.id).head;assert(snap.f.every(f=>Math.abs(f[0]-h[0])<=685&&Math.abs(f[1]-h[1])<=474));assert(snap.f.length<=600);assert(legacy.f.length<=600);assert(snap.p.find(x=>x.id===join.id));console.log('OK v4.1: predicción visual acotada, interpolación, recorte de segmentos, dos clientes simulados, minimapa y compatibilidad con v4.0. Frutas visibles:',snap.f.length,'vs antiguo:',legacy.f.length);
