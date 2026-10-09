import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { BackToList } from "@/components/BackToList";
import { PrdForm } from "@/components/PrdForm";
import { getAdminUser } from "@/utils/auth/get-admin-user";
import { getContent } from "@/utils/prds/get-content";
import { getPrd } from "@/utils/prds/get-prd";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditPrdPage({ params }: Props) {
  const { slug } = await params;
  const prd = getPrd(slug);
  if (!prd) notFound();
  const author = getAdminUser((await headers()).get("authorization")) ?? "";

  return (
    <div className="flex flex-col gap-6">
      <BackToList />
      <div>
        <h1 className="text-2xl font-semibold">Edit {prd.title}</h1>
        <p className="text-sm text-muted-foreground">
          You edit v{prd.latestVersion}. A save makes a new version and keeps the old ones.
        </p>
      </div>
      <PrdForm
        author={author}
        prd={{
          slug: prd.slug,
          title: prd.title,
          version: prd.latestVersion,
          content: getContent(prd.id, prd.latestVersion) ?? "",
        }}
      />
    </div>
  );
}
