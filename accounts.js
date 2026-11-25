'use strict';
const fs=require('fs'),crypto=require('crypto'),path=require('path');
const digest=t=>crypto.createHash('sha256').update(t).digest('hex');
class Accounts {
 constructor(file){this.file=file;this.rows=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{};this.dirty=false;}
 save(){if(!this.dirty)return;fs.mkdirSync(path.dirname(this.file),{recursive:true});fs.writeFileSync(this.file+'.tmp',JSON.stringify(this.rows),{mode:0o600});fs.renameSync(this.file+'.tmp',this.file);this.dirty=false;}
 create(name){if(Object.keys(this.rows).length>=10000)throw Error('Límite de cuentas');const id=crypto.randomBytes(8).toString('hex'),token=crypto.randomBytes(32).toString('hex');this.rows[id]={id,name:String(name||'Jugador').slice(0,20),hash:digest(token),xp:0,friends:[],incoming:[]};this.dirty=true;this.save();return {id,token};}
 auth(id,token){if(typeof id!=='string'||!/^[a-f0-9]{16}$/.test(id)||typeof token!=='string'||!/^[a-f0-9]{64}$/.test(token))return null;const p=this.rows[id];return p&&crypto.timingSafeEqual(Buffer.from(p.hash,'hex'),Buffer.from(digest(token),'hex'))?p:null;}
 public(p){return {id:p.id,name:p.name,xp:p.xp};}
 view(p){return {...this.public(p),friends:p.friends.map(id=>this.public(this.rows[id])),incoming:p.incoming.map(id=>this.public(this.rows[id]))};}
 request(p,id){const q=typeof id==='string'&&/^[a-f0-9]{16}$/.test(id)&&this.rows[id];if(!q||p===q||p.friends.includes(id)||q.incoming.includes(p.id)||q.incoming.length>=100)return false;q.incoming.push(p.id);this.dirty=true;this.save();return true;}
 accept(p,id){const q=this.rows[id];if(!p.incoming.includes(id)||!q||p.friends.length>=100||q.friends.length>=100)return false;p.incoming=p.incoming.filter(x=>x!==id);q.incoming=q.incoming.filter(x=>x!==p.id);p.friends.push(id);q.friends.push(p.id);this.dirty=true;this.save();return true;}
 award(p,n){if(Number.isSafeInteger(n)&&n>0){p.xp=Math.min(Number.MAX_SAFE_INTEGER,p.xp+n);this.dirty=true;}}
 ranking(){return Object.values(this.rows).sort((a,b)=>b.xp-a.xp||a.id.localeCompare(b.id)).slice(0,50).map(p=>this.public(p));}
}
module.exports=Accounts;
