(function(root){
'use strict';
const types=['gold','fire','ice','venom','shadow','electric','ancient','apocalypse','leviathan','hydra','cosmic','thanatos'];
const names=['REY DORADO','REY DE FUEGO','REY DE HIELO','REY VENENOSO','REY DE LAS SOMBRAS','REY ELÉCTRICO','REY ANCESTRAL','APOCALIPSIS','LEVIATÁN','HIDRA','DEVORADOR CÓSMICO','TÁNATOS'];
const normalize=t=>types.includes(t)?t:'gold';
const priority=t=>t==='apocalypse'?2:types.indexOf(t)>=8?3:1;
const asset=(t,kind)=>'boss-audio/'+normalize(t)+'-'+(kind==='roar'?'roar':'theme')+'.mp3';
class Tracker{
 constructor(){this.reset();}
 reset(){this.live=new Map();this.queue=[];this.type=null;this.next=0;}
 update(players,event,local){let entries=[];if(local){entries=Object.values(players||{}).filter(p=>p&&String(p.id).startsWith('__king__')).map(p=>[p.id,normalize(p.type)]);}else if(event?.king){const list=event.kings?.length?event.kings:[event];const counts={};entries=list.map(k=>{const t=normalize(k.type);counts[t]=(counts[t]||0)+1;return [t+':'+counts[t],t];});}
 const next=new Map(entries);this.queue=this.queue.filter(e=>next.has(e[0])&&next.get(e[0])===e[1]);const fresh=entries.filter(([id,t])=>this.live.get(id)!==t).sort((a,b)=>priority(b[1])-priority(a[1]));this.queue.push(...fresh);this.live=next;
 const top=entries.reduce((m,e)=>Math.max(m,priority(e[1])),0);const chosen=entries.find(e=>e[1]===this.type&&priority(e[1])===top)||entries.find(e=>priority(e[1])===top);const old=this.type;this.type=chosen?.[1]||null;if(!this.type){this.queue=[];this.next=0;}return {changed:old!==this.type,fresh:fresh.map(e=>e[1]),type:this.type};}
 poll(now,enabled){if(!enabled){this.queue=[];return null;}if(now<this.next||!this.queue.length)return null;const [,t]=this.queue.shift();this.next=now+2350;return t;}
}
root.EvolutionBossAudio={types,names,normalize,asset,Tracker};if(typeof module!=='undefined')module.exports=root.EvolutionBossAudio;
})(typeof window!=='undefined'?window:globalThis);
