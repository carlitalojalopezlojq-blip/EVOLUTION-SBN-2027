const assert=require('node:assert/strict');const crypto=require('node:crypto');
const path=require('node:path'),{execFileSync}=require('node:child_process');
if(process.argv[2]==='--simulate-v39'){
let seed=123;Math.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
const G=require(process.argv[3]);for(const n of ['legends','mutations','domination'])require('../app/src/main/assets/'+n);
function check(ticks,large){seed=123;const s=Mutations.init(Legends.init(G.world('invasion')),{arena:'jungle'});Domination.init(s,{});G.spawn(s,'me','Jugador');for(let i=0;i<18;i++)G.spawn(s,'bot'+i,'Bot '+i);s.started=true;s.nextKing=2;if(large)for(const p of Object.values(s.p)){p.m=large;let h=p.body[0];p.body=Array.from({length:large},(_,i)=>[h[0]+i%100*4,h[1]+Math.floor(i/100)*4]);}const hash=crypto.createHash('sha256');for(let j=0;j<ticks;j++){if(!s.p.me)G.revive(s,'me','Jugador');for(let i=0;i<18;i++){let k='bot'+i,q=s.p[k]||G.spawn(s,k,'Bot '+i);if((s.tick+i)%18===0)G.botSteer(s,q);}G.step(s);if(j%17===0)hash.update(JSON.stringify(s));}return hash.digest('hex');}
console.log(JSON.stringify([check(2400,0),check(600,700)]));
}else{
const run=engine=>JSON.parse(execFileSync(process.execPath,[__filename,'--simulate-v39',path.resolve(__dirname,engine)],{encoding:'utf8',timeout:180000}));
assert.deepEqual(run('../app/src/main/assets/engine.js'),run('fixtures/engine-v38.js'),'The seeded simulation must match v3.8 on this Node runtime');
global.window=global;global.document={createElement:()=>({addEventListener(){}})};require('../app/src/main/assets/render3d');const r=new Evolution3D.Renderer();r.pixel=1;r.detail=8;const m={a:1,b:0,c:0,d:1,e:0,f:0,s:1,alpha:1},c=[.5,.7,.3],p=Array.from({length:400},(_,i)=>[i*3,200+50*Math.sin(i/16)]);r.tube(p,22,c,m,0,p.length);assert.equal(r.count,399*8*6);const actual=r.buf.slice(0,r.count*13);r.count=0;r.emitRings35=function(a,rows,sides){const stride=sides+1;this.reserve35((rows-1)*sides*6);let dst=this.buf,k=this.count*13;const put=i=>{for(let f=0;f<13;f++)dst[k++]=a[i*13+f];};for(let i=1;i<rows;i++)for(let j=0;j<sides;j++){let v=(i-1)*stride+j,w=i*stride+j;put(v);put(w);put(w+1);put(v);put(w+1);put(v+1);}this.count=k/13;};r.tube(p,22,c,m,0,p.length);assert.deepEqual(r.buf.slice(0,r.count*13),actual);console.log('OK: 3000 seeded ticks match v3.8 in the same Node runtime, including large worms; tube vertices exactly equal.');
}
