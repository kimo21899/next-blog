import { NextResponse } from "next/server";
import getAuthUser from "./lib/getAuthUser";

const protectedRoutes = ['/dashboard', '/posts/create', '/posts/delete'];
const publicRoutes = ['/login', '/register']; 

export default async function middleware(req) {
 
  const path = req.nextUrl.pathname;
  const isProtected = protectedRoutes.includes(path) || path.startsWith("/post/edit/")
  const isPublic = publicRoutes.includes(path)

  const user = await getAuthUser();
  const userId = user?.userId;

  console.log(path);

  if(isProtected && !userId){
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  if(isPublic && userId){
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}