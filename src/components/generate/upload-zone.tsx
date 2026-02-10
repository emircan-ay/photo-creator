
"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface UploadZoneProps {
    onUploadComplete: (url: string) => void;
    onClear: () => void;
}

export function UploadZone({ onUploadComplete, onClear }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const supabase = createClient();

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleUpload(file);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
    };

    const handleUpload = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        // Max 10MB
        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size must be less than 10MB");
            return;
        }

        setIsUploading(true);
        setPreview(URL.createObjectURL(file));

        try {
            const fileName = `${Date.now()}-${file.name}`;
            const { error } = await supabase.storage
                .from("products")
                .upload(fileName, file);

            if (error) {
                // Handle specific error for bucket not found
                if (error.message.includes("Bucket not found")) {
                    toast.error("Storage bucket not found. Please create 'products' bucket.");
                    throw error;
                }
                throw error;
            };

            const { data: publicUrlData } = supabase.storage
                .from("products")
                .getPublicUrl(fileName);

            onUploadComplete(publicUrlData.publicUrl);
            toast.success("Image uploaded successfully");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image");
            setPreview(null);
            onClear();
        } finally {
            setIsUploading(false);
        }
    };

    const clearImage = () => {
        setPreview(null);
        onClear();
    };

    if (preview) {
        return (
            <Card className="relative overflow-hidden aspect-square w-full max-w-md mx-auto border-dashed border-2 flex items-center justify-center bg-muted/30">
                <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-contain p-4"
                />
                <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 z-10"
                    onClick={clearImage}
                    disabled={isUploading}
                >
                    <X className="h-4 w-4" />
                </Button>
                {isUploading && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
            </Card>
        );
    }

    return (
        <Card
            className={`relative aspect-square w-full max-w-md mx-auto border-dashed border-2 flex flex-col items-center justify-center transition-colors cursor-pointer hover:bg-muted/50 ${isDragging ? "border-primary bg-muted/50" : "border-muted-foreground/25"
                }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-upload")?.click()}
        >
            <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
            />
            <div className="flex flex-col items-center gap-2 text-center p-4">
                <div className="p-4 rounded-full bg-primary/10">
                    <UploadCloud className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-1">
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground">
                        SVG, PNG, JPG or WEBP (max 10MB)
                    </p>
                </div>
            </div>
        </Card>
    );
}
