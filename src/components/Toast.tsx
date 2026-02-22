import React, { useEffect, useRef, memo } from 'react';
import { Box, Text } from 'ink';
import type { ToastMessage } from '../types/torrent.js';
import { theme } from '../lib/theme.js';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

function getToastStyle(type: ToastMessage['type']) {
  switch (type) {
    case 'success':
      return { icon: '✓', color: theme.colors.success };
    case 'error':
      return { icon: '✗', color: theme.colors.error };
    case 'warning':
      return { icon: '⚠', color: theme.colors.warning };
    case 'info':
    default:
      return { icon: 'ℹ', color: theme.colors.primary };
  }
}

const ToastItem = memo(function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: string) => void }) {
  const style = getToastStyle(toast.type);

  // Use a ref so the timer callback always calls the latest onDismiss
  // without resetting the timer on every parent re-render
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    const duration = toast.duration ?? 3000;
    const timer = setTimeout(() => {
      onDismissRef.current(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration]);

  return (
    <Box
      borderStyle="single"
      borderColor={style.color}
      paddingX={1}
      marginBottom={1}
    >
      <Text color={style.color}>{style.icon} </Text>
      <Text>{toast.message}</Text>
    </Box>
  );
});

export const Toast = memo(function Toast({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <Box flexDirection="column" marginTop={1}>
      {toasts.slice(-3).map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
        />
      ))}
    </Box>
  );
});
