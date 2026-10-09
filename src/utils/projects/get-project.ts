import { PROJECTS } from "@/lib/config";

export function getProject(slug: string | null | undefined) {
  return PROJECTS.find((project) => project.slug === slug);
}
