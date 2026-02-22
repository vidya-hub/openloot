import React, { useMemo, memo } from 'react';
import { Box, Text } from 'ink';
import type { Torrent } from '../types/torrent.js';
import { TorrentCard } from './TorrentCard.js';
import { theme } from '../lib/theme.js';

interface TorrentListProps {
  torrents: Torrent[];
  selectedIndex: number;
  isLoading: boolean;
  error: string | null;
  maxVisible?: number;
}

function LoadingSpinner() {
  return (
    <Box flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1}>
      <Text color={theme.colors.primary}>
        {theme.icons.loading} Searching the seven seas...
      </Text>
      <Text color={theme.colors.text.muted}>Finding treasures for you</Text>
    </Box>
  );
}

function ErrorDisplay({ message }: { message: string }) {
  return (
    <Box flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1}>
      <Box
        flexDirection="column"
        alignItems="center"
        borderStyle="single"
        borderColor={theme.colors.error}
        paddingX={2}
        paddingY={1}
      >
        <Text color={theme.colors.error}>{theme.icons.error} Connection Failed</Text>
        <Text color={theme.colors.text.secondary}>{message}</Text>
        <Text color={theme.colors.text.muted}>Press / to try a new search</Text>
      </Box>
    </Box>
  );
}

function WelcomeScreen() {
  return (
    <Box flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1}>
      <Box
        flexDirection="column"
        alignItems="center"
        borderStyle="double"
        borderColor={theme.colors.primary}
        paddingX={2}
        paddingY={1}
      >
        <Text color={theme.colors.primary} bold>🏴‍☠️ Welcome to OpenLoot!</Text>
        <Text color={theme.colors.text.secondary}>Press / to start searching</Text>
        <Box flexDirection="column" marginTop={1}>
          <Text color={theme.colors.text.muted}>{theme.icons.bullet} j/k to navigate</Text>
          <Text color={theme.colors.text.muted}>{theme.icons.bullet} m to show magnet</Text>
          <Text color={theme.colors.text.muted}>{theme.icons.bullet} o to open torrent</Text>
          <Text color={theme.colors.text.muted}>{theme.icons.bullet} ? for help</Text>
        </Box>
      </Box>
    </Box>
  );
}

const ScrollIndicator = memo(function ScrollIndicator({ current, total, maxVisible }: { current: number; total: number; maxVisible: number }) {
  if (total <= maxVisible) return null;
  
  const scrollPercent = total > 1 ? current / (total - 1) : 0;
  const barHeight = Math.max(3, maxVisible);
  const thumbPosition = Math.round(scrollPercent * (barHeight - 1));
  
  return (
    <Box flexDirection="column" marginLeft={1}>
      {Array.from({ length: barHeight }).map((_, i) => (
        <Text key={i} color={i === thumbPosition ? theme.colors.primary : theme.colors.border.muted}>
          {i === thumbPosition ? '█' : '░'}
        </Text>
      ))}
    </Box>
  );
});

export const TorrentList = memo(function TorrentList({ torrents, selectedIndex, isLoading, error, maxVisible = 5 }: TorrentListProps) {
  const visibleTorrents = useMemo(() => {
    if (torrents.length === 0) return [];
    
    const halfVisible = Math.floor(maxVisible / 2);
    let start = Math.max(0, selectedIndex - halfVisible);
    let end = start + maxVisible;
    
    if (end > torrents.length) {
      end = torrents.length;
      start = Math.max(0, end - maxVisible);
    }
    
    return torrents.slice(start, end).map((torrent, i) => ({
      torrent,
      originalIndex: start + i,
    }));
  }, [torrents, selectedIndex, maxVisible]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (torrents.length === 0) {
    return <WelcomeScreen />;
  }

  return (
    <Box flexDirection="row" width="100%">
      <Box flexDirection="column" flexGrow={1}>
        {visibleTorrents.map(({ torrent, originalIndex }) => (
          <TorrentCard
            key={torrent.id || originalIndex}
            torrent={torrent}
            selected={originalIndex === selectedIndex}
            index={originalIndex}
          />
        ))}
      </Box>
      <ScrollIndicator current={selectedIndex} total={torrents.length} maxVisible={maxVisible} />
    </Box>
  );
});
