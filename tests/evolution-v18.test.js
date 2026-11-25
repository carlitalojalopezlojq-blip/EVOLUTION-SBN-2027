'use strict';
const assert=require('node:assert/strict'),G=require('../app/src/main/assets/engine');
assert.equal(G.fruits.length,54);assert.equal(new Set(G.fruits.map(f=>f.name)).size,54);assert.equal(G.bosses.length,7);assert.equal(G.growth(10000,1),.03);assert.equal(G.radius({id:'p',m:100000}),17);assert.deepEqual([24,100,500,1000].map(G.evolution),[0,1,2,3]);
function eating(type){const s=G.world(),p=G.spawn(s,'p','Test');p.m=100;p.energy=10;p.a=p.t=0;p.body=[[2000,2000]];s.f=[G.fruit(2007,2000,null,type)];G.step(s);return p;}
assert(eating(49).m>100);assert.equal(eating(50).energy,100);assert(eating(51).shieldUntil>0);assert(eating(52).m>104);assert.equal(eating(53).m,98);
for(let i=0;i<7;i++){const s=G.world();s.bossNumber=i;s.tick=s.nextKing-1;G.step(s);assert.equal(G.info(s).type,G.bosses[i].type);s.tick=s.kingUntil-1;G.step(s);assert.equal(G.info(s).king,false);}
const inv=G.world('invasion');inv.tick=inv.nextKing-1;G.step(inv);assert.equal(G.info(inv).kings.length,3);
const royale=G.world('royale');royale.tick=1000;assert(G.bounds(royale)[0]>0);const first=G.spawn(royale,'a','A');G.spawn(royale,'b','B');royale.started=true;delete royale.p.b;G.finish(royale);assert.equal(royale.winner.id,'a');
const team=G.world('teams');assert.notEqual(G.spawn(team,'a','A').team,G.spawn(team,'b','B').team);assert.equal(G.spawn(team,'c','C').team,team.p.a.team);
console.log('OK: 54 frutas, 5 efectos, 7 reyes, invasión, zonas, equipos y evolución.');
