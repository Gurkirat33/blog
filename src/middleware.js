import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  const publicPaths = ["/", "/signin", "/signup", "/blog"];
  const isBlogPath = path.startsWith("/blog/");

  const isPublicPath =
    publicPaths.includes(path) || isBlogPath || path.startsWith("/api/");

  const isPublicAsset =
    path.startsWith("/_next") ||
    path.startsWith("/_static") ||
    path.includes("/images/") ||
    path.endsWith(".ico") ||
    path.endsWith(".svg") ||
    path.endsWith(".png") ||
    path.endsWith(".jpg") ||
    path.endsWith(".jpeg");

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (token && (path === "/signin" || path === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Let public paths, blog slugs, and assets pass through
  if (isPublicPath || isPublicAsset) {
    return NextResponse.next();
  }

  // Redirect to login if there's no token and the path requires auth
  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}
