"use client";

import Link from "next/link";
import { startTransition, useActionState, useState } from "react";
import { createPrd } from "@/actions/create-prd";
import { saveVersion } from "@/actions/save-version";
import { Markdown } from "@/components/Markdown";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  author: string;
  project: string;
  prd?: { slug: string; title: string; version: number; content: string };
}

export function PrdForm({ author, project, prd }: Props) {
  const [state, formAction, isPending] = useActionState(prd ? saveVersion : createPrd, null);
  const [content, setContent] = useState(prd?.content ?? "");

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        // a native action submit resets the form when the server rejects the save
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.set("content", content);
        startTransition(() => formAction(formData));
      }}
    >
      {prd ? (
        <>
          <input type="hidden" name="slug" value={prd.slug} />
          <input type="hidden" name="baseVersion" value={prd.version} />
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <input type="hidden" name="project" value={project} />
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required placeholder="S3 Console Integration" />
        </div>
      )}

      <Tabs defaultValue="write">
        <TabsList>
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="write">
          <Textarea
            aria-label="PRD content in Markdown"
            className="min-h-[60vh] font-mono text-sm"
            required
            placeholder="Write the PRD in Markdown."
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </TabsContent>
        <TabsContent value="preview" className="min-h-[60vh] rounded-lg border p-6">
          <Markdown content={content} />
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-0 -mx-6 flex flex-col gap-4 border-t bg-background px-6 py-4">
        <div className="flex flex-wrap items-end gap-4">
          {prd && (
            <div className="flex min-w-64 flex-1 flex-col gap-2">
              <Label htmlFor="summary">Change summary</Label>
              <Input
                id="summary"
                name="summary"
                required
                placeholder="What did you change, and why?"
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="author">Your name</Label>
            <Input id="author" value={author} readOnly className="w-56 bg-muted" />
          </div>
        </div>

        {state?.error && (
          <p role="alert" className="text-sm text-destructive">
            {state.error}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {prd ? `Save as v${prd.version + 1}` : "Create PRD"}
            </Button>
            <Button asChild variant="ghost">
              <Link href={prd ? `/prds/${prd.slug}` : `/?project=${project}`}>Cancel</Link>
            </Button>
          </div>
          {prd && (
            <div className="flex items-center gap-2">
              <Checkbox id="isMinor" name="isMinor" />
              <Label htmlFor="isMinor">Minor edit. Do not notify the stakeholders.</Label>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
