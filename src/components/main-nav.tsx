"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sparkles, LayoutDashboard, Wand2, Box, CreditCard, Settings, Clock } from "lucide-react";

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();

    const routes = [
        {
            href: "/dashboard",
            label: "Overview",
            icon: LayoutDashboard,
            active: pathname === "/dashboard",
        },
        {
            href: "/dashboard/generate",
            label: "AI Studio",
            icon: Wand2,
            active: pathname === "/dashboard/generate",
        },
        {
            href: "/dashboard/history",
            label: "History",
            icon: Clock,
            active: pathname === "/dashboard/history",
        },
        {
            href: "/dashboard/bulk",
            label: "Store Sync",
            icon: Box,
            active: pathname === "/dashboard/bulk",
        },
        {
            href: "/dashboard/billing",
            label: "Billing",
            icon: CreditCard,
            active: pathname === "/dashboard/billing",
        },
        {
            href: "/dashboard/settings",
            label: "Account",
            icon: Settings,
            active: pathname === "/dashboard/settings",
        },
    ];

    return (
        <div className="flex items-center gap-10">
            <Link href="/dashboard" className="flex items-center gap-2 group">
                <div className="p-2 rounded-xl bg-primary shadow-lg group-hover:scale-110 transition-transform">
                    <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-black tracking-tighter">VISION AI</span>
            </Link>

            <nav
                className={cn("hidden md:flex items-center gap-2", className)}
                {...props}
            >
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-muted",
                            route.active
                                ? "text-foreground bg-muted shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <route.icon className={cn("h-4 w-4", route.active ? "text-primary" : "text-muted-foreground")} />
                        {route.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
