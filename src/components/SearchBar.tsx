import React, { memo, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { theme } from '../lib/theme.js';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (query: string) => void;
  focused: boolean;
  onEscape?: () => void;
}

export const SearchBar = memo(function SearchBar({ value, onChange, onSubmit, focused, onEscape }: SearchBarProps) {
  const handleSubmit = useCallback(() => {
    if (value.trim()) {
      onSubmit(value.trim());
    }
  }, [value, onSubmit]);

  useInput((input, key) => {
    if (key.escape && onEscape) {
      onEscape();
    }
  }, { isActive: focused });

  return (
    <Box
      borderStyle={focused ? 'double' : 'single'}
      borderColor={focused ? theme.colors.primary : theme.colors.border.default}
      paddingX={1}
      width="100%"
    >
      <Text color={theme.colors.primary}>🔍 </Text>
      {focused ? (
        <TextInput
          value={value}
          onChange={onChange}
          onSubmit={handleSubmit}
          placeholder="Type to search torrents..."
        />
      ) : (
        <Text color={value ? theme.colors.text.primary : theme.colors.text.muted}>
          {value || 'Press / to search...'}
        </Text>
      )}
    </Box>
  );
});
