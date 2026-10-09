import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="font-semibold">
          PRD Admin
        </Link>
      </div>
    </header>
  );
}
