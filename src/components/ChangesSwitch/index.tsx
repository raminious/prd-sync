"use client";

import { useRouter } from "next/navigation";
import { startTransition, useOptimistic } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Props {
  isOn: boolean;
  href: string;
  label: string;
}

export function ChangesSwitch({ isOn, href, label }: Props) {
  const router = useRouter();
  const [isChecked, setIsChecked] = useOptimistic(isOn);

  return (
    <div className="flex items-center gap-2">
      <Switch
        id="changes"
        checked={isChecked}
        onCheckedChange={(isNext) =>
          startTransition(() => {
            setIsChecked(isNext);
            // no scroll: the reader stays at the same place in the PRD
            router.replace(href, { scroll: false });
          })
        }
      />
      <Label htmlFor="changes">{label}</Label>
    </div>
  );
}
