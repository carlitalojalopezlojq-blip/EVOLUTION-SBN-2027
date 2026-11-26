'use strict';
// Executes the real simulation/server handlers, with in-memory transport (no actual network).
const assert=require('node:assert/strict'),{EventEmitter}=require('node:events'),Module=require('node:module');
const old=Module._load,interval=global.setInterval;let wss,step,health;
class WSS extends EventEmitter{constructor(){super();this.clients=new Set();wss=this;}}
class Client extends EventEmitter{
 constructor(){super();this.readyState=1;this.bufferedAmount=0;this.last={};this.snapshots=0;this.bytes=0;wss.clients.add(this);wss.emit('connection',this,{socket:{remoteAddress:'127.0.0.1'}});}
 send(s){const m=JSON.parse(s);for(const k of Object.keys(m))this.last[k]=m;if(Array.isArray(m.p)){this.snapshots++;this.bytes+=Buffer.byteLength(s);}}
 msg(m){this.emit('message',JSON.stringify(m));} close(){if(this.readyState===3)return;this.readyState=3;wss.clients.delete(this);this.emit('close');}ping(){}terminate(){this.close();}
}
Module._load=function(n,...a){if(n==='ws')return {WebSocketServer:WSS};if(n==='http')return {createServer(fn){health=()=>{let report;fn({url:'/health'},{setHeader(){},end(s){report=JSON.parse(s);}});return report;};return {listen(){}};}};return old.call(this,n,...a);};global.setInterval=fn=>{if(!step)step=fn;return {unref(){}};};process.env.EVO_CLOUD_ACCOUNTS='0';process.env.EVO_LEGACY_MODES='0';try{require('../server');}finally{Module._load=old;global.setInterval=interval;}
const realDate=Date.now;let now=realDate();Date.now=()=>now;const tick=()=>{now+=50;step();};
let seed=888;Math.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
const size=4,groups=[];
for(let k=0;k<4;k++){
 const cs=Array.from({length:size},()=>new Client());groups.push(cs);
 const join=(c,intent,extra={})=>c.msg({type:'join',intent,mode:'survival',name:'Prueba',net87:true,viewport:[850,450],expedition74:true,party74:4,lobby:true,...extra});
 join(cs[0],'create');assert(cs[0].last.id,JSON.stringify(cs[0].last.error));for(const c of cs.slice(1)){join(c,'join',{code:cs[0].last.id.code});assert(c.last.id,JSON.stringify(c.last.error));}
 {for(const c of cs)c.msg({type:'lobbyReady',ready:true});cs[0].msg({type:'lobbyStart'});assert(cs.every(c=>c.last.lobbyStart));}
}
const all=groups.flat();for(let i=0;i<4;i++)tick();assert(all.every(c=>c.snapshots>0));
{const [a,b]=groups[0],token=b.last.id.token;b.close();tick();assert(a.last.partyPaused74?.partyPaused74);const before=a.snapshots;for(let i=0;i<220;i++)tick();assert.equal(a.snapshots,before);const c=new Client();c.msg({type:'resume',token,net87:true,viewport:[850,450]});assert(c.last.resumed.partyPaused74);tick();tick();assert.equal(a.last.partyPaused74.partyPaused74,false);assert(a.snapshots>before);groups[0][1]=c;}
const clients=groups.flat(),blocked=clients[0],before=blocked.snapshots;blocked.bufferedAmount=65536;for(let i=0;i<10;i++)tick();assert.equal(blocked.snapshots,before);blocked.bufferedAmount=0;
const begin=performance.now();for(let t=0;t<600;t++){if(t%5===0)for(let i=0;i<clients.length;i++)clients[i].msg({type:'input',a:(t*.035+i*.6)%(Math.PI*2),b:false});tick();}const duration=performance.now()-begin;const r=health();assert.equal(r.rooms,4);assert.equal(r.performance.peakClients,clients.length);assert(r.performance.blockedClientTicks>=10);assert(clients.every(c=>c.snapshots>100));
console.log(JSON.stringify({mode:'expedition',players:clients.length,rooms:4,simulationTicks:600,elapsedMs:Math.round(duration),snapshotCount:clients.reduce((s,c)=>s+c.snapshots,0),health:r.performance}));for(const c of clients)c.msg({type:'leave'});assert.equal(health().rooms,0);Date.now=realDate;console.log('OK 8.8: full rooms, congestion isolation, cleanup, intentional pause and recovery.');
