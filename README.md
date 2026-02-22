# 🏴‍☠️ openloot

[![npm version](https://img.shields.io/npm/v/openloot.svg)](https://www.npmjs.com/package/openloot)
[![license](https://img.shields.io/npm/l/openloot.svg)](https://github.com/vidya-hub/openloot/blob/main/LICENSE)
[![bun](https://img.shields.io/badge/Bun-%23000000.svg?style=flat&logo=bun&logoColor=white)](https://bun.sh)

A modern, cyberpunk-themed terminal UI for searching torrents. Search, browse, and grab magnet links with ease, even over SSH.

## Features

- **TUI Search**: Fast, interactive search powered by [apibay.org](https://apibay.org).
- **Keyboard-First**: Optimized for vim-like navigation and rapid usage.
- **Cyberpunk Theme**: High-contrast neon interface (Cyan/Magenta/Green).
- **SSH-Friendly**: Built-in support for remote terminal environments.
- **Smart Clipboard**: OSC 52 support for copying to your local machine from SSH, with fallback mechanisms.
- **Magnet Overlay**: Special mode for manual mouse-copy if your terminal doesn't support modern clipboard protocols.
- **Actionable**: Open magnet links directly in your default client or save them as `.magnet` files.

## Screenshots

<!-- Screenshots coming soon -->
*Screenshots coming soon*

## Installation
### Quick Install (Linux / macOS)
```bash
curl -fsSL https://raw.githubusercontent.com/vidya-hub/openloot/main/install.sh | sh
```

This auto-detects your OS and architecture, downloads the latest release binary, and installs it to `/usr/local/bin`.
### via npm
```bash
npm i -g openloot
```
### via bun
```bash
bun add -g openloot
```
### From Releases
Download the standalone binary for your platform from the [Releases](https://github.com/vidya-hub/openloot/releases) page:
```bash
# Example: Linux x64
curl -fsSL https://github.com/vidya-hub/openloot/releases/latest/download/openloot-linux-x64 -o openloot
chmod +x openloot
sudo mv openloot /usr/local/bin/
```

## Usage

Launch the interactive TUI:
```bash
openloot
```

Search immediately from the command line:
```bash
openloot "ubuntu 24.04"
```

### CLI Flags
- `-h, --help`: Show help message
- `-v, --version`: Show version

## Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `/` | Focus search bar |
| `Esc` | Focus results / Close help / Close magnet overlay |
| `j` / `↓` | Navigate down |
| `k` / `↑` | Navigate up |
| `g` | Go to first result |
| `G` | Go to last result |
| `m` | Show magnet link overlay (for mouse copy) |
| `c` | Copy magnet link to clipboard (OSC 52) |
| `o` | Open magnet in default application |
| `s` | Save magnet as `.magnet` file |
| `?` | Show help modal |
| `q` | Quit |

## SSH Support

`openloot` is designed to work seamlessly over SSH. 

### Clipboard Sync (OSC 52)
When you press `c`, `openloot` sends an OSC 52 escape sequence. Modern terminals catch this and sync the content to your **local machine's clipboard**, even if you're running the app on a remote server.

Supported terminals include:
- iTerm2
- WezTerm
- Alacritty
- kitty
- Windows Terminal
- xterm (with `allowWindowOps` enabled)

### Magnet Overlay
If your terminal doesn't support OSC 52, press `m` to open the **Magnet Overlay**. This displays the full magnet link in a dedicated box, allowing you to select and copy it with your mouse.

## Development

```bash
# Clone the repository
git clone https://github.com/vidya-hub/openloot.git
cd openloot

# Install dependencies
bun install

# Run in development mode (with watch)
bun run dev

# Run type checks
bun run typecheck

# Compile standalone binary
bun run compile
```

## Tech Stack

- [Bun](https://bun.sh) - JavaScript runtime & bundler
- [React 19](https://react.dev) - UI logic
- [Ink 6](https://github.com/vadimdemedes/ink) - React for CLI
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## License

MIT © [vidya-hub](https://github.com/vidya-hub)
