import React, { useState, useRef } from 'react';
import { X, Upload, Wand2, Film, Tag } from 'lucide-react';
import { Button } from './Button';
import { extractFrameFromVideo, cleanBase64 } from '../utils/videoUtils';
import { generateVideoMetadata } from '../services/geminiService';
import { Video, VideoMetadata } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (video: Video) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailBase64, setThumbnailBase64] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Metadata state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      
      // Auto-extract frame
      try {
        const frameDataUrl = await extractFrameFromVideo(selectedFile);
        setThumbnailBase64(frameDataUrl);
      } catch (err) {
        console.error("Failed to extract frame", err);
      }
    }
  };

  const handleGenerateMetadata = async () => {
    if (!thumbnailBase64) return;
    setIsGenerating(true);
    try {
      const cleanData = cleanBase64(thumbnailBase64);
      const metadata = await generateVideoMetadata(cleanData);
      setTitle(metadata.title);
      setDescription(metadata.description);
      setTags(metadata.tags.join(', '));
    } catch (error) {
      console.error(error);
      alert("Failed to generate metadata. Check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    if (!file || !previewUrl) return;

    const newVideo: Video = {
      id: Math.random().toString(36).substr(2, 9),
      url: previewUrl,
      thumbnailUrl: thumbnailBase64 || 'https://picsum.photos/640/360',
      metadata: {
        title: title || file.name,
        description: description || 'No description provided.',
        tags: tags.split(',').map(t => t.trim()).filter(Boolean)
      },
      createdAt: Date.now(),
      views: 0,
      likes: 0,
      author: 'You'
    };

    onUpload(newVideo);
    handleClose();
  };

  const handleClose = () => {
    setFile(null);
    setPreviewUrl(null);
    setThumbnailBase64(null);
    setTitle('');
    setDescription('');
    setTags('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Upload className="w-5 h-5 mr-2 text-indigo-500" />
            Upload Video
          </h2>
          <button onClick={handleClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {!file ? (
            <div 
              className="border-2 border-dashed border-slate-700 rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-slate-800/50 transition-all group"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="p-4 bg-slate-800 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-indigo-500" />
              </div>
              <p className="text-lg font-medium text-slate-300">Click to upload video</p>
              <p className="text-sm text-slate-500 mt-2">MP4, WebM up to 50MB</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="video/*" 
                className="hidden" 
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Preview */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-slate-700">
                <video src={previewUrl!} className="w-full h-full object-contain" controls />
              </div>

              {/* AI Button */}
              <div className="flex justify-end">
                <Button 
                  onClick={handleGenerateMetadata} 
                  isLoading={isGenerating}
                  variant="outline"
                  size="sm"
                  leftIcon={<Wand2 className="w-4 h-4" />}
                  className="bg-indigo-500/10 border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300"
                >
                  Generate Metadata with AI
                </Button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Film className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="block w-full pl-10 bg-slate-800 border-slate-700 rounded-lg text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-slate-500 py-2.5"
                      placeholder="My Awesome Video"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="block w-full bg-slate-800 border-slate-700 rounded-lg text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-slate-500 py-2"
                    placeholder="Tell viewers about your video..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Tags (comma separated)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="block w-full pl-10 bg-slate-800 border-slate-700 rounded-lg text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-slate-500 py-2.5"
                      placeholder="travel, vlog, funny"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex justify-end space-x-3 bg-slate-900">
          <Button variant="ghost" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!file}>Publish Video</Button>
        </div>
      </div>
    </div>
  );
};
