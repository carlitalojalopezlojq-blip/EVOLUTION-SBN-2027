const assert=require('node:assert/strict'),G=require('../app/src/main/assets/engine');
let s=G.world('royale');G.spawn(s,'a','A');G.step(s);assert.equal(s.tick,0);G.spawn(s,'b','B');G.step(s);assert(s.started);s.p.b.body[0]=[-500,-500];G.step(s);assert(!s.p.b);assert.equal(s.result.winner,'A');
s=G.world('royale');s.started=true;s.tick=1000;assert(G.bounds(s)[0]>0);
s=G.world('teams');let a=G.spawn(s,'a','A'),b=G.spawn(s,'b','B');assert.notEqual(a.team,b.team);s.tick=5999;s.teamScores=[100,0];G.step(s);assert.equal(s.result.team,0);
s=G.world('survival');assert.equal(s.nextKing,1200);assert.equal(G.world('bad').mode,'classic');console.log('Modos: pruebas correctas');
