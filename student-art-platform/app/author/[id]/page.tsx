"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus, UserCheck, Heart, Bookmark } from "lucide-react"

export default function AuthorPage({ params }: { params: { id: string } }) {
  const [author, setAuthor] = useState<any>(null)
  const [authorProjects, setAuthorProjects] = useState<any[]>([])
  const [followed, setFollowed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [toast, setToast] = useState<{ message: string } | null>(null)

  useEffect(() => {
    setMounted(true)

    // Имитация загрузки данных автора
    const foundAuthor = authors.find((a) => a.id === params.id) || authors[0]
    setAuthor(foundAuthor)

    // Имитация загрузки проектов автора
    const projects = allProjects.filter((p) => p.author.id === params.id)
    setAuthorProjects(projects)

    // Проверяем состояние подписки из localStorage
    const followedAuthors = JSON.parse(localStorage.getItem("followedAuthors") || "[]")
    setFollowed(followedAuthors.includes(params.id))
  }, [params.id])

  // Простая функция для отображения toast
  const showToast = (message: string) => {
    setToast({ message })
    setTimeout(() => setToast(null), 3000)
  }

  // Функция для создания уведомления
  const createNotification = (notificationData) => {
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
    const newNotification = {
      id: Date.now().toString(),
      time: new Date().toLocaleString(),
      isRead: false,
      ...notificationData,
    }
    notifications.unshift(newNotification) // Добавляем в начало массива
    localStorage.setItem("notifications", JSON.stringify(notifications))

    // Обновляем счетчик непрочитанных уведомлений
    const unreadCount = notifications.filter((n) => !n.isRead).length
    localStorage.setItem("unreadNotificationsCount", unreadCount.toString())
  }

  const handleFollow = () => {
    const newFollowed = !followed
    setFollowed(newFollowed)

    // Сохраняем состояние в localStorage
    const followedAuthors = JSON.parse(localStorage.getItem("followedAuthors") || "[]")
    if (newFollowed) {
      if (!followedAuthors.includes(author.id)) {
        followedAuthors.push(author.id)
      }
    } else {
      const index = followedAuthors.indexOf(author.id)
      if (index !== -1) {
        followedAuthors.splice(index, 1)
      }
    }
    localStorage.setItem("followedAuthors", JSON.stringify(followedAuthors))

    // Создаем уведомление при подписке
    if (newFollowed) {
      createNotification({
        type: "follow",
        authorId: author.id,
        authorName: author.name,
        authorAvatar: author.avatar,
        message: `Вы подписались на ${author.name}`,
      })
    }

    showToast(newFollowed ? `Вы подписались на ${author.name}` : `Вы отписались от ${author.name}`)
  }

  if (!mounted || !author) return null

  return (
    <div className="container mx-auto px-4 py-8">
      {toast && (
        <div className="fixed bottom-4 right-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-4 rounded-md shadow-md z-50">
          {toast.message}
        </div>
      )}

      <div className="mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={author.avatar} alt={author.name} />
                  <AvatarFallback className="text-2xl">{author.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
                  <h1 className="text-2xl font-bold">{author.name}</h1>
                  <div className="flex justify-center md:justify-start gap-2">
                    <Badge variant="outline">{author.role}</Badge>
                    <Badge variant="outline">{author.faculty}</Badge>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">{author.bio}</p>

                <div className="flex justify-center md:justify-start gap-4 mb-4">
                  <div className="text-center">
                    <div className="font-bold">{authorProjects.length}</div>
                    <div className="text-sm text-muted-foreground">Проектов</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{author.followers}</div>
                    <div className="text-sm text-muted-foreground">Подписчиков</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{author.following}</div>
                    <div className="text-sm text-muted-foreground">Подписок</div>
                  </div>
                </div>

                <div className="flex justify-center md:justify-start gap-2">
                  <Button
                    className="w-full md:w-auto"
                    variant={followed ? "default" : "outline"}
                    onClick={handleFollow}
                  >
                    {followed ? (
                      <>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Вы подписаны
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Подписаться
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects">
        <TabsList className="mb-6">
          <TabsTrigger value="projects">Проекты</TabsTrigger>
          <TabsTrigger value="about">О авторе</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <h2 className="text-xl font-bold mb-4">Проекты автора</h2>

          {authorProjects.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">У автора пока нет проектов.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {authorProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">О авторе</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Биография</h3>
                  <p className="text-muted-foreground">{author.bio}</p>
                </div>

                <div>
                  <h3 className="font-medium">Образование</h3>
                  <p className="text-muted-foreground">{author.education}</p>
                </div>

                <div>
                  <h3 className="font-medium">Специализация</h3>
                  <p className="text-muted-foreground">{author.specialization}</p>
                </div>

                <div>
                  <h3 className="font-medium">Контакты</h3>
                  <p className="text-muted-foreground">{author.contact}</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
      <CardContent className="p-4 flex-1 flex flex-col">
        <Link href={`/projects/${project.id}`} className="hover:text-primary transition-colors">
          <h3 className="font-bold text-lg">{project.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-1 mb-4 flex-1 line-clamp-3">{project.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <div className="text-sm text-muted-foreground">{project.date}</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{project.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bookmark className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{project.saves || 0}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const authors = [
  {
    id: "author1",
    name: "Анна Соколова",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    role: "Студент",
    faculty: "Факультет искусств",
    bio: "Студентка факультета искусств, специализируюсь на художественной фотографии. Увлекаюсь архитектурной и уличной фотографией, исследую взаимодействие человека и городской среды.",
    education: "Колледж AITU, 3 курс",
    specialization: "Художественная фотография, архитектурная фотография",
    contact: "a.sokolova@example.com",
    followers: 48,
    following: 32,
  },
  {
    id: "author2",
    name: "Михаил Волков",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "Студент",
    faculty: "Факультет искусств",
    bio: "Студент факультета искусств, специализируюсь на современной живописи. Исследую абстрактные формы и цветовые композиции, экспериментирую с различными материалами и техниками.",
    education: "Колледж AITU, 4 курс",
    specialization: "Современная живопись, абстрактное искусство",
    contact: "m.volkov@example.com",
    followers: 36,
    following: 24,
  },
]

const allProjects = [
  {
    id: "1",
    title: "Городские силуэты",
    category: "Фотография",
    description: "Серия черно-белых фотографий, исследующих геометрию и ритмы современной городской архитектуры.",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1920&auto=format&fit=crop",
    date: "15 мая 2023",
    likes: 24,
    saves: 8,
    author: {
      id: "author1",
      name: "Анна Соколова",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  },
  {
    id: "2",
    title: "Абстрактные композиции",
    category: "Живопись",
    description: "Серия абстрактных работ, исследующих взаимодействие цвета, формы и текстуры в современном искусстве.",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=1920&auto=format&fit=crop",
    date: "3 июня 2023",
    likes: 32,
    saves: 12,
    author: {
      id: "author2",
      name: "Михаил Волков",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  },
  {
    id: "3",
    title: "Эхо мегаполиса",
    category: "Музыка",
    description:
      "Экспериментальная композиция, созданная из звуков городской среды и преобразованная в современное электронное произведение.",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1920&auto=format&fit=crop",
    date: "20 апреля 2023",
    likes: 45,
    saves: 18,
    author: {
      id: "author2",
      name: "Михаил Волков",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  },
]

