const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../app/src/main/assets/index.html'),'utf8');
const block=html.slice(html.indexOf('let domPrefs;'),html.indexOf('function resize()'));
const owned=html.slice(html.indexOf('function installOwned()'),html.indexOf('}installOwned();',html.indexOf('function installOwned()'))+1);
function setup(initial={}){
 const store=new Map(Object.entries(initial));
 const opt=(textContent,value)=>({textContent,value,disabled:false});
 const select={options:[opt('Aleatoria','auto'),opt('Esmeralda','#43ffd1'),opt('Zafiro','#49aaff'),opt('Rubí','#ff527d'),opt('Oro','#ffcf55'),opt('Obsidiana','#454b59'),opt('Eléctrico','#ad80ff')],value:'auto',add(o){this.options.push(o)},get selectedOptions(){return this.options.filter(o=>o.value===this.value)}};
 const els={skin:select,quality:{value:'medium'},arena:{value:'neon'}};
 const ctx=vm.createContext({localStorage:{getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,String(v))},$:k=>els[k],resize(){},refreshChoices(){},Option:function(n,c){return opt(n,c)},data:{owned:['#a52739','#861a39']},Legends:{shop:[['Infernal','#a52739',1]]},Mutations:{mutations:[['radio','Radiactiva','#69f34d']]},stageColor:(c,n)=>n?'#aaaaaa':c});
 vm.runInContext(block+'\n'+owned,ctx);return {run:s=>vm.runInContext(s,ctx),store,select};
}
let t=setup({skin:'#ff527d',domPrefs24:JSON.stringify({customColor:'#e79fcd',bots:9})});
assert.equal(t.run('selectedSkin()'),'#e79fcd');assert.equal(t.run('skinLabel()'),'COLOR PERSONALIZADO');
t.run("$('skin').value='#49aaff';$('skin').onchange()");assert.equal(t.run('selectedSkin()'),'#49aaff');assert.equal(JSON.parse(t.store.get('domPrefs24')).customColor,undefined);assert.equal(JSON.parse(t.store.get('domPrefs24')).bots,9);
t.run("$('quality').value='high';$('quality').onchange();$('arena').value='ice';$('arena').onchange()");assert.equal(t.run('selectedSkin()'),'#49aaff');
assert.equal(t.run("[0,1,2,3].every(n=>bodySkinColor({id:'me',c:'#49aaff',mutation:'radio',team:null},'me',false,n)==='#49aaff')"),true);
assert.equal(t.run("bodySkinColor({id:'bot1',c:'#123456',mutation:'radio'},'me',false,0)"),'#69f34d');assert.equal(t.run("bodySkinColor({id:'king',c:'#ffcf55'},'me',true,3)"),'#ffcf55');
assert.equal(t.run("bodySkinColor({id:'me',team:1,c:'#123456'},'me',false,0)"),'#123456');
assert.equal(t.run("chooseSkin('#ffcf55')"),false);assert.equal(t.run('selectedSkin()'),'#49aaff');t.run("chooseSkin('auto')");assert.equal(t.run('selectedSkin()'),undefined);
t=setup({skin:'#a52739'});t.run('installOwned()');assert.equal(t.run('selectedSkin()'),'#a52739');assert.equal(t.select.value,'#a52739');
t=setup({skin:'#861a39'});t.run('installOwned()');assert.equal(t.run('selectedSkin()'),undefined);t.run("Legends.shop.push(['Apocalipsis','#861a39',1]);installOwned()");assert.equal(t.run('selectedSkin()'),'#861a39');
assert.ok(html.includes('bodySkinColor(q,id,king,level)'));assert.ok(html.includes('if(chosen&&sim.p.me.team==null)sim.p.me.c=chosen'));assert.ok(html.includes('selectedSkin()).a'));
for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){if(match[1].trim())new vm.Script(match[1]);}
console.log('OK: skin selection, custom color precedence, purchased skins restoration, mutation/evolution color, auto and gold lock; inline JS syntax.');
