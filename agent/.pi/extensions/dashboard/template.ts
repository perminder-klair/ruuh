export function dashboardHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="theme-color" content="#0b0907">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="manifest" href="/manifest.json">
<title>Ruuh</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0b0907;
    --surface: #141210;
    --surface2: #1a1816;
    --border: #201e1b;
    --text: #f0f0f0;
    --text2: #d4d0cc;
    --text3: #8a8480;
    --text4: #5a5550;
    --accent: #FBAA19;
    --accent-dim: rgba(251, 170, 25, 0.08);
    --accent-bg: #2a1d08;
    --green: #3fb950;
    --orange: #d29922;
    --red: #f85149;
    --safe-top: env(safe-area-inset-top, 0px);
    --safe-bottom: env(safe-area-inset-bottom, 0px);
    --header-h: 48px;
    --nav-h: 56px;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background: var(--bg);
    color: var(--text);
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Header ── */
  .header {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: calc(var(--header-h) + var(--safe-top));
    padding-top: var(--safe-top);
    background: rgba(11, 9, 7, 0.82);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    display: flex;
    align-items: center;
    padding-left: 16px;
    padding-right: 16px;
    z-index: 100;
    border-bottom: 1px solid var(--border);
  }
  .header-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-right: 10px;
  }
  .header-dot.idle     { background: var(--green); box-shadow: 0 0 6px var(--green); }
  .header-dot.thinking { background: var(--orange); box-shadow: 0 0 6px var(--orange); animation: pulse 1s infinite; }
  .header-dot.executing_tool { background: var(--red); box-shadow: 0 0 6px var(--red); animation: pulse 0.5s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

  .header-title {
    font-size: 1.05rem;
    font-weight: 700;
    flex-shrink: 0;
  }
  .header-status {
    margin-left: 10px;
    font-size: 0.78rem;
    color: var(--text3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
  }

  /* ── Connection Bar ── */
  .conn-bar {
    position: fixed;
    top: calc(var(--header-h) + var(--safe-top));
    left: 0; right: 0;
    background: #3b1520;
    color: var(--red);
    text-align: center;
    padding: 6px;
    font-size: 0.78rem;
    font-weight: 600;
    z-index: 99;
    transform: translateY(-100%);
    transition: transform 0.3s ease;
  }
  .conn-bar.visible { transform: translateY(0); }

  /* ── Bottom Nav ── */
  .bottom-nav {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    height: calc(var(--nav-h) + var(--safe-bottom));
    padding-bottom: var(--safe-bottom);
    background: rgba(11, 9, 7, 0.92);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid var(--border);
    display: flex;
    z-index: 100;
  }
  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    background: none;
    border: none;
    color: var(--text4);
    font-size: 0.65rem;
    font-weight: 600;
    cursor: pointer;
    position: relative;
    padding: 0;
    letter-spacing: 0.02em;
  }
  .nav-item.active { color: var(--accent); }
  .nav-item.active::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 32px;
    height: 3px;
    border-radius: 0 0 3px 3px;
    background: var(--accent);
    box-shadow: 0 0 8px rgba(251,170,25,0.5);
  }
  .nav-item svg { width: 22px; height: 22px; }

  /* ── View Container ── */
  .views {
    position: fixed;
    top: calc(var(--header-h) + var(--safe-top));
    bottom: calc(var(--nav-h) + var(--safe-bottom));
    left: 0; right: 0;
    overflow: hidden;
  }
  .view {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.28s ease;
    will-change: transform, opacity;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
  }
  .view.hidden-left  { transform: translateX(-30%); opacity: 0; pointer-events: none; }
  .view.hidden-right { transform: translateX(30%); opacity: 0; pointer-events: none; }
  .view.active       { transform: translateX(0); opacity: 1; }

  /* ── Chat View ── */
  .chat-view {
    display: flex;
    flex-direction: column;
    padding: 0;
    overflow: hidden;
  }
  .chat-messages {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px 14px;
  }
  .chat-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    color: var(--text4);
    font-size: 0.9rem;
  }
  .chat-empty-icon {
    width: 64px; height: 64px;
    border-radius: 50%;
    background: var(--accent-dim);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 40px rgba(251,170,25,0.08);
  }
  .chat-empty-icon svg { width: 32px; height: 32px; color: var(--accent); }

  .chat-msg {
    max-width: 82%;
    padding: 10px 14px;
    font-size: 0.88rem;
    line-height: 1.5;
    word-break: break-word;
    animation: msgIn 0.25s ease-out;
  }
  @keyframes msgIn {
    from { transform: translateY(8px) scale(0.97); opacity: 0; }
    to   { transform: translateY(0) scale(1); opacity: 1; }
  }
  .chat-msg.user {
    align-self: flex-end;
    background: var(--accent);
    color: #0b0907;
    border-radius: 18px 18px 4px 18px;
    white-space: pre-wrap;
  }
  .chat-msg.agent {
    align-self: flex-start;
    background: var(--surface2);
    color: var(--text2);
    border-radius: 18px 18px 18px 4px;
  }
  .chat-msg .chat-time {
    display: block;
    font-size: 0.62rem;
    margin-top: 5px;
  }
  .chat-msg.user .chat-time { color: rgba(11,9,7,0.5); }
  .chat-msg.agent .chat-time { color: var(--text4); }

  /* Markdown in agent messages */
  .chat-msg.agent code {
    background: var(--bg);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.82em;
    font-family: "SF Mono", "Fira Code", "Cascadia Code", monospace;
  }
  .chat-msg.agent pre {
    background: var(--bg);
    padding: 12px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 8px 0;
    white-space: pre;
  }
  .chat-msg.agent pre code {
    background: none;
    padding: 0;
    font-size: 0.82em;
  }
  .chat-msg.agent strong { color: var(--text); }
  .chat-msg.agent em { color: var(--text2); }
  .chat-msg.agent a { color: var(--accent); text-decoration: underline; }
  .chat-msg.agent ul, .chat-msg.agent ol { padding-left: 1.2em; margin: 4px 0; }
  .chat-msg.agent li { margin: 2px 0; }
  .chat-msg.agent blockquote {
    border-left: 2px solid var(--accent);
    padding-left: 10px;
    color: var(--text3);
    margin: 4px 0;
  }
  .chat-msg.agent h1, .chat-msg.agent h2, .chat-msg.agent h3 {
    color: var(--text);
    margin: 8px 0 4px 0;
    line-height: 1.3;
  }
  .chat-msg.agent h1 { font-size: 1.15em; }
  .chat-msg.agent h2 { font-size: 1.05em; }
  .chat-msg.agent h3 { font-size: 0.95em; }
  .chat-msg.agent p { margin: 4px 0; }

  /* Typing indicator */
  .typing-indicator {
    align-self: flex-start;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 12px 18px;
    background: var(--surface2);
    border-radius: 18px 18px 18px 4px;
    animation: msgIn 0.25s ease-out;
  }
  .typing-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--text3);
    animation: typeBounce 1.4s infinite ease-in-out;
  }
  .typing-dot:nth-child(2) { animation-delay: 0.16s; }
  .typing-dot:nth-child(3) { animation-delay: 0.32s; }
  @keyframes typeBounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-6px); opacity: 1; }
  }

  /* Compose bar */
  .compose {
    padding: 8px 12px;
    border-top: 1px solid var(--border);
    background: var(--bg);
    flex-shrink: 0;
  }
  .compose-row {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 4px 4px 4px 16px;
  }
  .compose-row:focus-within { border-color: var(--accent); }
  .compose-input {
    flex: 1;
    background: none;
    border: none;
    color: var(--text);
    font-size: 0.9rem;
    line-height: 1.4;
    resize: none;
    outline: none;
    padding: 6px 0;
    max-height: 120px;
    min-height: 1.4em;
    font-family: inherit;
  }
  .compose-input::placeholder { color: var(--text4); }
  .compose-send {
    width: 36px; height: 36px;
    border-radius: 50%;
    border: none;
    background: var(--accent);
    color: #0b0907;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: opacity 0.15s;
  }
  .compose-send:active { opacity: 0.7; }
  .compose-send:disabled { opacity: 0.3; }
  .compose-hint {
    font-size: 0.68rem;
    color: var(--text4);
    text-align: center;
    padding: 4px 0 0;
    min-height: 1em;
  }

  /* ── Activity View ── */
  .activity-view {
    padding: 12px 16px;
  }
  .timeline { position: relative; }
  .tl-entry {
    display: flex;
    gap: 14px;
    padding-bottom: 16px;
    position: relative;
  }
  .tl-rail {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 14px;
    flex-shrink: 0;
    position: relative;
  }
  .tl-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
    z-index: 1;
    margin-top: 3px;
  }
  .tl-dot.session { background: var(--green); box-shadow: 0 0 6px rgba(63,185,80,0.4); }
  .tl-dot.agent   { background: var(--orange); box-shadow: 0 0 6px rgba(210,153,34,0.4); }
  .tl-dot.turn    { background: var(--accent); box-shadow: 0 0 6px rgba(251,170,25,0.4); }
  .tl-dot.tool    { background: var(--red); box-shadow: 0 0 6px rgba(248,81,73,0.4); }
  .tl-dot.message { background: var(--accent); box-shadow: 0 0 6px rgba(251,170,25,0.4); }
  .tl-line {
    flex: 1;
    width: 2px;
    background: linear-gradient(to bottom, var(--border), transparent);
    margin-top: 4px;
  }
  .tl-content { flex: 1; min-width: 0; }
  .tl-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 2px;
  }
  .tl-badge {
    font-size: 0.62rem;
    padding: 1px 7px;
    border-radius: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .tl-badge.session { background: #1f3d2d; color: var(--green); }
  .tl-badge.agent   { background: #3b2e12; color: var(--orange); }
  .tl-badge.turn    { background: var(--accent-bg); color: var(--accent); }
  .tl-badge.tool    { background: #3b1520; color: var(--red); }
  .tl-badge.message { background: var(--accent-bg); color: var(--accent); }
  .tl-time {
    font-size: 0.68rem;
    color: var(--text4);
    font-family: "SF Mono", "Fira Code", monospace;
  }
  .tl-text {
    font-size: 0.82rem;
    color: var(--text2);
    line-height: 1.4;
    word-break: break-word;
  }
  .activity-empty {
    text-align: center;
    color: var(--text4);
    padding: 48px 16px;
    font-size: 0.85rem;
  }

  /* ── Info View ── */
  .info-view {
    padding: 8px 0 24px;
  }
  .info-section {
    border-bottom: 1px solid var(--border);
  }
  .info-section:last-child { border-bottom: none; }
  .info-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .info-section-header:active { background: var(--surface); }
  .info-section-title {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text3);
    font-weight: 600;
  }
  .info-chevron {
    color: var(--text4);
    transition: transform 0.25s ease;
    flex-shrink: 0;
  }
  .info-section.collapsed .info-chevron { transform: rotate(-90deg); }
  .info-section-body {
    padding: 0 16px 14px;
    overflow: hidden;
    transition: max-height 0.3s ease, opacity 0.25s ease, padding 0.3s ease;
    max-height: 500px;
    opacity: 1;
  }
  .info-section.collapsed .info-section-body {
    max-height: 0;
    opacity: 0;
    padding-top: 0;
    padding-bottom: 0;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
  }
  .info-row + .info-row { border-top: 1px solid rgba(32,30,27,0.5); }
  .info-row-label {
    font-size: 0.85rem;
    color: var(--text2);
  }
  .info-row-value {
    font-size: 0.85rem;
    color: var(--text);
    text-align: right;
    max-width: 60%;
    word-break: break-all;
  }
  .info-row-value.mono {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 0.78rem;
  }
  .info-row-value.dim { color: var(--text4); font-style: italic; }

  .resource-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 4px 0;
  }
  .chip {
    font-size: 0.75rem;
    padding: 4px 10px;
    border-radius: 10px;
    background: var(--accent-dim);
    color: var(--text2);
    border: 1px solid rgba(251,170,25,0.12);
  }
  .none-label {
    font-size: 0.82rem;
    color: var(--text4);
    font-style: italic;
    padding: 4px 0;
  }

  /* Install banner */
  .install-banner {
    display: none;
    margin: 8px 16px;
    background: var(--surface);
    border: 1px solid var(--accent);
    border-radius: 14px;
    padding: 12px 14px;
    align-items: center;
    gap: 10px;
  }
  .install-banner.visible { display: flex; }
  .install-banner-text {
    flex: 1;
    font-size: 0.82rem;
    color: var(--text);
    line-height: 1.3;
  }
  .install-banner-text strong { color: var(--accent); }
  .install-btn {
    background: var(--accent);
    color: #0b0907;
    border: none;
    border-radius: 10px;
    padding: 8px 14px;
    font-weight: 700;
    font-size: 0.82rem;
    cursor: pointer;
    white-space: nowrap;
  }
  .install-btn:active { opacity: 0.7; }
  .install-dismiss {
    background: none;
    border: none;
    color: var(--text3);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0 4px;
    line-height: 1;
  }

  /* Shimmer loading skeleton */
  .shimmer {
    background: linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 8px;
    height: 16px;
    margin: 8px 0;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .loading-skeleton {
    padding: 24px 16px;
  }
  .loading-skeleton .shimmer:nth-child(1) { width: 60%; height: 14px; }
  .loading-skeleton .shimmer:nth-child(2) { width: 80%; height: 14px; }
  .loading-skeleton .shimmer:nth-child(3) { width: 45%; height: 14px; }
</style>
</head>
<body>

<!-- Header -->
<header class="header">
  <div class="header-dot idle" id="headerDot"></div>
  <span class="header-title">Ruuh</span>
  <span class="header-status" id="headerStatus"></span>
</header>

<!-- Connection bar -->
<div class="conn-bar" id="connBar">Reconnecting...</div>

<!-- Views -->
<div class="views" id="viewsContainer">
  <!-- Chat -->
  <div class="view chat-view active" id="viewChat">
    <div class="chat-messages" id="chatMessages">
      <div class="chat-empty" id="chatEmpty">
        <div class="chat-empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><text x="12" y="16" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="currentColor" stroke="none">R</text></svg>
        </div>
        Talk to Ruuh
      </div>
    </div>
    <div class="compose">
      <div class="compose-row">
        <textarea class="compose-input" id="chatInput" placeholder="Message..." rows="1"></textarea>
        <button class="compose-send" id="chatSend">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
      <div class="compose-hint" id="chatHint"></div>
    </div>
  </div>

  <!-- Activity -->
  <div class="view activity-view hidden-right" id="viewActivity">
    <div class="loading-skeleton" id="activityLoading">
      <div class="shimmer"></div>
      <div class="shimmer"></div>
      <div class="shimmer"></div>
    </div>
    <div class="timeline" id="timeline"></div>
  </div>

  <!-- Info -->
  <div class="view info-view hidden-right" id="viewInfo">
    <div class="install-banner" id="installBanner">
      <div class="install-banner-text"><strong>Ruuh</strong> can be added to your home screen.</div>
      <button class="install-btn" id="installBtn">Install</button>
      <button class="install-dismiss" id="installDismiss">&times;</button>
    </div>

    <div class="info-section" id="sectionStatus">
      <div class="info-section-header">
        <span class="info-section-title">Status</span>
        <svg class="info-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="info-section-body">
        <div class="info-row">
          <span class="info-row-label">State</span>
          <span class="info-row-value" id="infoState">Idle</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Tool</span>
          <span class="info-row-value mono" id="infoTool">\u2014</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Doing</span>
          <span class="info-row-value dim" id="infoCustomStatus">\u2014</span>
        </div>
      </div>
    </div>

    <div class="info-section" id="sectionSession">
      <div class="info-section-header">
        <span class="info-section-title">Session</span>
        <svg class="info-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="info-section-body">
        <div class="info-row">
          <span class="info-row-label">Name</span>
          <span class="info-row-value" id="infoSessionName">\u2014</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Started</span>
          <span class="info-row-value" id="infoSessionStart">\u2014</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Turns</span>
          <span class="info-row-value" id="infoTurns">0</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Uptime</span>
          <span class="info-row-value" id="infoUptime">\u2014</span>
        </div>
      </div>
    </div>

    <div class="info-section" id="sectionModel">
      <div class="info-section-header">
        <span class="info-section-title">Model</span>
        <svg class="info-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="info-section-body">
        <div class="info-row">
          <span class="info-row-label">Model</span>
          <span class="info-row-value" id="infoModel">\u2014</span>
        </div>
      </div>
    </div>

    <div class="info-section" id="sectionResources">
      <div class="info-section-header">
        <span class="info-section-title">Loaded Resources</span>
        <svg class="info-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="info-section-body">
        <div class="info-row-label" style="font-size:0.72rem;color:var(--text3);margin-bottom:4px">Skills</div>
        <div class="resource-chips" id="skillsList"></div>
        <div class="info-row-label" style="font-size:0.72rem;color:var(--text3);margin:10px 0 4px">Extensions</div>
        <div class="resource-chips" id="extensionsList"></div>
        <div class="info-row-label" style="font-size:0.72rem;color:var(--text3);margin:10px 0 4px">Prompts</div>
        <div class="resource-chips" id="promptsList"></div>
      </div>
    </div>

    <div class="info-section" id="sectionFiles">
      <div class="info-section-header">
        <span class="info-section-title">Files</span>
        <svg class="info-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="info-section-body">
        <div class="info-row">
          <span class="info-row-label">Agent Home</span>
          <span class="info-row-value mono" id="infoAgentHome">\u2014</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Android</span>
          <span class="info-row-value mono">/sdcard/ruuh</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Termux</span>
          <span class="info-row-value mono">~/storage/shared/ruuh</span>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Bottom Nav -->
<nav class="bottom-nav">
  <button class="nav-item active" data-view="chat">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    <span>Chat</span>
  </button>
  <button class="nav-item" data-view="activity">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
    <span>Activity</span>
  </button>
  <button class="nav-item" data-view="info">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
    <span>Info</span>
  </button>
</nav>

<script>
(function() {
  "use strict";
  var $ = function(id) { return document.getElementById(id); };
  var state = null;
  var currentView = "chat";
  var viewOrder = ["chat", "activity", "info"];
  var reconnectDelay = 1000;
  var sseConnected = false;

  // ── Escape HTML ──
  function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // ── Markdown Renderer ──
  // Security: HTML-escapes first, then applies markdown transforms.
  // This means no raw HTML ever passes through — XSS safe.
  function renderMarkdown(raw) {
    if (!raw) return "";
    var text = escapeHtml(raw);

    // Fenced code blocks: extract and protect them first
    var codeBlocks = [];
    text = text.replace(/\`\`\`(\\w*?)\\n([\\s\\S]*?)\`\`\`/g, function(_, lang, code) {
      var idx = codeBlocks.length;
      codeBlocks.push('<pre><code' + (lang ? ' class="lang-' + lang + '"' : '') + '>' + code + '</code></pre>');
      return "\\x00CB" + idx + "\\x00";
    });

    // Inline code
    text = text.replace(/\`([^\`\\n]+?)\`/g, '<code>$1</code>');

    // Headings
    text = text.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    text = text.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Bold and italic
    text = text.replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>');
    text = text.replace(/\\*(.+?)\\*/g, '<em>$1</em>');

    // Blockquotes (escaped > becomes &gt;)
    text = text.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

    // Unordered lists
    text = text.replace(/^- (.+)$/gm, '<li>$1</li>');
    text = text.replace(/((?:<li>.*<\\/li>\\n?)+)/g, '<ul>$1</ul>');

    // Ordered lists
    text = text.replace(/^\\d+\\. (.+)$/gm, '<li>$1</li>');

    // Links: [text](url) — url was escaped, so unescape &amp; in urls
    text = text.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, function(_, label, url) {
      return '<a href="' + url.replace(/&amp;/g, '&') + '" target="_blank" rel="noopener">' + label + '</a>';
    });

    // Line breaks: double newline → break, single newline within text → <br>
    text = text.replace(/\\n\\n/g, '<br><br>');
    text = text.replace(/([^>])\\n([^<])/g, '$1<br>$2');

    // Restore code blocks
    text = text.replace(/\\x00CB(\\d+)\\x00/g, function(_, idx) {
      return codeBlocks[parseInt(idx, 10)];
    });

    return text;
  }

  // ── Auto-grow textarea ──
  var input = $("chatInput");
  input.addEventListener("input", function() {
    this.style.height = "auto";
    this.style.height = Math.min(this.scrollHeight, 120) + "px";
  });

  // ── View Navigation ──
  function switchView(name) {
    if (name === currentView) return;
    var newIdx = viewOrder.indexOf(name);

    document.querySelectorAll(".nav-item").forEach(function(b) {
      b.classList.toggle("active", b.dataset.view === name);
    });

    viewOrder.forEach(function(v, i) {
      var el = $("view" + v.charAt(0).toUpperCase() + v.slice(1));
      el.classList.remove("active", "hidden-left", "hidden-right");
      if (v === name) {
        el.classList.add("active");
      } else if (i < newIdx) {
        el.classList.add("hidden-left");
      } else {
        el.classList.add("hidden-right");
      }
    });

    currentView = name;
  }

  document.querySelectorAll(".nav-item").forEach(function(btn) {
    btn.addEventListener("click", function() { switchView(btn.dataset.view); });
  });

  // ── Swipe Detection ──
  var touchStartX = 0;
  var touchStartY = 0;
  var swiping = false;

  document.addEventListener("touchstart", function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    swiping = true;
  }, { passive: true });

  document.addEventListener("touchend", function(e) {
    if (!swiping) return;
    swiping = false;
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx) * 0.6) return;

    var idx = viewOrder.indexOf(currentView);
    if (dx > 0 && idx > 0) switchView(viewOrder[idx - 1]);
    if (dx < 0 && idx < viewOrder.length - 1) switchView(viewOrder[idx + 1]);
  }, { passive: true });

  // ── Collapsible Sections ──
  document.querySelectorAll(".info-section-header").forEach(function(hdr) {
    hdr.addEventListener("click", function() {
      var section = hdr.closest(".info-section");
      section.classList.toggle("collapsed");
    });
  });

  // ── Status labels ──
  var statusLabels = { idle: "Idle", thinking: "Thinking", executing_tool: "Executing" };

  // ── Render ──
  var lastChatKey = "";
  var lastLogKey = "";

  function render(s) {
    // Header
    $("headerDot").className = "header-dot " + s.agentStatus;
    var statusText = statusLabels[s.agentStatus] || s.agentStatus;
    if (s.currentToolName) statusText += ": " + s.currentToolName;
    if (s.customStatus) statusText = s.customStatus;
    $("headerStatus").textContent = statusText;

    // Info view — status
    $("infoState").textContent = statusLabels[s.agentStatus] || s.agentStatus;
    $("infoTool").textContent = s.currentToolName || "\\u2014";
    var cs = $("infoCustomStatus");
    cs.textContent = s.customStatus || "\\u2014";
    cs.className = "info-row-value" + (s.customStatus ? "" : " dim");

    // Info view — session
    $("infoSessionName").textContent = s.sessionName || "\\u2014";
    $("infoTurns").textContent = s.turnCount;
    if (s.sessionStartTime) {
      $("infoSessionStart").textContent = new Date(s.sessionStartTime).toLocaleTimeString();
    }

    // Info view — model
    if (s.modelName) {
      $("infoModel").textContent = s.modelName + (s.modelId ? " (" + s.modelId + ")" : "");
      $("infoModel").className = "info-row-value";
    } else {
      $("infoModel").textContent = "\\u2014";
      $("infoModel").className = "info-row-value dim";
    }

    // Info view — resources (all names escaped via escapeHtml)
    renderChips("skillsList", s.skills);
    renderChips("extensionsList", s.extensions);
    renderChips("promptsList", s.prompts);

    // Info view — agent home
    $("infoAgentHome").textContent = s.agentHome || "\\u2014";

    // Chat — differential render
    var chatCount = (s.chatMessages || []).length;
    var isBusy = s.agentStatus !== "idle";
    var chatKey = chatCount + ":" + (isBusy ? "1" : "0");
    if (chatKey !== lastChatKey) {
      lastChatKey = chatKey;
      renderChat(s.chatMessages || [], isBusy);
    }

    // Chat hint
    $("chatHint").textContent = isBusy ? "Agent is busy \\u2014 message will be queued" : "";

    // Activity — differential render
    var logKey = s.activityLog.length + ":" + (s.activityLog[0] ? s.activityLog[0].timestamp : "");
    if (logKey !== lastLogKey) {
      lastLogKey = logKey;
      renderTimeline(s.activityLog);
    }
  }

  function renderChips(id, items) {
    var el = $(id);
    if (!items || items.length === 0) {
      el.innerHTML = '<span class="none-label">None</span>';
    } else {
      // Safe: escapeHtml applied to all item names
      el.innerHTML = items.map(function(name) {
        return '<span class="chip">' + escapeHtml(name) + '</span>';
      }).join("");
    }
  }

  function renderChat(messages, isBusy) {
    var el = $("chatMessages");
    if (messages.length === 0 && !isBusy) {
      // Safe: static HTML only
      el.innerHTML = '<div class="chat-empty" id="chatEmpty"><div class="chat-empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><text x="12" y="16" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="currentColor" stroke="none">R</text></svg></div>Talk to Ruuh</div>';
      return;
    }

    // Safe: user text goes through escapeHtml, agent text goes through
    // renderMarkdown which escapes HTML first then applies transforms
    var html = messages.map(function(m) {
      var t = new Date(m.timestamp).toLocaleTimeString();
      var content = m.role === "agent" ? renderMarkdown(m.text) : escapeHtml(m.text);
      return '<div class="chat-msg ' + m.role + '">' +
        content +
        '<span class="chat-time">' + t + '</span></div>';
    }).join("");

    if (isBusy) {
      html += '<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
    }

    el.innerHTML = html;
    el.scrollTop = el.scrollHeight;
  }

  function renderTimeline(log) {
    var loading = $("activityLoading");
    var el = $("timeline");
    if (loading) loading.style.display = "none";

    if (log.length === 0) {
      el.innerHTML = '<div class="activity-empty">No activity yet</div>';
      return;
    }

    // Safe: all text escaped via escapeHtml, type is server-controlled enum
    el.innerHTML = log.map(function(e, i) {
      var t = new Date(e.timestamp).toLocaleTimeString();
      var isLast = i === log.length - 1;
      return '<div class="tl-entry">' +
        '<div class="tl-rail">' +
          '<div class="tl-dot ' + e.type + '"></div>' +
          (isLast ? '' : '<div class="tl-line"></div>') +
        '</div>' +
        '<div class="tl-content">' +
          '<div class="tl-header">' +
            '<span class="tl-badge ' + e.type + '">' + e.type + '</span>' +
            '<span class="tl-time">' + t + '</span>' +
          '</div>' +
          '<div class="tl-text">' + escapeHtml(e.text) + '</div>' +
        '</div></div>';
    }).join("");
  }

  // ── Uptime ticker ──
  setInterval(function() {
    if (state && state.sessionStartTime) {
      var secs = Math.floor((Date.now() - new Date(state.sessionStartTime).getTime()) / 1000);
      var m = Math.floor(secs / 60);
      var s = secs % 60;
      $("infoUptime").textContent = m + "m " + s + "s";
    }
  }, 1000);

  // ── SSE ──
  function connect() {
    var es = new EventSource("/api/events");
    es.onmessage = function(ev) {
      if (!sseConnected) {
        sseConnected = true;
        $("connBar").classList.remove("visible");
        var loading = $("activityLoading");
        if (loading) loading.style.display = "none";
      }
      reconnectDelay = 1000;
      var msg = JSON.parse(ev.data);
      if (msg.type === "state") {
        state = msg.data;
        render(state);
      }
    };
    es.onerror = function() {
      es.close();
      sseConnected = false;
      $("connBar").classList.add("visible");
      setTimeout(connect, reconnectDelay);
      reconnectDelay = Math.min(reconnectDelay * 2, 10000);
    };
  }
  connect();

  // ── Chat Send ──
  async function sendChat() {
    var msg = input.value.trim();
    if (!msg) return;
    input.disabled = true;
    $("chatSend").disabled = true;
    try {
      var resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      if (resp.ok) {
        input.value = "";
        input.style.height = "auto";
      }
    } catch(e) {
      // network error — user can retry
    } finally {
      input.disabled = false;
      $("chatSend").disabled = false;
      input.focus();
    }
  }

  input.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChat();
    }
  });
  $("chatSend").addEventListener("click", sendChat);

  // ── PWA ──
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(function() {});
  }

  var deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", function(e) {
    e.preventDefault();
    deferredPrompt = e;
    $("installBanner").classList.add("visible");
  });
  $("installBtn").addEventListener("click", function() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function() {
      deferredPrompt = null;
      $("installBanner").classList.remove("visible");
    });
  });
  $("installDismiss").addEventListener("click", function() {
    $("installBanner").classList.remove("visible");
    deferredPrompt = null;
  });
})();
</script>
</body>
</html>`;
}
