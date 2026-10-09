import { headers } from "next/headers";
import { BackToList } from "@/components/BackToList";
import { PrdForm } from "@/components/PrdForm";
import { getAdminUser } from "@/utils/auth/get-admin-user";

export default async function NewPrdPage() {
  const author = getAdminUser((await headers()).get("authorization")) ?? "";

  return (
    <div className="flex flex-col gap-6">
      <BackToList />
      <h1 className="text-2xl font-semibold">New PRD</h1>
      <PrdForm author={author} />
    </div>
  );
}
