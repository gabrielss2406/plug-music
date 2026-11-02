# Arquitetura

`renderer` (React) se comunica apenas com a API explícita em `preload`, via canais IPC validados no `main`. Serviços nativos ficam em `src/main`: `usb.ts`, `downloader.ts`, `db.ts`, `logic.ts`.

- SQLite fica no `app.getPath('userData')`, músicas não são persistidas no PC.
- Downloads utilizam diretório temporário do sistema, conversão e posterior cópia para USB.
- Windows PowerShell descobre drives de `DriveType=2`.
- Qualquer caminho escolhido pelo renderer é confinado à raiz do volume selecionado.
- Extensões futuras: fila persistente, fingerprints, scanner incremental, gestão de origens e atualizações.
