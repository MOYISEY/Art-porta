"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Settings, Grid, List, BookmarkIcon, Heart } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Бахтияр Зикирин" />
                  <AvatarFallback className="text-2xl">БЗ</AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                  asChild
                >
                  <Link href="/settings">
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
                  <h1 className="text-2xl font-bold">Бахтияр Зикирин</h1>
                  <div className="flex justify-center md:justify-start gap-2">
                    <Badge variant="outline">Студент</Badge>
                    <Badge variant="outline">Дизайнер</Badge>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">
                  Студент колледжа AITU, увлекаюсь веб-дизайном и разработкой. Создаю проекты на стыке искусства и
                  технологий.
                </p>

                <div className="flex justify-center md:justify-start gap-4 mb-4">
                  <div className="text-center">
                    <div className="font-bold">12</div>
                    <div className="text-sm text-muted-foreground">Проектов</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">48</div>
                    <div className="text-sm text-muted-foreground">Подписчиков</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">36</div>
                    <div className="text-sm text-muted-foreground">Подписок</div>
                  </div>
                </div>

                <div className="flex justify-center md:justify-start gap-2">
                  <Button asChild>
                    <Link href="/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Настройки
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">Мои проекты</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects">
        <TabsList className="mb-6">
          <TabsTrigger value="projects">Мои проекты</TabsTrigger>
          <TabsTrigger value="saved">Сохраненные</TabsTrigger>
          <TabsTrigger value="liked">Понравившиеся</TabsTrigger>
        </TabsList>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Проекты</h2>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="projects">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {userProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {userProjects.map((project) => (
                <ProjectListItem key={project.id} project={project} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {savedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {savedProjects.map((project) => (
                <ProjectListItem key={project.id} project={project} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="liked">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {likedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {likedProjects.map((project) => (
                <ProjectListItem key={project.id} project={project} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProjectCard({ project }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48">
        <img src={project.image || "/placeholder.svg"} alt={project.title} className="w-full h-full object-cover" />
        <Badge className="absolute top-2 right-2">{project.category}</Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          <Link href={`/projects/${project.id}`} className="hover:text-primary transition-colors">
            {project.title}
          </Link>
        </CardTitle>
        <CardDescription>{project.date}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
      </CardContent>
      <CardContent className="pt-0 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Heart className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{project.likes}</span>
        </div>
        <div className="flex items-center gap-1">
          <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{project.saves}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function ProjectListItem({ project }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-48 h-32 flex-shrink-0">
            <img
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="text-lg font-medium">
                  <Link href={`/projects/${project.id}`} className="hover:text-primary transition-colors">
                    {project.title}
                  </Link>
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <Badge>{project.category}</Badge>
                  <span className="text-sm text-muted-foreground">{project.date}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{project.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{project.saves}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const userProjects = [
  {
    id: "1",
    title: "Городские пейзажи",
    category: "Фотография",
    description: "Серия фотографий, исследующих архитектуру и атмосферу современного города через призму света и тени.",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1920&auto=format&fit=crop",
    date: "15 мая 2023",
    likes: 24,
    saves: 8,
  },
  {
    id: "2",
    title: "Цифровые миры",
    category: "Дизайн",
    description: "Серия цифровых иллюстраций, создающих фантастические миры с уникальной атмосферой и персонажами.",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1920&auto=format&fit=crop",
    date: "10 мая 2023",
    likes: 18,
    saves: 6,
  },
  {
    id: "3",
    title: "Минимализм в дизайне",
    category: "Дизайн",
    description: "Исследование принципов минимализма в современном веб-дизайне и пользовательских интерфейсах.",
    image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1920&auto=format&fit=crop",
    date: "1 мая 2023",
    likes: 32,
    saves: 14,
  },
]

const savedProjects = [
  {
    id: "4",
    title: "Абстрактные композиции",
    category: "Живопись",
    description: "Серия абстрактных работ, исследующих взаимодействие цвета, формы и текстуры в современном искусстве.",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=1920&auto=format&fit=crop",
    date: "3 июня 2023",
    likes: 32,
    saves: 12,
  },
  {
    id: "5",
    title: "Эхо мегаполиса",
    category: "Музыка",
    description:
      "Экспериментальная композиция, созданная из звуков городской среды и преобразованная в современное электронное произведение.",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1920&auto=format&fit=crop",
    date: "20 апреля 2023",
    likes: 45,
    saves: 18,
  },
]

const likedProjects = [
  {
    id: "6",
    title: "Органические формы",
    category: "Скульптура",
    description: "Серия керамических скульптур, вдохновленных природными формами и органическими структурами.",
    image: "https://images.unsplash.com/photo-1544413164-5f1b295eb435?q=80&w=1920&auto=format&fit=crop",
    date: "25 мая 2023",
    likes: 28,
    saves: 10,
  },
  {
    id: "7",
    title: "Человек и технологии",
    category: "Видео",
    description:
      "Короткометражный экспериментальный фильм о взаимоотношениях человека и технологий в современном мире.",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1920&auto=format&fit=crop",
    date: "15 апреля 2023",
    likes: 45,
    saves: 18,
  },
]

