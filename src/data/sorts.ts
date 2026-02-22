import type { Torrent, SortKey } from '../types/torrent';

interface SortConfig {
  id: number;
  key: keyof Torrent;
  reverse: boolean;
}

export const sorts: Record<SortKey, SortConfig> = {
  TitleDsc: { id: 1, key: 'name', reverse: true },
  TitleAsc: { id: 2, key: 'name', reverse: false },
  DateDsc: { id: 3, key: 'raw_uploaded', reverse: true },
  DateAsc: { id: 4, key: 'raw_uploaded', reverse: false },
  SizeDsc: { id: 5, key: 'raw_size', reverse: true },
  SizeAsc: { id: 6, key: 'raw_size', reverse: false },
  SeedersDsc: { id: 7, key: 'seeders', reverse: true },
  SeedersAsc: { id: 8, key: 'seeders', reverse: false },
  LeechersDsc: { id: 9, key: 'leechers', reverse: true },
  LeechersAsc: { id: 10, key: 'leechers', reverse: false },
  CategoryDsc: { id: 13, key: 'category', reverse: true },
  CategoryAsc: { id: 14, key: 'category', reverse: false },
  Default: { id: 99, key: 'seeders', reverse: true },
};

export function sortResults(results: Torrent[], sortKey: SortKey = 'Default'): Torrent[] {
  const config = sorts[sortKey];
  return [...results].sort((a, b) => {
    const aVal = a[config.key];
    const bVal = b[config.key];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return config.reverse 
        ? bVal.localeCompare(aVal)
        : aVal.localeCompare(bVal);
    }
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return config.reverse ? bVal - aVal : aVal - bVal;
    }
    
    return 0;
  });
}
