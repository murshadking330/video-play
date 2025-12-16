import React, { useState } from 'react';
import { MOCK_VIDEOS, MOCK_ANALYTICS } from './constants';
import { Video } from './types';
import { VideoCard } from './components/VideoCard';
import { UploadModal } from './components/UploadModal';
import { Button } from './components/Button';
import { AnalyticsChart } from './components/AnalyticsChart';
import { Plus, LayoutGrid, BarChart2, Video as VideoIcon, Search, User } from 'lucide-react';

const App: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [activeTab, setActiveTab] = useState<'library' | 'analytics'>('library');

  const handleUpload = (newVideo: Video) => {
    setVideos([newVideo, ...videos]);
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => { setSelectedVideo(null); setActiveTab('library'); }}>
              <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-2 rounded-lg">
                <VideoIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                VidSphere
              </span>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 bg-slate-800 border border-slate-700 rounded-full py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Search videos, creators, or tags..."
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="primary" 
                size="sm" 
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setIsUploadModalOpen(true)}
              >
                Upload
              </Button>
              <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 hover:border-indigo-400 cursor-pointer transition-colors">
                <User className="w-5 h-5 text-slate-300" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {selectedVideo ? (
          // Video Player View
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Button 
              variant="ghost" 
              className="mb-4 pl-0 hover:bg-transparent hover:text-indigo-400"
              onClick={() => setSelectedVideo(null)}
            >
              ← Back to Library
            </Button>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Player Column */}
              <div className="lg:col-span-2 space-y-6">
                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl shadow-indigo-900/20 border border-slate-800">
                  <video 
                    src={selectedVideo.url} 
                    controls 
                    className="w-full h-full"
                    autoPlay
                  />
                </div>
                
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">{selectedVideo.metadata.title}</h1>
                  <div className="flex items-center justify-between text-slate-400 text-sm mb-4">
                    <span>{selectedVideo.views.toLocaleString()} views • {new Date(selectedVideo.createdAt).toLocaleDateString()}</span>
                    <div className="flex space-x-4">
                      <span className="cursor-pointer hover:text-pink-500 transition-colors">👍 {selectedVideo.likes}</span>
                      <span className="cursor-pointer hover:text-white transition-colors">Share</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                     <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {selectedVideo.metadata.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedVideo.metadata.tags.map(tag => (
                        <span key={tag} className="text-xs bg-slate-800 text-indigo-400 px-2 py-1 rounded-full border border-slate-700">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar / Recommended */}
              <div className="lg:col-span-1 space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Up Next</h3>
                {videos.filter(v => v.id !== selectedVideo.id).map(video => (
                  <div 
                    key={video.id} 
                    className="flex space-x-3 group cursor-pointer p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-slate-900 flex-shrink-0">
                      <img src={video.thumbnailUrl} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white line-clamp-2 group-hover:text-indigo-400 transition-colors">
                        {video.metadata.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">{video.author}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{video.views} views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Dashboard View
          <>
            {/* Tabs */}
            <div className="flex space-x-1 bg-slate-900/50 p-1 rounded-lg w-fit mb-8 border border-slate-800">
              <button
                onClick={() => setActiveTab('library')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'library' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <LayoutGrid className="w-4 h-4 mr-2" />
                Library
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'analytics' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BarChart2 className="w-4 h-4 mr-2" />
                Analytics
              </button>
            </div>

            {activeTab === 'library' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {videos.map((video) => (
                  <VideoCard key={video.id} video={video} onClick={handleVideoClick} />
                ))}
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white">Channel Analytics</h2>
                  <p className="text-slate-400 text-sm">Overview of your content performance over the last 7 days.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <p className="text-slate-400 text-sm font-medium">Total Views</p>
                    <p className="text-3xl font-bold text-white mt-1">14.2K</p>
                    <span className="text-emerald-400 text-xs font-medium flex items-center mt-2">
                      ↑ 12% vs last week
                    </span>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <p className="text-slate-400 text-sm font-medium">Total Likes</p>
                    <p className="text-3xl font-bold text-white mt-1">845</p>
                    <span className="text-emerald-400 text-xs font-medium flex items-center mt-2">
                      ↑ 5% vs last week
                    </span>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <p className="text-slate-400 text-sm font-medium">Watch Time</p>
                    <p className="text-3xl font-bold text-white mt-1">48.5h</p>
                    <span className="text-rose-400 text-xs font-medium flex items-center mt-2">
                      ↓ 2% vs last week
                    </span>
                  </div>
                </div>
                <AnalyticsChart data={MOCK_ANALYTICS} />
              </div>
            )}
          </>
        )}
      </main>

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onUpload={handleUpload}
      />
    </div>
  );
};

export default App;
