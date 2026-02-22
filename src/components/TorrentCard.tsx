import React, { memo } from 'react';
import { Box, Text } from 'ink';
import type { Torrent } from '../types/torrent.js';
import { getCategoryName } from '../lib/config.js';
import { theme, getHealthColor, getCategoryColor, truncateText } from '../lib/theme.js';

interface TorrentCardProps {
  torrent: Torrent;
  selected: boolean;
  index: number;
  width?: number;
}

function getHealthBar(seeders: number, leechers: number): string {
  const total = seeders + leechers;
  if (total === 0) return theme.icons.bar.empty.repeat(5);
  
  const ratio = seeders / total;
  const filledCount = Math.round(ratio * 5);
  const emptyCount = 5 - filledCount;
  
  return theme.icons.bar.filled.repeat(filledCount) + theme.icons.bar.empty.repeat(emptyCount);
}

function formatNumber(num: number): string {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return String(num);
}

export const TorrentCard = memo(function TorrentCard({ torrent, selected, index, width = 80 }: TorrentCardProps) {
  const healthColor = getHealthColor(torrent.seeders);
  const healthBar = getHealthBar(torrent.seeders, torrent.leechers);
  const category = getCategoryName(torrent.category);
  const categoryColor = getCategoryColor(category);
  const borderColor = selected ? theme.colors.primary : theme.colors.border.muted;

  const titleMaxLen = Math.max(width - 10, 30);
  return (
    <Box
      flexDirection="column"
      borderStyle={selected ? 'double' : 'single'}
      borderColor={borderColor}
      paddingX={1}
      width="100%"
    >
      <Box>
        <Text color={selected ? theme.colors.primary : theme.colors.text.muted}>
          {selected ? '▸ ' : '  '}{String(index + 1).padStart(2, '0')} 
        </Text>
        <Text color={selected ? theme.colors.text.accent : theme.colors.text.primary} bold={selected}>
          {truncateText(torrent.name, titleMaxLen)}
        </Text>
      </Box>
      <Box gap={1}>
        <Text color={categoryColor} bold>
          {(category.split('/').pop() || 'Unknown').padEnd(10)}
        </Text>
        <Text color={theme.colors.text.muted}>{theme.icons.size}</Text>
        <Text color={theme.colors.secondary}>{torrent.size.padEnd(9)}</Text>
        <Text color={theme.colors.success}>{theme.icons.seeder}</Text>
        <Text color={theme.colors.success}>{formatNumber(torrent.seeders).padStart(5)}</Text>
        <Text color={theme.colors.text.muted}>/</Text>
        <Text color={theme.colors.error}>{formatNumber(torrent.leechers).padStart(5)}</Text>
        <Text color={theme.colors.error}>{theme.icons.leecher}</Text>
        <Text color={healthColor}>{healthBar}</Text>
        <Text color={theme.colors.text.muted}>{theme.icons.date}</Text>
        <Text color={theme.colors.text.secondary}>{torrent.uploaded}</Text>
      </Box>
    </Box>
  );
});
