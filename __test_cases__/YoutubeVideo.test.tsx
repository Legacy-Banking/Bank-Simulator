import { render, screen } from '@testing-library/react';
import YouTubeVideo from '@/components/YoutubeVideo';
import '@testing-library/jest-dom';

describe('YouTubeVideo component', () => {
  it('renders iframe when a valid YouTube URL is provided', () => {
    const validUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    
    render(<YouTubeVideo videoUrl={validUrl} />);
    
    const iframeElement = screen.getByTitle('YouTube video player');
    
    expect(iframeElement).toBeInTheDocument();
    expect(iframeElement).toHaveAttribute('src', 'https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  it('displays an error message when an invalid YouTube URL is provided', () => {
    const invalidUrl = 'https://www.invalidurl.com';
    
    render(<YouTubeVideo videoUrl={invalidUrl} />);
    
    const errorMessage = screen.getByText('Invalid YouTube URL');
    
    expect(errorMessage).toBeInTheDocument();
  });
});
