import { emitKeypressEvents } from 'node:readline'

export function renderList(kind, catalog, state) {
  const model = buildSelectionModel(kind, catalog, state)
  return [
    model.title,
    '',
    ...model.items.map((item, index) => `${item.marker} ${index + 1}. ${item.id} - ${item.description}${item.note}`),
    '',
    '在交互终端中运行该命令，可直接进入选择界面。',
  ].join('\n')
}

export async function promptSelection(kind, catalog, state) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    return { changed: false, cancelled: false, nextState: state, message: '当前不是交互终端，仅显示列表。' }
  }

  return runInteractiveSelection(kind, catalog, state)
}

export function buildSelectionModel(kind, catalog, state) {
  if (kind === 'bundles') {
    return {
      title: 'hello-scholar Bundles',
      items: catalog.bundles.map((bundle) => ({
        id: bundle.id,
        description: bundle.description,
        marker: state.bundles.includes(bundle.id) ? '[x]' : '[ ]',
        locked: false,
        note: '',
      })),
    }
  }

  if (kind === 'skills') {
    return {
      title: 'hello-scholar Skills',
      items: catalog.skills.map((entry) => {
        const isExplicit = state.explicitSkills.includes(entry.id)
        const isInherited = state.skills.includes(entry.id) && !isExplicit
        return {
          id: entry.id,
          description: entry.description,
          marker: isExplicit ? '[x]' : (isInherited ? '[+]' : '[ ]'),
          locked: isInherited,
          note: isInherited ? ' (来自 bundle/base)' : '',
        }
      }),
    }
  }

  if (kind === 'agents') {
    return {
      title: 'hello-scholar Agents',
      items: catalog.agents.map((entry) => {
        const isExplicit = state.explicitAgents.includes(entry.id)
        const isInherited = state.agents.includes(entry.id) && !isExplicit
        return {
          id: entry.id,
          description: entry.description,
          marker: isExplicit ? '[x]' : (isInherited ? '[+]' : '[ ]'),
          locked: isInherited,
          note: isInherited ? ' (来自 bundle)' : '',
        }
      }),
    }
  }

  if (kind === 'profiles') {
    return {
      title: 'hello-scholar Profiles',
      items: catalog.profiles.map((profile) => ({
        id: profile.id,
        description: `${profile.displayName} - ${profile.description}`,
        marker: state.activeProfile === profile.id ? '[x]' : '[ ]',
        locked: false,
        note: profile.base ? ' (base)' : '',
      })),
    }
  }

  throw new Error(`Unsupported list kind: ${kind}`)
}

export function buildInteractiveFrame(kind, catalog, state, focusIndex, statusMessage, terminal = {}) {
  const model = buildSelectionModel(kind, catalog, state)
  const rows = Math.max(terminal.rows || 24, 12)
  const cols = Math.max(terminal.cols || 80, 40)
  const entries = [
    ...model.items.map((item, index) => ({
      type: 'item',
      index,
      id: item.id,
      marker: item.marker,
      locked: item.locked,
      description: item.description,
      note: item.note,
    })),
    {
      type: 'action',
      action: 'confirm',
      id: 'confirm',
      marker: '[确认保存]',
      locked: false,
      description: '保存当前选择',
      note: '',
    },
    {
      type: 'action',
      action: 'cancel',
      id: 'cancel',
      marker: '[退出不保存]',
      locked: false,
      description: '退出而不保存修改',
      note: '',
    },
  ]

  const reservedLines = 8
  const visibleCount = Math.max(rows - reservedLines, 3)
  const start = clampWindowStart(focusIndex, entries.length, visibleCount)
  const end = Math.min(start + visibleCount, entries.length)
  const visibleEntries = entries.slice(start, end)
  const focusedEntry = entries[Math.min(focusIndex, entries.length - 1)] || entries[0]

  const lines = [
    model.title,
    '↑/↓ 移动  Enter 选择/确认  Esc/Q 退出',
    '',
  ]

  if (start > 0) {
    lines.push(`... 上方还有 ${start} 项`)
  }

  for (let index = start; index < end; index += 1) {
    const entry = entries[index]
    const pointer = index === focusIndex ? '>' : ' '
    if (entry.type === 'item') {
      const note = entry.locked ? ' [继承]' : ''
      lines.push(truncate(`${pointer} ${entry.marker} ${entry.index + 1}. ${entry.id}${note}`, cols))
    } else {
      lines.push(truncate(`${pointer} ${entry.marker}`, cols))
    }
  }

  if (end < entries.length) {
    lines.push(`... 下方还有 ${entries.length - end} 项`)
  }

  lines.push('')
  lines.push(truncate(`当前: ${focusedEntry.id} - ${focusedEntry.description}${focusedEntry.note || ''}`, cols))
  lines.push(truncate(`状态: ${statusMessage}`, cols))

  return {
    model,
    entries,
    lines,
    focusIndex,
    start,
    end,
    visibleCount,
  }
}

export function applySelectionOperation(kind, catalog, state, focusIndex) {
  const model = buildSelectionModel(kind, catalog, state)
  if (focusIndex < model.items.length) {
    const entry = model.items[focusIndex]
    if (entry.locked) {
      return {
        changed: false,
        cancelled: false,
        confirmed: false,
        nextState: state,
        message: `${entry.id} 来自 bundle/base，请通过 bundles 调整。`,
      }
    }

    const currentIds = new Set(getMutableCurrentIds(kind, state))
    if (kind === 'profiles') {
      return {
        changed: state.activeProfile !== entry.id,
        cancelled: false,
        confirmed: false,
        nextState: {
          ...state,
          baseProfile: state.baseProfile || 'ml-development',
          activeProfile: entry.id,
        },
        message: `${entry.id} 已设为当前 profile`,
      }
    }

    if (currentIds.has(entry.id)) currentIds.delete(entry.id)
    else currentIds.add(entry.id)

    return {
      changed: true,
      cancelled: false,
      confirmed: false,
      nextState: applyIds(kind, state, [...currentIds].sort()),
      message: `${entry.id} 已${currentIds.has(entry.id) ? '选中' : '取消'}`,
    }
  }

  if (focusIndex === model.items.length) {
    return {
      changed: false,
      cancelled: false,
      confirmed: true,
      nextState: state,
      message: '已确认保存。',
    }
  }

  return {
    changed: false,
    cancelled: true,
    confirmed: false,
    nextState: state,
    message: '已退出，不保存修改。',
  }
}

export function formatInstallSummary(hostState, selection, mode, cwd = process.cwd()) {
  return [
    'hello-scholar Install',
    '',
    `- Mode: ${mode}`,
    `- Profile: ${selection.activeProfile || 'ml-development'}`,
    `- Bundles: ${formatInlineList(selection.bundles)}`,
    `- Skills: ${selection.skills.length}`,
    `- Agents: ${selection.agents.length}`,
    `- Managed Skills: ${hostState.managedSkills.length}`,
    `- Managed Agents: ${hostState.managedAgents.length}`,
    `- Skipped Skills: ${formatSkipped(hostState.skippedSkills)}`,
    `- Skipped Agents: ${formatSkipped(hostState.skippedAgents)}`,
    `- Prompt Target: ${mode === 'global' ? '~/.codex/AGENTS.md' : '<project>/AGENTS.md'}`,
    `- Project: ${cwd}`,
  ].join('\n')
}

export function formatStatus(status) {
  if (status.scope === 'global') {
    return [
      'hello-scholar Status',
      '',
      '- Scope: global',
      `- Installed: ${status.installed ? 'yes' : 'no'}`,
      `- Mode: ${status.mode || '(none)'}`,
      `- Profile: ${status.activeProfile || 'ml-development'}`,
      `- Bundles: ${formatInlineList(status.bundles)}`,
      `- Skills: ${status.selectedSkills.length}`,
      `- Agents: ${status.selectedAgents.length}`,
      `- Active Experiment: ${status.activeExperiment || 'None'}`,
      `- Experiments: ${status.experimentCount || 0}`,
      `- Project Preferences: ${status.preferencesProjectFile || '(unknown)'}`,
      `- Global Preferences: ${status.preferencesGlobalFile || '(unknown)'}`,
      `- Global State Root: ${status.stateRoot}`,
      `- Home Prompt: ${status.promptExists ? 'present' : 'absent'}`,
      `- Home Bootstrap Block: ${status.bootstrapMarker ? 'present' : 'absent'}`,
      `- Host Config Block: ${status.configMarker ? 'present' : 'absent'}`,
      `- Plugin Root: ${status.pluginRootExists ? 'present' : 'absent'}`,
    ].join('\n')
  }

  return [
    'hello-scholar Status',
    '',
    '- Scope: standby',
    `- Installed: ${status.installed ? 'yes' : 'no'}`,
    `- Mode: ${status.mode || '(none)'}`,
    `- Profile: ${status.activeProfile || 'ml-development'}`,
    `- Bundles: ${formatInlineList(status.bundles)}`,
    `- Skills: ${status.selectedSkills.length}`,
    `- Agents: ${status.selectedAgents.length}`,
    `- Active Experiment: ${status.activeExperiment || 'None'}`,
    `- Experiments: ${status.experimentCount || 0}`,
    `- Project Preferences: ${status.preferencesProjectFile || '(unknown)'}`,
    `- Global Preferences: ${status.preferencesGlobalFile || '(unknown)'}`,
    `- Project State Root: ${status.stateRoot}`,
    `- Project Prompt: ${status.promptExists ? 'present' : 'absent'}`,
    `- Project Bootstrap Block: ${status.bootstrapMarker ? 'present' : 'absent'}`,
  ].join('\n')
}

export function formatDoctor(checks) {
  return [
    'hello-scholar Doctor',
    '',
    ...checks.map((entry) => `${entry.pass ? '[PASS]' : '[FAIL]'} ${entry.check}`),
  ].join('\n')
}

export function formatCleanupSummary({
  cwd,
  scope,
  removedScopedState,
  removedScopedAgentsBlock,
  removedScopedConfigBlock,
  removedGlobalPluginRoot,
  removedGlobalPluginCache,
  removedMarketplaceEntry,
}) {
  if (scope === 'global') {
    return [
      'hello-scholar Cleanup',
      '',
      `- Project: ${cwd}`,
      '- Scope: global',
      `- Removed global install state: ${removedScopedState ? 'yes' : 'no'}`,
      `- Removed home AGENTS Scholar block: ${removedScopedAgentsBlock ? 'yes' : 'no'}`,
      `- Removed home config Scholar block: ${removedScopedConfigBlock ? 'yes' : 'no'}`,
      `- Removed global plugin root: ${removedGlobalPluginRoot ? 'yes' : 'no'}`,
      `- Removed global plugin cache: ${removedGlobalPluginCache ? 'yes' : 'no'}`,
      `- Removed marketplace entry: ${removedMarketplaceEntry ? 'yes' : 'no'}`,
    ].join('\n')
  }

  return [
    'hello-scholar Cleanup',
    '',
    `- Project: ${cwd}`,
    '- Scope: standby',
    `- Removed .hello-scholar: ${removedScopedState ? 'yes' : 'no'}`,
    `- Removed project AGENTS Scholar block: ${removedScopedAgentsBlock ? 'yes' : 'no'}`,
  ].join('\n')
}

async function runInteractiveSelection(kind, catalog, initialState) {
  const stdin = process.stdin
  const stdout = process.stdout
  const wasRaw = stdin.isRaw === true
  let state = initialState
  let focusIndex = 0
  let statusMessage = '上下方向键移动，回车选择或取消，底部确认保存或退出。'

  return new Promise((resolve) => {
    emitKeypressEvents(stdin)
    if (stdin.setRawMode) stdin.setRawMode(true)
    stdin.resume()
    stdout.write('\x1B[?1049h')
    stdout.write('\x1B[?25l')

    const cleanup = () => {
      stdin.off('keypress', onKeypress)
      if (stdin.setRawMode) stdin.setRawMode(wasRaw)
      stdin.pause()
      stdout.write('\x1B[?25h')
      stdout.write('\x1B[?1049l')
    }

    const render = () => {
      const frame = buildInteractiveFrame(kind, catalog, state, focusIndex, statusMessage, {
        rows: stdout.rows,
        cols: stdout.columns,
      })
      stdout.write('\x1B[H\x1B[J')
      stdout.write(`${frame.lines.join('\n')}\n`)
    }

    const finish = (result) => {
      cleanup()
      resolve(result)
    }

    const onKeypress = (_str, key) => {
      const model = buildSelectionModel(kind, catalog, state)
      const maxIndex = model.items.length + 1

      if (key?.name === 'up') {
        focusIndex = focusIndex > 0 ? focusIndex - 1 : maxIndex
        render()
        return
      }
      if (key?.name === 'down') {
        focusIndex = focusIndex < maxIndex ? focusIndex + 1 : 0
        render()
        return
      }
      if (key?.name === 'pageup') {
        focusIndex = Math.max(0, focusIndex - 10)
        render()
        return
      }
      if (key?.name === 'pagedown') {
        focusIndex = Math.min(maxIndex, focusIndex + 10)
        render()
        return
      }
      if (key?.name === 'home') {
        focusIndex = 0
        render()
        return
      }
      if (key?.name === 'end') {
        focusIndex = maxIndex
        render()
        return
      }
      if (key?.name === 'return' || key?.name === 'space') {
        const result = applySelectionOperation(kind, catalog, state, focusIndex)
        statusMessage = result.message
        if (result.cancelled) {
          finish({
            changed: false,
            cancelled: true,
            nextState: initialState,
            message: result.message,
          })
          return
        }
        if (result.confirmed) {
          const changed =
            JSON.stringify(getMutableCurrentIds(kind, state)) !== JSON.stringify(getMutableCurrentIds(kind, initialState))
          finish({
            changed,
            cancelled: false,
            nextState: state,
            message: changed ? '已保存当前选择。' : '未修改当前选择。',
          })
          return
        }
        state = result.nextState
        render()
        return
      }
      if (key?.name === 'escape' || key?.name === 'q' || (key?.ctrl && key?.name === 'c')) {
        finish({
          changed: false,
          cancelled: true,
          nextState: initialState,
          message: '已退出，不保存修改。',
        })
      }
    }

    stdin.on('keypress', onKeypress)
    render()
  })
}

function clampWindowStart(focusIndex, totalEntries, visibleCount) {
  if (totalEntries <= visibleCount) return 0
  const centered = focusIndex - Math.floor(visibleCount / 2)
  return Math.max(0, Math.min(centered, totalEntries - visibleCount))
}

function truncate(text, width) {
  if (text.length <= width) return text
  if (width <= 1) return text.slice(0, width)
  return `${text.slice(0, Math.max(0, width - 1))}…`
}

function getMutableCurrentIds(kind, state) {
  if (kind === 'bundles') return state.bundles
  if (kind === 'skills') return state.explicitSkills
  if (kind === 'agents') return state.explicitAgents
  if (kind === 'profiles') return [state.activeProfile || 'ml-development']
  return []
}

function applyIds(kind, state, ids) {
  if (kind === 'bundles') {
    return {
      ...state,
      bundles: ids,
    }
  }
  if (kind === 'skills') {
    return {
      ...state,
      explicitSkills: ids,
    }
  }
  if (kind === 'agents') {
    return {
      ...state,
      explicitAgents: ids,
    }
  }
  return state
}

function formatInlineList(values) {
  return values.length > 0 ? values.join(', ') : '(none)'
}

function formatSkipped(entries) {
  return entries.length > 0
    ? entries.map((entry) => `${entry.id}:${entry.reason}`).join(', ')
    : '(none)'
}
