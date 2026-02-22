#!/usr/bin/env node
import { render } from 'ink';
import React from 'react';
import { App } from './App.js';

// Parse CLI arguments
const args = process.argv.slice(2);
let initialQuery = '';

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '-h' || arg === '--help') {
    console.log(`
🏴‍☠️ openloot - A terminal UI for searching torrents

USAGE:
  openloot [OPTIONS] [SEARCH_QUERY]

OPTIONS:
  -h, --help     Show this help message
  -v, --version  Show version

EXAMPLES:
  openloot                    # Launch interactive TUI
  openloot "ubuntu 24.04"     # Search immediately

KEYBOARD SHORTCUTS:
  /         Focus search
  Esc       Focus results / Close help
  j/k       Navigate down/up
  g/G       Go to first/last
  m         Show magnet link
  c         Copy magnet link
  o         Open magnet in default app
  s         Save .magnet file
  ?         Show help
  q         Quit
`);
    process.exit(0);
  }
  
  if (arg === '-v' || arg === '--version') {
    console.log('openloot v1.0.0');
    process.exit(0);
  }
  
  // Treat non-flag arguments as search query
  if (!arg?.startsWith('-')) {
    initialQuery = args.slice(i).join(' ');
    break;
  }
}

render(<App initialQuery={initialQuery} />, {
  patchConsole: true,
});
