export type APKCategory =
  | 'Apps'
  | 'Games'
  | 'Tools'
  | 'Productivity'
  | 'Social'
  | 'Entertainment'
  | 'Media';

export type ThemeMode = 'dark' | 'light';

export interface APKItem {
  id: string;
  title: string;
  packageName: string;
  version: string;
  size: string;
  sizeBytes: number;
  category: APKCategory;
  developer: string;
  minAndroid: string;
  iconUrl: string;
  downloadCount: number;
  rating: number;
  ratingCount: number;
  description: string;
  changelog?: string;
  screenshots: string[];
  fileUrl?: string;
  uploadedAt: string;
  isVerified: boolean;
  verifiedBy?: string;
  downloadSpeedScore?: string;
  tags?: string[];
  architecture?: string; // e.g., "arm64-v8a", "universal"
}

export interface APKComment {
  id: string;
  apkId: string;
  author: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface ServerStats {
  totalApks: number;
  totalDownloads: number;
  serverSpeedMbps: number;
  uptimePercentage: number;
}
