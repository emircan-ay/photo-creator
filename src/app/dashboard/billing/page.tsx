"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Sparkles, Zap, Shield, Crown } from "lucide-react";
import { toast } from "sonner";
import LiquidChrome from "@/components/bits/liquid-chrome";

export default function BillingPage() {
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
            setProfile(data);
        }
        loadProfile();
    }, []);

    const handleCheckout = (planName: string) => {
        setIsLoading(true);
        // Simulate a checkout delay
        setTimeout(() => {
            toast.success(`Redirecting to ${planName} checkout...`);
            setIsLoading(false);
        }, 1500);
    };

    const plans = [
        {
            name: "Starter",
            price: "$9",
            credits: "50",
            features: ["50 AI Generations", "High-res Downloads", "Basic Scraper Access", "Standard Support"],
            icon: Zap,
            color: "blue"
        },
        {
            name: "Pro",
            price: "$29",
            credits: "250",
            features: ["250 AI Generations", "4K Ultra HD Export", "Advanced Bulking", "Priority Support", "Custom Scene Saving"],
            icon: Crown,
            color: "primary",
            popular: true
        },
        {
            name: "Business",
            price: "$99",
            credits: "1200",
            features: ["1200 AI Generations", "Commercial License", "1-Click Store Modernization", "24/7 Dedicated Support", "White-label Options"],
            icon: Shield,
            color: "slate"
        }
    ];

    return (
        <div className="flex flex-col space-y-12 pb-20">
            <div className="relative overflow-hidden rounded-[3rem] bg-slate-950 p-12 text-white shadow-2xl">
                <div className="absolute inset-0 -z-10 opacity-30">
                    <LiquidChrome baseColor={[0.4, 0.1, 0.9]} speed={0.03} />
                </div>

                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs font-bold uppercase tracking-widest text-primary-foreground mb-4">
                        <Sparkles className="h-3 w-3" />
                        Billing & Subscriptions
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter mb-4">Fuel Your Creativity.</h1>
                    <p className="text-white/60 text-lg font-medium leading-relaxed">
                        Choose the fuel amount your business needs. You currently have <span className="text-white font-black">{profile?.credits || 0} credits</span> left.
                    </p>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {plans.map((plan) => (
                    <div key={plan.name} className={`group relative flex flex-col rounded-[2.5rem] border bg-card p-10 transition-all hover:shadow-2xl hover:-translate-y-2 ${plan.popular ? 'border-primary shadow-xl shadow-primary/10' : ''}`}>
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg">
                                Most Popular Choice
                            </div>
                        )}

                        <div className="mb-8">
                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${plan.popular ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}`}>
                                <plan.icon className="h-7 w-7 transition-transform group-hover:scale-110" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tight">{plan.name}</h3>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-4xl font-black">{plan.price}</span>
                                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">/ month</span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-10 flex-1">
                            {plan.features.map((feature) => (
                                <div key={feature} className="flex items-start gap-3">
                                    <div className={`mt-1 h-5 w-5 shrink-0 rounded-full flex items-center justify-center ${plan.popular ? 'bg-primary/20 text-primary' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                        <Check className="h-3 w-3" />
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Button
                            onClick={() => handleCheckout(plan.name)}
                            disabled={isLoading}
                            className={`h-14 rounded-2xl text-md font-bold transition-all ${plan.popular ? 'shadow-xl shadow-primary/20' : 'hover:bg-primary hover:text-white'}`}
                            variant={plan.popular ? "default" : "outline"}
                        >
                            {plan.name === "Starter" && profile?.credits > 0 ? "Current Plan" : `Upgrade to ${plan.name}`}
                        </Button>
                    </div>
                ))}
            </div>

            <div className="rounded-[2.5rem] border bg-muted/30 p-10 flex flex-col md:flex-row items-center gap-8">
                <div className="h-20 w-20 rounded-3xl bg-background shadow-xl flex items-center justify-center shrink-0">
                    <CreditCard className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-2xl font-black tracking-tight">Need a custom plan?</h4>
                    <p className="text-muted-foreground font-medium mt-1">For large volume agencies and multiple store owners, we offer tailored enterprise solutions.</p>
                </div>
                <Button variant="ghost" className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest">Contact Sales</Button>
            </div>
        </div>
    );
}
