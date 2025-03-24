"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageSquare, Heart } from "lucide-react"

export function RecentProjects() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {recentProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

function ProjectCard({ project }) {
  const [liked, setLiked] = useState(false)

  return (
    <Card className="overflow-hidden project-card">
      <div className="relative h-40">
        <img src={project.image || "/placeholder.svg"} alt={project.title} className="object-cover w-full h-full" />
        <Badge className="absolute top-2 right-2 bg-primary/10 text-primary hover:bg-primary/20 border-0">
          {project.category}
        </Badge>
      </div>
      <CardContent className="pt-4">
        <Link href={`/projects/${project.id}`} className="hover:text-primary transition-colors">
          <h3 className="font-bold text-lg">{project.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{project.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={project.author.avatar} alt={project.author.name} />
            <AvatarFallback>{project.author.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{project.author.name}</span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 px-2 flex items-center gap-1 btn-like ${liked ? "active" : ""}`}
            onClick={() => setLiked(!liked)}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            <span className="text-xs">{liked ? project.likes + 1 : project.likes}</span>
          </Button>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs">{project.comments}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

const recentProjects = [
  {
    id: "4",
    title: "Цифровые миры",
    category: "Дизайн",
    description: "Серия цифровых иллюстраций, создающих фантастические миры с уникальной атмосферой и персонажами.",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1920&auto=format&fit=crop",
    author: {
      name: "Дмитрий Лебедев",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    likes: 24,
    comments: 8,
  },
  {
    id: "5",
    title: "Стихи о современности",
    category: "Литература",
    description:
      "Сборник стихотворений, исследующих темы технологий, отчуждения и поиска идентичности в цифровую эпоху.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1920&auto=format&fit=crop",
    author: {
      name: "Ольга Белова",
      avatar: "https://randomuser.me/api/portraits/women/29.jpg",
    },
    likes: 15,
    comments: 5,
  },
  {
    id: "6",
    title: "Органические формы",
    category: "Скульптура",
    description: "Серия керамических скульптур, вдохновленных природными формами и органическими структурами.",
    image: "https://images.unsplash.com/photo-1544413164-5f1b295eb435?q=80&w=1920&auto=format&fit=crop",
    author: {
      name: "Алексей Новиков",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    likes: 32,
    comments: 12,
  },
  {
    id: "7",
    title: "Человек и технологии",
    category: "Видео",
    description:
      "Короткометражный экспериментальный фильм о взаимоотношениях человека и технологий в современном мире.",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1920&auto=format&fit=crop",
    author: {
      name: "Мария Кузнецова",
      avatar: "https://randomuser.me/api/portraits/women/17.jpg",
    },
    likes: 45,
    comments: 18,
  },
]

