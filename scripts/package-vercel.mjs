import {cpSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
mkdirSync('.vercel-output',{recursive:true});cpSync('apps/web/dist','.vercel-output',{recursive:true});cpSync('apps/mobile/dist','.vercel-output/app',{recursive:true});const p='.vercel-output/app/index.html';writeFileSync(p,readFileSync(p,'utf8').replace('<html lang="en">','<html lang="pt-BR">'));
