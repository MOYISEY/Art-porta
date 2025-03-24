import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export function Categories() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link key={category.name} href={category.href}>
          <Card className="h-full transition-all hover:shadow-md">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
              <div className="rounded-full bg-primary/10 p-3 mb-3">{category.icon}</div>
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{category.count} проектов</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

const categories = [
  {
    name: "Живопись",
    icon: "🎨",
    count: 124,
    href: "/category/painting",
  },
  {
    name: "Фотография",
    icon: "📷",
    count: 98,
    href: "/category/photography",
  },
  {
    name: "Скульптура",
    icon: "🗿",
    count: 45,
    href: "/category/sculpture",
  },
  {
    name: "Дизайн",
    icon: "✏️",
    count: 87,
    href: "/category/design",
  },
  {
    name: "Музыка",
    icon: "🎵",
    count: 76,
    href: "/category/music",
  },
  {
    name: "Литература",
    icon: "📚",
    count: 63,
    href: "/category/literature",
  },
]

