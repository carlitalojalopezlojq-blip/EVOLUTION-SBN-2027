/* Render-only pacing; never delays the independent simulation/input timers. */
(function(root){'use strict';
class FrameBudget{
 constructor(){this.reset();}
 reset(){this.next=null;this.target=0;this.last=null;this.adaptive=false;this.bad=0;this.good=0;this.work=0;this.gap=16.7;}
 allow(t,limit,active){if(!active){if(this.last!==null)this.reset();limit=Math.min(limit,30);}else{if(this.last!==null){const dt=t-this.last;if(dt>250||dt<=0){this.reset();}else this.gap=.85*this.gap+.15*dt;}this.last=t;}const hz=limit===30||this.adaptive?30:60,period=1000/hz;if(this.target!==hz||this.next===null){this.target=hz;this.next=t;}if(t+1.5<this.next)return false;this.next=Math.max(this.next+period,t+period-3);return true;}
 record(ms,active,limit){if(!active||limit===30)return;this.work=.85*this.work+.15*Math.min(250,Math.max(0,ms));if(!this.adaptive){if(this.work>18||this.gap>24){if(++this.bad>=45){this.adaptive=true;this.good=0;}}else this.bad=Math.max(0,this.bad-2);}else{if(this.work<10&&this.gap<20){if(++this.good>=180){this.adaptive=false;this.bad=0;}}else this.good=0;}}
}
function lruGet(map,key){if(!map.has(key))return undefined;const v=map.get(key);map.delete(key);map.set(key,v);return v;}
function lruSet(map,key,value,max=32){map.delete(key);map.set(key,value);while(map.size>max)map.delete(map.keys().next().value);return value;}
// Intentional party pauses do not count as a stalled snapshot stream.
function connectionState(age,partyPaused,closing){return partyPaused?'paused':age>10000&&!closing?'reconnect':age>3500?'warning':'ok';}
const api={FrameBudget,lruGet,lruSet,connectionState};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Stability88=api;
})(typeof window==='undefined'?globalThis:window);
