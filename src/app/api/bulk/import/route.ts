
import { ApifyClient } from 'apify-client';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const client = new ApifyClient({
    token: process.env.APIFY_API_TOKEN,
});

export async function POST(req: Request) {
    try {
        const { storeUrl } = await req.json();
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!storeUrl) {
            return NextResponse.json({ error: "Store URL is required" }, { status: 400 });
        }

        // 1. Prepare input for dhrumil/shopify-products-scraper
        const input = {
            "startUrls": [
                {
                    "url": storeUrl.endsWith('/') ? `${storeUrl}collections/all` : `${storeUrl}/collections/all`
                }
            ],
            "maxItems": 20, // Limited for demo/starting
            "proxyConfiguration": {
                "useApifyProxy": true
            }
        };

        // 2. Start the actor and wait for it to finish
        // For production, we would use a webhook or poll. 
        // For 20 items, it's usually fast enough to wait.
        const run = await client.actor("dhrumil/shopify-products-scraper").call(input);

        // 3. Fetch results from the dataset
        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        // 4. Return results to frontend
        return NextResponse.json({
            success: true,
            products: items,
            runId: run.id
        });

    } catch (error: any) {
        console.error("Apify error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
