'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),N=require('../network71');
let seed=123;const rand=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
const fruits=Array.from({length:1150},(_,i)=>[rand()*4000,rand()*4000,rand()*8,i%64]);
fruits.push([100,200,4,1],[200,100,3.55,2]);
const old=(h,r)=>fruits.filter(b=>Math.abs(b[0]-h[0])<r[0]&&Math.abs(b[1]-h[1])<r[1]).map(b=>[Math.round(b[0]),Math.round(b[1]),Math.round(b[2]*10)/10,b[3]]);
const view=N.fruitView(fruits);
for(let i=0;i<120;i++){const h=[rand()*4000,rand()*4000],r=[600+rand()*1000,400+rand()*700];assert.deepEqual(view(h,r),old(h,r));}
assert.deepEqual(view([0,0],[100,200]),old([0,0],[100,200]));
assert.equal(N.writable({readyState:1,bufferedAmount:199999}),true);assert.equal(N.writable({readyState:1,bufferedAmount:200000}),false);assert.equal(N.writable({readyState:3,bufferedAmount:0}),false);
const next=N.fruitView([[10.4,20.6,4.44,5]]);assert.deepEqual(next([10,20],[100,100]),[[10,21,4.4,5]]);
global.window=global;require('../app/src/main/assets/performance35');const F=global.EvolutionFPS35;
assert(F.richFruit('high',0,false,1));assert(!F.richFruit('high',2,false,1));assert(F.richFruit('high',2,false,54));assert(!F.richFruit('high',3,false,54));assert(!F.richFruit('low',0,false,1));assert(!F.richFruit('high',0,true,1));
let n=0;const ctx={createPattern(){n++;return {};}};const tile={};assert.equal(F.pattern(ctx,tile),F.pattern(ctx,tile));assert.equal(n,1);
let r={},t=0;for(let i=0;i<150;i++){t+=33;F.sample(r,t,33,false);}assert.equal(r.mobileTier37,3);for(let i=0;i<5000;i++){t+=16.667;F.sample(r,t,16.667,false);}assert.equal(r.mobileTier37,0);
const html=fs.readFileSync('app/src/main/assets/index.html','utf8');assert(html.includes('setInterval(()=>{if(canControl522())input41();},25)'));assert(html.includes('if(document.hidden||paused)return'));assert(html.includes('EvolutionFPS35.richFruit'));
console.log('OK v7.1: exact snapshot order and bounds, backpressure, adaptive fruit LOD, pattern cache, recovery, independent controls.');
