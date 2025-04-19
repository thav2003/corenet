import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Lấy Supabase URL từ biến môi trường
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

export async function middleware(request: NextRequest) {
  // Nếu là URL từ Supabase thì không cần xác thực
  if (supabaseUrl && request.nextUrl.href.includes(supabaseUrl)) {
    return NextResponse.next();
  }
  
  // Protect uploaded files
  if (request.nextUrl.pathname.startsWith("/uploads")) {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.redirect(new URL("/api/auth/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/uploads/:path*"],
}; 