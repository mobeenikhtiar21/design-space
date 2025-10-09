import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const publicRoutes = ["/auth/login", "/auth/register", "/auth/reset-password"];
const subscriptionRequiredRoutes = ["/studio", "/account/settings"];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const cookieStore = await cookies();

    // return NextResponse.next();

    // Allow public routes
    if (publicRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    let supabaseResponse = NextResponse.next({
        request: req,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Ignore errors from cookies.set() in Server Components
                    }
                },
            },
        }
    );

    // Refresh session if needed
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Redirect to login if not authenticated
    if (!user) {
        const loginUrl = new URL("/auth/login", req.url);
        if (pathname !== '/studio')
            loginUrl.searchParams.set("redirectedFrom", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Check subscription for protected routes
    if (subscriptionRequiredRoutes.some((route) => pathname.startsWith(route))) {
        const { data: subscription, error } = await supabase
            .from('subscriptions')
            .select('status')
            .eq('user_id', user.id)
            .single();

        if (error || !subscription || (subscription.status !== 'active')) {
            const subscribeUrl = new URL("/subscribe", req.url);
            subscribeUrl.searchParams.set("redirectedFrom", pathname);
            return NextResponse.redirect(subscribeUrl);
        }
    }

    return supabaseResponse;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*|api|auth).*)"],
};
