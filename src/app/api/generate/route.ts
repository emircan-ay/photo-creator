import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
    const supabase = await createClient(); // Await the promise from server utility
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let imageUrl, prompt;
    try {
        const body = await request.json();
        imageUrl = body.imageUrl;
        prompt = body.prompt;
    } catch (e) {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (!imageUrl || !prompt) {
        return NextResponse.json(
            { error: "Missing required fields: imageUrl and prompt" },
            { status: 400 }
        );
    }


    // 1. Check user credits
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) {
        return NextResponse.json(
            { error: "Could not fetch user profile" },
            { status: 500 }
        );
    }

    if (profile.credits < 1) {
        return NextResponse.json(
            { error: "Insufficient credits" },
            { status: 403 }
        );
    }

    try {
        // Using SDXL for reliable Img2Img results
        // Model: stability-ai/sdxl
        // Version: 39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b
        const output = await replicate.run(
            "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
            {
                input: {
                    prompt: `Professional product photography, ${prompt}, 8k, highly detailed, studio lighting, advertising style`,
                    image: imageUrl,
                    prompt_strength: 0.65, // Balance between original product shape and new scene
                    num_inference_steps: 30,
                    scheduler: "K_EULER_ANCESTRAL",
                    guidance_scale: 7.5,
                    high_noise_frac: 0.8,
                }
            }
        );

        // 2. Deduct credit if successful
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ credits: profile.credits - 1 })
            .eq("id", user.id);

        if (updateError) {
            console.error("Failed to deduct credit:", updateError);
            // We still return the image, but maybe log this for manual fix
        }

        // Output is usually an array of strings (URLs)
        return NextResponse.json({ result: output, remainingCredits: profile.credits - 1 });
    } catch (error) {
        console.error("Generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate image" },
            { status: 500 }
        );
    }
}
