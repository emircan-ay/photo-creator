
"use client";

import { useState } from "react";
import { UploadZone } from "@/components/generate/upload-zone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Download, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { ProductShowcaseCard } from "@/components/ui/cards";
import LiquidChrome from "@/components/bits/liquid-chrome";

export default function GeneratePage() {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [productId, setProductId] = useState<string | null>(null);
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]);

    const handleGenerate = async () => {
        if (!imageUrl || !prompt) return;

        setIsGenerating(true);
        setGeneratedImage(null);

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    imageUrl,
                    productId,
                    prompt,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate image");
            }

            const data = await response.json();

            // Replicate usually returns an array of strings
            if (data.result && Array.isArray(data.result) && data.result.length > 0) {
                const newImg = data.result[0];
                setGeneratedImage(newImg);
                setHistory(prev => [newImg, ...prev].slice(0, 5));
                toast.success("Image generated successfully!");
            } else {
                toast.error("No image returned from AI");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col space-y-8 pb-12">
            <div className="flex flex-col space-y-2">
                <h1 className="text-4xl font-black tracking-tight flex items-center gap-2">
                    <Wand2 className="h-8 w-8 text-primary" />
                    AI Creative Studio
                </h1>
                <p className="text-muted-foreground text-lg">
                    Transform ordinary product shots into high-end marketing assets.
                </p>
            </div>

            <div className="grid gap-10 lg:grid-cols-2">
                {/* Left Column: Input */}
                <div className="space-y-8">
                    <div className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm shadow-primary/5 transition-all hover:shadow-md">
                        <div className="absolute inset-0 -z-10 opacity-10">
                            <LiquidChrome baseColor={[0.6, 0.4, 0.9]} speed={0.1} />
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">1</span>
                                    Upload Product
                                </h3>
                                <UploadZone
                                    onUploadComplete={(url, id) => {
                                        setImageUrl(url);
                                        setProductId(id || null);
                                    }}
                                    onClear={() => {
                                        setImageUrl(null);
                                        setProductId(null);
                                        setGeneratedImage(null);
                                    }}
                                />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">2</span>
                                    Define the Scene
                                </h3>
                                <div className="grid gap-3">
                                    <Label htmlFor="prompt" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Detailed Description</Label>
                                    <Input
                                        id="prompt"
                                        className="h-12 rounded-xl bg-background/50 backdrop-blur-md transition-all focus:ring-2 focus:ring-primary/20"
                                        placeholder="E.g., on a minimal marble pedestal, soft morning sunlight, bokeh foliage..."
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        disabled={isGenerating}
                                    />
                                </div>
                                <Button
                                    onClick={handleGenerate}
                                    disabled={!imageUrl || !prompt || isGenerating}
                                    className="w-full h-14 rounded-xl text-md font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    size="lg"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Crafting Visual...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-5 w-5" />
                                            Generate Masterpiece
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Result */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold">Studio Result</h3>
                    <div className="group relative aspect-square w-full items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-primary/20 bg-muted/30 flex shadow-inner transition-all hover:border-primary/40">
                        {generatedImage ? (
                            <>
                                <Image
                                    src={generatedImage}
                                    alt="Generated Image"
                                    fill
                                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.02]"
                                />
                                <div className="absolute bottom-6 right-6 z-10 translate-y-4 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                                    <Button
                                        size="lg"
                                        className="rounded-full shadow-xl"
                                        onClick={() => window.open(generatedImage, "_blank")}
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Export HD
                                    </Button>
                                </div>
                            </>
                        ) : isGenerating ? (
                            <div className="flex flex-col items-center gap-6 text-center">
                                <div className="relative h-20 w-20">
                                    <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                                    <Sparkles className="relative h-20 w-20 animate-pulse text-primary" />
                                </div>
                                <p className="text-lg font-medium text-muted-foreground">Synthesizing Pixels...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4 text-muted-foreground">
                                <div className="p-6 rounded-3xl bg-background/50 backdrop-blur-xl border border-white/10 shadow-xl">
                                    <Sparkles className="h-12 w-12 text-primary/40" />
                                </div>
                                <p className="font-medium">Your creation will appear here</p>
                            </div>
                        )}
                    </div>

                    {history.length > 0 && (
                        <div className="py-8">
                            <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">Recent Creations</h4>
                            <div className="flex gap-4 overflow-x-auto pb-4">
                                {history.map((img, i) => (
                                    <div key={i} className="relative h-24 w-24 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border transition-all hover:scale-105" onClick={() => setGeneratedImage(img)}>
                                        <Image src={img} alt="History" fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
