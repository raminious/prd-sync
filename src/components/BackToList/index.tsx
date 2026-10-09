import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BackToList() {
  return (
    <Button asChild variant="ghost" size="sm" className="-ml-2 self-start">
      <Link href="/">
        <ArrowLeft />
        All PRDs
      </Link>
    </Button>
  );
}
