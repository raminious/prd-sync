import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProject } from "@/utils/projects/get-project";

interface Props {
  project: string;
}

export function BackToList({ project }: Props) {
  return (
    <Button asChild variant="ghost" size="sm" className="-ml-2 self-start">
      <Link href={`/?project=${project}`}>
        <ArrowLeft />
        {getProject(project)?.name} PRDs
      </Link>
    </Button>
  );
}
