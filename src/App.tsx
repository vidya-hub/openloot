import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Box, Text, useInput, useApp, useStdout } from 'ink';
import type { Torrent, ToastMessage } from './types/torrent.js';
import { searchTorrents } from './lib/tpb.js';
import { config } from './lib/config.js';
import { theme } from './lib/theme.js';
import { SearchBar } from './components/SearchBar.js';
import { TorrentList } from './components/TorrentList.js';
import { Toast } from './components/Toast.js';
import { HelpModal } from './components/HelpModal.js';
import { MagnetOverlay } from './components/MagnetOverlay.js';

interface AppProps {
  initialQuery?: string;
}

export function App({ initialQuery = '' }: AppProps) {
  const { exit } = useApp();
  const { stdout } = useStdout();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Torrent[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [showMagnet, setShowMagnet] = useState(false);
  const [focusedElement, setFocusedElement] = useState<'search' | 'list'>('search');
  const [terminalHeight, setTerminalHeight] = useState(stdout?.rows ?? 24);

  // Debounce resize events to avoid rapid re-renders that cause flicker
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const updateSize = () => {
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(() => {
        setTerminalHeight(stdout?.rows ?? 24);
      }, 150);
    };
    stdout?.on('resize', updateSize);
    return () => {
      stdout?.off('resize', updateSize);
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
    };
  }, [stdout]);

  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setFocusedElement('list');

    try {
      const torrents = await searchTorrents({ query: searchQuery });
      setResults(torrents);
      setSelectedIndex(0);

      if (torrents.length === 0) {
        addToast('No results found', 'warning');
      } else {
        addToast(`Found ${torrents.length} torrents`, 'success');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed';
      setError(message);
      addToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  // Stable ref for handleSearch so the initial-query effect doesn't re-fire
  const handleSearchRef = useRef(handleSearch);
  handleSearchRef.current = handleSearch;

  useEffect(() => {
    if (initialQuery) {
      handleSearchRef.current(initialQuery);
    }
  }, [initialQuery]);

  const openMagnet = useCallback(async () => {
    const torrent = results[selectedIndex];
    if (!torrent) return;

    try {
      const openCmd = process.platform === 'darwin' ? 'open' : 'xdg-open';
      Bun.spawn([openCmd, torrent.magnet]);
      addToast('Opening magnet link...', 'info');
    } catch {
      addToast('Failed to open magnet', 'error');
    }
  }, [results, selectedIndex, addToast]);

  const saveMagnet = useCallback(async () => {
    const torrent = results[selectedIndex];
    if (!torrent) return;

    try {
      const filename = torrent.name.replace(/[/\\]/g, '_') + '.magnet';
      await Bun.write(filename, torrent.magnet + '\n');
      addToast(`Saved ${filename}`, 'success');
    } catch {
      addToast('Failed to save magnet', 'error');
    }
  }, [results, selectedIndex, addToast]);


  const copyMagnet = useCallback(async () => {
    const torrent = results[selectedIndex];
    if (!torrent) return;
    // 1. Try OSC 52 — works over SSH in modern terminals
    //    (iTerm2, WezTerm, Alacritty, kitty, Windows Terminal, xterm)
    const encoded = Buffer.from(torrent.magnet).toString('base64');
    process.stdout.write(`\x1b]52;c;${encoded}\x07`);
    // 2. Also try local clipboard command as fallback
    //    (covers GNOME Terminal, Konsole, Terminal.app when running locally)
    try {
      const platform = process.platform;
      let cmd: string[];

      if (platform === 'darwin') {
        cmd = ['pbcopy'];
      } else if (process.env.WAYLAND_DISPLAY) {
        cmd = ['wl-copy'];
      } else {
        cmd = ['xclip', '-selection', 'clipboard'];
      }

      const proc = Bun.spawn(cmd, {
        stdin: new Response(torrent.magnet).body,
        stderr: 'ignore',
      });
      await proc.exited;
    } catch {
      // Silently ignore — OSC 52 may have already worked,
      // or user can use 'm' to show + mouse-select the magnet link.
    }
    addToast('Magnet link copied!', 'success');
  }, [results, selectedIndex, addToast]);

  useInput((input, key) => {
    if (showMagnet) {
      if (key.escape || input === 'x' || input === 'X') {
        setShowMagnet(false);
      }
      return;
    }
    if (showHelp) {
      if (key.escape || input === '?') {
        setShowHelp(false);
      }
      return;
    }
    if (input === 'q' && focusedElement === 'list') {
      exit();
      return;
    }
    if (input === '?' && focusedElement === 'list') {
      setShowHelp(true);
      return;
    }
    if (input === '/' && focusedElement === 'list') {
      setFocusedElement('search');
      return;
    }
    if (focusedElement === 'list' && results.length > 0) {
      if (input === 'j' || key.downArrow) {
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (input === 'k' || key.upArrow) {
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (input === 'g') {
        setSelectedIndex(0);
      } else if (input === 'G') {
        setSelectedIndex(results.length - 1);
      } else if (input === 'm') {
        setShowMagnet(true);
      } else if (input === 'o') {
        openMagnet();
      } else if (input === 's') {
        saveMagnet();
      } else if (input === 'c') {
        copyMagnet();
      }
    }
  });

  const closeHelp = useCallback(() => setShowHelp(false), []);
  const closeMagnet = useCallback(() => setShowMagnet(false), []);
  const focusList = useCallback(() => setFocusedElement('list'), []);

  if (showMagnet && results[selectedIndex]) {
    return <MagnetOverlay torrent={results[selectedIndex]} onClose={closeMagnet} />;
  }
  if (showHelp) {
    return <HelpModal onClose={closeHelp} />;
  }

  const listHeight = Math.max(terminalHeight - 8, 5);
  const maxVisible = Math.floor(listHeight / 4);

  return (
    <Box flexDirection="column" width="100%">
      <Box
        borderStyle="round"
        borderColor={theme.colors.primary}
        paddingX={1}
        justifyContent="space-between"
      >
        <Text color={theme.colors.primary} bold>🏴‍☠️ openloot</Text>
        <Text color={theme.colors.text.muted}>v{config.version} | Press ? for help</Text>
      </Box>

      <Box marginTop={1} marginX={1}>
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={handleSearch}
          focused={focusedElement === 'search'}
          onEscape={focusList}
        />
      </Box>

      <Box marginTop={1} marginX={1} height={listHeight}>
        <TorrentList
          torrents={results}
          selectedIndex={selectedIndex}
          isLoading={isLoading}
          error={error}
          maxVisible={maxVisible}
        />
      </Box>

      <Box
        borderStyle="single"
        borderColor={theme.colors.border.default}
        paddingX={1}
        justifyContent="space-between"
      >
        <Text color={theme.colors.text.muted}>
          {results.length > 0 ? `${selectedIndex + 1}/${results.length}` : 'No results'}
        </Text>
        <Text color={theme.colors.text.muted}>
          /: search | j/k: nav | m: magnet | c: copy | q: quit
        </Text>
      </Box>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </Box>
  );
}
