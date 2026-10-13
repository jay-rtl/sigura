import { mkdir, writeFile } from 'node:fs/promises';
const pages={home:'',portfolio:'bay-area-home-remodeling-portfolio/',before:'bay-area-home-remodeling-before-and-after/',about:'about/',awards:'bay-area-award-winning-construction/',areas:'service-areas/'};
await mkdir('research',{recursive:true});
for (const [name,path] of Object.entries(pages)) {const html=await (await fetch('https://siguraconstruction.com/'+path)).text();await writeFile('research/'+name+'.html',html); const imgs=[...html.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]);await writeFile('research/'+name+'-images.txt',imgs.join('\n'));console.log(name,imgs.length);}
