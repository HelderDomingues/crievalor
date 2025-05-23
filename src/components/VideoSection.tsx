import React from "react";
interface VideoSectionProps {
  title: string;
  description: string;
  videoUrl?: string;
  videoPlaceholder?: string;
}
const VideoSection: React.FC<VideoSectionProps> = ({
  title,
  description,
  videoUrl,
  videoPlaceholder = "https://images.unsplash.com/photo-1518770660439-4636190af475"
}) => {
  return <section className="py-16 md:py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 md:text-3xl">{title}</h2>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-card rounded-xl overflow-hidden shadow-xl border border-border">
          {videoUrl ? <div className="aspect-video">
              <iframe width="100%" height="100%" src={videoUrl} title={title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
            </div> : <div className="aspect-video relative">
              <img src={videoPlaceholder} alt="Video placeholder" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <a href="https://youtu.be/Lr_L7MAIUnM" target="_blank" rel="noopener noreferrer" className="bg-primary/90 text-white rounded-full p-4 cursor-pointer hover:bg-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </a>
              </div>
            </div>}
        </div>
      </div>
    </section>;
};
export default VideoSection;