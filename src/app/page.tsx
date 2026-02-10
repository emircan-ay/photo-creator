
import { Button } from "@/components/ui/button"
import { RetroGrid } from "@/components/ui/retro-grid"
import { ShineBorder } from "@/components/ui/hero-designali"
import DecryptedText from "@/components/bits/decrypted-text"
import Link from "next/link"

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      <RetroGrid />

      <div className="z-10 flex flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm">
          <span className="mr-2 h-1 w-1 rounded-full bg-primary animate-pulse" />
          Powered by Advanced Flux AI
        </div>

        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl">
          <DecryptedText
            text="Transform Your Products"
            animateOn="view"
            revealDirection="center"
            className="block"
          />
          <span className="mt-2 block bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            With AI Magic
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Create studio-quality product photos in seconds. The default visual engine for modern e-commerce sellers worldwide.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <ShineBorder color={["#A07CFE", "#FE8FB5", "#FFBE7B"]} borderRadius={40}>
            <Button size="lg" className="h-14 rounded-full px-8 text-base font-semibold transition-all hover:scale-105" asChild>
              <Link href="/login">Get Started Free</Link>
            </Button>
          </ShineBorder>

          <Button variant="ghost" size="lg" className="h-14 rounded-full px-8 text-base font-semibold" asChild>
            <Link href="/dashboard">Watch Demo</Link>
          </Button>
        </div>
      </div>

      <div className="pointer-events-none z-10 mt-20 flex items-center justify-center gap-8 opacity-40 grayscale transition-all hover:opacity-100 hover:grayscale-0">
        <div className="text-xl font-black tracking-tighter">SHOPIFY</div>
        <div className="text-xl font-black tracking-tighter">ETSY</div>
        <div className="text-xl font-black tracking-tighter">AMAZON</div>
      </div>
    </div>
  )
}
