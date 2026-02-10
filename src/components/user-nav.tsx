"use client";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon, CreditCard, Settings, Star } from "lucide-react";
import { useEffect, useState } from "react";

export function UserNav({ user }: { user: User }) {
    const router = useRouter();
    const supabase = createClient();
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        async function getProfile() {
            const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (data) setProfile(data);
        }
        getProfile();
    }, [user.id, supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push('/login');
    };

    const initials = profile?.full_name?.split(' ').map((n: string) => n[0]).join('') || user.email?.slice(0, 2).toUpperCase();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-2xl border bg-background shadow-sm hover:shadow-md transition-all">
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2 rounded-2xl" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-black leading-none">{profile?.full_name || 'Creator'}</p>
                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                Pro
                            </span>
                        </div>
                        <p className="text-xs leading-none text-muted-foreground italic">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="opacity-50" />
                <DropdownMenuGroup className="p-1">
                    <DropdownMenuItem className="rounded-xl p-3 gap-3 font-bold cursor-pointer transition-colors" onClick={() => router.push('/dashboard/settings')}>
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        Account Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl p-3 gap-3 font-bold cursor-pointer transition-colors" onClick={() => router.push('/dashboard/billing')}>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        Billing & Credits
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl p-3 gap-3 font-bold cursor-pointer transition-colors">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        Upgrade Plan
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="opacity-50" />
                <DropdownMenuItem onClick={handleSignOut} className="rounded-xl p-3 gap-3 font-bold cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                    <LogOut className="h-4 w-4" />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
