
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();

    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            <Link
                href="/dashboard"
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                )}
            >
                Overview
            </Link>
            <Link
                href="/dashboard/generate"
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/dashboard/generate"
                        ? "text-primary"
                        : "text-muted-foreground"
                )}
            >
                Generate
            </Link>
            <Link
                href="/dashboard/bulk"
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/dashboard/bulk"
                        ? "text-primary"
                        : "text-muted-foreground"
                )}
            >
                Bulk Modernizer
            </Link>
            <Link
                href="/dashboard/billing"
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/dashboard/billing"
                        ? "text-primary"
                        : "text-muted-foreground"
                )}
            >
                Billing
            </Link>
            <Link
                href="/dashboard/settings"
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/dashboard/settings"
                        ? "text-primary"
                        : "text-muted-foreground"
                )}
            >
                Settings
            </Link>
        </nav>
    );
}
