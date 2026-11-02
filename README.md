# PlugMusic — Retro Digital Edition

Aplicativo Windows 10/11 para **gerenciar músicas e arquivos no pendrive** com pesquisa, download autorizado, MP3 e detecção de duplicatas. Projeto inicial funcional de engenharia, **não release de produção validada**.

## Ambiente
- Node.js 22+
- Windows 10/11, PowerShell
- `yt-dlp` e `ffmpeg` disponíveis no `PATH` (instalar separadamente)
- Compilação do instalador em Windows recomendada

```powershell
winget install yt-dlp.yt-dlp
winget install Gyan.FFmpeg
npm install
npm run dev
```

Testes: `npm test`; tipagem: `npm run typecheck`; build: `npm run build`; instalador Windows: `npm run dist:win`.

## Escopo implementado
- Interface retrô digital em React
- seleção de unidade removível via PowerShell
- navegação e criação de pastas; renomear e mover por caminho relativo
- mover para recuperação ou excluir definitivamente; recuperar arquivos na raiz
- detecção de duplicatas por hash SHA-256 e nome normalizado
- pesquisa `ytsearch`, download sob seleção explícita e conversão MP3 via yt-dlp/FFmpeg
- fila concorrente em memória, progresso básico e histórico SQLite
- preferências locais de bitrate e concorrência

## Limitações conhecidas — ler antes de usar
- A fila de downloads ainda **não é persistida** no SQLite, nem suporta cancelamento/retomada confiável.
- Não há arrastar-soltar, nem prévia/renomeação em lote; recuperação simplificada não preserva pasta de origem.
- Não há deduplicação preventiva por fingerprint de áudio; identificação por título é heurística.
- A integridade de um arquivo copiado deve ser validada por hash antes de usar em produção; arquivos `.plugmusic-partial` podem restar após falhas.
- O app depende de binários externos `yt-dlp` e `ffmpeg` no PATH; o instalador não os embute.
- Não foram feitos testes em Windows ou validação completa de binários nativos `better-sqlite3`.
- Os downloads não contornam restrições de acesso ou DRM. Use somente material cuja obtenção seja autorizada; considere os termos de uso da fonte e direitos autorais.

O objetivo deste ZIP é servir como **base executável e extensível**, não declarar finalizadas funcionalidades ainda ausentes.

## Build do instalador (binários embutidos)
`resources/bin/` não vai para o git (ffmpeg passa de 100 MB). Antes de `npm run dist:win`, coloque ali `yt-dlp.exe`, `ffmpeg.exe` e `ffprobe.exe`. O instalador pronto fica nas Releases do GitHub.
