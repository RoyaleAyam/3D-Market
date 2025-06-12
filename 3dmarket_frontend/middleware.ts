import { NextResponse, NextRequest } from "next/server";

export const middleware = async (request: NextRequest) => {
    const token = request.cookies.get("token")?.value;
    const role = request.cookies.get("role")?.value;

    if (request.nextUrl.pathname === "/") {
        const redirectAdmin = request.nextUrl.clone();
        redirectAdmin.pathname = "/login";
        return NextResponse.redirect(redirectAdmin);
    }

    if (request.nextUrl.pathname.startsWith('/manager')) {
        // Jika tidak ada token atau role, arahkan ke halaman login
        if (!token || !role) {
            const redirectAdmin = request.nextUrl.clone();
            redirectAdmin.pathname = "/login";
            return NextResponse.redirect(redirectAdmin);
        }

        // Jika role bukan MANAGER, arahkan ke halaman login
        if (role !== "ADMIN") {
            const redirectAdmin = request.nextUrl.clone();
            redirectAdmin.pathname = "/login";
            return NextResponse.redirect(redirectAdmin);
        }
    }

    // if (request.nextUrl.pathname.startsWith('/cashier')) {
    //     // Jika tidak ada token atau role, arahkan ke halaman login
    //     if (!token || !role) {
    //         const redirectCashier = request.nextUrl.clone();
    //         redirectCashier.pathname = "/login";
    //         return NextResponse.redirect(redirectCashier);
    //     }

    //     // Jika role bukan CASHIER, arahkan ke halaman login
    //     if (role !== "USER") {
    //         const redirectCashier = request.nextUrl.clone();
    //         redirectCashier.pathname = "/login";
    //         return NextResponse.redirect(redirectCashier);
    //     }
    // }

    return NextResponse.next();
}

export const config = {
    matcher:[
        "/manager/:path*", // menangkap semua route yang dimulai dengan "/manager/"
        // "/cashier/:path*", // menangkap semua route yang dimulai dengan "/cashier/"
        "/"                // menangkap route root
    ]
}
