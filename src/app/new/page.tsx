import { headers } from "next/headers";
import { BackToList } from "@/components/BackToList";
import { PrdForm } from "@/components/PrdForm";
import { PROJECTS } from "@/lib/config";
import { getAdminUser } from "@/utils/auth/get-admin-user";
import { getProject } from "@/utils/projects/get-project";

interface Props {
  searchParams: Promise<{ project?: string }>;
}

export default async function NewPrdPage({ searchParams }: Props) {
  const author = getAdminUser((await headers()).get("authorization")) ?? "";
  const project = getProject((await searchParams).project) ?? PROJECTS[0];

  return (
    <div className="flex flex-col gap-6">
      <BackToList project={project.slug} />
      <h1 className="text-2xl font-semibold">New PRD in {project.name}</h1>
      <PrdForm author={author} project={project.slug} />
    </div>
  );
}
