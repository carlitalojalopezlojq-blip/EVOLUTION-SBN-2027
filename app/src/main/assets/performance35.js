/* Render-only performance improvements. No gameplay, asset, or preference changes. */
(function(root){'use strict';
const patterns=new WeakMap();let cache=null,terrainRenderer=null;
function pattern(ctx,tile){let p=patterns.get(ctx);if(!p){p=new WeakMap();patterns.set(ctx,p);}let v=p.get(tile);if(!v){v=ctx.createPattern(tile,'repeat');if(v)p.set(tile,v);}return v;}
// World-space cached terrain, including every original decoration. Moving objects remain live 3D.
function terrain(main,type,x,y,w,h,ctx,t,d,quality){
 if(!main.on)return false;
 const margin=224,cell=112;
 if(!cache||cache.type!==type||cache.quality!==quality||cache.d!==d||cache.w!==w||cache.h!==h||x<cache.x||y<cache.y||x+w>cache.x+cache.W||y+h>cache.y+cache.H){
  let X=Math.floor((x-margin)/cell)*cell,Y=Math.floor((y-margin)/cell)*cell,W=Math.ceil((w+2*margin+cell)/cell)*cell,H=Math.ceil((h+2*margin+cell)/cell)*cell;
  try{
   let r=terrainRenderer||(terrainRenderer=new root.Evolution3D.Renderer());r.terrainCache35=true;
   // Same material and nominal pixel density as the viewport; cap the cached surface to a mobile-safe size.
   let factor=Math.min(d,quality==='low'?1:quality==='high'?1.5:1.25,Math.sqrt(2400000/(W*H)));
   r.pixel=factor;if(!r.begin(W,H,factor,quality)){cache=null;return false;}
   let c=cache?.canvas||document.createElement('canvas');c.width=Math.max(1,Math.round(W*factor));c.height=Math.max(1,Math.round(H*factor));let g=c.getContext('2d');if(!g){cache=null;return false;}
   g.setTransform(factor,0,0,factor,-X*factor,-Y*factor);
   if(!r.terrain31(type,X,Y,W,H,g,t)){cache=null;return false;}r.flush(g,false);
   cache={canvas:c,type,quality,d,w,h,x:X,y:Y,W,H};
  }catch(e){cache=null;return false;}
 }
 ctx.drawImage(cache.canvas,cache.x,cache.y,cache.W,cache.H);return true;
}
// Only changes the internal WebGL pixel count; logical coordinates, simulation, HUD and settings stay fixed.
function sample(r,t,dt,boss){
 let s=r.perf35;if(!s)s=r.perf35={at:t,n:0,sum:0,slow:0,good:0,lastBoss:false};
 if(dt>250||dt<=0){s.at=t;s.n=0;s.sum=0;s.slow=0;s.good=0;return;}
 if(boss&&!s.lastBoss){s.good=0;}s.lastBoss=boss;s.n++;s.sum+=dt;if(dt>20)s.slow++;
 if(t-s.at<700||s.n<10)return;
 const avg=s.sum/s.n,bad=s.slow/s.n;let tier=r.mobileTier37||0,scale=r.performanceScale35||1;
 if(avg>18.5&&bad>.18){tier=Math.min(3,tier+1);scale=Math.max(.50,Math.round((scale-(avg>26?.15:.08))*100)/100);s.good=0;}
 else if(avg<17.6&&bad<.12){if(++s.good>=7){scale=Math.min(1,Math.round((scale+.04)*100)/100);if(scale>=.9)tier=Math.max(0,tier-1);s.good=0;}}else s.good=0;
 r.mobileTier37=tier;r.performanceScale35=scale;r.perfStats37={fps:Math.round(1000/avg),slow:Math.round(100*bad),tier,scale,boss};s.at=t;s.n=0;s.sum=0;s.slow=0;
}
function reset(r){r.perf35=null;r.performanceScale35=1;r.mobileTier37=0;}
// Keep important pickups as 3D even in reduced detail unless battery/low is selected.
function richFruit(quality,tier,battery,kind){if(battery||quality==='low'||tier>=3)return false;return tier<2||kind>=49;}
root.EvolutionFPS35={pattern,terrain,sample,reset,richFruit};
})(window);
