import {readFile} from 'node:fs/promises';
const s=await readFile('research/portfolio.html','utf8');const imgs=[...s.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]);let seen=new Set;for(const img of imgs){const url=img.match(/(?:data-lazy-src|src)="(https:[^"]+)"/)?.[1];const alt=img.match(/alt="([^"]*)"/)?.[1];if(url&&!seen.has(alt)){seen.add(alt);console.log(alt+' | '+url)}}
