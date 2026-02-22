/**
 * Cyberpunk-inspired theme for the TUI
 * Colors inspired by neon terminals and retro-futuristic aesthetics
 */

export const theme = {
  colors: {
    // Primary accents
    primary: '#00f3ff',      // Bright cyan - main accent
    secondary: '#ff00ff',    // Magenta - secondary accent
    success: '#00ff41',      // Matrix green
    warning: '#ffb700',      // Amber/gold
    error: '#ff0055',        // Hot pink/red
    
    // Text hierarchy
    text: {
      primary: '#ffffff',    // White - main text
      secondary: '#a0a0a0',  // Gray - secondary info
      muted: '#666666',      // Dim gray - less important
      accent: '#00f3ff',     // Cyan - highlighted text
    },
    
    // Backgrounds
    bg: {
      primary: '#0a0a1a',    // Deep dark blue
      secondary: '#1a1a2e',  // Slightly lighter
      tertiary: '#16213e',   // Card background
      selected: '#0f3460',   // Selected item
    },
    
    // Borders
    border: {
      default: '#333355',    // Subtle border
      active: '#00f3ff',     // Active/selected border
      muted: '#222244',      // Very subtle border
    },
    
    // Health indicators (for seeders/leechers)
    health: {
      excellent: '#00ff41',  // 100+ seeders
      good: '#7fff00',       // 50+ seeders
      moderate: '#ffff00',   // 20+ seeders
      poor: '#ff8c00',       // 5+ seeders
      dead: '#ff0055',       // <5 seeders
    },
    
    // Category colors
    category: {
      video: '#ff6b6b',      // Red-ish
      audio: '#4ecdc4',      // Teal
      games: '#95e1d3',      // Mint
      applications: '#a8e6cf', // Light green
      other: '#dda0dd',      // Plum
    },
  },
  
  // Spacing units
  spacing: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
  },
  
  // Border styles
  borders: {
    none: 'none',
    single: 'single',
    double: 'double',
    rounded: 'round',
    bold: 'bold',
  },
  
  // Icons (unicode)
  icons: {
    // Status
    loading: '⏳',
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ',
    
    // Navigation
    selected: '▸',
    unselected: ' ',
    arrow: {
      up: '↑',
      down: '↓',
      left: '←',
      right: '→',
    },
    
    // Torrent specific
    seeder: '▲',
    leecher: '▼',
    size: '◉',
    date: '◷',
    category: '▣',
    magnet: '⚡',
    
    // Health bar
    bar: {
      filled: '█',
      half: '▓',
      empty: '░',
    },
    
    // Decorative
    bullet: '•',
    separator: '│',
    dot: '·',
  },
} as const;

// Helper functions
export function getHealthColor(seeders: number): string {
  if (seeders >= 100) return theme.colors.health.excellent;
  if (seeders >= 50) return theme.colors.health.good;
  if (seeders >= 20) return theme.colors.health.moderate;
  if (seeders >= 5) return theme.colors.health.poor;
  return theme.colors.health.dead;
}

export function getCategoryColor(category: string): string {
  const lowerCat = category.toLowerCase();
  if (lowerCat.includes('video')) return theme.colors.category.video;
  if (lowerCat.includes('audio')) return theme.colors.category.audio;
  if (lowerCat.includes('game')) return theme.colors.category.games;
  if (lowerCat.includes('app')) return theme.colors.category.applications;
  return theme.colors.category.other;
}

export function formatSize(size: string): string {
  return size.replace(/\s+/g, '');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '…';
}
