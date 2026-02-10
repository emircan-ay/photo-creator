import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { UserNav } from "@/components/user-nav"; // Need to create this
import { MainNav } from "@/components/main-nav"; // Need to create this

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
        <div className="flex-col md:flex">
            <div className="border-b">
                <div className="flex h-16 items-center px-4">
                    <MainNav className="mx-6" />
                    <div className="ml-auto flex items-center space-x-4">
                        <UserNav user={user} />
                    </div>
                </div>
            </div>
            <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
        </div>
    );
}
