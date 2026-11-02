import {app,BrowserWindow,session} from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';

const PARTITION='persist:youtube';
const LOGIN_URL='https://accounts.google.com/ServiceLogin?service=youtube&continue=https%3A%2F%2Fwww.youtube.com%2F';
const LOGIN_COOKIES=['SAPISID','__Secure-3PSID'];
export const cookiesPath=()=>path.join(app.getPath('userData'),'youtube-cookies.txt');

async function exportCookies():Promise<boolean>{
  const all=await session.fromPartition(PARTITION).cookies.get({});
  const mine=all.filter(c=>/(^|\.)(youtube|google)\.com$/.test((c.domain??'').replace(/^\./,'')));
  if(!mine.some(c=>LOGIN_COOKIES.includes(c.name)))return false;
  const farFuture=Math.floor(Date.now()/1000)+365*24*3600;
  const lines=['# Netscape HTTP Cookie File',...mine.map(c=>[
    (c.httpOnly?'#HttpOnly_':'')+(c.domain??''),
    (c.domain??'').startsWith('.')?'TRUE':'FALSE',
    c.path||'/',
    c.secure?'TRUE':'FALSE',
    String(c.expirationDate?Math.floor(c.expirationDate):farFuture),
    c.name,
    c.value
  ].join('\t'))];
  await fs.writeFile(cookiesPath(),lines.join('\n')+'\n',{mode:0o600});
  return true;
}

export function youtubeLogin(parent:BrowserWindow|null):Promise<string|null>{
  return new Promise(resolve=>{
    const ses=session.fromPartition(PARTITION);
    ses.setUserAgent(ses.getUserAgent().replace(/\s(Electron|plugmusic)\/\S+/gi,''));
    const win=new BrowserWindow({parent:parent??undefined,modal:!!parent,width:520,height:720,title:'Entrar no YouTube',autoHideMenuBar:true,webPreferences:{partition:PARTITION,contextIsolation:true,nodeIntegration:false,sandbox:true}});
    let done=false;
    const finish=async()=>{if(done)return;done=true;const ok=await exportCookies().catch(()=>false);resolve(ok?cookiesPath():null);if(!win.isDestroyed())win.destroy();};
    const check=async(url:string)=>{if(done)return;try{if(/(^|\.)youtube\.com$/.test(new URL(url).hostname)&&await exportCookies())await finish();}catch{}};
    win.webContents.on('did-navigate',(_,url)=>void check(url));
    win.webContents.on('did-navigate-in-page',(_,url)=>void check(url));
    win.on('close',e=>{if(done)return;e.preventDefault();void finish();});
    void win.loadURL(LOGIN_URL);
  });
}

export async function youtubeLogout():Promise<void>{
  await session.fromPartition(PARTITION).clearStorageData();
  await fs.rm(cookiesPath(),{force:true});
}
