<div align="center">
  <img src="LOGO.png" alt="Claude Scholar Logo" width="100%"/>

  <p>
    <a href="https://github.com/Galaxy-Dawn/claude-scholar/stargazers"><img src="https://img.shields.io/github/stars/Galaxy-Dawn/claude-scholar?style=flat-square&color=yellow" alt="Stars"/></a>
    <a href="https://github.com/Galaxy-Dawn/claude-scholar/network/members"><img src="https://img.shields.io/github/forks/Galaxy-Dawn/claude-scholar?style=flat-square" alt="Forks"/></a>
    <img src="https://img.shields.io/github/last-commit/Galaxy-Dawn/claude-scholar?style=flat-square" alt="Last Commit"/>
    <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"/>
    <img src="https://img.shields.io/badge/Codex_CLI-Compatible-blue?style=flat-square" alt="Codex CLI"/>
  </p>

  <strong>Language</strong>: <a href="README.md">English</a> | <a href="README.zh-CN.md">中文</a> | <a href="README.ja-JP.md">日本語</a>
</div>

> 学術研究とソフトウェア開発のための半自動リサーチアシスタントであり、特にコンピュータサイエンスと AI 研究者に適しています。[Codex CLI](https://github.com/openai/codex) 向けに調整されており、研究構想、文献レビュー、実験、結果レポート、執筆、プロジェクト知識ベースの保守までを一つの流れで支援します。
>
> **ブランチ説明**：これは Claude Scholar の **Codex CLI 版**です。Claude Code 版は [`main` ブランチ](https://github.com/Galaxy-Dawn/claude-scholar/tree/main)、OpenCode 版は [`opencode` ブランチ](https://github.com/Galaxy-Dawn/claude-scholar/tree/opencode) を参照してください。

## 最新ニュース

- **2026-03-31**: **Zotero smart-importワークフロー文書を整合** — 最新の`zotero-mcp`公開インターフェースに合わせて、Claude Scholarの研究向けドキュメントを更新しました。`zotero_add_items_by_identifier`を標準の論文インポート経路として明示し、`zotero_reconcile_collection_duplicates`を標準的なインポート後クリーンアップ手順に位置づけ、source-awareなPDF cascadeの挙動もより正確に説明し直しました。公開機能と内部診断機能の境界も整理しています。
- **2026-03-31**: **READMEの導入案内を刷新** — Claude Scholarが特にコンピュータサイエンスおよびAI研究者に適していることを明確にし、インストール後すぐ使える実践的な導入シナリオを追加しました。前提条件やブランチ案内も整理し、「既存のローカルmdファイルは手動でマージする必要がある」点をより明確にしました。
- **2026-03-31**: **インストーラーとhooksの挙動を整理** — インストーラーは既存のローカル`AGENTS.md`を保持しつつ、リポジトリ版を`AGENTS.scholar.md`として追加するようになりました。あわせて、デフォルトhooksの要約出力も整理し、temp filesやuncommitted filesのノイズを抑えつつ、より安全な書き込みガードは維持しています。
- **2026-03-31**: **日本語ドキュメントを追加** — メインREADMEに加え、`AGENTS`、`MCP_SETUP`、`OBSIDIAN_SETUP`の日本語版も追加し、Codexブランチ全体の多言語ドキュメント導線をより充実させました。

<details>
<summary>過去の更新履歴を表示</summary>

- **2026-02-25**: **Codex CLI への移行** — プロジェクトを Codex CLI 形態へ移行し、TOML 設定、agent ディレクトリ、AGENTS ベースの作業規律、増分インストーラーを導入
- **2026-02-23**: `setup.sh` インストーラー追加 — 既存 `~/.codex` 向けのバックアップ付き増分更新と、既存設定保持 + Zotero MCP 任意有効化に対応
- **2026-02-22**: Zotero MCP テンプレート追加 — Codex 上でそのまま使える文献ワークフローテンプレートを提供
- **2026-02-21**: OpenCode 移行の土台整備 — Claude Code / Codex / OpenCode の 3 分岐の役割を明確化
- **2026-02-15**: Zotero MCP 統合 — `/zotero-review`、`/zotero-notes` 系の文献ワークフローをより大きな Claude Scholar 主線に統合
- **2026-02-11**: 大型アップデート — 研究 skills、agents、学術ワークフローのカバー範囲を拡張
- **2026-01-25**: プロジェクト正式公開、v1.0.0 リリース

</details>

## クイックナビゲーション

| セクション | 役割 |
|---|---|
| [なぜ Claude Scholar なのか](#なぜ-claude-scholar-なのか) | プロジェクトの位置づけと適用シーンを素早く把握する。 |
| [コアワークフロー](#コアワークフロー) | 研究構想から投稿までの主線を確認する。 |
| [クイックスタート](#クイックスタート) | 既存の `~/.codex` 環境へ安全に導入する。 |
| [使い始めのシナリオ](#使い始めのシナリオ) | インストール後の代表的な使い始め方を見る。 |
| [プラットフォーム範囲](#プラットフォーム範囲) | この分岐の対象範囲と他バージョンの所在を確認する。 |
| [連携機能](#連携機能) | Zotero と Obsidian を Codex ワークフローへどう接続するかを確認する。 |
| [主要ワークフロー](#主要ワークフロー) | 中核となる研究・開発ワークフローを俯瞰する。 |
| [支援ワークフロー](#支援ワークフロー) | 主ワークフローを支える裏側の仕組みを見る。 |
| [ドキュメント入口](#ドキュメント入口) | インストール、設定、setup 文書へ移動する。 |
| [引用](#引用) | 論文・報告書・プロジェクト文書で Claude Scholar を引用する。 |

## なぜ Claude Scholar なのか

Claude Scholar は、研究者を置き換えることを目指したエンドツーエンドの全自動研究システム**ではありません**。

中核の発想はとても単純です。

> **意思決定は常に人間が中心に持ち、アシスタントはその周囲の研究プロセスを加速する。**

つまり Codex 版は、文献整理、知識の蓄積、実験分析、結果報告、執筆支援のような「反復的で構造依存だが、なお人間の判断が必要な仕事」に特に向いています。本当に重要な判断は、やはり研究者自身が行うべきです。

- どの問題に取り組むべきか
- どの論文が本当に重要か
- どの仮説を検証すべきか
- どの結果が十分に説得力を持つか
- 何を続け、何を書き、何を投稿し、あるいは何をやめるべきか

言い換えれば、Claude Scholar は**半自動研究アシスタント**であり、「全自動の科学者」ではありません。

## どんな人に向いているか

Claude Scholar は特に次のような人に向いています。

- **コンピュータサイエンス研究者**：文献、コード、実験、論文執筆を頻繁に行き来する人
- **AI / ML researcher**：構想、実装、分析、レポート、rebuttal までを一つの流れで回したい人
- **research engineer や大学院生**：人間の判断を保ったまま、より強いプロセス構造を導入したい人
- **ソフトウェア・計算駆動型の学術プロジェクト**：Zotero、Obsidian、CLI 自動化、追跡可能な project memory の恩恵を直接受けられる人

もちろん他の研究分野にも役立ちますが、このワークフローの重心は現時点ではコンピュータサイエンス、AI、および近接する computational research に最も近いです。

## コアワークフロー

- **研究構想**：曖昧なテーマを具体的な研究問題、研究ギャップ、初期計画へ収束させる
- **文献ワークフロー**：Zotero コレクションを通じて論文を検索、取込、整理し、読む
- **論文ノート**：論文を構造化された読書ノートと再利用可能な論点へ変換する
- **知識ベースへの蓄積**：安定した知識を Obsidian に書き込み、`Papers / Knowledge / Experiments / Results / Writing` へ振り分ける。ラウンド単位の実験レポートは `Results/Reports/` に保存する
- **実験推進**：仮説、実験ライン、実行履歴、主要発見、次アクションを追跡する
- **厳密分析**：`results-analysis` を用いて厳密統計、実際の科研図、分析成果物を生成する
- **結果レポート**：`results-report` を用いて完全な実験後レポートを作成し、Obsidian へ書き戻す
- **執筆と発表**：安定した結論をレビュー、論文、rebuttal、発表資料、ポスター、発信素材へ展開する

## クイックスタート

### 前提条件

- [Codex CLI](https://github.com/openai/codex)
- Git
- （任意）Python + [uv](https://docs.astral.sh/uv/) — Python 開発用
- （任意）[Zotero](https://www.zotero.org/) + [Galaxy-Dawn/zotero-mcp](https://github.com/Galaxy-Dawn/zotero-mcp) — 文献ワークフロー用
- （任意）[Obsidian](https://obsidian.md/) — プロジェクト知識ベース用

### オプション 1：フルインストール（推奨）

```bash
git clone -b codex https://github.com/Galaxy-Dawn/claude-scholar.git /tmp/claude-scholar
bash /tmp/claude-scholar/scripts/setup.sh
```

インストーラーは現在、**バックアップ付きの安全な増分更新**をサポートしています。
- リポジトリ管理の `skills/`、`agents/`、`scripts/`、`utils/` を同期
- 既存 provider/model を保持したい場合、Claude Scholar に必要な section を現在の `~/.codex/config.toml` にマージ
- 上書き前に `config.toml` と `auth.json` を自動バックアップ
- `~/.codex/AGENTS.md` が既に存在する場合は元ファイルを保持し、リポジトリ版を `~/.codex/AGENTS.scholar.md` として保存
- 増分更新パスでは既存の provider / model / API key を保持
- テンプレート内にある Zotero MCP 設定ブロックを任意で有効化可能

**重要な AGENTS 説明**：すでに自分用の `~/.codex/AGENTS.md` を持っている場合は、インストール後に `~/.codex/AGENTS.scholar.md` を確認し、必要な Claude Scholar の内容だけを自分の `AGENTS.md` に手動で merge してください。sidecar ファイルが自動で有効化されるとは考えないでください。

以後の増分更新は次の通りです。

```bash
cd /tmp/claude-scholar
git pull --ff-only
bash scripts/setup.sh
```

**Windows**：インストーラーは Git Bash / WSL から実行してください。

### オプション 2：最小インストール

研究ワークフローの小さめのサブセットだけを導入します。

```bash
git clone -b codex https://github.com/Galaxy-Dawn/claude-scholar.git /tmp/claude-scholar
mkdir -p ~/.codex/skills ~/.codex/agents
cp -r /tmp/claude-scholar/skills/research-ideation ~/.codex/skills/
cp -r /tmp/claude-scholar/skills/results-analysis ~/.codex/skills/
cp -r /tmp/claude-scholar/skills/results-report ~/.codex/skills/
cp -r /tmp/claude-scholar/skills/ml-paper-writing ~/.codex/skills/
cp -r /tmp/claude-scholar/skills/review-response ~/.codex/skills/
cp -r /tmp/claude-scholar/agents/literature-reviewer ~/.codex/agents/
cp -r /tmp/claude-scholar/agents/paper-miner ~/.codex/agents/
cp /tmp/claude-scholar/AGENTS.md ~/.codex/AGENTS.md
```

**インストール後**：最小化 / 手動インストールでは `config.toml` は**自動マージされません**。必要な section を setup 文書やリポジトリ設定から手動で取り込んでください。自分の `~/.codex/AGENTS.md` がある場合も、関連する部分だけを手動で merge し、丸ごと上書きしないでください。

### オプション 3：選択インストール

必要な部分だけをコピーします。

```bash
git clone -b codex https://github.com/Galaxy-Dawn/claude-scholar.git /tmp/claude-scholar
cp -r /tmp/claude-scholar/skills/<skill-name> ~/.codex/skills/
cp -r /tmp/claude-scholar/agents/<agent-name> ~/.codex/agents/
cp /tmp/claude-scholar/AGENTS.md ~/.codex/AGENTS.md
```

**インストール後**：選択的 / 手動インストールでも `config.toml` は自動マージされません。既に `~/.codex/AGENTS.md` を持っている場合も、必要な内容だけを手動で merge してください。

**Codex 利用メモ**：
- Codex は `/...` メニューにカスタム skill を表示しません。
- 基本は自然言語で起動し、必要な場合だけ `$skill-name` を明示してください。

## 使い始めのシナリオ

インストール後は、自然言語で今やりたいことをそのまま伝えるのがいちばん簡単です。Codex ではこれらのワークフローを使うために `/...` メニューを先に覚える必要もありません。ここでは、最初の一歩として使いやすい代表的なシナリオをいくつか挙げます。

### 1. 新しい研究テーマを立ち上げる
**たとえばこう言えます:**
> [あなたの研究テーマ]について研究を始めたいです。文献に基づいた初期プラン、重要な未解決問題、次にやるべき具体的なステップを整理してください。

**Claude Scholarがよく支援する内容:**
- テーマを明確化して研究課題を絞り込む
- 優先して見るべき文献の方向を整理する
- 初期計画や仮説候補をまとめる
- 必要ならZoteroやObsidianにも流し込む

### 2. Zotero文献コレクションをレビューする
**たとえばこう言えます:**
> Zoteroにある brain foundation models 関連の文献コレクションをレビューして、主な流れ、研究ギャップ、次に有望な方向をまとめてください。

**典型的な出力:**
- テーマ別の論文整理
- 簡潔な文献総括
- ギャップ分析
- 次に掘る価値のある研究方向

### 3. 完了した実験結果を分析する
**たとえばこう言えます:**
> この実験フォルダの結果を分析して、各runで何が変わったのかを確認し、意思決定に使える要約を書いてください。

**典型的な出力:**
- 指標比較
- アブレーションやエラー分析の提案
- 何が堅い結論で、何がまだ弱く、次に何を走らせるべきかを整理した結果要約

### 4. 論文の節やrebuttal草稿を書く
**たとえばこう言えます:**
> このプロジェクトの現時点の知見と論文メモに基づいて、関連研究の節の草稿を書いてください。

または:

> これらの査読コメントに対するrebuttal草稿を手伝ってください。

**典型的な出力:**
- 構造化された節ドラフト
- より明確な論理展開
- 主張と根拠の対応整理
- 追加で検証や補強が必要な論点

### 実用上のメモ
- 最初は「全部やって」ではなく、具体的な一つのタスクから始めるのがおすすめです。
- Codex では自然言語が基本の入口で、特定の skill を明示したいときだけ `$skill-name` を使えば十分です。
- すでに自分用のローカル`AGENTS.md`を運用している場合は、`AGENTS.scholar.md`から必要な内容だけを手動でマージしてください。別名で配置されたファイルが自動適用されるわけではありません。
- ZoteroとObsidianは必須ではありませんが、単発のチャット出力ではなく、継続的な文献ノートやプロジェクトメモリを残したい場合にはかなり有用です。

## プラットフォーム範囲

この分岐は **Codex CLI** 向けです。

- **Codex CLI（`codex` 分岐）** — TOML 設定、AGENTS 駆動の作業規律、ファイルシステム中心の Obsidian ワークフロー、Codex 専用インストール文書
- **Claude Code（`main` 分岐）** — Claude Code 設定、ネイティブ hooks、主線の文書構成
- **OpenCode（`opencode` 分岐）** — OpenCode 向け設定とインストールパス

3 分岐は研究ワークフロー主線をできるだけ共有しますが、プラットフォーム層の操作方法は異なります。

## 連携機能

### Zotero

次のような場面に向いています。
- DOI / arXiv / URL から論文を取り込む
- コレクション単位で論文をまとめて読む
- Zotero MCP を通して全文にアクセスする
- 詳細な論文ノートと文献統合を作る

詳しくは [MCP_SETUP.ja-JP.md](./MCP_SETUP.ja-JP.md) を参照してください。

### Obsidian

次のような場面に向いています。
- ファイルシステム中心のプロジェクト知識ベースを維持する
- `Papers/` を管理する
- `Knowledge/` を管理する
- `Experiments/` を管理する
- `Results/` を管理する
- `Results/Reports/` を管理する
- `Writing/` と `Daily/` を管理する

詳しくは [OBSIDIAN_SETUP.ja-JP.md](./OBSIDIAN_SETUP.ja-JP.md) を参照してください。

## 主要ワークフロー

研究構想から発表までを含む、完全な学術研究ライフサイクルの 7 段階です。

> **Codex 入口説明**：この分岐は repo レベルの slash commands に依存しません。通常は自然言語で起動し、必要に応じて `$results-analysis` のような skill を明示してください。

### 1. 研究構想（Zotero 統合）

曖昧なテーマを、文献に支えられた研究方向へ収束させます。

| 種類 | 名前 | 一行説明 |
|---|---|---|
| Skill | `research-ideation` | 曖昧なテーマを構造化問題、研究ギャップ分析、初期研究計画へ変換する |
| Agent | `literature-reviewer` | 論文を検索・分類・統合し、実行可能な文献地図を作る |
| Skill | `zotero-obsidian-bridge` | Zotero コレクションを詳細な論文ノートと後続の Obsidian 知識ベースへ接続する |

**進め方**
- **5W1H ブレインストーミング**：曖昧な関心を構造化問題へ収束させる
- **文献検索と取込**：論文を探し、DOI/arXiv/URL を抽出し、Zotero に入れてテーマごとに整理する
- **PDF と全文**：PDF を添付できるなら添付し、全文を読めるなら読む
- **研究ギャップ分析**：文献・方法・応用・学際・時間軸の研究ギャップを見つける
- **研究問題と計画**：文献統合の結果を具体的な問題、初期仮説、次アクションに落とす

**典型的な成果物**
- 文献レビュー・ノート
- 構造化された Zotero コレクション
- 研究提案または研究方向ドラフト

### 2. ML プロジェクト開発

実験コードとリポジトリ保守のための、持続可能な ML 開発ワークフローです。

| 種類 | 名前 | 一行説明 |
|---|---|---|
| Skill | `architecture-design` | 新しい登録可能コンポーネントや新モジュール追加時に保守しやすい ML 構造を設計する |
| Skill | `git-workflow` | より安全なブランチ協業、コミット規約、Git 習慣を整える |
| Skill | `bug-detective` | stack trace、shell エラー、壊れたコードパスを体系的に追跡する |
| Skill | `git-commit` | Conventional Commits に沿ったコミットをローカルで作る |
| Skill | `git-push` | Conventional Commits に沿って stage / commit / push を行う |
| Agent | `code-reviewer` | コード変更の正しさ、保守性、実装品質をレビューする |
| Agent | `dev-planner` | 複雑なエンジニアリング作業を実行可能な工程に分解する |

**進め方**
- **構造設計**：適切な場面では Factory / Registry パターンを使う
- **コード品質**：ファイルの可読性、型ヒント、設定駆動を維持する
- **問題調査**：shell 失敗、trace、パス問題を体系的に扱う
- **Git 規律**：高速反復でも安全なブランチ運用とコミット規律を保つ

### 3. 実験分析

厳密統計、科研図、分析成果物、実験後レポートを含む厳格な分析ワークフローです。

| 種類 | 名前 | 一行説明 |
|---|---|---|
| Skill | `results-analysis` | 厳密統計、実際の科研図、分析付録を生成する |
| Skill | `results-report` | 分析成果物を、結論・制約・次アクションが明確な完全な実験後レポートへまとめる |
| Agent | `research-knowledge-curator-obsidian` | repo がバインド済みなら、安定結論を Obsidian 知識ベースへ書き戻す |

**進め方**
- **データ処理**：実験ログ、metrics ファイル、結果ディレクトリを読む
- **統計検定**：前提を満たす場合に厳密統計検定を行い、不確実性も明示する
- **科研可視化**：曖昧な作図提案ではなく、実際の科研図を生成する
- **消融と比較**：コンポーネント寄与、性能 tradeoff、安定性を分析する
- **実験後レポート**：`results-report` で意思決定向けの完全な振り返りを作る

**典型的な成果物**
- `analysis-report.md`
- `stats-appendix.md`
- `figure-catalog.md`
- `figures/`
- Obsidian `Results/Reports/` に書き戻される実験レポート

### 4. 論文執筆

テンプレート整理から草稿反復までの、体系的な論文執筆ワークフローです。

| 種類 | 名前 | 一行説明 |
|---|---|---|
| Skill | `ml-paper-writing` | repo、実験結果、文献コンテキストを基に投稿志向の ML/AI 論文を書く |
| Skill | `citation-verification` | 参考文献、メタデータ、claim-citation の対応を確認する |
| Skill | `writing-anti-ai` | 機械的な表現を減らし、リズム、明瞭さ、学術トーンを改善する |
| Skill | `latex-conference-template-organizer` | 会議テンプレートを Overleaf-ready な執筆構造へ整理する |
| Agent | `paper-miner` | 高品質論文から再利用可能な書き方、構造シグナル、投稿ノウハウを抽出する |

**進め方**
- **テンプレート準備**：散らかったテンプレートを執筆可能な構造に整える
- **引用検証**：参考文献、メタデータ、claim の支え方を確認する
- **体系的執筆**：repo の証拠と文献コンテキストに基づき節ごとに執筆する
- **ライティングメモリ再利用**：`paper-miner` memory を通して安定した書き方を再利用する

### 5. 論文セルフレビュー

投稿前の品質保証ワークフローです。

| 種類 | 名前 | 一行説明 |
|---|---|---|
| Skill | `paper-self-review` | 投稿前に構造、論理、引用、図表、順守項目を体系的に確認する |

**進め方**
- **構造確認**：論理の流れ、章バランス、叙述の一貫性を確認する
- **論理検証**：claim-evidence の整合と仮説の明瞭さを確認する
- **引用監査**：引用の正確さと完全性を点検する
- **図表品質**：可読性、caption、アクセシビリティを確認する
- **順守確認**：ページ制限、形式、開示要件を確認する

### 6. 投稿と Rebuttal

投稿準備と査読返信のワークフローです。

| 種類 | 名前 | 一行説明 |
|---|---|---|
| Skill | `review-response` | 査読コメントを、証拠ベースの rebuttal ワークフローへ整理する |
| Agent | `rebuttal-writer` | 専門的で礼儀正しく、構造の明確な rebuttal 文書を起草する |

**進め方**
- **投稿前確認**：会議形式、匿名化、必要 checklist を確認する
- **査読分析**：コメントを実行可能な問題に分類する
- **返信戦略**：accept / defend / clarify / 追加実験のどれを取るか判断する
- **Rebuttal 執筆**：構造的で証拠に基づき、語調の整った返信文書を作る

### 7. 採択後処理

採択後の会議準備と研究発信ワークフローです。

| 種類 | 名前 | 一行説明 |
|---|---|---|
| Skill | `post-acceptance` | slides、ポスター、対外発信素材の準備を支援する |
| Agent | `ui-sketcher` | 必要に応じて slides、ポスター、発表フローなどの視覚素材構成を支援する |

**進め方**
- **発表準備**：talk 構成と発表資料の指針を用意する
- **ポスター整理**：ポスターの内容階層と版面を整理する
- **対外発信**：簡潔な要約、thread、採択後素材を生成する

## 支援ワークフロー

これらのワークフローは主ワークフローの背後で動き、全体の Codex 体験を強化します。

### Obsidian プロジェクト知識ベース

Obsidian を、バラバラなメモの山ではなく、安定した研究知識の沈殿先として扱います。

| 種類 | 名前 | 一行説明 |
|---|---|---|
| Skill | `obsidian-project-memory` | プロジェクトレベルの Obsidian 知識ベースを維持し、どの安定知識を書き戻すかを判断する |
| Skill | `obsidian-project-bootstrap` | 新規または既存研究プロジェクト向けに Obsidian 知識ベース構造を初期化する |
| Skill | `obsidian-research-log` | 毎日の研究進捗、計画、発想、TODO を知識ベースに書き込む |
| Skill | `obsidian-experiment-log` | 実験設定、実行過程、主要発見、次アクションを Obsidian に記録する |
| Skill | `obsidian-literature-workflow` | Obsidian 内でファイルシステム中心の paper note 正規化と文献統合を行う |
| Skill | `zotero-obsidian-bridge` | Zotero コレクションを Obsidian 内の正規論文ノートと文献マップへ接続する |

**進め方**
- 既存 repo を Obsidian vault にバインドする
- 安定知識を `Papers / Knowledge / Experiments / Results / Writing` に振り分け、ラウンド単位の実験レポートは `Results/Reports/` に保存する
- `Daily/` と project memory を保守的に維持する
- 新しい Markdown を正しい正規ノートへ整理して取り込む
- 実際に必要なときだけ canvas や view を生成する

### Codex セッション規律と Hook エミュレーション

Codex は Claude Code のネイティブ hooks を提供しないため、この分岐では AGENTS 規律とローカル補助スクリプトで高価値な挙動を再現します。

| 種類 | 名前 | 一行説明 |
|---|---|---|
| File | `AGENTS.md` | セッション規律、skill 評価規則、安全規則、Codex 専用ワークフロー説明を記述する |
| Script | `scripts/codex_hook_emulation.py` | repo ワークフロー内で session-start、preflight、post-edit、session-end を模擬する |
| Skill | `session-wrap-up` | セッション終了時に作業ログ、清理リマインド、締めサマリを生成する |

**進め方**
- **セッション開始代理**：repo 状態、skills、TODO、プロジェクト文脈を確認する
- **危険操作の事前確認**：危険または不可逆なコマンドの前に preflight を行う
- **編集後確認**：意味のある編集後に検証要件と最小 Obsidian 書き戻しを判断する
- **セッション終了代理**：作業をまとめ、次のメンテナンス行動をリマインドする

### 知識抽出ワークフロー

専用 agents が論文やエンジニアリング解法から再利用可能な知識を継続的に抽出します。

| 種類 | 名前 | 一行説明 |
|---|---|---|
| Agent | `paper-miner` | 高品質論文から再利用可能な書き方、構造シグナル、返信戦略を抽出する |
| Agent | `kaggle-miner` | 優れた Kaggle ワークフローから再利用可能な実装慣行と解法パターンを抽出する |

**進め方**
- 論文から書き方、投稿期待値、rebuttal 戦略を抽出する
- Kaggle ワークフローから実装パターンと解法構造を抽出する
- それらを共有 skills と references に還流する

### Skill 進化システム

Claude Scholar には、自分自身の skill を改善するためのワークフローもあります。

| 種類 | 名前 | 一行説明 |
|---|---|---|
| Skill | `skill-development` | 明確な発火条件、構造、段階的展開を備えた新しい skill を作る |
| Skill | `skill-quality-reviewer` | 内容品質、構成、表現、構造完全性の観点から skill を審査する |
| Skill | `skill-improver` | 構造化された改善計画に基づいて既存 skill を継続改善する |

**進め方**
- 明確な発火説明を持つ新 skill を作る
- 複数の品質軸で skill をレビューする
- 修正提案を取り込み、継続的に反復する

## ドキュメント入口

- [MCP_SETUP.ja-JP.md](./MCP_SETUP.ja-JP.md) — Codex 版 Zotero MCP 設定説明
- [OBSIDIAN_SETUP.ja-JP.md](./OBSIDIAN_SETUP.ja-JP.md) — Obsidian プロジェクト知識ベースワークフロー
- [AGENTS.md](./AGENTS.md) — Codex セッション規則、安全制約、ワークフロー説明
- [README.zh-CN.md](./README.zh-CN.md) — この README の中国語版
- [config.toml](./config.toml) — skills、agents、MCP 設定ブロックを含む Codex テンプレート設定

## プロジェクトルール

Claude Scholar の Codex 版には次のルールが含まれます。
- コードスタイル
- agent オーケストレーション
- 安全制約
- 実験再現性
- Codex 専用セッション規律

これらのルールは主に `AGENTS.md` と同梱 skills に反映されています。

## コントリビューション

issue、PR、ワークフロー改善提案を歓迎します。

installer、Zotero ワークフロー、Obsidian ルーティング、または Codex セッション規律を変更したい場合は、提案に次を含めてください。
- ユーザーシナリオ
- 現在の制約
- 期待される挙動
- 互換性への影響

## 引用

Claude Scholar があなたの研究またはエンジニアリングワークフローの助けになった場合は、次のように引用できます。

```bibtex
@misc{claude_scholar_2026,
  title        = {Claude Scholar: Semi-automated research assistant for academic research and software development},
  author       = {Gaorui Zhang},
  year         = {2026},
  howpublished = {\url{https://github.com/Galaxy-Dawn/claude-scholar}},
  note         = {GitHub repository}
}
```

## ライセンス

MIT License。

## 謝辞

Codex CLI ワークフローを基盤に構築され、オープンソース研究ツール群によって継続的に強化されています。

### 参考資料

本プロジェクトはコミュニティの優れた仕事から着想を得て構築されています。

- **[everything-claude-code](https://github.com/anthropics/everything-claude-code)** - Claude Code CLI の総合リソース
- **[AI-research-SKILLs](https://github.com/zechenzhangAGI/AI-research-SKILLs)** - 研究指向の skills と設定パターン
- **[codex](https://github.com/openai/codex)** - この分岐が依拠する Codex CLI の基盤能力

これらのプロジェクトは、Claude Scholar の研究・ツールワークフロー設計に共通して影響を与えています。

---

**学術研究、ソフトウェア開発、持続可能なプロジェクト知識管理のために。**

リポジトリ：[https://github.com/Galaxy-Dawn/claude-scholar](https://github.com/Galaxy-Dawn/claude-scholar)
