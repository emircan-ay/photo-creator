"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { User, Mail, Shield, LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SettingsPage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
            setProfile(data);
            setLoading(false);
        }
        loadProfile();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from("profiles")
            .update({
                full_name: profile.full_name,
                username: profile.username,
            })
            .eq("id", user.id);

        if (error) {
            toast.error("Failed to update profile");
        } else {
            toast.success("Profile updated successfully!");
        }
        setSaving(false);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        toast.success("Signed out successfully");
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="flex flex-col space-y-8 pb-12">
            <div className="flex flex-col space-y-2">
                <h1 className="text-4xl font-black tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground text-lg">Manage your profile and security preferences.</p>
            </div>

            <div className="grid gap-10 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Profile Information
                            </CardTitle>
                            <CardDescription>This information will be used for your account and bills.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="full_name">Full Name</Label>
                                        <Input
                                            id="full_name"
                                            value={profile.full_name || ""}
                                            onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                                            className="rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                            id="username"
                                            value={profile.username || ""}
                                            onChange={e => setProfile({ ...profile, username: e.target.value })}
                                            className="rounded-xl"
                                        />
                                    </div>
                                </div>
                                <Button disabled={saving} className="rounded-xl font-bold px-8">
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                Security
                            </CardTitle>
                            <CardDescription>Keep your account secure.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-background">
                                        <Mail className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Email Address</p>
                                        <p className="text-xs text-muted-foreground">{profile.id} (Linked)</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="font-bold">Update</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="glass-card border-none bg-primary/5">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Credits & Usage</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center p-6 rounded-2xl bg-background shadow-inner">
                                <div className="text-4xl font-black text-primary mb-1">{profile.credits}</div>
                                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Credits Remaining</div>
                            </div>
                            <Button className="w-full rounded-xl font-bold" variant="outline" asChild>
                                <Link href="/dashboard/billing">Refill Credits</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Button
                        variant="destructive"
                        className="w-full rounded-xl font-bold h-12 flex items-center justify-center gap-2"
                        onClick={handleSignOut}
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </div>
    );
}
