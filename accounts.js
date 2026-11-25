'use strict';
const fs=require('fs'),crypto=require('crypto'),path=require('path');
const R=require('./app/src/main/assets/rules');
const P=require('./app/src/main/assets/progression');
const digest=t=>crypto.createHash('sha256').update(t).digest('hex');
class Accounts {
 constructor(file){this.file=file;this.rows=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{};this.dirty=false;}
 save(){if(!this.dirty)return;fs.mkdirSync(path.dirname(this.file),{recursive:true});fs.writeFileSync(this.file+'.tmp',JSON.stringify(this.rows),{mode:0o600});fs.renameSync(this.file+'.tmp',this.file);this.dirty=false;}
 create(name,password){if(Object.keys(this.rows).length>=10000)throw Error('Límite de cuentas');if(password!==undefined&&(typeof password!=='string'||password.length<10||password.length>128))throw Error('Contraseña: entre 10 y 128 caracteres');const id=crypto.randomBytes(8).toString('hex'),token=crypto.randomBytes(32).toString('hex');this.rows[id]={id,name:String(name||'Jugador').slice(0,20),hash:digest(token),xp:0,friends:[],incoming:[]};if(password!==undefined){const salt=crypto.randomBytes(16).toString('hex');this.rows[id].password={salt,hash:crypto.scryptSync(password,salt,32).toString('hex')};}this.dirty=true;this.save();return {id,token};}
 login(id,password){if(typeof id!=='string'||!/^[a-f0-9]{16}$/.test(id)||typeof password!=='string'||password.length>128)return null;const p=this.rows[id];if(!p?.password)return null;const h=crypto.scryptSync(password,p.password.salt,32);if(!crypto.timingSafeEqual(h,Buffer.from(p.password.hash,'hex')))return null;const token=crypto.randomBytes(32).toString('hex');p.hash=digest(token);this.dirty=true;this.save();return {id,token};}
 setPassword(p,password){if(typeof password!=='string'||password.length<10||password.length>128)throw Error('Contraseña: entre 10 y 128 caracteres');const salt=crypto.randomBytes(16).toString('hex');p.password={salt,hash:crypto.scryptSync(password,salt,32).toString('hex')};delete p.recovery;this.dirty=true;this.save();}
 issueRecovery(p){const code=crypto.randomBytes(24).toString('hex');p.recovery=digest(code);this.dirty=true;this.save();return code;}
 recover(id,code,password){if(typeof id!=='string'||!/^[a-f0-9]{16}$/.test(id)||typeof code!=='string'||!/^[a-f0-9]{48}$/.test(code)||typeof password!=='string'||password.length<10||password.length>128)return null;const p=this.rows[id];if(!p?.recovery||!crypto.timingSafeEqual(Buffer.from(p.recovery,'hex'),Buffer.from(digest(code),'hex')))return null;const salt=crypto.randomBytes(16).toString('hex'),token=crypto.randomBytes(32).toString('hex');p.password={salt,hash:crypto.scryptSync(password,salt,32).toString('hex')};p.hash=digest(token);delete p.recovery;this.dirty=true;this.save();return {id,token};}
 missionProgress(p,delta,now=new Date()){const r=this.progress(p);P.ensure(r,now);const before=JSON.stringify(r.daily);const xp=r.xp;P.record(r,delta,now);if(xp===undefined)delete r.xp;else r.xp=xp;if(before!==JSON.stringify(r.daily))this.dirty=true;}
 claimMission(p,id,now=new Date()){const r=this.progress(p);if(!P.claim(r,id,now))return false;this.dirty=true;this.save();return true;}
 auth(id,token){if(typeof id!=='string'||!/^[a-f0-9]{16}$/.test(id)||typeof token!=='string'||!/^[a-f0-9]{64}$/.test(token))return null;const p=this.rows[id];return p&&crypto.timingSafeEqual(Buffer.from(p.hash,'hex'),Buffer.from(digest(token),'hex'))?p:null;}
 public(p){return {id:p.id,name:p.name,xp:p.xp};}
 progress(p){return p.progress||(p.progress=R.newProfile());}
 awardProgress(p,points,wins){const r=this.progress(p);r.points+=points;r.wins.infernal+=wins[0];r.wins.glacial+=wins[1];this.dirty=true;}
 redeem(p,id){if(!R.redeem(this.progress(p),id))return false;this.dirty=true;this.save();return true;}
 recordMatch(p,m){const h=p.history||(p.history=[]);if(h.some(x=>x.id===m.id))return false;h.unshift({id:m.id,mode:m.mode,seconds:Math.max(0,Math.floor(m.seconds)),fruits:Math.max(0,Math.floor(m.fruits||0)),deaths:Math.max(0,Math.floor(m.deaths||0)),reward:Math.max(0,Math.floor(m.reward||0)),date:new Date().toISOString()});h.length=Math.min(h.length,30);this.dirty=true;this.save();return true;}
 view(p){P.ensure(this.progress(p),new Date());return {...this.public(p),progress:this.progress(p),history:p.history||[],friends:p.friends.map(id=>this.public(this.rows[id])),incoming:p.incoming.map(id=>this.public(this.rows[id]))};}
 request(p,id){const q=typeof id==='string'&&/^[a-f0-9]{16}$/.test(id)&&this.rows[id];if(!q||p===q||p.friends.includes(id)||q.incoming.includes(p.id)||q.incoming.length>=100)return false;q.incoming.push(p.id);this.dirty=true;this.save();return true;}
 accept(p,id){const q=this.rows[id];if(!p.incoming.includes(id)||!q||p.friends.length>=100||q.friends.length>=100)return false;p.incoming=p.incoming.filter(x=>x!==id);q.incoming=q.incoming.filter(x=>x!==p.id);p.friends.push(id);q.friends.push(p.id);this.dirty=true;this.save();return true;}
 award(p,n){if(Number.isSafeInteger(n)&&n>0){p.xp=Math.min(Number.MAX_SAFE_INTEGER,p.xp+n);this.dirty=true;}}
 ranking(){return Object.values(this.rows).sort((a,b)=>b.xp-a.xp||a.id.localeCompare(b.id)).slice(0,50).map(p=>this.public(p));}
}
module.exports=Accounts;
