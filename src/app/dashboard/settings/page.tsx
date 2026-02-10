"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, User, Mail, CreditCard, Shield, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import LiquidChrome from "@/components/bits/liquid-chrome";

export default function SettingsPage() {
    const [profile, setProfile] = useState<any>(null);
    const [fullName, setFullName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
            if (data) {
                setProfile({ ...data, email: user.email });
                setFullName(data.full_name || "");
            }
        }
        loadProfile();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        const { error } = await supabase
            .from("profiles")
            .update({ full_name: fullName })
            .eq("id", profile.id);

        if (error) {
            toast.error("Failed to update profile");
        } else {
            toast.success("Profile updated successfully!");
        }
        setIsSaving(false);
    };

    return (
        <div className="flex flex-col space-y-8 pb-20">
            <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-10 text-white">
                <div className="absolute inset-0 -z-10 opacity-20">
                    <LiquidChrome baseColor={[0.8, 0.2, 0.5]} speed={0.04} />
                </div>
                <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                    <Settings className="h-8 w-8 text-primary" />
                    Account Settings
                </h1>
                <p className="mt-2 text-white/60 font-medium">Manage your profile and studio preferences.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="rounded-[2rem] border shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Personal Information
                            </CardTitle>
                            <CardDescription>Update your profile details displayed across the studio.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="h-11 rounded-xl bg-background border-muted"
                                    />
                                </div>
                                <div className="space-y-2 opacity-50">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            value={profile?.email || ""}
                                            disabled
                                            className="h-11 pl-10 rounded-xl bg-muted/50 border-muted font-medium"
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-1">Email cannot be changed manually.</p>
                                </div>
                            </div>

                            <Button onClick={handleSave} disabled={isSaving} className="rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/20">
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                Save Changes
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] border shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                Security & Privacy
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-muted">
                                <div className="space-y-1">
                                    <p className="font-bold">Password</p>
                                    <p className="text-xs text-muted-foreground">Last changed 2 months ago</p>
                                </div>
                                <Button variant="outline" size="sm" className="rounded-xl font-bold">Update</Button>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-muted">
                                <div className="space-y-1">
                                    <p className="font-bold">Two-Factor Authentication</p>
                                    <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                                </div>
                                <Button variant="outline" size="sm" className="rounded-xl font-bold">Enable</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="rounded-[2.5rem] bg-primary text-primary-foreground shadow-xl shadow-primary/20 border-none relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <CreditCard className="h-24 w-24" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-2xl font-black">Plan Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 relative z-10">
                            <div className="space-y-1">
                                <p className="text-primary-foreground/60 text-xs font-bold uppercase tracking-widest">Active Plan</p>
                                <p className="text-3xl font-black italic">Starter</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-primary-foreground/60 text-xs font-bold uppercase tracking-widest">Remaining Credits</p>
                                <p className="text-3xl font-black">{profile?.credits || 0}</p>
                            </div>
                            <Button variant="secondary" className="w-full h-12 rounded-2xl font-bold shadow-inner" asChild>
                                <a href="/dashboard/billing">Manage Billing</a>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
