import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* 背景图片 */}
      <div className="absolute inset-0 z-0">
        <img
          src="/uchiha-itachi-silhouette-with-sharingan-eyes-glowi.jpg"
          alt="Uchiha Itachi"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      {/* 内容区域 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* 标题区域 */}
        <div className="text-center mb-12 max-w-4xl">
          <h1 className="text-4xl md:text-8xl font-bold mb-6 text-balance">
            <span className="bg-gradient-to-r from-red-500 via-red-400 to-orange-400 bg-clip-text text-transparent [&]:text-red-400">
              Mangekyō Sharingan Design
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Create your own unique kaleidoscope of eye patterns and explore the endless artistic possibilities
          </p>
        </div>

        {/* 开始设计按钮 */}
        <div className="flex flex-col items-center gap-6">
          <Link href="/design">
            <Button
              size="lg"
              className="px-12 py-6 text-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
            >
              Have some fun
            </Button>
          </Link>
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
    </main>
  )
}
