
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

  const handleSelectProject = (project: PortfolioProject) => {
    setSelectedProject(project);
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
                    asChild
                  >
                    <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-5 w-5" />
                    </a>
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => handleSelectProject(project)}>
                    Ver detalhes
                  </Button>
                </DialogTrigger>
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
                          {selectedProject.gallery && (
                            <div className="grid grid-cols-2 gap-2 mt-4">
                              {selectedProject.gallery.map((image, index) => (
                                <img 
                                  key={index} 
                                  src={image} 
                                  alt={`${selectedProject.title} - imagem ${index + 1}`}
                                  className="w-full h-auto rounded-md" 
                                />
                              ))}
                            </div>
                          )}
                          {selectedProject.projectUrl && (
                            <Button variant="link" className="px-0" asChild>
                              <a href={selectedProject.projectUrl} target="_blank" rel="noopener noreferrer">
                                Visitar projeto <ExternalLink className="ml-2 h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PortfolioGallery;
