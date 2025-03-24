"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, Bookmark } from "lucide-react"

export function FeaturedProjects() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {featuredProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

function ProjectCard({ project }) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  return (
    <Card className="overflow-hidden project-card">
      <div className="relative h-48">
        <img src={project.image || "/placeholder.svg"} alt={project.title} className="object-cover w-full h-full" />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <Link href={`/projects/${project.id}`} className="hover:underline">
              <h3 className="font-bold text-xl">{project.title}</h3>
            </Link>
            <p className="text-muted-foreground text-sm">{project.category}</p>
          </div>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">{project.type}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3">{project.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={project.author.avatar} alt={project.author.name} />
            <AvatarFallback>{project.author.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{project.author.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full btn-like ${liked ? "active" : ""}`}
            onClick={() => setLiked(!liked)}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full btn-bookmark ${bookmarked ? "active" : ""}`}
            onClick={() => setBookmarked(!bookmarked)}
          >
            <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

const featuredProjects = [
  {
    id: "1",
    title: "Городские силуэты",
    category: "Фотография",
    type: "Фотопроект",
    description: "Серия черно-белых фотографий, исследующих геометрию и ритмы современной городской архитектуры.",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1920&auto=format&fit=crop",
    author: {
      name: "Анна Соколова",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    date: "15 мая 2023",
  },
  {
    id: "2",
    title: "Абстрактные композиции",
    category: "Живопись",
    type: "Выставка",
    description: "Серия абстрактных работ, исследующих взаимодействие цвета, формы и текстуры в современном искусстве.",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=1920&auto=format&fit=crop",
    author: {
      name: "Михаил Волков",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    date: "3 июня 2023",
  },
  {
    id: "3",
    title: "Эхо мегаполиса",
    category: "Музыка",
    type: "Аудиопроект",
    description:
      "Экспериментальная композиция, созданная из звуков городской среды и преобразованная в современное электронное произведение.",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1920&auto=format&fit=crop",
    author: {
      name: "Елена Морозова",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    date: "20 апреля 2023",
  },
]

