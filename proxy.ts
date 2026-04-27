import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const PUBLIC_ROUTES = ["/profile/"];

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const path = request.nextUrl.pathname;
    const isAuthRoute = path.startsWith("/auth");
    const isPublicRoute =
        path === "/" || PUBLIC_ROUTES.some((route) => path.includes(route));

    if (session && isAuthRoute) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (!session && !isAuthRoute && !isPublicRoute) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Exclude API routes, static files, image optimizations, favicon, and .png files
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
    ],
};
