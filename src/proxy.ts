import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser } from "@/utils/auth/get-admin-user";

export function proxy(request: NextRequest) {
  if (getAdminUser(request.headers.get("authorization"))) return NextResponse.next();
  return new NextResponse("Sign in with your name as the user name and the admin password.\n", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="PRD Admin. Use your name as the user name."' },
  });
}

// /api is not here: each API route checks the bearer token itself.
export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|favicon.ico).*)"],
};
