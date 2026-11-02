import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Protege /admin: renueva la sesión de Supabase y envía al login si no hay usuario.
 * La verificación de rol se hace además en cada página y acción del servidor.
 */
export async function middleware(req: NextRequest) {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isLogin = req.nextUrl.pathname.startsWith("/admin/login");

  if (!url || !key) {
    return isLogin ? NextResponse.next() : NextResponse.redirect(new URL("/admin/login", req.url));
  }

  let res = NextResponse.next({ request: req });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });
  const { data } = await supabase.auth.getUser();

  if (!data.user && !isLogin) return NextResponse.redirect(new URL("/admin/login", req.url));
  return res;
}

export const config = { matcher: ["/admin/:path*"] };
