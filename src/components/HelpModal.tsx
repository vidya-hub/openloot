import React from 'react';
import { Box, Text, useInput } from 'ink';
import { theme } from '../lib/theme.js';

interface HelpModalProps {
  onClose: () => void;
}

const shortcuts = [
  { key: '/', action: 'Focus search' },
  { key: 'Esc', action: 'Focus list / Close help' },
  { key: 'j / ↓', action: 'Next torrent' },
  { key: 'k / ↑', action: 'Previous torrent' },
  { key: 'g', action: 'Go to first' },
  { key: 'G', action: 'Go to last' },
  { key: 'm', action: 'Show magnet link' },
  { key: 'c', action: 'Copy magnet link' },
  { key: 'o', action: 'Open magnet in browser' },
  { key: 's', action: 'Save .magnet file' },
  { key: '?', action: 'Toggle help' },
  { key: 'q', action: 'Quit' },
];

export function HelpModal({ onClose }: HelpModalProps) {
  useInput((input, key) => {
    if (key.escape || input === '?' || input === 'q') {
      onClose();
    }
  });

  return (
    <Box flexDirection="column" alignItems="center" justifyContent="center" padding={2}>
      <Box
        flexDirection="column"
        borderStyle="double"
        borderColor={theme.colors.primary}
        paddingX={2}
        paddingY={1}
      >
        <Text color={theme.colors.primary} bold>⌨️  Keyboard Shortcuts</Text>
        <Text color={theme.colors.border.default}>{'─'.repeat(36)}</Text>

        {shortcuts.map(({ key, action }) => (
          <Box key={key}>
            <Text color={theme.colors.warning}>{key.padEnd(12)}</Text>
            <Text>{action}</Text>
          </Box>
        ))}

        <Text color={theme.colors.border.default}>{'─'.repeat(36)}</Text>
        <Text color={theme.colors.text.muted}>Press ESC or ? to close</Text>
      </Box>
    </Box>
  );
}
