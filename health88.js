'use strict';
// Bounded recent window; aggregate only, never accounts, tokens, IPs or positions.
class Health88{
 constructor(){this.samples=[];this.cursor=0;this.last=null;this.total=0;this.cached=null;this.cachedAt=0;}
 record(at,cost,clients,blocked){const gap=this.last===null?50:Math.max(0,at-this.last);this.last=at;this.samples[this.cursor]={cost,gap,clients,blocked};this.cursor=(this.cursor+1)%1200;this.total++;}
 report(){const now=Date.now();if(this.cached&&now-this.cachedAt<1000)return this.cached;const s=this.samples;const quant=(key,p)=>{if(!s.length)return null;const a=s.map(x=>x[key]).sort((a,b)=>a-b);return Math.round(a[Math.ceil(a.length*p)-1]*10)/10;};const mem=process.memoryUsage();this.cachedAt=now;return this.cached={samples:s.length,ticks:this.total,tickWorkP95Ms:quant('cost',.95),tickGapP95Ms:quant('gap',.95),lateTicks:s.filter(x=>x.gap>75||x.cost>50).length,blockedClientTicks:s.reduce((a,x)=>a+x.blocked,0),peakClients:Math.max(0,...s.map(x=>x.clients)),heapUsedMB:Math.round(mem.heapUsed/1048576),rssMB:Math.round(mem.rss/1048576)};}
}
module.exports=Health88;
