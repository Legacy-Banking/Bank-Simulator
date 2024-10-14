// components/YouTubeVideo.tsx
import React from 'react';

interface YouTubeVideoProps {
    videoUrl: string;
}

const YouTubeVideo: React.FC<YouTubeVideoProps> = ({ videoUrl }) => {
    // Extract the video ID from the YouTube URL
    const videoId = videoUrl.split('v=')[1]?.split('&')[0];

    if (!videoId) {
        return <p>Invalid YouTube URL</p>;
    }

    return (
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', maxWidth: '95%', margin: '0 auto' }}>
            <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}`}
                frameBorder="0"
                allowFullScreen
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '12px',
                }}
            />
        </div>
    );
};

export default YouTubeVideo;
