
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function PricingPage() {
    return (
        <div className="flex flex-col space-y-8 pb-12">
            <div className="flex flex-col space-y-2 text-center md:text-left">
                <h1 className="text-3xl font-bold tracking-tight">Upgrade your plan</h1>
                <p className="text-muted-foreground">
                    Choose the plan that fits your business needs.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Starter Plan */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col">
                    <div className="p-6 flex-1">
                        <h3 className="text-xl font-bold">Starter</h3>
                        <div className="mt-4 flex items-baseline text-3xl font-bold">
                            $9
                            <span className="ml-1 text-sm font-medium text-muted-foreground">/mo</span>
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Perfect for individuals and hobbyists starting out.
                        </p>
                        <ul className="mt-6 space-y-4 text-sm">
                            <li className="flex">
                                <Check className="mr-2 h-4 w-4 text-primary" />
                                50 Credits / month
                            </li>
                            <li className="flex">
                                <Check className="mr-2 h-4 w-4 text-primary" />
                                Standard Resolution
                            </li>
                            <li className="flex">
                                <Check className="mr-2 h-4 w-4 text-primary" />
                                Basic Templates
                            </li>
                        </ul>
                    </div>
                    <div className="p-6 pt-0">
                        <Button className="w-full" variant="outline">Current Plan</Button>
                    </div>
                </div>

                {/* Pro Plan */}
                <div className="rounded-xl border border-primary bg-card text-card-foreground shadow-md flex flex-col relative">
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                        <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                            Most Popular
                        </span>
                    </div>
                    <div className="p-6 flex-1">
                        <h3 className="text-xl font-bold">Pro</h3>
                        <div className="mt-4 flex items-baseline text-3xl font-bold">
                            $29
                            <span className="ml-1 text-sm font-medium text-muted-foreground">/mo</span>
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground">
                            For professional sellers and growing brands.
                        </p>
                        <ul className="mt-6 space-y-4 text-sm">
                            <li className="flex">
                                <Check className="mr-2 h-4 w-4 text-primary" />
                                250 Credits / month
                            </li>
                            <li className="flex">
                                <Check className="mr-2 h-4 w-4 text-primary" />
                                High Resolution (4K)
                            </li>
                            <li className="flex">
                                <Check className="mr-2 h-4 w-4 text-primary" />
                                Trend Intelligence Packs
                            </li>
                            <li className="flex">
                                <Check className="mr-2 h-4 w-4 text-primary" />
                                Bulk Processing
                            </li>
                        </ul>
                    </div>
                    <div className="p-6 pt-0">
                        <Button className="w-full">Upgrade to Pro</Button>
                    </div>
                </div>

                {/* Business Plan */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col">
                    <div className="p-6 flex-1">
                        <h3 className="text-xl font-bold">Business</h3>
                        <div className="mt-4 flex items-baseline text-3xl font-bold">
                            $99
                            <span className="ml-1 text-sm font-medium text-muted-foreground">/mo</span>
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground">
                            For agencies and large scale operations.
                        </p>
                        <ul className="mt-6 space-y-4 text-sm">
                            <li className="flex">
                                <Check className="mr-2 h-4 w-4 text-primary" />
                                1200 Credits / month
                            </li>
                            <li className="flex">
                                <Check className="mr-2 h-4 w-4 text-primary" />
                                API Access
                            </li>
                            <li className="flex">
                                <Check className="mr-2 h-4 w-4 text-primary" />
                                Store Modernization (1-Click)
                                <span className="ml-2 text-[10px] font-bold text-primary uppercase bg-primary/10 px-1.5 py-0.5 rounded leading-none">New</span>
                            </li>
                            <li className="flex">
                                <Check className="mr-2 h-4 w-4 text-primary" />
                                Priority Support
                            </li>
                        </ul>
                    </div>
                    <div className="p-6 pt-0">
                        <Button className="w-full" variant="outline">Contact Sales</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
