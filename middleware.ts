import { NextResponse, type NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/session";

const PROTECTED_MATCHERS = ["/notes"];
const GUEST_MATCHERS = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = await getSessionFromRequest(request);

  const isProtected = PROTECTED_MATCHERS.some((matcher) => pathname.startsWith(matcher));
  const isGuestPage = GUEST_MATCHERS.some((matcher) => pathname.startsWith(matcher));

  if (isProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isGuestPage && session) {
    return NextResponse.redirect(new URL("/notes", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/login", "/signup"]
};
