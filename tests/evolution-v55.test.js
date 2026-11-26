'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto'),C=require('../cloud44'),O=require('../origin53');
(async()=>{
 const users=new Map(),sessions=new Map();
 const q=async(sql,p=[])=>{let rows=[];if(sql===C.SCHEMA){}else if(sql.startsWith('INSERT INTO evo44_users')){if(!users.has(p[0])){users.set(p[0],{name:p[0],salt:p[1],hash:p[2],public_id51:p[4]||crypto.randomUUID(),has_email51:true});rows=[{name:p[0]}];}}else if(sql.startsWith('INSERT INTO evo44_sessions'))sessions.set(p[0],p[1]);else if(sql.startsWith('SELECT name FROM evo44_sessions')){if(sessions.has(p[0]))rows=[{name:sessions.get(p[0])}];}else if(sql.startsWith('SELECT name,best,xp,coins')||sql.startsWith('SELECT salt,hash')||sql.startsWith('SELECT skin45,skins45')){if(users.has(p[0]))rows=[{...users.get(p[0])}];}return {rows,rowCount:rows.length};};
 const api=C.make({query:q}),rooms=new Map(),base={action:'register',password:'test-password',email:'player@example.com',manualLogin:true};
 await assert.rejects(api.request({...base,name:'abcdefghijklm'},rooms),/máximo 12/);assert.equal(users.size,0);
 const reg=await api.request({...base,name:'abcdefghijkl'},rooms);assert.equal(reg.registered,true);assert.equal(reg.token,undefined);assert.equal(sessions.size,0);
 const logged=await api.request({...base,action:'login',name:'abcdefghijkl'},rooms);assert(logged.token);assert.equal(logged.profile.name,'abcdefghijkl');
 const name='legacyusername15',salt='test-salt';users.set(name,{name,salt,hash:crypto.scryptSync(base.password,salt,64).toString('hex')});assert((await api.request({...base,action:'login',name},rooms)).token);
 process.env.EVO_FOUNDER_EMAIL='owner@example.com';process.env.EVO_FOUNDER_SETUP_CODE='test-only-setup-key-0123456789';const founder={...base,name:O.DISPLAY,email:'owner@example.com'};await assert.rejects(api.request({...founder,founderCode:'bad'},rooms),/reservado/);assert((await api.request({...founder,founderCode:process.env.EVO_FOUNDER_SETUP_CODE},rooms)).registered);const profile=(await api.request({...founder,action:'login'},rooms)).profile;assert(profile.founder53);assert.equal(profile.publicAlias53,O.ID);
 console.log('OK v5.5: rejects 13 characters, accepts 12, registration creates no session, explicit login, legacy names and founder identity preserved (simulated SQL).');
})().catch(e=>{console.error(e);process.exitCode=1;});
