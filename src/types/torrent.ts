export interface Torrent {
  id: string;
  name: string;
  info_hash: string;
  size: string;
  raw_size: number;
  seeders: number;
  leechers: number;
  uploaded: string;
  raw_uploaded: number;
  category: number;
  imdb?: string;
  magnet: string;
}

export interface SearchOptions {
  query: string;
  category?: number;
  page?: number;
}

export interface SortOption {
  key: keyof Torrent;
  reverse: boolean;
}

export type SortKey = 
  | 'TitleDsc' | 'TitleAsc'
  | 'DateDsc' | 'DateAsc'
  | 'SizeDsc' | 'SizeAsc'
  | 'SeedersDsc' | 'SeedersAsc'
  | 'LeechersDsc' | 'LeechersAsc'
  | 'CategoryDsc' | 'CategoryAsc'
  | 'Default';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export interface AppState {
  query: string;
  results: Torrent[];
  selectedIndex: number;
  isLoading: boolean;
  error: string | null;
  toasts: ToastMessage[];
  showHelp: boolean;
  focusedElement: 'search' | 'list';
}
