import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const publicPaths = [
    "/",
    "/signin",
    "/signup",
    "/articles",
    "/categories",
    "/about",
    "/contact",
  ];

  const isPublicPath = publicPaths.some(
    (publicPath) => path === publicPath || path.startsWith("/api/")
  );

  // Check if the path is a public asset
  const isPublicAsset =
    path.startsWith("/_next") ||
    path.includes("/images/") ||
    path.endsWith(".ico") ||
    path.endsWith(".svg") ||
    path.endsWith(".png") ||
    path.endsWith(".jpg") ||
    path.endsWith(".jpeg");

  // Check for session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect already authenticated users away from auth pages
  if (token && (path === "/signin" || path === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Let public paths and assets pass through
  if (isPublicPath || isPublicAsset) {
    return NextResponse.next();
  }

  // Redirect to login if there's no token and the path requires auth
  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}
