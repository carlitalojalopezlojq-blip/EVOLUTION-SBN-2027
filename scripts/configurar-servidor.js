'use strict';
const fs=require('node:fs'),path=require('node:path');
function normalize(value){const raw=String(value||'').trim();if(!raw)throw Error('Introduce la URL HTTPS pública de tu servidor.');const u=new URL(raw);if(!['https:','wss:'].includes(u.protocol)||u.username||u.password||u.search||u.hash||u.pathname!=='/'||!u.hostname.includes('.'))throw Error('Usa la dirección pública HTTPS o WSS, sin ruta, usuario ni contraseña.');u.protocol='wss:';return u.origin;}
if(require.main===module){try{const url=normalize(process.argv[2]);const file=path.join(__dirname,'../app/src/main/assets/server-config.js');fs.writeFileSync(file,'// URL pública del servidor; no contiene credenciales.\nwindow.EVO_SERVER = '+JSON.stringify(url)+';\n');console.log('Servidor integrado en el próximo APK: '+url);}catch(e){console.error(e.message);process.exitCode=1;}}
module.exports={normalize};
