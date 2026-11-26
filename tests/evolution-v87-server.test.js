'use strict';
const assert=require('node:assert/strict'),{EventEmitter}=require('node:events'),Module=require('node:module');
const original=Module._load,interval=global.setInterval,realPerformance=global.performance;let wss,step,clock=0;
class WSS extends EventEmitter{constructor(){super();this.clients=new Set();wss=this;}}
class Client extends EventEmitter{
 constructor(){super();this.readyState=1;this.bufferedAmount=0;this.out=[];wss.clients.add(this);wss.emit('connection',this,{socket:{remoteAddress:'127.0.0.1',setNoDelay:on=>{this.noDelay=on;}}});}
 send(s){this.out.push(JSON.parse(s));} msg(m){this.emit('message',JSON.stringify(m));return this.out.at(-1);} find(k){return this.out.findLast(m=>m[k]);} count(){return this.out.filter(x=>Array.isArray(x.p)).length;} close(){if(this.readyState===3)return;this.readyState=3;wss.clients.delete(this);this.emit('close');} ping(){} terminate(){this.close();}
}
Module._load=function(n,...a){if(n==='ws')return {WebSocketServer:WSS};if(n==='http')return {createServer(){return {listen(){}};}};return original.call(this,n,...a);};global.setInterval=fn=>{if(!step)step=fn;return {unref(){}};};process.env.EVO_CLOUD_ACCOUNTS='0';delete process.env.EVO_LEGACY_MODES;try{require('../server');}finally{Module._load=original;global.setInterval=interval;}
let seed=123;Math.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
global.performance={now:()=>clock};const tick=(gap=50)=>{clock+=gap;step();};
try{
 const a=new Client(),b=new Client();const join=(c,intent,extra)=>c.msg({type:'join',intent,expedition74:true,party74:2,lobby:true,name:'Jugador',viewport:[400,240],...extra});
 join(a,'create',{net87:true});join(b,'join',{code:a.find('id').code});assert(a.noDelay&&b.noDelay);assert(a.fast87&&!b.fast87);a.msg({type:'lobbyReady',ready:true});b.msg({type:'lobbyReady',ready:true});a.msg({type:'lobbyStart'});
 tick();tick();assert(a.lastSnapshotBytes87>0&&a.lastSnapshotBytes87<=7000,`fixture size ${a.lastSnapshotBytes87}`);assert.equal(a.count(),1);assert.equal(b.count(),1);
 tick();assert.equal(a.count(),2);assert.equal(b.count(),1);tick();assert.equal(a.count(),3);assert.equal(b.count(),2);
 a.bufferedAmount=1;tick();tick();assert.equal(a.count(),3);assert.equal(b.count(),3);a.bufferedAmount=0;
 tick(120);assert.equal(a.count(),3,'overloaded loop skips extra frame');tick();assert.equal(a.count(),4);
 assert.equal(a.msg({type:'ping',t:123}).pong,123);const token=a.find('id').token;a.close();const recovered=new Client();recovered.msg({type:'resume',token,net87:true,viewport:[400,240]});assert(recovered.find('resumed'));assert(recovered.fast87);tick();tick();assert(recovered.count()>0);recovered.msg({type:'leave'});b.msg({type:'leave'});
}finally{global.performance=realPerformance;}
console.log('OK 8.7 server: opt-in 20 Hz, legacy 10 Hz, slow-loop fallback, blocked queue, ping echo and session recovery (simulated sockets).');
