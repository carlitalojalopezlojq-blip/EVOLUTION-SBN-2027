'use strict';
// Test server handlers with in-memory WebSocket doubles. Real TLS and transport must be tested after deployment.
const assert=require('node:assert/strict'),{EventEmitter}=require('node:events'),Module=require('node:module');
const realLoad=Module._load,realInterval=global.setInterval;let wss,step,health;
class FakeWSS extends EventEmitter{constructor(){super();this.clients=new Set();wss=this;}}
class Client extends EventEmitter{constructor(){super();this.readyState=1;this.bufferedAmount=0;this.out=[];wss.clients.add(this);wss.emit('connection',this,{socket:{remoteAddress:'127.0.0.1'}});}send(s){this.out.push(JSON.parse(s));}msg(m){this.emit('message',JSON.stringify(m));return this.out.at(-1);}close(){if(this.readyState===3)return;this.readyState=3;wss.clients.delete(this);this.emit('close');}terminate(){this.close();}ping(){this.emit('pong');}}
Module._load=function(name,...args){if(name==='ws')return {WebSocketServer:FakeWSS};if(name==='http')return {createServer(fn){health=fn;return {listen(){}};}};return realLoad.call(this,name,...args);};
let intervals=0;global.setInterval=(fn)=>{if(intervals++===0)step=fn;return {unref(){}};};process.env.EVO_CLOUD_ACCOUNTS='0';
try{require('../server');}finally{Module._load=realLoad;global.setInterval=realInterval;}
const G=require('../app/src/main/assets/engine');let a=new Client(),m=a.msg({type:'join',intent:'create',mode:'survival',name:'Amigo 1',skin:'#123456'});assert(m.id&&m.token&&/^[A-F0-9]{8}$/.test(m.code));let code=m.code,token=m.token,id=m.id;
let b=new Client();assert.equal(b.msg({type:'join',intent:'join',code,mode:'invasion',name:'Amigo 2'}).code,code);
let bad=new Client();assert.match(bad.msg({type:'join',intent:'join',code:'NOEXISTE'}).error,/no encontrada/);
let cloud=new Client();assert.match(cloud.msg({type:'account',action:'register'}).error,/beta/);cloud.close();
for(let i=0;i<8;i++)assert(new Client().msg({type:'join',intent:'join',code,name:'Amigo '+(i+3)}).id);
assert.match(new Client().msg({type:'join',intent:'join',code}).error,/llena/);
step();step();let snap=a.out.at(-1);assert.equal(snap.n,10);assert.equal(snap.players.length,10);assert(Array.isArray(snap.p)&&Array.isArray(snap.f));assert.equal(snap.p.find(p=>p.id===id)?.c,'#123456');assert.equal(a.msg({type:'ping',t:42}).pong,42);
a.close();let resumed=new Client();m=resumed.msg({type:'resume',token});assert.equal(m.id,id);assert.equal(m.resumed,true);assert.equal(m.code,code);
let q=new Client(),r=new Client();let qc=q.msg({type:'join',intent:'quick',mode:'survival'}).code;assert.notEqual(qc,code);assert.equal(r.msg({type:'join',intent:'quick',mode:'survival'}).code,qc);
let world=G.world();world.betaFruitTarget=600;world.f.length=600;G.step(world);assert.equal(world.f.length,600);let normal=G.world();G.step(normal);assert.equal(normal.f.length,950);
let info;health({}, {setHeader(){},end(t){info=JSON.parse(t);}});assert.equal(info.ok,true);assert.equal(info.maxPlayers,10);assert.equal(info.cloud,false);console.log('OK beta: creación, unión, sala inexistente, cupo, snapshots, ping, reconexión, partida rápida, invitado, salud y frutas offline intactas.');
