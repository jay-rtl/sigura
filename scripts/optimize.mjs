import sharp from 'sharp';import {readdir} from 'node:fs/promises';
for(const file of await readdir('research/originals')){if(!file.endsWith('.jpg'))continue;for(const width of [800,1600])await sharp('research/originals/'+file).rotate().resize({width,withoutEnlargement:true}).webp({quality:83}).toFile('public/images/'+file.replace('.jpg','-'+width+'.webp'));}
console.log('Responsive WebP assets created.');
