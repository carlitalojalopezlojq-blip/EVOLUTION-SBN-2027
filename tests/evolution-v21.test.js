const assert=require('node:assert/strict'),G=require('../app/src/main/assets/engine');
function scene(){let s=G.world();s.f=[];s.tick=100;let p=G.spawn(s,'p','Jugador'),k=G.spawn(s,G.KING,'Rey');Object.assign(k,{type:'gold',born:0,a:0,t:0,body:[[2000,2000]]});Object.assign(p,{a:0,t:0,body:[[2200,2000]]});s.kingUntil=1000;return {s,p,k};}
let {s,p,k}=scene();G.step(s);assert(k.body[0][0]-2000<7);assert.equal(p.body[0][0]-2200,7);
({s,p,k}=scene());p.b=true;G.step(s);assert.equal(p.body[0][0]-2200,12);assert.equal(p.m,24);
({s,p,k}=scene());p.body=[[2010,2000]];k.born=s.tick;G.step(s);assert(s.p.p,'grace');
({s,p,k}=scene());p.body=[[2010,2000]];G.step(s);assert(!s.p.p);assert.equal(s.deaths.p.killerId,k.id);assert.equal(G.killerFor(s,'p'),k);delete s.p[k.id];G.spawn(s,k.id,'Otro rey');assert.equal(G.killerFor(s,'p'),null);G.revive(s,'p','Jugador');assert(!s.deaths.p);
({s,p,k}=scene());p.body=[[3999,2000]];G.step(s);assert.equal(s.deaths.p.reason,'boundary');assert(!G.killerFor(s,'p'));
console.log('OK: balance, turbo inicial, protección del evento, causa de derrota, identidad del atacante y resurrección.');
