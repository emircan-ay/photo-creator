"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Trash2, Clock, Sparkles } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import LiquidChrome from "@/components/bits/liquid-chrome";

export default function HistoryPage() {
    const [generations, setGenerations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function loadGenerations() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("generations")
                .select("*, products(name, original_image_url)")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) {
                toast.error("Failed to load history");
            } else {
                setGenerations(data || []);
            }
            setIsLoading(false);
        }

        loadGenerations();
    }, []);

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from("generations").delete().eq("id", id);
        if (error) {
            toast.error("Failed to delete generation");
        } else {
            setGenerations(prev => prev.filter(g => g.id !== id));
            toast.success("Generation deleted");
        }
    };

    return (
        <div className="flex flex-col space-y-8 pb-20">
            <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-10 text-white">
                <div className="absolute inset-0 -z-10 opacity-20">
                    <LiquidChrome baseColor={[0.1, 0.4, 0.8]} speed={0.04} />
                </div>
                <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                    <Clock className="h-8 w-8 text-primary" />
                    Creation History
                </h1>
                <p className="mt-2 text-white/60 font-medium">Your entire visual library in one place.</p>
            </div>

            {isLoading ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="aspect-square rounded-3xl bg-muted animate-pulse" />
                    ))}
                </div>
            ) : generations.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {generations.map((gen) => (
                        <Card key={gen.id} className="group relative overflow-hidden rounded-3xl border bg-card transition-all hover:shadow-2xl">
                            <div className="aspect-square relative overflow-hidden">
                                <Image
                                    src={gen.image_url}
                                    alt={gen.prompt}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all p-6 flex flex-col justify-end">
                                    <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1 truncate">
                                        {gen.products?.name || "Untitled Item"}
                                    </p>
                                    <p className="text-sm font-medium text-white line-clamp-2 mb-4 italic">
                                        "{gen.prompt}"
                                    </p>
                                    <div className="flex gap-2">
                                        <Button size="sm" className="flex-1 rounded-xl font-bold" onClick={() => window.open(gen.image_url, "_blank")}>
                                            <Download className="h-4 w-4 mr-2" />
                                            Save
                                        </Button>
                                        <Button size="sm" variant="secondary" className="rounded-xl px-2" onClick={() => handleDelete(gen.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 flex items-center justify-between bg-muted/10 border-t">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                                    {new Date(gen.created_at).toLocaleDateString()}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Sparkles className="h-3 w-3 text-primary" />
                                    <span className="text-[10px] font-black text-primary uppercase">SDXL</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 rounded-[3rem] border-2 border-dashed border-muted bg-muted/5 text-center">
                    <div className="p-8 rounded-[2rem] bg-background shadow-xl mb-6">
                        <Sparkles className="h-16 w-16 text-primary/20" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Your gallery is empty</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm mx-auto">Start generating amazing product photos to see them appear here.</p>
                    <Button className="mt-8 rounded-2xl px-8 h-12 font-bold" asChild>
                        <a href="/dashboard/generate">Start Creating</a>
                    </Button>
                </div>
            )}
        </div>
    );
}
