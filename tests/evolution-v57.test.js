'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto'),O=require('../origin53'),B=require('../verification57'),C=require('../cloud44');
(async()=>{
const owner={name:O.NAME,public_id51:O.UUID,badge_verified57:false},alice={name:'alice',public_id51:'11111111-1111-4111-8111-111111111111',verified52:true,badge_verified57:false},bob={name:'bob',public_id51:'22222222-2222-4222-8222-222222222222',badge_verified57:false};
const users=[owner,alice,bob],tokens=new Map([['a'.repeat(64),owner],['b'.repeat(64),alice]].map(([k,v])=>[crypto.createHash('sha256').update(k).digest('hex'),v.name]));let writes=0;
const query=async(sql,p=[])=>{let rows=[];
 if(sql===C.SCHEMA)assert(sql.includes(B.SCHEMA));
 else if(sql.startsWith('SELECT name FROM evo44_sessions')){if(tokens.has(p[0]))rows=[{name:tokens.get(p[0])}];}
 else if(sql.startsWith('SELECT skin45,skins45')||sql.startsWith('SELECT name,best,xp,coins'))rows=users.filter(x=>x.name===p[0]).map(x=>({...x}));
 else if(sql.startsWith('SELECT name FROM evo60_suspensions')){}
 else if(sql.startsWith('SELECT target FROM')||sql.startsWith('SELECT friend FROM')||sql.startsWith('SELECT sender AS')||sql.startsWith('SELECT mass,seconds')){}
 else if(sql.startsWith('SELECT name,public_id51,badge_verified57 FROM evo44_users WHERE badge_verified57'))rows=users.filter(x=>x.badge_verified57&&x.name!==p[0]&&x.name>p[1]).map(x=>({...x}));
 else if(sql.startsWith('SELECT name,public_id51,badge_verified57 FROM evo44_users WHERE name='))rows=users.filter(x=>x.name===p[0]||x.public_id51===p[1]).map(x=>({...x}));
 else if(sql.startsWith('UPDATE evo44_users SET badge_verified57=')){writes++;const x=users.find(x=>x.public_id51===p[0]&&x.name!==p[2]);if(x){x.badge_verified57=p[1];rows=[{...x}];}}
 else if(sql.startsWith('SELECT name,public_id51,best,xp,wins'))rows=users.filter(x=>x.public_id51===p[0]).map(x=>({...x}));
 else if(sql.startsWith('SELECT name,best,xp,wins'))rows=users.map(x=>({...x,best:10,xp:1,wins:0}));
 else throw Error('Unexpected SQL: '+sql);
 return {rows,rowCount:rows.length};};
const api=C.make({query}),rooms=new Map(),call=(action,data={},token='a'.repeat(64))=>api.request({action,token,...data},rooms);
assert.equal(B.role(owner),'F');assert.equal(B.role(alice),null);assert.equal(B.role({name:O.NAME}),null);assert.equal(B.role({badge_verified57:'true'}),null);
for(const action of B.ACTIONS){await assert.rejects(call(action,{query:'alice',publicId:alice.public_id51,enabled:true},'b'.repeat(64)),/Solo el fundador/);await assert.rejects(call(action,{},'c'.repeat(64)),/Solo el fundador/);}
assert.equal(writes,0);assert.equal((await call('badgeFind57',{query:'ALICE'})).badgePlayer57.id,alice.public_id51);assert.equal((await call('badgeFind57',{query:alice.public_id51})).badgePlayer57.badge57,null);assert.equal((await call('badgeFind57',{query:O.ID})).badgePlayer57.badge57,'F');
await assert.rejects(call('badgeSet57',{publicId:O.ID,enabled:false}),/permanente/);await assert.rejects(call('badgeSet57',{publicId:alice.public_id51,enabled:'true'}),/inválida/);assert.equal(writes,0);
assert.equal((await call('badgeSet57',{publicId:alice.public_id51,enabled:true})).badgePlayer57.badge57,'V');assert.equal((await call('badgeList57')).badgePlayers57.length,1);assert.equal((await call('profile',{},'b'.repeat(64))).profile.badge57,'V');assert.equal((await call('lookup51',{publicId:alice.public_id51})).found51.badge57,'V');assert.equal((await call('rank')).rank.find(x=>x.name==='alice').badge57,'V');assert.equal((await api.user('b'.repeat(64))).badge_verified57,true);
assert.equal((await call('badgeSet57',{publicId:alice.public_id51,enabled:false})).badgePlayer57.badge57,null);assert.equal((await call('badgeList57')).badgePlayers57.length,0);assert.equal((await call('profile',{},'b'.repeat(64))).profile.badge57,null);assert.equal((await call('profile')).profile.badge57,'F');assert.equal(writes,2);
console.log('OK v5.7: session-based founder authorization, guest and ordinary user denial, immutable F, grant/revoke, profile, public lookup, leaderboard and list (simulated SQL).');
})().catch(e=>{console.error(e);process.exitCode=1;});
