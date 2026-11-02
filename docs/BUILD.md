# Build no Windows

1. Instale Node.js 22 LTS, Git, ferramentas de build nativo para `better-sqlite3` se exigidas e `yt-dlp` + `ffmpeg`.
2. Execute `npm install` e `npm run typecheck`.
3. Execute `npm run dev` e teste com um pendrive **de testes**, sem arquivos importantes.
4. Execute `npm run dist:win`; verifique a pasta `release`.
5. Faça testes de conexão/desconexão, volumes FAT32/exFAT/NTFS, permissões, nomes reservados e duplicatas antes de usar em pendrive real.

O executável Windows não foi gerado nem assinado neste ambiente. Empacotamento do `better-sqlite3` pode requerer rebuild para a versão do Electron instalada.
