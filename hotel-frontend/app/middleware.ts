import { NextRequest, NextResponse } from "next/server";

const ROLE_ROUTES: Record<string, string[]> = {
  "/reservations": ["Reception", "Admin"],
  "/checkin":      ["Reception", "Admin"],
  "/rooms":        ["Reception", "Admin"],
  "/folio":        ["Cashier", "Admin"],
  "/room-status":  ["RoomService", "Admin"],
  "/inventory":    ["RoomService", "Admin"],
  "/charge":       ["Restaurant", "Admin"],
  "/dashboard":    ["Admin"],
  "/staff":        ["Admin"],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Let login page through always
  if (pathname.startsWith("/login")) return NextResponse.next();

  const raw = req.cookies.get("hotel_auth")?.value;

  // No cookie → redirect to login
  if (!raw) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const user = JSON.parse(decodeURIComponent(raw));
    const role: string = user?.role ?? "";

    // Check role permissions
    const matched = Object.entries(ROLE_ROUTES).find(([route]) =>
      pathname.startsWith(route)
    );

    if (matched && !matched[1].includes(role)) {
      // Role doesn't have access → send to their default page
      return NextResponse.redirect(new URL(defaultPage(role), req.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

function defaultPage(role: string): string {
  switch (role) {
    case "Reception":   return "/reservations";
    case "Cashier":     return "/folio";
    case "RoomService": return "/room-status";
    case "Restaurant":  return "/charge";
    case "Admin":       return "/dashboard";
    default:            return "/login";
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};