"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Filter, Search, Bookmark } from "lucide-react"
import { ProjectSkeleton } from "@/components/project-skeleton"

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [timeFrame, setTimeFrame] = useState("all-time")
  const [viewType, setViewType] = useState("grid")
  const [filteredProjects, setFilteredProjects] = useState(projects)
  const [isLoading, setIsLoading] = useState(true)
  const [likedProjects, setLikedProjects] = useState<Record<string, boolean>>({})
  const [bookmarkedProjects, setBookmarkedProjects] = useState<Record<string, boolean>>({})
  // Добавим новое состояние для отслеживания количества отображаемых проектов
  const [visibleProjects, setVisibleProjects] = useState(6)

  // Имитация загрузки данных
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Фильтрация проектов
  useEffect(() => {
    setIsLoading(true)

    // Имитация задержки API
    const timer = setTimeout(() => {
      let filtered = [...projects]

      // Фильтр по поисковому запросу
      if (searchQuery) {
        filtered = filtered.filter(
          (project) =>
            project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      }

      // Фильтр по категории
      if (category !== "all") {
        filtered = filtered.filter((project) => project.category.toLowerCase() === category)
      }

      // Сортировка
      if (sortBy === "recent") {
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      } else if (sortBy === "popular") {
        filtered.sort((a, b) => b.likes - a.likes)
      } else if (sortBy === "comments") {
        filtered.sort((a, b) => b.comments - a.comments)
      }

      setFilteredProjects(filtered)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery, category, sortBy, timeFrame])

  const handleLike = (projectId: string) => {
    setLikedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }))
  }

  const handleBookmark = (projectId: string) => {
    setBookmarkedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }))
  }

  const handleApplyFilters = () => {
    // Фильтры уже применяются через useEffect
    // Эта функция нужна для обработки нажатия кнопки
  }

  // Добавим функцию для загрузки дополнительных проектов
  const handleLoadMore = () => {
    setIsLoading(true)

    // Имитируем задержку загрузки
    setTimeout(() => {
      setVisibleProjects((prev) => prev + 3)
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Проекты</h1>
          <p className="text-muted-foreground">Исследуйте творческие работы студентов</p>
        </div>
        <Button asChild>
          <Link href="/submit">Опубликовать проект</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Фильтры
                  </h3>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Поиск проектов..."
                      className="pl-8 mb-4"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Категория</h4>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все категории</SelectItem>
                      <SelectItem value="живопись">Живопись</SelectItem>
                      <SelectItem value="фотография">Фотография</SelectItem>
                      <SelectItem value="скульптура">Скульптура</SelectItem>
                      <SelectItem value="дизайн">Дизайн</SelectItem>
                      <SelectItem value="музыка">Музыка</SelectItem>
                      <SelectItem value="литература">Литература</SelectItem>
                      <SelectItem value="видео">Видео</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Сортировка</h4>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Сортировать по" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Сначала новые</SelectItem>
                      <SelectItem value="popular">По популярности</SelectItem>
                      <SelectItem value="comments">По комментариям</SelectItem>
                      <SelectItem value="likes">По лайкам</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Дата публикации</h4>
                  <Select value={timeFrame} onValueChange={setTimeFrame}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите период" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-time">За все время</SelectItem>
                      <SelectItem value="today">Сегодня</SelectItem>
                      <SelectItem value="this-week">На этой неделе</SelectItem>
                      <SelectItem value="this-month">В этом месяце</SelectItem>
                      <SelectItem value="this-year">В этом году</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" onClick={handleApplyFilters}>
                  Применить фильтры
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="grid" value={viewType} onValueChange={setViewType}>
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">Найдено {filteredProjects.length} проектов</p>
              <TabsList>
                <TabsTrigger value="grid">Сетка</TabsTrigger>
                <TabsTrigger value="list">Список</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="grid">
              {isLoading ? (
                <ProjectsGridSkeleton />
              ) : (
                <ProjectsGrid
                  projects={filteredProjects}
                  likedProjects={likedProjects}
                  bookmarkedProjects={bookmarkedProjects}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                  visibleProjects={visibleProjects}
                />
              )}
            </TabsContent>

            <TabsContent value="list">
              {isLoading ? (
                <ProjectsListSkeleton />
              ) : (
                <ProjectsList
                  projects={filteredProjects}
                  likedProjects={likedProjects}
                  bookmarkedProjects={bookmarkedProjects}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                  visibleProjects={visibleProjects}
                />
              )}
            </TabsContent>
          </Tabs>

          {/* Обновим кнопку "Загрузить еще" */}
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={isLoading || visibleProjects >= filteredProjects.length}
            >
              {isLoading ? "Загрузка..." : "Загрузить еще"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Обновим функцию ProjectsGrid, чтобы она отображала только видимые проекты
function ProjectsGrid({ projects, likedProjects, bookmarkedProjects, onLike, onBookmark, visibleProjects }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.slice(0, visibleProjects).map((project) => (
        <Card key={project.id} className="overflow-hidden project-card">
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
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 flex items-center gap-1 btn-like ${likedProjects[project.id] ? "active" : ""}`}
                onClick={() => onLike(project.id)}
              >
                <Heart className={`h-4 w-4 ${likedProjects[project.id] ? "fill-current" : ""}`} />
                <span className="text-xs">{likedProjects[project.id] ? project.likes + 1 : project.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 flex items-center gap-1 btn-bookmark ${bookmarkedProjects[project.id] ? "active" : ""}`}
                onClick={() => onBookmark(project.id)}
              >
                <Bookmark className={`h-4 w-4 ${bookmarkedProjects[project.id] ? "fill-current" : ""}`} />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

// Обновим функцию ProjectsList, чтобы она отображала только видимые проекты
function ProjectsList({ projects, likedProjects, bookmarkedProjects, onLike, onBookmark, visibleProjects }) {
  return (
    <div className="space-y-4">
      {projects.slice(0, visibleProjects).map((project) => (
        <Card key={project.id} className="overflow-hidden project-card">
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-48 h-40 md:h-auto">
              <img
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col flex-1 p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <Link href={`/projects/${project.id}`} className="hover:text-primary transition-colors">
                    <h3 className="font-bold text-lg">{project.title}</h3>
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                      {project.category}
                    </Badge>
                    <span>•</span>
                    <span>{project.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 px-2 flex items-center gap-1 btn-like ${likedProjects[project.id] ? "active" : ""}`}
                    onClick={() => onLike(project.id)}
                  >
                    <Heart className={`h-4 w-4 ${likedProjects[project.id] ? "fill-current" : ""}`} />
                    <span className="text-xs">{likedProjects[project.id] ? project.likes + 1 : project.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 px-2 flex items-center gap-1 btn-bookmark ${bookmarkedProjects[project.id] ? "active" : ""}`}
                    onClick={() => onBookmark(project.id)}
                  >
                    <Bookmark className={`h-4 w-4 ${bookmarkedProjects[project.id] ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{project.description}</p>
              <div className="flex items-center gap-2 mt-4">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={project.author.avatar} alt={project.author.name} />
                  <AvatarFallback>{project.author.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{project.author.name}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function ProjectsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <ProjectSkeleton key={i} />
        ))}
    </div>
  )
}

function ProjectsListSkeleton() {
  return (
    <div className="space-y-4">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <ProjectSkeleton key={i} isList />
        ))}
    </div>
  )
}

const projects = [
  {
    id: "1",
    title: "Городские силуэты",
    category: "Фотография",
    description: "Серия черно-белых фотографий, исследующих геометрию и ритмы современной городской архитектуры.",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1920&auto=format&fit=crop",
    author: {
      name: "Анна Соколова",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    date: "15 мая 2023",
    likes: 24,
    comments: 8,
  },
  {
    id: "2",
    title: "Абстрактные композиции",
    category: "Живопись",
    description: "Серия абстрактных работ, исследующих взаимодействие цвета, формы и текстуры в современном искусстве.",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=1920&auto=format&fit=crop",
    author: {
      name: "Михаил Волков",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    date: "3 июня 2023",
    likes: 32,
    comments: 12,
  },
  {
    id: "3",
    title: "Эхо мегаполиса",
    category: "Музыка",
    description:
      "Экспериментальная композиция, созданная из звуков городской среды и преобразованная в современное электронное произведение.",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1920&auto=format&fit=crop",
    author: {
      name: "Елена Морозова",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    date: "20 апреля 2023",
    likes: 45,
    comments: 18,
  },
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
    date: "10 мая 2023",
    likes: 18,
    comments: 6,
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
    date: "5 июня 2023",
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
    date: "25 мая 2023",
    likes: 28,
    comments: 10,
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
    date: "15 апреля 2023",
    likes: 45,
    comments: 18,
  },
  {
    id: "8",
    title: "Архитектурные метаморфозы",
    category: "Фотография",
    description:
      "Фотографический проект, исследующий трансформацию городской архитектуры в разное время суток и при разном освещении.",
    image: "https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=1920&auto=format&fit=crop",
    author: {
      name: "Игорь Соловьев",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    },
    date: "2 июня 2023",
    likes: 36,
    comments: 14,
  },
]

