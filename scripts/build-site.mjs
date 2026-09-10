import {cp,mkdir} from 'node:fs/promises';
await mkdir('docs/dist/src',{recursive:true});
await cp('dist/src/EventScheduler.js','docs/dist/src/EventScheduler.js');
