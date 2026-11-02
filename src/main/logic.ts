import path from 'node:path';
import {createHash} from 'node:crypto';
import fs from 'node:fs';
export const normalized = (s:string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\([^)]*\)/g,' ').replace(/\[[^\]]*\]/g,' ').replace(/\b(oficial|official|audio|video|lyrics|letra|hd|4k)\b/g,' ').replace(/[^a-z0-9]+/g,' ').trim();
export const trackKey = (artist:string,title:string) => `${normalized(artist)}::${normalized(title)}`;
export function confined(root:string, relative:string) {const base=path.resolve(root);const resolved=path.resolve(base,relative);const rel=path.relative(base,resolved);if(rel==='..'||rel.startsWith('..'+path.sep)||path.isAbsolute(rel))throw new Error('Caminho fora do pendrive');return resolved;}
export function hash(file:string):Promise<string>{return new Promise((resolve,reject)=>{const h=createHash('sha256');const stream=fs.createReadStream(file);stream.on('data',c=>h.update(c));stream.on('end',()=>resolve(h.digest('hex')));stream.on('error',reject);});}
export const safeName=(v:string)=>v.replace(/[<>:"/\\|?*\x00-\x1f]/g,'_').replace(/[. ]+$/g,'').slice(0,140).trim()||'Sem nome';
const NOISE=new Set(['video','videoclipe','clipe','oficial','official','audio','lyrics','lyric','letra','hd','4k','music','visualizer','com','e']);
export function cleanFileName(base:string,stripArtist:boolean){let name=base.replace(/\s*\[[\w-]{11}\]\s*$/,'');name=name.replace(/\s*[(\[]([^)\]]*)[)\]]/g,(whole,inner:string)=>{const tokens=inner.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);return tokens.length>0&&tokens.every(t=>NOISE.has(t))?'':whole;});let parts=name.split(/\s+-\s+/).map(p=>p.trim()).filter(Boolean);parts=parts.filter((p,i)=>i===0||normalized(p)!==normalized(parts[i-1]));if(stripArtist&&parts.length>1)parts=[parts[parts.length-1]];return safeName(parts.join(' - ').replace(/\s+/g,' '));}
