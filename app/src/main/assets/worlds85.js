/* Cached procedural arena tiles and visible-edge decoration. No external images or per-frame terrain meshes. */
(function(root){'use strict';
const themes=[
 {name:'Territorio de los titanes',base:'#192621',stone:'#344239',accent:'#85bd83',dark:'#080f0e',kind:'bones'},
 {name:'Reino de la oscuridad',base:'#192034',stone:'#323a50',accent:'#7899ef',dark:'#090b17',kind:'crystal'},
 {name:'Mundo apocalíptico',base:'#2b1d1a',stone:'#4a332c',accent:'#ff9951',dark:'#140a09',kind:'lava'},
 {name:'Pesadilla viviente',base:'#2a1928',stone:'#483040',accent:'#ef6279',dark:'#100810',kind:'organic'},
 {name:'Universo dimensional',base:'#211a34',stone:'#403153',accent:'#bd86ff',dark:'#090716',kind:'cosmos'},
 {name:'Santuario de los dioses',base:'#28241f',stone:'#4a4234',accent:'#f3d086',dark:'#100d09',kind:'temple'}];
const byArena={jungle:0,desert:0,jurassic:0,swamp:1,ice:1,ocean:2,lava:2,haunted:3,alien:4,neon:4,temple:5};
function theme(world,arena){return themes[Number.isInteger(world)&&world>=1&&world<=11?Math.min(5,Math.floor((world-1)/2)):(byArena[arena]??4)];}
const cache=new Map(),SIZE=512;
function random(seed){return ()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);}
function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function line(g,pts,color,width){g.beginPath();g.moveTo(...pts[0]);for(const p of pts.slice(1))g.lineTo(...p);g.strokeStyle=color;g.lineWidth=width;g.lineCap='round';g.lineJoin='round';g.stroke();}
function shape(g,pts,fill,stroke){g.beginPath();g.moveTo(...pts[0]);for(const p of pts.slice(1))g.lineTo(...p);g.closePath();g.fillStyle=fill;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=1;g.stroke();}}
function crystal(g,x,y,s,t){shape(g,[[x-s*.6,y],[x-s*.35,y-s],[x+s*.12,y-s*1.65],[x+s*.55,y-s*.6],[x+s*.4,y+3]],t.stone,t.accent+'99');shape(g,[[x+s*.12,y-s*1.65],[x+s*.55,y-s*.6],[x+s*.4,y+3],[x,y-s*.35]],t.accent+'99');line(g,[[x+s*.12,y-s*1.65],[x,y-s*.35],[x-s*.6,y]],t.accent+'aa',1);}
function build(t){const seed=themes.indexOf(t)+85,r=random(seed*173),floor=canvas(SIZE,SIZE),g=floor.getContext('2d');g.fillStyle=t.base;g.fillRect(0,0,SIZE,SIZE);
 for(let i=0;i<1600;i++){const x=r()*SIZE,y=r()*SIZE,s=1+r()*5;g.fillStyle=i%2?t.stone+'66':'#00000029';g.fillRect(x,y,s*1.7,s);}
 for(let i=0;i<48;i++){const x=16+r()*480,y=16+r()*480,s=5+r()*16;shape(g,[[x-s,y],[x-s*.45,y-s*.65],[x+s*.5,y-s*.8],[x+s,y],[x+s*.3,y+s*.5]],t.dark+'aa',t.stone);line(g,[[x-s*.45,y-s*.65],[x+s*.5,y-s*.8],[x+s,y]],t.stone+'aa',1.4);}
 for(let i=0;i<9;i++){let x=35+r()*380,y=35+r()*380;const pts=[[x,y]];for(let j=0;j<4;j++){x+=(r()-.5)*58;y+=8+r()*18;pts.push([x,y]);}line(g,pts,t.dark, t.kind==='lava'?13:6);line(g,pts,t.accent+(t.kind==='lava'?'c0':'65'),t.kind==='lava'?4:1.6);if(t.kind==='organic')line(g,[[x,y],[x+24,y-9],[x+36,y-30]],t.accent+'40',2);}
 if(t.kind==='bones'){for(let i=0;i<4;i++){const x=65+r()*370,y=80+r()*350;g.save();g.translate(x,y);g.rotate(r()*6);for(let j=0;j<5;j++){g.beginPath();g.ellipse(j*7,0,6,15,0,-1.3,1.3);g.strokeStyle='#b4ae8966';g.lineWidth=3;g.stroke();}line(g,[[-7,0],[37,0]],'#b4ae8999',4);g.restore();}}
 if(t.kind==='crystal'||t.kind==='cosmos'){for(let i=0;i<9;i++)crystal(g,35+r()*440,45+r()*425,5+r()*10,t);}
 if(t.kind==='cosmos'){for(let i=0;i<90;i++){g.fillStyle=t.accent+'77';g.fillRect(r()*SIZE,r()*SIZE,1+r()*2,1+r()*2);}}
 if(t.kind==='temple'){for(let x=0;x<SIZE;x+=64){line(g,[[x,0],[x,SIZE]],'#b79a5a33',1);line(g,[[0,x],[SIZE,x]],'#b79a5a33',1);}for(let i=0;i<4;i++){const x=64+(i%2)*256,y=64+Math.floor(i/2)*256;g.strokeStyle=t.accent+'50';g.lineWidth=2;g.strokeRect(x,y,96,96);g.beginPath();g.arc(x+48,y+48,26,0,7);g.stroke();}}
 const edge=canvas(256,160),e=edge.getContext('2d');let gr=e.createLinearGradient(0,0,0,160);gr.addColorStop(0,t.dark);gr.addColorStop(.45,t.dark);gr.addColorStop(.71,t.stone);gr.addColorStop(.77,t.accent+'88');gr.addColorStop(.84,t.stone+'77');gr.addColorStop(1,t.base+'00');e.fillStyle=gr;e.fillRect(0,0,256,160);
 for(let i=0;i<13;i++){const x=i*21+r()*6,y=114+r()*12,s=8+r()*13;if(t.kind==='crystal'||t.kind==='cosmos'||t.kind==='temple')crystal(e,x,y,s,t);else if(t.kind==='organic'){line(e,[[x,118],[x-5,90],[x+8,74],[x+2,54]],t.stone,9);line(e,[[x,118],[x-5,90],[x+8,74]],t.accent+'88',2);}else {shape(e,[[x-s,y+8],[x-s*.5,y-s],[x+s*.4,y-s*.6],[x+s,y+8]],t.stone,t.accent+'55');if(t.kind==='bones')line(e,[[x,y],[x-5,y-16],[x+4,y-30]],'#a6aa8377',4);}}
 return {floor,edge,patterns:new WeakMap()};}
function assets(t){if(!cache.has(t))cache.set(t,build(t));return cache.get(t);}
function draw(ctx,event,arena,x,y,w,h,t,low){const th=theme(event?.kings73?.world74,arena),a=assets(th);let pattern=a.patterns.get(ctx);if(!pattern){pattern=ctx.createPattern(a.floor,'repeat');a.patterns.set(ctx,pattern);}ctx.save();ctx.fillStyle=th.dark;ctx.fillRect(x,y,w,h);const [lo,hi]=event?.bounds||[0,4000];const left=Math.max(x,lo),top=Math.max(y,lo),right=Math.min(x+w,hi),bottom=Math.min(y+h,hi);if(right>left&&bottom>top){ctx.fillStyle=pattern||th.base;ctx.fillRect(left,top,right-left,bottom-top);} 
 // Four visible strips only, rotated around the actual server boundary. Art lies primarily outside playable space.
 function side(ox,oy,angle,start,end){ctx.save();ctx.translate(ox,oy);ctx.rotate(angle);for(let i=Math.floor(Math.max(0,start)/256)*256;i<Math.min(hi-lo,end);i+=256){const width=Math.min(256,hi-lo-i);if(width>0)ctx.drawImage(a.edge,0,0,width,160,i,-120,width,160);}if(!low){for(let i=Math.ceil(Math.max(35,start)/190)*190;i<Math.min(hi-lo-25,end);i+=190){const pulse=.35+.25*Math.sin(t*.0015+i);ctx.globalAlpha=pulse;ctx.fillStyle=th.accent;for(const d of [-7,7]){ctx.beginPath();ctx.ellipse(i+d,-54,4,2,0,0,7);ctx.fill();}}ctx.globalAlpha=1;}ctx.restore();}
 if(y<lo+40&&y+h>lo-120)side(lo,lo,0,x-lo,x+w-lo);if(x+w>hi-40&&x<hi+120)side(hi,lo,Math.PI/2,y-lo,y+h-lo);if(y+h>hi-40&&y<hi+120)side(hi,hi,Math.PI,hi-x-w,hi-x);if(x<lo+40&&x+w>lo-120)side(lo,hi,-Math.PI/2,hi-y-h,hi-y);
 if(!low){ctx.fillStyle=th.accent;for(let i=0;i<16;i++){const xx=x+((i*173+t*.012*(1+i%3))%w+w)%w,yy=y+((i*113-t*.009)%h+h)%h;if(xx<lo||xx>hi||yy<lo||yy>hi)continue;ctx.globalAlpha=.16+.12*Math.sin(i+t*.002);ctx.fillRect(xx,yy,2,2);}ctx.globalAlpha=1;}ctx.restore();}
const api={theme,draw,themes};root.Worlds85=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
