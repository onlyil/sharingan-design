import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <main
      className="min-h-screen bg-background text-foreground relative overflow-hidden"
      itemScope
      itemType="https://schema.org/CreativeWork">
      {/* Large screen: left-right layout */}
      <article className="hidden lg:grid lg:grid-cols-2 h-screen relative">
        {/* Left side: image area */}
        <div className="relative overflow-hidden">
          <img
            src="/home-bg.jpeg"
            alt="Uchiha Itachi"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />
          {/* Central blend gradient - softer transition */}
          <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-background/30 via-background/15 to-transparent pointer-events-none backdrop-blur-[1px]" />
        </div>

        {/* Right side: content area */}
        <article className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-background via-background/98 to-background relative">
          {/* Left side blend gradient - more natural transition */}
          <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-black/15 via-black/5 to-transparent pointer-events-none" />

          {/* Central blend bridge - create middle transition layer */}
          <div className="absolute top-0 left-0 w-12 h-full bg-gradient-to-r from-background/40 via-background/20 to-transparent pointer-events-none backdrop-blur-sm" />
          <header className="max-w-2xl text-center">
            <h1
              className="text-5xl lg:text-7xl font-bold mb-6 text-balance"
              itemProp="headline">
              <span className="bg-gradient-to-r from-red-500 via-red-400 to-orange-400 bg-clip-text text-transparent">
                Mangekyō Sharingan Design
              </span>
            </h1>
            <p
              className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed"
              itemProp="description">
              Create your own unique Mangekyō sharingan and explore the endless
              artistic possibilities
            </p>
            <Link href="/design">
              <Button
                size="lg"
                className="px-12 py-6 text-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105">
                Have some fun
              </Button>
            </Link>
          </header>
        </article>
      </article>

      {/* Mobile and small screen: keep original layout */}
      <section className="lg:hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/home-bg.jpeg"
            alt="Uchiha Itachi"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        {/* Content area */}
        <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          {/* Title area */}
          <header className="text-center mb-12 max-w-4xl">
            <h1
              className="text-4xl md:text-6xl font-bold mb-6 text-balance"
              itemProp="headline">
              <span className="bg-gradient-to-r from-red-500 via-red-400 to-orange-400 bg-clip-text text-transparent">
                Mangekyō Sharingan Design
              </span>
            </h1>
            <p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              itemProp="description">
              Create your own unique Mangekyō sharingan and explore the endless
              the endless artistic possibilities
            </p>
          </header>

          {/* Start design button */}
          <div className="flex flex-col items-center gap-6">
            <Link href="/design">
              <Button
                size="lg"
                className="px-12 py-6 text-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105">
                Have some fun
              </Button>
            </Link>
          </div>
        </section>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
      </section>
    </main>
  )
}
