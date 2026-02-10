import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { UserNav } from "@/components/user-nav";
import { MainNav } from "@/components/main-nav";
import { Sparkles } from "lucide-react";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen flex-col bg-background/50">
            <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
                <div className="container max-w-7xl mx-auto flex h-20 items-center px-6">
                    <MainNav />
                    <div className="ml-auto flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/10 text-xs font-bold text-primary">
                            <Sparkles className="h-3 w-3" />
                            Studio Mode Active
                        </div>
                        <UserNav user={user} />
                    </div>
                </div>
            </header>
            <main className="flex-1">
                <div className="container max-w-7xl mx-auto py-10 px-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
