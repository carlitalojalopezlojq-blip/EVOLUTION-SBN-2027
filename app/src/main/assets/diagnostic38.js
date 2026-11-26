/* Optional on-device diagnostics. No gameplay settings are changed. */
(function(root){'use strict';
const empty=()=>({frames:[],draw:[],step:[],flush:[],verts:[],terrain:[]});
let samples=empty(),start=0,prev=0,frameFlush=0,frameVerts=0,frameTerrain=0,enabled=true,summary=null;
const add=(arr,x)=>{if(Number.isFinite(x)&&x>=0)arr.push(x);};
const stat=a=>{if(!a.length)return null;let b=a.slice().sort((x,y)=>x-y);return {avg:a.reduce((s,x)=>s+x,0)/a.length,p95:b[Math.ceil(b.length*.95)-1],max:b[b.length-1]};};
function begin(t){if(!enabled)return;start=performance.now();frameFlush=frameVerts=frameTerrain=0;if(prev&&t-prev<500)add(samples.frames,t-prev);prev=t;}
function end(){if(!enabled||!start)return;add(samples.draw,performance.now()-start);add(samples.flush,frameFlush);add(samples.verts,frameVerts);add(samples.terrain,frameTerrain);start=0;}
function flush(ms,verts){if(enabled&&start){frameFlush+=ms;frameVerts+=verts;}}
function terrain(ms){if(enabled&&start)frameTerrain+=ms;}
function step(ms){if(enabled)add(samples.step,ms);}
function report(){if(!enabled)return null;let s=samples;samples=empty();if(s.frames.length<2)return summary;summary={fps:1000/stat(s.frames).avg,frame:stat(s.frames),draw:stat(s.draw),step:stat(s.step),flush:stat(s.flush),terrain:stat(s.terrain),verts:stat(s.verts)};return summary;}
function reset(){samples=empty();start=prev=0;summary=null;}
function set(v){enabled=!!v;reset();}
root.EvolutionDiag38={begin,end,flush,terrain,step,report,reset,set,get enabled(){return enabled;}};
})(typeof window==='undefined'?globalThis:window);
