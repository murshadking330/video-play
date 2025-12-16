export interface VideoMetadata {
  title: string;
  description: string;
  tags: string[];
}

export interface Video {
  id: string;
  url: string;
  thumbnailUrl: string;
  metadata: VideoMetadata;
  createdAt: number;
  views: number;
  likes: number;
  author: string;
}

export interface AnalyticsData {
  day: string;
  views: number;
  likes: number;
}
