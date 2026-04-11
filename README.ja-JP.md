# ScholarAGENTS

`ScholarAGENTS` はこのリポジトリの Codex 向けランタイムです。移行中でもリポジトリ内容は `claude-scholar` 配下に残せますが、CLI、bootstrap、設定、公開ドキュメントでは `scholaragents` 名を使います。

## 提供内容

- `base` レイヤー: 複数ワークフローが共有する下位スキル
- `bundle` レイヤー: 機能別の選択インストール
- `standby` モード: 選択モジュールを `CODEX_HOME` へ配置
- `global` モード: Codex のローカルプラグイン連鎖として配置し、プラグインキャッシュにも反映
- プロジェクト有効化ファイル: `.scholaragents/modules.json`

## 既定 Base

複数 bundle の依存ハブとして次を既定で保持します。

- `planning-with-files`
- `daily-coding`
- `bug-detective`
- `verification-loop`
- `git-workflow`
- `codex-hook-emulation`
- `session-wrap-up`

`obsidian-project-memory`、`plugin-structure`、`skill-development`、`skill-quality-reviewer` は対応する bundle 側へ戻し、base から外しました。

## Bundle

- `research-core`: 研究立ち上げ、実験解析、文献レビュー
- `writing-core`: 論文執筆、引用確認、rebuttal、採択後作業
- `dev-core`: コードレビュー、設計、ビルド修正、Git 補助
- `obsidian-core`: Obsidian プロジェクト記憶と文献ワークフロー（`obsidian-project-memory` を含む）
- `meta-builder`: skill / command / agent / plugin の自己拡張（`plugin-structure`、`skill-development`、`skill-quality-reviewer` を含む）
- `ui-content`: UI 生成、レビュー、ブラウザ検証

## クイックスタート

```bash
npm install
node scripts/build-catalog.mjs
node cli.mjs list bundles
node cli.mjs list default
```

standby モード:

```bash
node cli.mjs install codex --standby --bundle research-core --bundle writing-core
```

global モード:

```bash
node cli.mjs install codex --global --bundle obsidian-core --bundle meta-builder
```

現在のプロジェクトでモジュールを有効化:

```bash
node cli.mjs activate --bundle research-core
```

状態確認とクリーンアップ:

```bash
node cli.mjs status
node cli.mjs doctor
node cli.mjs cleanup codex
```

## 選択ルール

- `--no-base` を付けない限り base は既定で含まれます
- `--bundle` で機能群を追加します
- `--skills` / `--agents` で個別指定できます
- skill の依存は自動展開されます
- base 依存は `base` に残し、bundle 側では `dependsOnBase` で参照します

## Global モードの配置先

`install codex --global` は次の Codex ローカルプラグイン連鎖を作成します。

- `~/plugins/scholaragents/`
- `~/.agents/plugins/marketplace.json`
- `~/.codex/plugins/cache/local-plugins/scholaragents/local/`
- `~/.codex/AGENTS.md` の管理 bootstrap ブロック
- `~/.codex/config.toml` の管理 plugin / agent ブロック

## 開発検証

```bash
npm test
```

テストは catalog 依存解決、standby install/activate/cleanup、global プラグイン導線をカバーします。
