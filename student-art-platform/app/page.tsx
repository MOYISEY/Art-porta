import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FeaturedProjects } from "@/components/featured-projects"
import { RecentProjects } from "@/components/recent-projects"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-background z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-2">
                Творческая платформа для студентов
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Раскрой свой творческий потенциал</h1>
              <p className="text-xl text-muted-foreground">
                Публикуй, обсуждай и открывай для себя уникальные культурные и художественные проекты студентов.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/projects">Смотреть проекты</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link href="/submit">Опубликовать проект</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20 dark:from-primary/10 dark:to-primary/30">
              <h2 className="text-8xl md:text-9xl font-bold text-primary/80 tracking-tighter">AITU</h2>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Избранные проекты</h2>
          <Button variant="ghost" asChild className="group">
            <Link href="/projects" className="flex items-center gap-2">
              Все проекты
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        <FeaturedProjects />
      </section>

      {/* Recent Projects */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Недавние проекты</h2>
            <Button variant="ghost" asChild className="group">
              <Link href="/projects" className="flex items-center gap-2">
                Все проекты
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <RecentProjects />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center">
        <div className="max-w-3xl mx-auto space-y-6 px-4">
          <h2 className="text-3xl font-bold">Готов поделиться своим проектом?</h2>
          <p className="text-xl text-muted-foreground">
            Присоединяйся к сообществу творческих студентов и получай ценные отзывы о своей работе.
          </p>
          <Button asChild size="lg" className="rounded-full">
            <Link href="/submit">Создать проект</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

