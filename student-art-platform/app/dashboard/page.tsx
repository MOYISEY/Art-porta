"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Grid, List, Plus, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [projects, setProjects] = useState(userProjects)
  const [drafts, setDrafts] = useState(draftProjects)
  const { toast } = useToast()

  const handleDeleteProject = (id: string, isDraft = false) => {
    if (isDraft) {
      setDrafts(drafts.filter((project) => project.id !== id))
    } else {
      setProjects(projects.filter((project) => project.id !== id))
    }

    toast({
      title: "Проект удален",
      description: "Проект был успешно удален.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Мои проекты</h1>
          <p className="text-muted-foreground">Управляйте своими проектами и черновиками</p>
        </div>
        <Button asChild>
          <Link href="/submit">
            <Plus className="h-4 w-4 mr-2" />
            Создать проект
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          <div className="flex-1">
            <Label htmlFor="search" className="mb-2">
              Поиск
            </Label>
            <Input id="search" placeholder="Поиск проектов..." />
          </div>
          <div className="w-full md:w-48">
            <Label htmlFor="category" className="mb-2">
              Категория
            </Label>
            <Select defaultValue="all">
              <SelectTrigger id="category">
                <SelectValue placeholder="Все категории" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                <SelectItem value="design">Дизайн</SelectItem>
                <SelectItem value="photography">Фотография</SelectItem>
                <SelectItem value="illustration">Иллюстрация</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-48">
            <Label htmlFor="sort" className="mb-2">
              Сортировка
            </Label>
            <Select defaultValue="newest">
              <SelectTrigger id="sort">
                <SelectValue placeholder="Сортировать по" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Сначала новые</SelectItem>
                <SelectItem value="oldest">Сначала старые</SelectItem>
                <SelectItem value="popular">По популярности</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
      </div>

      <Tabs defaultValue="published">
        <TabsList className="mb-6">
          <TabsTrigger value="published">Опубликованные</TabsTrigger>
          <TabsTrigger value="drafts">Черновики</TabsTrigger>
        </TabsList>

        <TabsContent value="published">
          {projects.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">У вас пока нет опубликованных проектов</p>
                <Button asChild>
                  <Link href="/submit">
                    <Plus className="h-4 w-4 mr-2" />
                    Создать проект
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} onDelete={() => handleDeleteProject(project.id)} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <ProjectListItem key={project.id} project={project} onDelete={() => handleDeleteProject(project.id)} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="drafts">
          {drafts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">У вас пока нет черновиков</p>
                <Button asChild>
                  <Link href="/submit">
                    <Plus className="h-4 w-4 mr-2" />
                    Создать проект
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {drafts.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isDraft
                  onDelete={() => handleDeleteProject(project.id, true)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {drafts.map((project) => (
                <ProjectListItem
                  key={project.id}
                  project={project}
                  isDraft
                  onDelete={() => handleDeleteProject(project.id, true)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProjectCard({ project, isDraft = false, onDelete }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48">
        <img src={project.image || "/placeholder.svg"} alt={project.title} className="w-full h-full object-cover" />
        <Badge className={`absolute top-2 right-2 ${isDraft ? "bg-amber-500" : ""}`}>
          {isDraft ? "Черновик" : project.category}
        </Badge>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="mb-2">
          <Link
            href={isDraft ? `/submit/edit/${project.id}` : `/projects/${project.id}`}
            className="hover:text-primary transition-colors"
          >
            <h3 className="text-lg font-medium">{project.title}</h3>
          </Link>
          <p className="text-sm text-muted-foreground">{project.date}</p>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">{project.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">Просмотры: {project.views}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={isDraft ? `/submit/edit/${project.id}` : `/projects/${project.id}`}>
                {isDraft ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href={isDraft ? `/submit/edit/${project.id}` : `/projects/${project.id}`}>
                    {isDraft ? "Редактировать" : "Просмотр"}
                  </Link>
                </DropdownMenuItem>
                {!isDraft && (
                  <DropdownMenuItem asChild>
                    <Link href={`/submit/edit/${project.id}`}>Редактировать</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProjectListItem({ project, isDraft = false, onDelete }) {
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
                  <Link
                    href={isDraft ? `/submit/edit/${project.id}` : `/projects/${project.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {project.title}
                  </Link>
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={isDraft ? "bg-amber-500" : ""}>{isDraft ? "Черновик" : project.category}</Badge>
                  <span className="text-sm text-muted-foreground">{project.date}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={isDraft ? `/submit/edit/${project.id}` : `/projects/${project.id}`}>
                    {isDraft ? "Редактировать" : "Просмотр"}
                  </Link>
                </Button>
                {!isDraft && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/submit/edit/${project.id}`}>Редактировать</Link>
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={onDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
            <div className="mt-2">
              <span className="text-sm text-muted-foreground">Просмотры: {project.views}</span>
            </div>
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
    views: 245,
    likes: 24,
    comments: 8,
  },
  {
    id: "2",
    title: "Цифровые миры",
    category: "Дизайн",
    description: "Серия цифровых иллюстраций, создающих фантастические миры с уникальной атмосферой и персонажами.",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1920&auto=format&fit=crop",
    date: "10 мая 2023",
    views: 187,
    likes: 18,
    comments: 6,
  },
  {
    id: "3",
    title: "Минимализм в дизайне",
    category: "Дизайн",
    description: "Исследование принципов минимализма в современном веб-дизайне и пользовательских интерфейсах.",
    image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1920&auto=format&fit=crop",
    date: "1 мая 2023",
    views: 312,
    likes: 32,
    comments: 14,
  },
]

const draftProjects = [
  {
    id: "draft-1",
    title: "Эксперименты с типографикой",
    category: "Дизайн",
    description: "Черновик проекта по экспериментальной типографике и композиции для веб-дизайна.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1920&auto=format&fit=crop",
    date: "20 мая 2023",
    views: 0,
    likes: 0,
    comments: 0,
  },
  {
    id: "draft-2",
    title: "Абстрактные формы",
    category: "Иллюстрация",
    description: "Черновик серии абстрактных иллюстраций, исследующих взаимодействие цвета и формы.",
    image: "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?q=80&w=1920&auto=format&fit=crop",
    date: "18 мая 2023",
    views: 0,
    likes: 0,
    comments: 0,
  },
]

