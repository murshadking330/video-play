import { AnalyticsData, Video } from "./types";

export const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://picsum.photos/seed/bunny/640/360',
    metadata: {
      title: 'Big Buck Bunny',
      description: 'A classic short film about a giant rabbit with a heart of gold and a temper to match.',
      tags: ['animation', 'short', 'funny']
    },
    createdAt: Date.now() - 10000000,
    views: 12543,
    likes: 842,
    author: 'Blender Foundation'
  },
  {
    id: '2',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://picsum.photos/seed/elephant/640/360',
    metadata: {
      title: 'Elephants Dream',
      description: 'The first open movie from the Blender Institute. A journey into the machine.',
      tags: ['sci-fi', 'surreal', '3d']
    },
    createdAt: Date.now() - 20000000,
    views: 8432,
    likes: 521,
    author: 'Orange Team'
  },
  {
    id: '3',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://picsum.photos/seed/fire/640/360',
    metadata: {
      title: 'For Bigger Blazes',
      description: 'High definition footage of fire and flames, perfect for background visuals.',
      tags: ['nature', 'fire', '4k']
    },
    createdAt: Date.now() - 5000000,
    views: 3201,
    likes: 150,
    author: 'Google'
  }
];

export const MOCK_ANALYTICS: AnalyticsData[] = [
  { day: 'Mon', views: 1200, likes: 120 },
  { day: 'Tue', views: 1900, likes: 180 },
  { day: 'Wed', views: 1500, likes: 140 },
  { day: 'Thu', views: 2400, likes: 240 },
  { day: 'Fri', views: 3100, likes: 350 },
  { day: 'Sat', views: 3800, likes: 410 },
  { day: 'Sun', views: 4200, likes: 450 },
];
