import type { Torrent, SearchOptions, SortKey } from '../types/torrent';
import { config } from './config';
import { sortResults } from '../data/sorts';

interface ApiResponse {
  id: string;
  name: string;
  info_hash: string;
  leechers: string;
  seeders: string;
  num_files: string;
  size: string;
  username: string;
  added: string;
  status: string;
  category: string;
  imdb: string;
}

function prettySize(size: number): string {
  const ranges: [string, number][] = [
    ['PiB', 1125899906842624],
    ['TiB', 1099511627776],
    ['GiB', 1073741824],
    ['MiB', 1048576],
    ['KiB', 1024],
  ];

  for (const [unit, value] of ranges) {
    if (size >= value) {
      return `${(size / value).toFixed(1)} ${unit}`;
    }
  }
  return `${size} B`;
}

function prettyDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toISOString().slice(0, 16).replace('T', ' ');
}

function buildMagnet(name: string, infoHash: string): string {
  return `magnet:?xt=urn:btih:${infoHash}&dn=${encodeURIComponent(name)}`;
}

function parseResponse(data: ApiResponse[]): Torrent[] {
  // Check for "No results" response
  if (data.length === 1 && data[0]?.name === 'No results returned') {
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    name: item.name,
    info_hash: item.info_hash,
    raw_size: parseInt(item.size, 10),
    size: prettySize(parseInt(item.size, 10)),
    seeders: parseInt(item.seeders, 10),
    leechers: parseInt(item.leechers, 10),
    raw_uploaded: parseInt(item.added, 10),
    uploaded: prettyDate(parseInt(item.added, 10)),
    category: parseInt(item.category, 10),
    imdb: item.imdb || undefined,
    magnet: buildMagnet(item.name, item.info_hash),
  }));
}

export async function searchTorrents(
  options: SearchOptions,
  sortKey: SortKey = 'Default',
  mirror: string = config.defaultMirror,
): Promise<Torrent[]> {
  const { query, category = 0 } = options;

  const url = `${mirror}/q.php?q=${encodeURIComponent(query)}&cat=${category}`;

  const response = await fetch(url, {
    headers: config.defaultHeaders,
    signal: AbortSignal.timeout(config.defaultTimeout),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as ApiResponse[];
  const results = parseResponse(data);

  return sortResults(results, sortKey);
}

export async function getTopTorrents(
  category: number = 0,
  sortKey: SortKey = 'Default',
  mirror: string = config.defaultMirror,
): Promise<Torrent[]> {
  const cat = category === 0 ? 'all' : category;
  const url = `${mirror}/precompiled/data_top100_${cat}.json`;

  const response = await fetch(url, {
    headers: config.defaultHeaders,
    signal: AbortSignal.timeout(config.defaultTimeout),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as ApiResponse[];
  const results = parseResponse(data);

  return sortResults(results, sortKey);
}

export async function getRecentTorrents(
  page: number = 0,
  sortKey: SortKey = 'Default',
  mirror: string = config.defaultMirror,
): Promise<Torrent[]> {
  const url = `${mirror}/precompiled/data_top100_recent_${page}.json`;

  const response = await fetch(url, {
    headers: config.defaultHeaders,
    signal: AbortSignal.timeout(config.defaultTimeout),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as ApiResponse[];
  const results = parseResponse(data);

  return sortResults(results, sortKey);
}

export { prettySize, prettyDate, buildMagnet };
