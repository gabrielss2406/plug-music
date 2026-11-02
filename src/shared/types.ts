export type Track = {id:string; title:string; artist:string; duration:number; url:string; thumbnail?:string;owned?:boolean};
export type UsbDrive = {id:string; letter:string; label:string; size:number; free:number};
export type FileEntry = {name:string;relativePath:string;isDirectory:boolean;size:number};
export type DuplicateGroup = {key:string;reason:'same-name'|'same-hash';files:FileEntry[]};
export type DownloadState = {id:string;title:string;state:'queued'|'downloading'|'converting'|'copying'|'done'|'failed'|'canceled';percent:number;error?:string};
export type RenameProposal = {from:string;to:string;name:string;newName:string;conflict:boolean};
export type CookiesBrowser = 'none'|'edge'|'chrome'|'firefox'|'brave';
export type Settings = {bitrate:'96'|'128'|'192'|'256'|'320';concurrency:number;cookiesBrowser:CookiesBrowser;cookiesFile:string};
export type Api = {drives:()=>Promise<UsbDrive[]>;chooseDrive:(id:string)=>Promise<UsbDrive>;files:(dir?:string)=>Promise<FileEntry[]>;mkdir:(dir:string)=>Promise<void>;rename:(src:string,dst:string)=>Promise<void>;remove:(paths:string[],permanent:boolean)=>Promise<void>;recover:(paths:string[])=>Promise<void>;duplicates:()=>Promise<DuplicateGroup[]>;search:(query:string,limit:number,hideOwned:boolean)=>Promise<Track[]>;queue:(tracks:Track[],targetFolder:string)=>Promise<void>;tasks:()=>Promise<DownloadState[]>;cancel:(id:string)=>Promise<void>;cancelAll:()=>Promise<void>;pickCookies:()=>Promise<string|null>;previewUrl:(url:string)=>Promise<string>;previewNames:(stripArtist:boolean)=>Promise<RenameProposal[]>;applyNames:(items:{from:string;to:string}[])=>Promise<{done:number;skipped:number}>;settings:()=>Promise<Settings>;saveSettings:(settings:Settings)=>Promise<void>;onTasks:(fn:(tasks:DownloadState[])=>void)=>()=>void};
