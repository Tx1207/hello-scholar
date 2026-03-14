#!/usr/bin/env bash
# ============================================================
# Claude Scholar — Codex CLI Installer
# ============================================================
# Usage: bash scripts/setup.sh
# Supports fresh install and incremental merge with existing config.

set -euo pipefail

CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# --- State flags ---
SKIP_PROVIDER=false
SKIP_AUTH=false
PROVIDER_NAME=""
PROVIDER_URL=""
MODEL=""
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
declare -a PRESET_MODELS=("gpt-5.2" "")

# ============================================================
# Step 1: Check prerequisites
# ============================================================
check_deps() {
  command -v git >/dev/null || error "Git is required."
  if ! command -v codex >/dev/null; then
    warn "Codex CLI not found. Install: npm i -g @openai/codex"
  fi
}

# ============================================================
# Step 2: Detect existing configuration
# ============================================================
detect_existing() {
  echo ""
  if [ -f "$CODEX_HOME/config.toml" ]; then
    info "Existing config.toml found at $CODEX_HOME/config.toml"
    # Extract current model and provider
    local cur_model cur_provider
    cur_model=$(grep '^model ' "$CODEX_HOME/config.toml" 2>/dev/null | head -1 | sed 's/.*= *"//;s/".*//' || true)
    cur_provider=$(grep '^model_provider ' "$CODEX_HOME/config.toml" 2>/dev/null | head -1 | sed 's/.*= *"//;s/".*//' || true)
    if [ -n "$cur_model" ]; then
      info "  Current model: $cur_model"
    fi
    if [ -n "$cur_provider" ]; then
      info "  Current provider: $cur_provider"
    fi
    echo ""
    read -rp "Keep existing provider/model config? [Y/n]: " keep_config
    if [ "$keep_config" != "n" ] && [ "$keep_config" != "N" ]; then
      SKIP_PROVIDER=true
      info "Keeping existing provider/model configuration"
    fi
  fi

  if [ -f "$CODEX_HOME/auth.json" ]; then
    local existing_key
    existing_key=$(grep -o '"OPENAI_API_KEY"[[:space:]]*:[[:space:]]*"[^"]*"' "$CODEX_HOME/auth.json" 2>/dev/null | sed 's/.*: *"//;s/"$//' || true)
    if [ -n "$existing_key" ]; then
      local masked="${existing_key:0:8}...${existing_key: -4}"
      info "Existing API key found: $masked"
      read -rp "Keep existing API key? [Y/n]: " keep_key
      if [ "$keep_key" != "n" ] && [ "$keep_key" != "N" ]; then
        SKIP_AUTH=true
        info "Keeping existing API key"
      fi
    fi
  fi
}

# ============================================================
# Step 3: Choose provider (skipped if existing config kept)
# ============================================================
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

# ============================================================
# Step 4: Configure API key (skipped if existing key kept)
# ============================================================
configure_api_key() {
  if [ "$SKIP_AUTH" = true ]; then
    return
  fi

  echo ""
  read -rp "Enter API key (OPENAI_API_KEY, or press Enter to skip): " API_KEY
  if [ -z "$API_KEY" ]; then
    warn "No API key set. Make sure OPENAI_API_KEY is in your environment."
    SKIP_AUTH=true
  fi
}

# ============================================================
# Step 5: Generate or merge config.toml
# ============================================================
generate_config() {
  local template="$SRC_DIR/config.toml"
  local target="$CODEX_HOME/config.toml"

  [ -f "$template" ] || error "Template config.toml not found at $template"

  if [ "$SKIP_PROVIDER" = true ]; then
    # Merge mode: keep existing config, only add missing Scholar sections
    merge_scholar_config "$target" "$template"
  else
    # Fresh mode: generate from template
    if [ -f "$target" ]; then
      cp "$target" "${target}.bak"
      info "Backed up config.toml → config.toml.bak"
    fi
    sed -e "s|__MODEL__|$MODEL|g" \
        -e "s|__PROVIDER_NAME__|$PROVIDER_NAME|g" \
        -e "s|__PROVIDER_URL__|$PROVIDER_URL|g" \
        "$template" > "$target"
    info "Generated config.toml (model=$MODEL, provider=$PROVIDER_NAME)"
  fi
}

# ============================================================
# Merge Scholar-specific sections into existing config
# ============================================================
merge_scholar_config() {
  local target="$1"
  local template="$2"
  local added=0

  cp "$target" "${target}.bak"
  info "Backed up config.toml → config.toml.bak"

  # Add [features] if missing
  if ! grep -q '^\[features\]' "$target" 2>/dev/null; then
    cat >> "$target" << 'FEATURES'

# ============================================================
# Features (added by Claude Scholar)
# ============================================================
[features]
multi_agent = true
memories = true
skill_approval = true
FEATURES
    added=$((added + 1))
  fi

  # Add [mcp_servers.zotero] if missing
  if ! grep -q '\[mcp_servers\.zotero\]' "$target" 2>/dev/null; then
    cat >> "$target" << 'MCP'

# ============================================================
# MCP Servers (added by Claude Scholar)
# ============================================================
[mcp_servers.zotero]
command = "zotero-mcp"
args = ["serve"]
enabled = false
[mcp_servers.zotero.env]
ZOTERO_LOCAL = "true"
NO_PROXY = "localhost,127.0.0.1"
MCP
    added=$((added + 1))
  fi

  # Add agent definitions if missing
  if ! grep -q '\[agents\.' "$target" 2>/dev/null; then
    # Extract agents block from template (lines starting with [agents. or belonging to agent sections)
    sed -n '/^# --- Research Workflow/,$ p' "$template" >> "$target"
    added=$((added + 1))
  fi

  if [ "$added" -gt 0 ]; then
    info "Merged $added Scholar section(s) into existing config.toml"
  else
    info "Config already has all Scholar sections, no changes needed"
  fi
}

# ============================================================
# Step 6: Write auth.json (skipped if existing key kept)
# ============================================================
write_auth() {
  if [ "$SKIP_AUTH" = true ]; then
    return
  fi

  local target="$CODEX_HOME/auth.json"
  if [ -f "$target" ]; then
    cp "$target" "${target}.bak"
  fi
  cat > "$target" << EOF
{
  "OPENAI_API_KEY": "$API_KEY"
}
EOF
  chmod 600 "$target"
  info "Wrote auth.json (permissions: 600)"
}

# ============================================================
# Step 7: Copy components to ~/.codex/ (additive merge)
# ============================================================
copy_components() {
  # Skills (additive - cp -r merges directories)
  if [ -d "$SRC_DIR/skills" ]; then
    mkdir -p "$CODEX_HOME/skills"
    cp -r "$SRC_DIR/skills/." "$CODEX_HOME/skills/"
    local count
    count=$(ls -d "$CODEX_HOME/skills"/*/ 2>/dev/null | wc -l | tr -d ' ')
    info "Synced skills: $count total"
  fi

  # Agents
  if [ -d "$SRC_DIR/agents" ]; then
    mkdir -p "$CODEX_HOME/agents"
    cp -r "$SRC_DIR/agents/." "$CODEX_HOME/agents/"
    local count
    count=$(ls -d "$CODEX_HOME/agents"/*/ 2>/dev/null | wc -l | tr -d ' ')
    info "Synced agents: $count total"
  fi

  # AGENTS.md
  if [ -f "$SRC_DIR/AGENTS.md" ]; then
    if [ -f "$CODEX_HOME/AGENTS.md" ]; then
      cp "$CODEX_HOME/AGENTS.md" "$CODEX_HOME/AGENTS.md.bak"
    fi
    cp "$SRC_DIR/AGENTS.md" "$CODEX_HOME/AGENTS.md"
    info "Synced AGENTS.md"
  fi

  # Scripts
  if [ -d "$SRC_DIR/scripts" ]; then
    mkdir -p "$CODEX_HOME/scripts"
    cp -r "$SRC_DIR/scripts/." "$CODEX_HOME/scripts/"
    info "Synced scripts/"
  fi

  # Utils
  if [ -d "$SRC_DIR/utils" ]; then
    mkdir -p "$CODEX_HOME/utils"
    cp -r "$SRC_DIR/utils/." "$CODEX_HOME/utils/"
    info "Synced utils/"
  fi
}

# ============================================================
# Step 8: Optional - Enable Zotero MCP
# ============================================================
configure_mcp() {
  # Skip if already enabled in config
  if grep -q 'enabled = true' "$CODEX_HOME/config.toml" 2>/dev/null; then
    info "Zotero MCP already enabled"
    return
  fi

  echo ""
  read -rp "Enable Zotero MCP server? [y/N]: " enable_zotero
  if [ "$enable_zotero" = "y" ] || [ "$enable_zotero" = "Y" ]; then
    sed -i.tmp 's/enabled = false/enabled = true/' "$CODEX_HOME/config.toml"
    rm -f "$CODEX_HOME/config.toml.tmp"
    info "Zotero MCP enabled"
    if ! command -v zotero-mcp >/dev/null 2>&1; then
      warn "zotero-mcp not found. Install: uv tool install git+https://github.com/Galaxy-Dawn/zotero-mcp.git"
    fi
  fi
}

# ============================================================
# Main
# ============================================================
main() {
  echo ""
  echo "╔══════════════════════════════════════╗"
  echo "║   Claude Scholar Installer (Codex)   ║"
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
  echo ""
  echo "  Config:  $CODEX_HOME/config.toml"
  echo "  Auth:    $CODEX_HOME/auth.json"
  echo "  Skills:  $CODEX_HOME/skills/"
  echo "  Agents:  $CODEX_HOME/agents/"
  echo ""
  echo "  Run $(bold 'codex') to start."
  echo "============================================================"
}

main "$@"
