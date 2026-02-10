"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signup } from "../login/actions"
import { Sparkles, ArrowRight, Lock, Mail, Loader2, AlertCircle, User } from "lucide-react"
import LiquidChrome from "@/components/bits/liquid-chrome"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link";

function SignupButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            formAction={signup}
            disabled={pending}
            className="h-12 rounded-xl font-bold transition-all hover:scale-[1.02] shadow-lg shadow-primary/20"
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                </>
            ) : (
                <>
                    Create Free Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                </>
            )}
        </Button>
    )
}

function SignupForm() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    return (
        <form className="grid gap-6">
            {error && (
                <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">User Name / Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="fullName"
                            name="fullName"
                            type="text"
                            placeholder="John Doe"
                            required
                            className="h-11 pl-10 rounded-xl bg-background/50 border-white/10"
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Work Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@company.com"
                            required
                            className="h-11 pl-10 rounded-xl bg-background/50 border-white/10"
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            className="h-11 pl-10 rounded-xl bg-background/50 border-white/10"
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Confirm Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            required
                            className="h-11 pl-10 rounded-xl bg-background/50 border-white/10"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <SignupButton />
                <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/5" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-transparent px-2 text-muted-foreground font-medium">Already have an account?</span>
                    </div>
                </div>
                <Button variant="outline" className="h-12 rounded-xl font-bold border-white/10 bg-white/5 hover:bg-white/10" asChild>
                    <Link href="/login">
                        Sign In Instead
                    </Link>
                </Button>
            </div>
        </form>
    );
}

export default function SignupPage() {
    return (
        <div className="relative flex min-h-screen w-full items-center justify-center p-4 overflow-hidden bg-background">
            <div className="absolute inset-0 -z-10 opacity-30">
                <LiquidChrome baseColor={[0.5, 0.2, 0.8]} speed={0.05} />
            </div>

            <div className="z-10 w-full max-w-lg animate-in fade-in zoom-in-95 duration-500">
                <div className="mb-10 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 backdrop-blur-xl border border-primary/20">
                        <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">Join VisionAI Studio</h1>
                    <p className="mt-2 text-muted-foreground">Start creating magical product photos today.</p>
                </div>

                <Card className="glass shadow-2xl border-white/10 overflow-hidden">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                        <CardDescription>
                            Sign up to get 10 free credits instantly.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Suspense fallback={<div className="h-64 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
                            <SignupForm />
                        </Suspense>
                    </CardContent>
                </Card>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                    By signing up, you agree to our Terms of Service.
                </p>
            </div>
        </div>
    )
}
