#!/usr/bin/env bash
# ============================================================
# hello-scholar — Codex CLI Installer
# ============================================================
# Usage: bash scripts/setup.sh
# Supports fresh install and safer incremental updates.

set -euo pipefail

CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
AGENTS_MD_SIDECAR="AGENTS.hello-scholar.md"
BACKUP_ROOT="$CODEX_HOME/.hello-scholar-backups"
BACKUP_STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="$BACKUP_ROOT/$BACKUP_STAMP"
BACKUP_READY=0
BACKUP_COUNT=0
UPDATED_COUNT=0
SKIPPED_COUNT=0

# --- State flags ---
SKIP_PROVIDER=false
SKIP_AUTH=false
PERSIST_AUTH=false
PROVIDER_NAME=""
PROVIDER_URL=""
MODEL=""
AUTH_ENV_VAR_NAME="OPENAI_API_KEY"
API_KEY=""

# --- Colors ---
green()  { printf "\033[32m%s\033[0m" "$1"; }
red()    { printf "\033[31m%s\033[0m" "$1"; }
yellow() { printf "\033[33m%s\033[0m" "$1"; }
bold()   { printf "\033[1m%s\033[0m" "$1"; }
info()   { echo -e "\033[1;34m[INFO]\033[0m $*"; }
warn()   { echo -e "\033[1;33m[WARN]\033[0m $*"; }
error()  { echo -e "\033[1;31m[ERROR]\033[0m $*"; exit 1; }

# --- Presets ---
declare -a PRESET_NAMES=("openai" "custom")
declare -a PRESET_LABELS=("OpenAI (official)" "Custom provider")
declare -a PRESET_URLS=("https://api.openai.com/v1" "")
declare -a PRESET_MODELS=("gpt-5.4" "")

ensure_backup_dir() {
  if [ "$BACKUP_READY" -eq 0 ]; then
    mkdir -p "$BACKUP_DIR"
    BACKUP_READY=1
    info "Backup directory: $BACKUP_DIR"
  fi
}

backup_path() {
  local target="$1"
  [ -e "$target" ] || return 0

  ensure_backup_dir

  local rel="${target#$CODEX_HOME/}"
  if [ "$rel" = "$target" ]; then
    rel="$(basename "$target")"
  fi

  mkdir -p "$BACKUP_DIR/$(dirname "$rel")"
  if [ -d "$target" ]; then
    cp -R "$target" "$BACKUP_DIR/$rel"
  else
    cp -p "$target" "$BACKUP_DIR/$rel"
  fi
  BACKUP_COUNT=$((BACKUP_COUNT + 1))
}

ensure_parent_dir() {
  local target_path="$1"
  local parent_dir
  parent_dir="$(dirname "$target_path")"

  if [ -e "$parent_dir" ] && [ ! -d "$parent_dir" ]; then
    backup_path "$parent_dir"
    rm -f "$parent_dir"
  fi

  mkdir -p "$parent_dir"
}

copy_file_safely() {
  local src_file="$1"
  local target_file="$2"

  ensure_parent_dir "$target_file"

  if [ -f "$target_file" ] && cmp -s "$src_file" "$target_file"; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    return 0
  fi

  if [ -e "$target_file" ]; then
    backup_path "$target_file"
    [ -d "$target_file" ] && rm -rf "$target_file"
  fi

  cp -p "$src_file" "$target_file"
  UPDATED_COUNT=$((UPDATED_COUNT + 1))
}

copy_dir_safely() {
  local src_dir="$1"
  local target_dir="$2"

  if [ -e "$target_dir" ] && [ ! -d "$target_dir" ]; then
    backup_path "$target_dir"
    rm -f "$target_dir"
  fi
  ensure_parent_dir "$target_dir/.dir"
  mkdir -p "$target_dir"

  while IFS= read -r -d '' src_file; do
    local rel="${src_file#$src_dir/}"
    local target_file="$target_dir/$rel"
    copy_file_safely "$src_file" "$target_file"
  done < <(find "$src_dir" -type f -print0)
}

install_agents_md() {
  local src_file="$1"
  local target_file="$CODEX_HOME/AGENTS.md"
  local sidecar_file="$CODEX_HOME/$AGENTS_MD_SIDECAR"

  if [ -f "$target_file" ]; then
    warn "Preserving existing AGENTS.md"
    copy_file_safely "$src_file" "$sidecar_file"
    info "Installed repository AGENTS.md as $AGENTS_MD_SIDECAR"
    return 0
  fi

  copy_file_safely "$src_file" "$target_file"
}

# --- Auth/provider helpers ---
mask_secret() {
  local value="$1"
  local length=${#value}
  if [ "$length" -le 12 ]; then
    printf '%s' "$value"
    return
  fi
  printf '%s...%s' "${value:0:8}" "${value: -4}"
}

validate_env_var_name() {
  local name="$1"
  [[ "$name" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]] || error "Invalid env var name: $name"
}

read_auth_entry() {
  local file="$1"
  [ -f "$file" ] || return 0

  python3 - "$file" <<'PY'
import json
import pathlib
import sys

path = pathlib.Path(sys.argv[1])
try:
    data = json.loads(path.read_text())
except Exception:
    sys.exit(0)

for key, value in data.items():
    if isinstance(value, str) and value:
        print(f"{key}\t{value}")
        break
PY
}

normalize_env_prefix() {
  local raw="$1"
  printf '%s' "$raw" \
    | tr '[:lower:]-./' '[:upper:]___' \
    | sed 's/[^A-Z0-9_]/_/g; s/__*/_/g; s/^_//; s/_$//'
}

collect_api_key_candidates() {
  local provider="$1"
  local normalized_provider=""
  local -a candidates=()

  if [ -n "$provider" ]; then
    normalized_provider=$(normalize_env_prefix "$provider")
    if [ -n "$normalized_provider" ]; then
      candidates+=("${normalized_provider}_API_KEY")
    fi
  fi

  candidates+=(
    "OPENAI_API_KEY"
    "ANTHROPIC_API_KEY"
    "OPENROUTER_API_KEY"
    "GEMINI_API_KEY"
    "GOOGLE_API_KEY"
    "DEEPSEEK_API_KEY"
    "DASHSCOPE_API_KEY"
    "SILICONFLOW_API_KEY"
    "XAI_API_KEY"
    "GROQ_API_KEY"
    "MISTRAL_API_KEY"
    "COHERE_API_KEY"
    "TOGETHER_API_KEY"
    "FIREWORKS_API_KEY"
    "MOONSHOT_API_KEY"
    "ZHIPU_API_KEY"
  )

  printf '%s\n' "${candidates[@]}" | awk '!seen[$0]++'
}

detect_existing_env_auth() {
  local provider="$1"
  local candidate=""
  local value=""

  while IFS= read -r candidate; do
    [ -n "$candidate" ] || continue
    value="${!candidate:-}"
    if [ -n "$value" ]; then
      AUTH_ENV_VAR_NAME="$candidate"
      API_KEY="$value"
      PERSIST_AUTH=true
      info "No auth.json found; detected $candidate from environment and will persist it for Codex compatibility"
      return 0
    fi
  done < <(collect_api_key_candidates "$provider")

  return 1
}

check_deps() {
  command -v git >/dev/null || error "Git is required."
  command -v python3 >/dev/null || error "Python 3 is required."
  if ! command -v codex >/dev/null; then
    warn "Codex CLI not found. Install: npm i -g @openai/codex"
  fi
}

detect_existing() {
  echo ""
  if [ -f "$CODEX_HOME/config.toml" ]; then
    info "Existing config.toml found at $CODEX_HOME/config.toml"
    local cur_model cur_provider
    cur_model=$(grep '^model ' "$CODEX_HOME/config.toml" 2>/dev/null | head -1 | sed 's/.*= *"//;s/".*//' || true)
    cur_provider=$(grep '^model_provider ' "$CODEX_HOME/config.toml" 2>/dev/null | head -1 | sed 's/.*= *"//;s/".*//' || true)
    PROVIDER_NAME="$cur_provider"
    [ -n "$cur_model" ] && info "  Current model: $cur_model"
    [ -n "$cur_provider" ] && info "  Current provider: $cur_provider"
    SKIP_PROVIDER=true
    info "Detected existing provider/model configuration; keeping it without prompting"
  fi

  if [ -f "$CODEX_HOME/auth.json" ]; then
    local auth_entry existing_key_name existing_key_value
    auth_entry=$(read_auth_entry "$CODEX_HOME/auth.json")
    if [ -n "$auth_entry" ]; then
      IFS=$'\t' read -r existing_key_name existing_key_value <<< "$auth_entry"
      AUTH_ENV_VAR_NAME="$existing_key_name"
      info "Existing auth.json credential found: $AUTH_ENV_VAR_NAME=$(mask_secret "$existing_key_value")"
    else
      info "Existing auth.json found; leaving it untouched"
    fi
    SKIP_AUTH=true
    info "Detected existing authentication configuration; keeping it without prompting"
  elif [ "$SKIP_PROVIDER" = true ]; then
    SKIP_AUTH=true
    if ! detect_existing_env_auth "$PROVIDER_NAME"; then
      info "Existing Codex config detected; installer will not prompt for credentials or overwrite your current auth flow"
    fi
  fi
}

choose_provider() {
  if [ "$SKIP_PROVIDER" = true ]; then
    return
  fi

  echo ""
  bold "Select API provider:"
  echo ""
  for i in "${!PRESET_LABELS[@]}"; do
    echo "  $((i+1))) ${PRESET_LABELS[$i]}"
  done
  echo ""

  local choice
  read -rp "Enter choice [1-2] (default: 1): " choice
  choice="${choice:-1}"

  local idx=$((choice - 1))
  if [ "$idx" -lt 0 ] || [ "$idx" -ge "${#PRESET_NAMES[@]}" ]; then
    error "Invalid choice: $choice"
  fi

  PROVIDER_NAME="${PRESET_NAMES[$idx]}"
  PROVIDER_URL="${PRESET_URLS[$idx]}"
  MODEL="${PRESET_MODELS[$idx]}"

  if [ "$PROVIDER_NAME" = "custom" ]; then
    read -rp "Provider name: " PROVIDER_NAME
    read -rp "Base URL: " PROVIDER_URL
    read -rp "Model name: " MODEL
  else
    echo ""
    read -rp "Model name (default: $MODEL): " input_model
    MODEL="${input_model:-$MODEL}"
  fi

  info "Provider: $PROVIDER_NAME | URL: $PROVIDER_URL | Model: $MODEL"
}

configure_api_key() {
  if [ "$SKIP_AUTH" = true ]; then
    return
  fi

  echo ""
  read -rp "API key env var name (default: $AUTH_ENV_VAR_NAME): " input_env_name
  AUTH_ENV_VAR_NAME="${input_env_name:-$AUTH_ENV_VAR_NAME}"
  validate_env_var_name "$AUTH_ENV_VAR_NAME"

  local env_value="${!AUTH_ENV_VAR_NAME:-}"
  if [ -n "$env_value" ]; then
    API_KEY="$env_value"
    PERSIST_AUTH=true
    info "Detected $AUTH_ENV_VAR_NAME in current environment; will reuse it without prompting for the key again"
    return
  fi

  read -rsp "Enter API key for $AUTH_ENV_VAR_NAME (or press Enter to skip): " API_KEY
  echo ""
  if [ -z "$API_KEY" ]; then
    warn "No API key set. Make sure $AUTH_ENV_VAR_NAME is available in your environment."
    SKIP_AUTH=true
    return
  fi

  PERSIST_AUTH=true
}

generate_fresh_config() {
  local template="$1"
  local target="$2"

  sed -e "s|__MODEL__|$MODEL|g" \
      -e "s|__PROVIDER_NAME__|$PROVIDER_NAME|g" \
      -e "s|__PROVIDER_URL__|$PROVIDER_URL|g" \
      "$template" > "$target"
  info "Generated config.toml (model=$MODEL, provider=$PROVIDER_NAME)"
}

merge_scholar_config() {
  local target="$1"
  local template="$2"

  TARGET_PATH="$target" TEMPLATE_PATH="$template" python3 <<'PY'
import os
import pathlib
import re


def read(path: str) -> str:
    return pathlib.Path(path).read_text()


def extract_section_block(text: str, header: str) -> str:
    pattern = rf"(^\[{re.escape(header)}\]\n(?:.*\n)*?)(?=^\[|\Z)"
    m = re.search(pattern, text, flags=re.M)
    return m.group(1).rstrip() if m else ""


def extract_agent_sections(text: str):
    pattern = r"(^\[agents\.[^\]]+\]\n(?:.*\n)*?)(?=^\[|\Z)"
    return re.findall(pattern, text, flags=re.M)


target_path = os.environ['TARGET_PATH']
template_path = os.environ['TEMPLATE_PATH']
target = read(target_path)
template = read(template_path)
added = []

for section in ['features', 'mcp_servers.zotero', 'mcp_servers.zotero.env']:
    if f'[{section}]' not in target:
        block = extract_section_block(template, section)
        if block:
            target += '\n\n' + block + '\n'
            added.append(section)

for block in extract_agent_sections(template):
    header = re.search(r'^\[(agents\.[^\]]+)\]$', block, flags=re.M).group(1)
    if f'[{header}]' not in target:
        target += '\n\n' + block.rstrip() + '\n'
        added.append(header)

pathlib.Path(target_path).write_text(target.rstrip() + '\n')
print(','.join(added))
PY
}

generate_config() {
  local template="$SRC_DIR/config.toml"
  local target="$CODEX_HOME/config.toml"

  [ -f "$template" ] || error "Template config.toml not found at $template"

  if [ -f "$target" ]; then
    backup_path "$target"
    cp "$target" "${target}.bak"
    info "Backed up config.toml → config.toml.bak"
  fi

  if [ "$SKIP_PROVIDER" = true ]; then
    local added
    added=$(merge_scholar_config "$target" "$template")
    if [ -n "$added" ]; then
      info "Merged Scholar sections into existing config.toml: $added"
    else
      info "Config already had the required Scholar sections"
    fi
  else
    generate_fresh_config "$template" "$target"
  fi
}

write_auth() {
  if [ "$PERSIST_AUTH" != true ]; then
    return
  fi

  local target="$CODEX_HOME/auth.json"
  if [ -f "$target" ]; then
    backup_path "$target"
    cp "$target" "${target}.bak"
    info "Backed up auth.json → auth.json.bak"
  fi
  python3 - "$target" "$AUTH_ENV_VAR_NAME" "$API_KEY" <<'PY'
import json
import pathlib
import sys

target = pathlib.Path(sys.argv[1])
env_name = sys.argv[2]
api_key = sys.argv[3]

payload = {env_name: api_key}
if env_name != "OPENAI_API_KEY":
    payload["OPENAI_API_KEY"] = api_key

target.write_text(json.dumps(payload, indent=2) + "\n")
PY
  chmod 600 "$target"
  if [ "$AUTH_ENV_VAR_NAME" = "OPENAI_API_KEY" ]; then
    info "Wrote auth.json (permissions: 600)"
  else
    info "Wrote auth.json with $AUTH_ENV_VAR_NAME and OPENAI_API_KEY for Codex compatibility (permissions: 600)"
  fi
}

copy_components() {
  if [ -d "$SRC_DIR/skills" ]; then
    copy_dir_safely "$SRC_DIR/skills" "$CODEX_HOME/skills"
  fi
  if [ -d "$SRC_DIR/agents" ]; then
    copy_dir_safely "$SRC_DIR/agents" "$CODEX_HOME/agents"
  fi
  if [ -f "$SRC_DIR/AGENTS.md" ]; then
    install_agents_md "$SRC_DIR/AGENTS.md"
  fi
  if [ -d "$SRC_DIR/scripts" ]; then
    copy_dir_safely "$SRC_DIR/scripts" "$CODEX_HOME/scripts"
  fi
  if [ -d "$SRC_DIR/utils" ]; then
    copy_dir_safely "$SRC_DIR/utils" "$CODEX_HOME/utils"
  fi

  info "Synced repo-managed Codex components"
}

configure_mcp() {
  if ! grep -q '\[mcp_servers\.zotero\]' "$CODEX_HOME/config.toml" 2>/dev/null; then
    return
  fi

  if awk '/\[mcp_servers\.zotero\]/{flag=1;next}/^\[/{flag=0}flag && /enabled = true/{found=1}END{exit(found?0:1)}' "$CODEX_HOME/config.toml"; then
    info "Zotero MCP already enabled"
    return
  fi

  echo ""
  read -rp "Enable Zotero MCP server? [y/N]: " enable_zotero
  if [ "$enable_zotero" = "y" ] || [ "$enable_zotero" = "Y" ]; then
    python3 - "$CODEX_HOME/config.toml" <<'PY'
import pathlib
import re
import sys
path = pathlib.Path(sys.argv[1])
text = path.read_text()
text = re.sub(r'(\[mcp_servers\.zotero\]\n(?:.*\n)*?enabled = )false', r'\1true', text, count=1)
path.write_text(text)
PY
    info "Zotero MCP enabled"
    if ! command -v zotero-mcp >/dev/null 2>&1; then
      warn "zotero-mcp not found. Install latest with: uv tool install --reinstall git+https://github.com/Galaxy-Dawn/zotero-mcp.git"
    fi
  fi
}

main() {
  echo ""
  echo "╔══════════════════════════════════════╗"
  echo "║   hello-scholar Installer (Codex)    ║"
  echo "╚══════════════════════════════════════╝"
  echo ""

  check_deps

  info "Source: $SRC_DIR"
  info "Target: $CODEX_HOME"
  mkdir -p "$CODEX_HOME"

  detect_existing
  choose_provider
  configure_api_key
  generate_config
  write_auth
  copy_components
  configure_mcp

  echo ""
  echo "============================================================"
  info "Installation complete!"
  info "Updated files: $UPDATED_COUNT | Unchanged files skipped: $SKIPPED_COUNT | Backups created: $BACKUP_COUNT"
  if [ "$BACKUP_READY" -eq 1 ]; then
    info "Recover previous files from: $BACKUP_DIR"
  fi
  echo ""
  echo "  Config:  $CODEX_HOME/config.toml"
  echo "  Auth:    $CODEX_HOME/auth.json"
  echo "  Skills:  $CODEX_HOME/skills/"
  echo "  Agents:  $CODEX_HOME/agents/"
  echo ""
  info "Existing model/provider/API key settings are preserved when you choose the incremental update path."
  echo "  Run $(bold 'codex') to start."
  echo "============================================================"
}

main "$@"
