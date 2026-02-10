import { Button } from "@/components/ui/button"
import { ShineBorder } from "@/components/ui/hero-designali"
import DecryptedText from "@/components/bits/decrypted-text"
import Link from "next/link"
import LiquidChrome from "@/components/bits/liquid-chrome"

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 opacity-40">
        <LiquidChrome baseColor={[0.1, 0.4, 0.9]} speed={0.02} />
      </div>

      <div className="z-10 flex flex-col items-center justify-center px-4 text-center">
        <div className="mb-8 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary backdrop-blur-md">
          <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          The New Standard of Product Photography
        </div>

        <h1 className="max-w-5xl text-6xl font-black tracking-tighter sm:text-8xl leading-[0.85] text-white">
          Transform Your <br />
          <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Product Photos
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg font-medium text-white/50 leading-relaxed">
          Create studio-quality lifestyle shots in seconds. The default visual engine for modern e-commerce sellers worldwide.
        </p>

        <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row">
          <ShineBorder color={["#A07CFE", "#FE8FB5", "#FFBE7B"]} borderRadius={40}>
            <Button size="lg" className="h-16 rounded-full px-10 text-lg font-bold transition-all hover:scale-105 shadow-2xl shadow-primary/20" asChild>
              <Link href="/login">Get Started Free</Link>
            </Button>
          </ShineBorder>

          <Button variant="ghost" size="lg" className="h-16 rounded-full px-10 text-lg font-bold hover:bg-primary/5" asChild>
            <Link href="/dashboard">Watch Demo</Link>
          </Button>
        </div>
      </div>

      <div className="pointer-events-none z-10 mt-24 flex items-center justify-center gap-12 opacity-30 grayscale transition-all hover:opacity-60">
        <div className="text-2xl font-black tracking-tighter">SHOPIFY</div>
        <div className="text-2xl font-black tracking-tighter">ETSY</div>
        <div className="text-2xl font-black tracking-tighter">AMAZON</div>
      </div>
    </div>
  )
}
