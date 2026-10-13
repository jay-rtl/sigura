import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('public/fonts',{recursive:true});
const fonts=[['Manrope:wght@200..800','manrope'],['Instrument+Serif','instrument-serif'],['Instrument+Serif:ital@1','instrument-serif-italic']];
for(const [family,name] of fonts){const css=await (await fetch('https://fonts.googleapis.com/css2?family='+family+'&display=swap',{headers:{'User-Agent':'Mozilla/5.0'}})).text();const urls=[...css.matchAll(/url\((https[^)]+)\)/g)];const u=urls.at(-1)?.[1];if(!u)throw Error(css);await writeFile('public/fonts/'+name+'.woff2',Buffer.from(await (await fetch(u)).arrayBuffer()));console.log(name);}
for(const [repo,name] of [['manrope','Manrope'],['instrumentserif','InstrumentSerif']]){const r=await fetch('https://raw.githubusercontent.com/google/fonts/main/ofl/'+repo+'/OFL.txt');if(r.ok)await writeFile('public/fonts/'+name+'-OFL.txt',await r.text());}
