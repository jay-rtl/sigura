import {spawnSync} from 'node:child_process';
const command=process.argv[2]||'dev';
const commands=command==='build'?[['check'],['build']]:[[command,...process.argv.slice(3)]];
for(const args of commands){const result=spawnSync(process.execPath,['node_modules/astro/bin/astro.mjs',...args],{stdio:'inherit',env:{...process.env,ASTRO_TELEMETRY_DISABLED:'1'}});if(result.status!==0)process.exit(result.status||1);}
