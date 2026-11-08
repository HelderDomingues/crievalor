import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { PortfolioProject } from "@/types/portfolio";
import { toast } from "@/components/ui/use-toast";

// Persistência real do portfólio na tabela public.portfolio_projects (Supabase).
// A tabela ainda não está nos tipos gerados, então usamos o cliente sem tipagem de tabela
// (mesmo cliente/instância, sem criar outro GoTrueClient).
const table = () => (supabase as unknown as SupabaseClient).from("portfolio_projects");

type Row = {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  cover_image: string;
  gallery: string[] | null;
  project_date: string | null;
  project_url: string | null;
  client: string | null;
  tags: string[] | null;
};

const fromRow = (r: Row): PortfolioProject => ({
  id: r.id,
  title: r.title,
  category: r.category ?? "",
  description: r.description ?? "",
  coverImage: r.cover_image,
  gallery: r.gallery ?? [],
  date: r.project_date ?? "",            // vazio quando o projeto não tem data
  projectUrl: r.project_url ?? null,
  client: r.client ?? undefined,
  tags: r.tags ?? [],
});

const toRow = (p: Partial<PortfolioProject>) => ({
  title: p.title ?? "",
  category: p.category ?? "",
  description: p.description ?? "",
  cover_image: p.coverImage ?? "",
  gallery: p.gallery ?? [],
  project_date: p.date ? p.date : null,   // "" vira NULL (coluna date não aceita string vazia)
  project_url: p.projectUrl ? p.projectUrl : null,
  client: p.client ? p.client : null,
  tags: p.tags ?? [],
});

export const getPortfolioProjects = async (): Promise<PortfolioProject[]> => {
  try {
    const { data, error } = await table()
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return ((data ?? []) as Row[]).map(fromRow);
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);
    toast({
      title: "Erro ao carregar projetos",
      description: "Não foi possível obter a lista de projetos.",
      variant: "destructive",
    });
    return [];
  }
};

export const getProjectById = async (id: string): Promise<PortfolioProject | undefined> => {
  try {
    const { data, error } = await table().select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? fromRow(data as Row) : undefined;
  } catch (error) {
    console.error("Erro ao buscar projeto:", error);
    toast({
      title: "Erro ao carregar projeto",
      description: "Não foi possível obter os dados do projeto.",
      variant: "destructive",
    });
    return undefined;
  }
};

export const addProject = async (project: Omit<PortfolioProject, "id">): Promise<PortfolioProject> => {
  // Sem toast aqui: o PortfolioAdminPanel já mostra "Erro ao salvar" quando esta função lança.
  const { data, error } = await table().insert(toRow(project)).select("*").single();
  if (error) {
    console.error("Erro ao adicionar projeto:", error);
    throw error;
  }
  return fromRow(data as Row);
};

export const updateProject = async (project: PortfolioProject): Promise<PortfolioProject> => {
  const { data, error } = await table()
    .update(toRow(project))
    .eq("id", project.id)
    .select("*")
    .single();
  if (error) {
    console.error("Erro ao atualizar projeto:", error);
    throw error;
  }
  return fromRow(data as Row);
};

export const deleteProject = async (id: string): Promise<boolean> => {
  // .select() devolve as linhas apagadas: se a RLS bloquear, vem vazio e tratamos como erro
  // (sem isso o admin diria "excluído" sem ter excluído nada, o mesmo defeito do mock).
  const { data, error } = await table().delete().eq("id", id).select("id");
  if (error) {
    console.error("Erro ao excluir projeto:", error);
    throw error;
  }
  if (!data || data.length === 0) {
    throw new Error("Nenhuma linha excluída (verifique permissão de admin)");
  }
  return true;
};
