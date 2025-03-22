
import { PortfolioProject } from "@/types/portfolio";

// Esse serviço simula um CMS para gerenciar o portfólio
// Em uma implementação real, isso se conectaria a uma API real

let projects: PortfolioProject[] = [
  {
    id: "1",
    title: "Rebrand Empresa de Tecnologia",
    category: "Identidade Visual",
    description: "Redesenho completo da identidade visual para uma empresa de tecnologia em crescimento, incluindo logo, paleta de cores, tipografia e aplicações.",
    coverImage: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1634942537034-2531766767a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1587614387466-0a72ca909e16?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600508773159-bfc7706bce35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
    ],
    date: "2023-09-15",
    projectUrl: null
  },
  {
    id: "2",
    title: "Identidade Visual Restaurante",
    category: "Branding",
    description: "Desenvolvimento de identidade visual para restaurante de culinária mediterrânea, incluindo logo, menus, cartões de visita e sinalização.",
    coverImage: "https://images.unsplash.com/photo-1583396796390-1c1a482d3c9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583396796390-1c1a482d3c9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1621844061203-3f9a5cf8a65f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1606936635002-8643a581bd2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
    ],
    date: "2023-07-20",
    projectUrl: null
  },
  {
    id: "3",
    title: "Site e-commerce de moda",
    category: "UI/UX & Branding",
    description: "Design de identidade visual e interface para e-commerce de moda sustentável, com foco em experiência de usuário e conversão.",
    coverImage: "https://images.unsplash.com/photo-1561069934-eee225952461?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1561069934-eee225952461?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1573339584805-6faf18f710bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1601524909162-ae8bd4d6ff31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
    ],
    date: "2023-05-30",
    projectUrl: "https://example.com"
  },
  {
    id: "4",
    title: "Rebrand Consultoria Financeira",
    category: "Identidade Visual",
    description: "Redesenho da marca para empresa de consultoria financeira, desenvolvendo uma identidade visual mais moderna e sofisticada.",
    coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1607703703520-bb638e84caf2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
    ],
    date: "2023-03-10",
    projectUrl: null
  },
  {
    id: "5",
    title: "App Fitness",
    category: "UI/UX & Branding",
    description: "Design de interface e identidade visual para aplicativo de fitness, com foco em usabilidade e engajamento do usuário.",
    coverImage: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1576153192396-180ecef2a715?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
    ],
    date: "2022-11-25",
    projectUrl: "https://example.com"
  },
  {
    id: "6",
    title: "Campanha Institucional",
    category: "Design Gráfico",
    description: "Desenvolvimento de campanha institucional para empresa do setor de energia, incluindo materiais impressos e digitais.",
    coverImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1634942537034-2531766767a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
    ],
    date: "2022-09-05",
    projectUrl: null
  }
];

export const getPortfolioProjects = (): Promise<PortfolioProject[]> => {
  return new Promise((resolve) => {
    // Simula uma chamada de API com um pequeno delay
    setTimeout(() => {
      resolve(projects);
    }, 500);
  });
};

export const getProjectById = (id: string): Promise<PortfolioProject | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const project = projects.find(p => p.id === id);
      resolve(project);
    }, 300);
  });
};

export const addProject = (project: Omit<PortfolioProject, 'id'>): Promise<PortfolioProject> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProject = {
        ...project,
        id: Date.now().toString()
      };
      projects = [...projects, newProject];
      resolve(newProject);
    }, 500);
  });
};

export const updateProject = (project: PortfolioProject): Promise<PortfolioProject> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = projects.findIndex(p => p.id === project.id);
      if (index === -1) {
        reject(new Error('Projeto não encontrado'));
        return;
      }
      
      projects[index] = project;
      resolve(project);
    }, 500);
  });
};

export const deleteProject = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      projects = projects.filter(p => p.id !== id);
      resolve(true);
    }, 500);
  });
};
