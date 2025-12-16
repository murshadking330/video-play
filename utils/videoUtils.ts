/**
 * Extracts a frame from a video file at a specific time (default 1s).
 * Returns the frame as a base64 string (data URL).
 */
export const extractFrameFromVideo = async (videoFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    // Create a URL for the video file
    const url = URL.createObjectURL(videoFile);
    video.src = url;
    video.muted = true;
    video.crossOrigin = 'anonymous';
    
    // We need to wait for metadata to know video dimensions, then seek
    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      // Seek to 1 second to likely get a non-black frame
      video.currentTime = 1.0;
    };

    video.onseeked = () => {
      try {
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataURL = canvas.toDataURL('image/jpeg', 0.8);
        URL.revokeObjectURL(url); // Clean up
        resolve(dataURL);
      } catch (error) {
        reject(error);
      }
    };

    video.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(new Error('Error loading video'));
    };
  });
};

/**
 * Strips the data:image/xyz;base64, prefix from a data URL.
 */
export const cleanBase64 = (dataUrl: string): string => {
  return dataUrl.split(',')[1];
};
