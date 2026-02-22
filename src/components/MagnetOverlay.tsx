import React from 'react';
import { Box, Text, useInput, useStdout } from 'ink';
import type { Torrent } from '../types/torrent.js';
import { theme } from '../lib/theme.js';

interface MagnetOverlayProps {
  torrent: Torrent;
  onClose: () => void;
}

export function MagnetOverlay({ torrent, onClose }: MagnetOverlayProps) {
  const { stdout } = useStdout();
  const termWidth = stdout?.columns ?? 80;
  const contentWidth = Math.min(termWidth - 4, 100);
  const innerWidth = contentWidth - 4;

  useInput((input, key) => {
    if (key.escape || input === 'x' || input === 'X') {
      onClose();
    }
  });

  const magnetLink = torrent.magnet;
  const lines: string[] = [];
  for (let i = 0; i < magnetLink.length; i += innerWidth) {
    lines.push(magnetLink.slice(i, i + innerWidth));
  }

  return (
    <Box flexDirection="column" alignItems="center" justifyContent="center" padding={1}>
      <Box
        flexDirection="column"
        borderStyle="double"
        borderColor={theme.colors.primary}
        paddingX={1}
        paddingY={1}
        width={contentWidth}
      >
        <Box justifyContent="space-between">
          <Text color={theme.colors.primary} bold>{theme.icons.magnet} Magnet Link</Text>
          <Text color={theme.colors.text.muted}>[x/Esc] close</Text>
        </Box>

        <Text color={theme.colors.border.default}>{'─'.repeat(innerWidth)}</Text>

        <Text color={theme.colors.text.secondary} bold>
          {torrent.name}
        </Text>

        <Box marginTop={1} />

        <Box
          flexDirection="column"
          borderStyle="single"
          borderColor={theme.colors.border.muted}
          paddingX={1}
        >
          {lines.map((line, i) => (
            <Text key={i} color={theme.colors.warning}>{line}</Text>
          ))}
        </Box>

        <Box marginTop={1} />

        <Text color={theme.colors.text.muted}>
          Select the link above with your mouse to copy in SSH terminal
        </Text>
      </Box>
    </Box>
  );
}