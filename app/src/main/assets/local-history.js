(function(root){'use strict';
function create(mode,map,now=Date.now()){return {mode,map,date:new Date(now).toISOString(),seconds:0,fruits:0,deaths:0,reward:0,score:0};}
function update(session,p,dt=0){if(!session)return;session.seconds+=Math.max(0,Math.min(1,dt));if(!p)return;for(const key of ['fruits','deaths','reward','score'])session[key]=Math.max(session[key],Number(p[key])||0);}
function finish(history,session){return session?[{...session,seconds:Math.floor(session.seconds)},...history].slice(0,30):history;}
const api={create,update,finish};if(typeof module!=='undefined')module.exports=api;else root.LocalHistory=api;
})(globalThis);
