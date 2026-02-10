"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Image as ImageIcon, CreditCard, Clock, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
    const [profile, setProfile] = useState<any>(null);
    const [stats, setStats] = useState({ total: 0, thisMonth: 0 });
    const [recentGenerations, setRecentGenerations] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        async function loadDashboardData() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Load Profile
            const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
            setProfile(prof);

            // Load Recent Generations
            const { data: gens } = await supabase
                .from("generations")
                .select("*, products(name)")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(4);
            setRecentGenerations(gens || []);

            // Load Stats
            const { count } = await supabase
                .from("generations")
                .select("*", { count: 'exact', head: true })
                .eq("user_id", user.id);
            setStats({ total: count || 0, thisMonth: 0 });
        }

        loadDashboardData();
    }, []);

    return (
        <div className="flex flex-col space-y-8 pb-12">
            <div className="flex flex-col space-y-2">
                <h1 className="text-4xl font-black tracking-tight">Welcome back, {profile?.full_name?.split(' ')[0] || 'Creator'}</h1>
                <p className="text-muted-foreground text-lg">Here's what's happening with your visual studio.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="glass-card overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-white">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-70">Total Generations</CardTitle>
                        <Sparkles className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{stats.total}</div>
                        <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
                    </CardContent>
                </Card>

                <Card className="glass-card overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-white">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-70">Credits Available</CardTitle>
                        <CreditCard className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{profile?.credits || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Resetting in 14 days</p>
                    </CardContent>
                </Card>

                <Card className="glass-card overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-white">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-70">Active Projects</CardTitle>
                        <Clock className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">3</div>
                        <p className="text-xs text-muted-foreground mt-1">2 processing now</p>
                    </CardContent>
                </Card>

                <Card className="glass-card bg-primary text-primary-foreground">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-90">Current Plan</CardTitle>
                        <ArrowUpRight className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">Starter</div>
                        <Link href="/dashboard/billing">
                            <Button variant="secondary" size="sm" className="mt-4 w-full font-bold">Upgrade Now</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 glass-card border-none">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
                        <CardDescription>Start creating amazing visuals instantly.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Link href="/dashboard/generate" className="flex flex-col items-center justify-center p-8 rounded-2xl border bg-background/50 transition-all hover:bg-primary/5 hover:border-primary/50 group">
                            <div className="p-4 rounded-2xl bg-primary/10 mb-4 group-hover:scale-110 transition-transform">
                                <Sparkles className="h-8 w-8 text-primary" />
                            </div>
                            <span className="font-bold">AI Generation</span>
                            <span className="text-xs text-muted-foreground mt-1">Single product shoot</span>
                        </Link>

                        <Link href="/dashboard/bulk" className="flex flex-col items-center justify-center p-8 rounded-2xl border bg-background/50 transition-all hover:bg-primary/5 hover:border-primary/50 group">
                            <div className="p-4 rounded-2xl bg-primary/10 mb-4 group-hover:scale-110 transition-transform">
                                <ImageIcon className="h-8 w-8 text-primary" />
                            </div>
                            <span className="font-bold">Bulk Import</span>
                            <span className="text-xs text-muted-foreground mt-1">Modernize entire store</span>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="col-span-3 glass-card border-none">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Recent Creations</CardTitle>
                        <CardDescription>Your latest AI generated assets.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentGenerations.length > 0 ? (
                                recentGenerations.map((gen) => (
                                    <div key={gen.id} className="flex items-center gap-4 p-2 rounded-xl transition-all hover:bg-muted/50">
                                        <div className="relative h-12 w-12 rounded-lg overflow-hidden border">
                                            <img src={gen.image_url} alt="Gen" className="object-cover h-full w-full" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate">{gen.prompt}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(gen.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" asChild>
                                            <a href={gen.image_url} target="_blank" rel="noreferrer">
                                                <ArrowUpRight className="h-4 w-4" />
                                            </a>
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                                    <Sparkles className="h-8 w-8 mb-2 opacity-20" />
                                    <p className="text-sm">No creations yet</p>
                                </div>
                            )}
                        </div>
                        {recentGenerations.length > 0 && (
                            <Button variant="ghost" className="w-full mt-4 text-xs font-bold uppercase tracking-widest" asChild>
                                <Link href="/dashboard/generate">View All</Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
