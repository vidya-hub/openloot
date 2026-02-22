export const config = {
  name: 'openloot',
  defaultMirror: 'https://apibay.org',
  mirrorList: 'https://proxy-bay.app/list.txt',
  defaultTimeout: 10000,
  defaultHeaders: {
    'User-Agent': 'openloot/1.0.0',
  },
  version: '1.0.0',
};

export const categories: Record<string, number> = {
  'All': 0,
  'Applications': 300,
  'Applications/Android': 306,
  'Applications/Handheld': 304,
  'Applications/IOS': 305,
  'Applications/Mac': 302,
  'Applications/Other': 399,
  'Applications/UNIX': 303,
  'Applications/Windows': 301,
  'Audio': 100,
  'Audio/Audiobooks': 102,
  'Audio/FLAC': 104,
  'Audio/Music': 101,
  'Audio/Other': 199,
  'Audio/Soundclips': 103,
  'Games': 400,
  'Games/Android': 408,
  'Games/Handheld': 406,
  'Games/IOS': 407,
  'Games/Mac': 402,
  'Games/Other': 499,
  'Games/PC': 401,
  'Games/PSx': 403,
  'Games/Wii': 405,
  'Games/XBOX360': 404,
  'Other': 600,
  'Other/Comics': 602,
  'Other/Covers': 604,
  'Other/Ebooks': 601,
  'Other/Other': 699,
  'Other/Physibles': 605,
  'Other/Pictures': 603,
  'Video': 200,
  'Video/3D': 209,
  'Video/HD-Movies': 207,
  'Video/HD-TV': 208,
  'Video/Handheld': 206,
  'Video/Clips': 204,
  'Video/Movies': 201,
  'Video/DVDR': 202,
  'Video/Music': 203,
  'Video/Other': 299,
  'Video/TV': 205,
};

export function getCategoryName(id: number): string {
  for (const [name, catId] of Object.entries(categories)) {
    if (catId === id) return name;
  }
  return 'Unknown';
}
