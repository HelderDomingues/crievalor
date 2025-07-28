
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, ExternalLink, ChevronLeft, ChevronRight, X } from "lucide-react";
import { PortfolioProject } from "@/types/portfolio";

interface PortfolioGalleryProps {
  projects: PortfolioProject[];
}

const PortfolioGallery = ({ projects }: PortfolioGalleryProps) => {
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  
  const handleSelectProject = (project: PortfolioProject) => {
    setSelectedProject(project);
    setDialogOpen(true);
  };

  const handleOpenProjectUrl = (url: string | null) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const getCurrentProjectIndex = () => {
    if (!selectedProject) return -1;
    return projects.findIndex(p => p.id === selectedProject.id);
  };

  const handlePreviousProject = () => {
    const currentIndex = getCurrentProjectIndex();
    if (currentIndex > 0) {
      setSelectedProject(projects[currentIndex - 1]);
    }
  };

  const handleNextProject = () => {
    const currentIndex = getCurrentProjectIndex();
    if (currentIndex < projects.length - 1) {
      setSelectedProject(projects[currentIndex + 1]);
    }
  };

  const openLightbox = (images: string[], startIndex: number) => {
    setLightboxImages(images);
    setLightboxImageIndex(startIndex);
    setLightboxOpen(true);
  };

  const handleLightboxPrevious = () => {
    if (lightboxImageIndex > 0) {
      setLightboxImageIndex(lightboxImageIndex - 1);
    }
  };

  const handleLightboxNext = () => {
    if (lightboxImageIndex < lightboxImages.length - 1) {
      setLightboxImageIndex(lightboxImageIndex + 1);
    }
  };

  const handleLightboxPreviousProject = () => {
    const currentIndex = getCurrentProjectIndex();
    if (currentIndex > 0) {
      const prevProject = projects[currentIndex - 1];
      const allImages = [prevProject.coverImage, ...(prevProject.gallery || [])];
      setSelectedProject(prevProject);
      setLightboxImages(allImages);
      setLightboxImageIndex(0);
    }
  };

  const handleLightboxNextProject = () => {
    const currentIndex = getCurrentProjectIndex();
    if (currentIndex < projects.length - 1) {
      const nextProject = projects[currentIndex + 1];
      const allImages = [nextProject.coverImage, ...(nextProject.gallery || [])];
      setSelectedProject(nextProject);
      setLightboxImages(allImages);
      setLightboxImageIndex(0);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-border">
            <div className="relative overflow-hidden aspect-square">
              <img 
                src={project.coverImage} 
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-background/80 mr-2"
                  onClick={() => handleSelectProject(project)}
                >
                  <Eye className="h-5 w-5" />
                </Button>
                {project.projectUrl && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-background/80"
                    onClick={() => handleOpenProjectUrl(project.projectUrl)}
                  >
                    <ExternalLink className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{project.title}</CardTitle>
              <CardDescription>{project.category}</CardDescription>
            </CardHeader>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {new Date(project.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'short' })}
              </span>
              <Button variant="outline" size="sm" onClick={() => handleSelectProject(project)}>
                Ver detalhes
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh]">
          {selectedProject && (
            <>
              <DialogHeader className="flex flex-row items-center justify-between">
                <div>
                  <DialogTitle>{selectedProject.title}</DialogTitle>
                  <DialogDescription>{selectedProject.category}</DialogDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePreviousProject}
                    disabled={getCurrentProjectIndex() === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextProject}
                    disabled={getCurrentProjectIndex() === projects.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>
              
              <ScrollArea className="max-h-[70vh] pr-4">
                <div className="space-y-4">
                  <img 
                    src={selectedProject.coverImage} 
                    alt={selectedProject.title}
                    className="w-full h-auto rounded-md cursor-pointer" 
                    onClick={() => openLightbox([selectedProject.coverImage, ...(selectedProject.gallery || [])], 0)}
                  />
                  
                  <p>{selectedProject.description}</p>
                  
                  {selectedProject.tags && selectedProject.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag, idx) => (
                        <span key={idx} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {selectedProject.gallery && selectedProject.gallery.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {selectedProject.gallery.map((image, index) => (
                        <img 
                          key={index} 
                          src={image} 
                          alt={`${selectedProject.title} - imagem ${index + 1}`}
                          className="w-full h-auto rounded-md cursor-pointer hover:opacity-80 transition-opacity" 
                          onClick={() => openLightbox([selectedProject.coverImage, ...(selectedProject.gallery || [])], index + 1)}
                        />
                      ))}
                    </div>
                  )}
                  
                  {selectedProject.projectUrl && (
                    <Button 
                      variant="link" 
                      className="px-0"
                      onClick={() => handleOpenProjectUrl(selectedProject.projectUrl)}
                    >
                      Visitar projeto <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Lightbox Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-0">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Project Navigation */}
            <div className="absolute top-4 left-4 z-50 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={handleLightboxPreviousProject}
                disabled={getCurrentProjectIndex() === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Projeto Anterior
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={handleLightboxNextProject}
                disabled={getCurrentProjectIndex() === projects.length - 1}
              >
                Próximo Projeto
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* Image Navigation */}
            {lightboxImageIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
                onClick={handleLightboxPrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}

            {lightboxImageIndex < lightboxImages.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
                onClick={handleLightboxNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}

            {/* Main Image */}
            {lightboxImages[lightboxImageIndex] && (
              <img
                src={lightboxImages[lightboxImageIndex]}
                alt={`Imagem ${lightboxImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {lightboxImageIndex + 1} / {lightboxImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioGallery;
