import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { APP_URL } from "@/lib/config";

interface Props {
  slug: string;
  version: number;
}

export function AgentAccess({ slug, version }: Props) {
  const auth = '-H "Authorization: Bearer $PRD_API_TOKEN"';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Agent access</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Agent access</DialogTitle>
          <DialogDescription>
            A repo records the version that its code agrees with. The diff from that version to the
            latest version is the work list.
          </DialogDescription>
        </DialogHeader>
        <div className="flex min-w-0 flex-col gap-3 text-xs">
          <p className="font-medium">Latest version</p>
          <pre className="rounded-md bg-muted p-3 break-all whitespace-pre-wrap">
            {`curl ${auth} \\\n  ${APP_URL}/api/prds/${slug}`}
          </pre>
          <p className="font-medium">Changes after a recorded version</p>
          <pre className="rounded-md bg-muted p-3 break-all whitespace-pre-wrap">
            {`curl ${auth} \\\n  "${APP_URL}/api/prds/${slug}/diff?from=${version}"`}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}
