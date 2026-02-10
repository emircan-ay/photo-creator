"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Store, ShoppingBag, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import LiquidChrome from "@/components/bits/liquid-chrome";

export default function BulkImportPage() {
    const [storeUrl, setStoreUrl] = useState("");
    const [isImporting, setIsImporting] = useState(false);
    const [importStatus, setImportStatus] = useState<string | null>(null);
    const [scrapedProducts, setScrapedProducts] = useState<any[]>([]);
    const [processingProduct, setProcessingProduct] = useState<number | null>(null);

    const handleImport = async () => {
        if (!storeUrl) return;

        setIsImporting(true);
        setImportStatus("Connecting to Shopify store...");
        setScrapedProducts([]);

        try {
            const response = await fetch("/api/bulk/import", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ storeUrl }),
            });

            if (!response.ok) {
                throw new Error("Failed to start import");
            }

            const data = await response.json();
            setScrapedProducts(data.products || []);
            setImportStatus(null);
            toast.success(`Successfully imported ${data.products?.length || 0} products!`);
        } catch (error) {
            console.error(error);
            toast.error("Import failed. Please check the URL and try again.");
            setImportStatus(null);
        } finally {
            setIsImporting(false);
        }
    };

    const modernizeAll = async () => {
        if (scrapedProducts.length === 0) return;

        toast.info("Starting bulk modernization...");
        for (let i = 0; i < scrapedProducts.length; i++) {
            setProcessingProduct(i);
            const product = scrapedProducts[i];

            try {
                const imgUrl = product.images?.[0]?.src || product.images?.[0];
                if (!imgUrl) continue;

                const res = await fetch("/api/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        imageUrl: imgUrl,
                        prompt: "professional studio product photography, minimal marble background, soft natural lighting, high resolution, extremely detailed",
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    setScrapedProducts(prev => {
                        const updated = [...prev];
                        updated[i] = { ...updated[i], modernizedImage: data.result[0] };
                        return updated;
                    });
                }
            } catch (e) {
                console.error("Failed to modernize product", i);
            }
        }
        setProcessingProduct(null);
        toast.success("All products modernized!");
    };

    return (
        <div className="flex flex-col space-y-8 pb-12">
            <div className="flex flex-col space-y-2">
                <h1 className="text-4xl font-black tracking-tight flex items-center gap-2">
                    <Store className="h-8 w-8 text-primary" />
                    Store Modernizer
                </h1>
                <p className="text-muted-foreground text-lg">
                    Import your entire Shopify store and modernize every product photo with 1-click.
                </p>
            </div>

            <div className="grid gap-10 lg:grid-cols-3">
                {/* Left Column: Import Form */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="relative overflow-hidden rounded-3xl border bg-card p-8 shadow-sm transition-all hover:shadow-md">
                        <div className="absolute inset-0 -z-10 opacity-5">
                            <LiquidChrome baseColor={[0.1, 0.8, 0.4]} speed={0.05} />
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <Label htmlFor="storeUrl" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Shopify Store URL</Label>
                                <div className="relative">
                                    <Input
                                        id="storeUrl"
                                        className="h-14 rounded-2xl bg-background/50 pl-12 pr-4 backdrop-blur-md focus:ring-2 focus:ring-primary/20"
                                        placeholder="https://your-store.com"
                                        value={storeUrl}
                                        onChange={(e) => setStoreUrl(e.target.value)}
                                        disabled={isImporting}
                                    />
                                    <Store className="absolute left-4 top-4 h-6 w-6 text-muted-foreground" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button
                                    onClick={handleImport}
                                    disabled={!storeUrl || isImporting}
                                    className="w-full h-14 rounded-2xl text-md font-bold transition-all hover:scale-[1.02]"
                                    size="lg"
                                >
                                    {isImporting ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Scanning Store...
                                        </>
                                    ) : (
                                        <>
                                            Import Products
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </>
                                    )}
                                </Button>

                                {scrapedProducts.length > 0 && (
                                    <Button
                                        onClick={modernizeAll}
                                        disabled={processingProduct !== null}
                                        variant="secondary"
                                        className="w-full h-14 rounded-2xl text-md font-bold border-2 border-primary/20 text-primary"
                                    >
                                        {processingProduct !== null ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Processing {processingProduct + 1}/{scrapedProducts.length}
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="mr-2 h-5 w-5" />
                                                Modernize All Selection
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>

                            {importStatus && (
                                <div className="flex items-center gap-3 rounded-xl bg-primary/5 p-4 text-sm text-primary animate-pulse">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    {importStatus}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-muted/30 p-6 space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-widest">How it works</h4>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <div className="flex gap-3">
                                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                                <span>We scan your public Shopify product list.</span>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                                <span>All product images are extracted in high-res.</span>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                                <span>AI applies global studio lighting to every shot.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Preview Grid */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">Imported Products</h3>
                        <span className="text-sm font-medium text-muted-foreground">
                            {scrapedProducts.length} items found
                        </span>
                    </div>

                    {scrapedProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {scrapedProducts.map((product, i) => (
                                <div key={i} className={`group relative overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-lg ${processingProduct === i ? 'ring-2 ring-primary bg-primary/5 animate-pulse' : ''}`}>
                                    <div className="aspect-square relative flex items-center justify-center p-4">
                                        {product.modernizedImage ? (
                                            <div className="relative h-full w-full">
                                                <img
                                                    src={product.modernizedImage}
                                                    alt={product.title}
                                                    className="h-full w-full object-contain transition-transform group-hover:scale-105"
                                                />
                                                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                                                    MODERNIZED
                                                </div>
                                            </div>
                                        ) : product.images && product.images[0] ? (
                                            <img
                                                src={product.images[0].src || product.images[0]}
                                                alt={product.title}
                                                className="h-full w-full object-contain transition-transform group-hover:scale-105"
                                            />
                                        ) : (
                                            <ShoppingBag className="h-12 w-12 text-muted-foreground/20" />
                                        )}
                                    </div>
                                    <div className="p-4 border-t bg-muted/10">
                                        <p className="text-xs font-bold uppercase tracking-widest text-primary truncate mb-1">
                                            {product.vendor || "Shopify Item"}
                                        </p>
                                        <h4 className="text-sm font-semibold truncate leading-tight group-hover:text-primary transition-colors">
                                            {product.title}
                                        </h4>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-primary scale-x-0 transition-transform group-hover:scale-x-100" />
                                </div>
                            ))}
                        </div>
                    ) : !isImporting ? (
                        <div className="flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-muted bg-muted/10 text-muted-foreground text-center">
                            <div className="p-6 rounded-3xl bg-background shadow-xl mb-4">
                                <ShoppingBag className="h-12 w-12 opacity-20" />
                            </div>
                            <p className="font-medium text-lg">Enter a store URL to see your products</p>
                            <p className="text-sm max-w-xs mx-auto mt-2">We'll fetch titles, descriptions, and high-res images automatically.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="aspect-[4/5] rounded-2xl bg-muted animate-pulse" />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
