"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Image as ImageIcon, CreditCard, Clock, ArrowUpRight, Zap, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LiquidChrome from "@/components/bits/liquid-chrome";

export default function DashboardPage() {
    const [profile, setProfile] = useState<any>(null);
    const [stats, setStats] = useState({ total: 0, credits: 0, activeProjects: 2 });
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
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(4);
            setRecentGenerations(gens || []);

            // Load Total count
            const { count } = await supabase
                .from("generations")
                .select("*", { count: 'exact', head: true })
                .eq("user_id", user.id);

            setStats(prev => ({
                ...prev,
                total: count || 0,
                credits: prof?.credits || 0
            }));
        }

        loadDashboardData();
    }, []);

    const firstName = profile?.full_name?.split(' ')[0] || 'Creator';

    return (
        <div className="relative space-y-10 pb-20">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-10 text-white shadow-2xl">
                <div className="absolute inset-0 -z-10 opacity-30">
                    <LiquidChrome baseColor={[0.4, 0.2, 0.9]} speed={0.03} />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-widest text-primary-foreground">
                            <Zap className="h-3 w-3 fill-primary text-primary" />
                            Premium account active
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
                            Welcome back, <br />
                            <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent italic">
                                {firstName}
                            </span>
                        </h1>
                        <p className="text-white/60 text-lg max-w-lg font-medium">
                            Your studio is ready. What kind of magic are we creating today?
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 min-w-[200px]">
                        <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-inner">
                            <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-1">Available Credits</p>
                            <div className="flex items-center gap-3">
                                <span className="text-4xl font-black">{stats.credits}</span>
                                <div className="h-8 w-[2px] bg-white/10" />
                                <div className="text-[10px] font-bold text-primary-foreground leading-tight px-2 py-1 bg-primary rounded-lg">
                                    TOP UP
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="group relative overflow-hidden rounded-3xl border bg-card p-8 transition-all hover:border-primary/50 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">+12.5%</span>
                    </div>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Works</p>
                    <h3 className="text-3xl font-black mt-1 group-hover:scale-110 transition-transform origin-left">{stats.total}</h3>
                </div>

                <div className="group relative overflow-hidden rounded-3xl border bg-card p-8 transition-all hover:border-primary/50 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                            <Target className="h-6 w-6" />
                        </div>
                        <span className="text-[10px] font-bold text-purple-500 bg-purple-500/10 px-2 py-1 rounded-full">ACTIVE</span>
                    </div>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Ongoing Projects</p>
                    <h3 className="text-3xl font-black mt-1 group-hover:scale-110 transition-transform origin-left">{stats.activeProjects}</h3>
                </div>

                <div className="group relative overflow-hidden rounded-3xl border bg-card p-8 transition-all hover:border-primary/50 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
                            <CreditCard className="h-6 w-6" />
                        </div>
                        <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full">PLAN</span>
                    </div>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Membership</p>
                    <h3 className="text-3xl font-black mt-1 group-hover:scale-110 transition-transform origin-left italic">Starter</h3>
                </div>
            </div>

            {/* Main Content Areas */}
            <div className="grid gap-10 lg:grid-cols-2">
                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                            <Zap className="h-6 w-6 text-primary" />
                            Launch Studio
                        </h2>
                    </div>

                    <div className="grid gap-4">
                        <Link href="/dashboard/generate" className="group relative flex items-center gap-6 p-6 rounded-[2rem] border bg-gradient-to-br from-background to-muted/30 transition-all hover:shadow-xl hover:-translate-y-1">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg group-hover:rotate-12 transition-transform">
                                <Sparkles className="h-8 w-8" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-xl font-bold">New AI Shoots</h4>
                                <p className="text-sm text-muted-foreground">Studio-quality photos for single products.</p>
                            </div>
                            <ArrowUpRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>

                        <Link href="/dashboard/bulk" className="group relative flex items-center gap-6 p-6 rounded-[2rem] border bg-gradient-to-br from-background to-muted/30 transition-all hover:shadow-xl hover:-translate-y-1">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg group-hover:-rotate-6 transition-transform">
                                <ImageIcon className="h-8 w-8" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-xl font-bold">Store Modernizer</h4>
                                <p className="text-sm text-muted-foreground text-glow text-primary font-bold">POWERFUL</p>
                                <p className="text-sm text-muted-foreground">Import & update your entire store in seconds.</p>
                            </div>
                            <ArrowUpRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                    </div>
                </div>

                {/* Recent Creations */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                            <Clock className="h-6 w-6 text-primary" />
                            Latest Magic
                        </h2>
                        <Button variant="link" className="text-xs font-bold uppercase tracking-widest p-0" asChild>
                            <Link href="/dashboard/generate">View All History</Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {recentGenerations.length > 0 ? (
                            recentGenerations.map((gen) => (
                                <div key={gen.id} className="group relative aspect-square rounded-3xl overflow-hidden border bg-card shadow-sm hover:shadow-xl transition-all">
                                    <img src={gen.image_url} alt="Gen" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                                        <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest truncate">{gen.prompt}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-xs text-white font-medium">{new Date(gen.created_at).toLocaleDateString()}</span>
                                            <a href={gen.image_url} target="_blank" rel="noreferrer" className="p-1.5 rounded-full bg-white/20 backdrop-blur-md text-white">
                                                <ArrowUpRight className="h-3 w-3" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 flex flex-col items-center justify-center py-20 rounded-[2.5rem] border-2 border-dashed border-muted bg-muted/5 text-muted-foreground/30">
                                <Sparkles className="h-12 w-12 mb-4 animate-pulse" />
                                <p className="font-bold text-sm tracking-widest uppercase">No assets yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
