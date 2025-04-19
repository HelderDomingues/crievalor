
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, ExternalLink } from "lucide-react";
import { PortfolioProject } from "@/types/portfolio";

interface PortfolioGalleryProps {
  projects: PortfolioProject[];
}

const PortfolioGallery = ({ projects }: PortfolioGalleryProps) => {
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleSelectProject = (project: PortfolioProject) => {
    setSelectedProject(project);
    setDialogOpen(true);
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
                    onClick={() => window.open(project.projectUrl, '_blank')}
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
        <DialogContent className="sm:max-w-xl">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProject.title}</DialogTitle>
                <DialogDescription>{selectedProject.category}</DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <img 
                  src={selectedProject.coverImage} 
                  alt={selectedProject.title}
                  className="w-full h-auto rounded-md mb-4 object-cover" 
                />
                <div className="space-y-4">
                  <p>{selectedProject.description}</p>
                  
                  {selectedProject.tags && selectedProject.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedProject.tags.map((tag, idx) => (
                        <span key={idx} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {selectedProject.gallery && selectedProject.gallery.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {selectedProject.gallery.map((image, index) => (
                        <img 
                          key={index} 
                          src={image} 
                          alt={`${selectedProject.title} - imagem ${index + 1}`}
                          className="w-full h-auto rounded-md cursor-pointer" 
                          onClick={() => window.open(image, '_blank')}
                        />
                      ))}
                    </div>
                  )}
                  
                  {selectedProject.projectUrl && (
                    <Button 
                      variant="link" 
                      className="px-0 mt-2"
                      onClick={() => window.open(selectedProject.projectUrl as string, '_blank')}
                    >
                      Visitar projeto <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioGallery;
