import React from 'react';
import { Video } from '../types';
import { Play, Heart, Eye } from 'lucide-react';

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  return (
    <div 
      className="group relative bg-slate-800 rounded-xl overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-1 border border-slate-700/50"
      onClick={() => onClick(video)}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img 
          src={video.thumbnailUrl} 
          alt={video.metadata.title}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
          <div className="bg-white/20 p-3 rounded-full backdrop-blur-md">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white font-medium">
          4:20
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg line-clamp-1 mb-1 group-hover:text-indigo-400 transition-colors">
          {video.metadata.title}
        </h3>
        <p className="text-slate-400 text-sm line-clamp-2 mb-3 h-10">
          {video.metadata.description}
        </p>
        
        <div className="flex items-center justify-between text-slate-500 text-xs mt-4 border-t border-slate-700/50 pt-3">
          <div className="flex items-center space-x-3">
            <span className="flex items-center hover:text-indigo-400 transition-colors">
              <Eye className="w-3 h-3 mr-1" />
              {video.views.toLocaleString()}
            </span>
            <span className="flex items-center hover:text-pink-500 transition-colors">
              <Heart className="w-3 h-3 mr-1" />
              {video.likes.toLocaleString()}
            </span>
          </div>
          <span className="text-slate-600">
             {new Date(video.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};
