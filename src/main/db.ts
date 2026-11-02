import path from 'node:path';
import {app} from 'electron';
import Database from 'better-sqlite3';
import type {Settings} from '../shared/types';
let db:Database.Database;
export function initDb(){db=new Database(path.join(app.getPath('userData'),'plugmusic.sqlite'));db.pragma('journal_mode = WAL');db.exec(`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY,value TEXT NOT NULL); CREATE TABLE IF NOT EXISTS history (id TEXT PRIMARY KEY,title TEXT NOT NULL,artist TEXT NOT NULL,volume TEXT NOT NULL,path TEXT NOT NULL,created_at TEXT DEFAULT CURRENT_TIMESTAMP);`);}
export function getSettings():Settings{const row=db.prepare('SELECT value FROM settings WHERE key=?').get('preferences') as {value:string}|undefined;return {bitrate:'128',concurrency:2,cookiesBrowser:'none',cookiesFile:'',...(row?JSON.parse(row.value):{})};}
export function setSettings(v:Settings){db.prepare('INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run('preferences',JSON.stringify(v));}
export function addHistory(id:string,title:string,artist:string,volume:string,relative:string){db.prepare('INSERT OR REPLACE INTO history(id,title,artist,volume,path) VALUES (?,?,?,?,?)').run(id,title,artist,volume,relative);}
