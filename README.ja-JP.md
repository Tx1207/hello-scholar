# hello-scholar

`hello-scholar` は Codex 向けの CLI ランタイムです。研究、執筆、開発、Obsidian、meta-builder 向けの workflow を必要なものだけインストールできます。

## 必要環境

- Node.js 18+
- npm

## インストール

npm 公開後:

```bash
npm install -g hello-scholar
```

このリポジトリから直接入れる場合:

```bash
npm install
npm run build:catalog
npm install -g .
```

インストール後はターミナルから直接実行できます:

```bash
hello-scholar --help
```

## 基本コマンド

```bash
hello-scholar list bundles
hello-scholar install codex --standby
hello-scholar install codex --global
hello-scholar status
hello-scholar doctor
hello-scholar cleanup codex
```

## ランタイム配置

- Project: `.hello-scholar/`
- Global state: `~/.codex/.hello-scholar/`
- Plugin root: `~/plugins/hello-scholar/`
- Plugin cache: `~/.codex/plugins/cache/local-plugins/hello-scholar/local/`

## 開発

```bash
npm test
```
