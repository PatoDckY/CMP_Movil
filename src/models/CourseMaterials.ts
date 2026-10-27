export type MaterialsStatus = 'no_iniciado' | 'finalizado' | 'sin_materiales' | 'disponible';

export interface CourseMaterials {
  enrollmentId: number;
  courseId: number;
  status: MaterialsStatus;
  url?: string;
}

// Defense in depth; authorization and course dates remain the server's decision.
export function isDriveFolderUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 2048 || !/^https:\/\//i.test(value) || /[\s\\]/.test(value) ||
    Array.from(value).some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) {return false;}
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.hostname !== 'drive.google.com' || url.port || url.username || url.password || url.hash ||
      !/^\/drive\/(?:u\/\d+\/)?folders\/[A-Za-z0-9_-]+\/?$/.test(url.pathname)) {return false;}
    const seen = new Set<string>();
    for (const [key, item] of url.searchParams) {
      if (seen.has(key) || !['usp', 'resourcekey'].includes(key) || !/^[A-Za-z0-9_-]{1,256}$/.test(item)) {return false;}
      seen.add(key);
    }
    return true;
  } catch { return false; }
}
