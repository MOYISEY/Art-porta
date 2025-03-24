"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Share2, Bookmark, Flag, UserPlus, UserCheck } from "lucide-react"
import { CommentSection } from "@/components/comment-section"
import { getProjectById, getCurrentUser, markCommentsAsRead, getUnreadCommentsCount } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<any>(null)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [followed, setFollowed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [unreadComments, setUnreadComments] = useState(0)
  const { toast } = useToast()
  const router = useRouter()
  const currentUser = getCurrentUser()

  // Загрузка данных проекта
  useEffect(() => {
    setMounted(true)

    // Получаем проект по ID
    const projectData = getProjectById(params.id)

    if (!projectData) {
      toast({
        title: "Ошибка",
        description: "Проект не найден",
        type: "error",
      })
      router.push("/projects")
      return
    }

    setProject(projectData)

    // Проверяем состояние лайков, закладок и подписок из localStorage
    const likedProjects = JSON.parse(localStorage.getItem("likedProjects") || "[]")
    const bookmarkedProjects = JSON.parse(localStorage.getItem("bookmarkedProjects") || "[]")
    const followedAuthors = JSON.parse(localStorage.getItem("followedAuthors") || "[]")

    setLiked(likedProjects.includes(projectData.id))
    setBookmarked(bookmarkedProjects.includes(projectData.id))
    setFollowed(followedAuthors.includes(projectData.author.id))

    // Получаем количество непрочитанных комментариев
    setUnreadComments(getUnreadCommentsCount(params.id))
  }, [params.id, router, toast])

  // Отмечаем комментарии как прочитанные при переключении на вкладку комментариев
  useEffect(() => {
    if (activeTab === "comments" && project) {
      markCommentsAsRead(project.id)
      setUnreadComments(0)
    }
  }, [activeTab, project])

  const handleLike = () => {
    if (!currentUser) {
      toast({
        title: "Необходимо войти",
        description: "Для оценки проекта необходимо войти в систему",
        type: "error",
      })
      return
    }

    const newLiked = !liked
    setLiked(newLiked)

    // Сохраняем состояние в localStorage
    const likedProjects = JSON.parse(localStorage.getItem("likedProjects") || "[]")
    if (newLiked) {
      if (!likedProjects.includes(project.id)) {
        likedProjects.push(project.id)
      }
    } else {
      const index = likedProjects.indexOf(project.id)
      if (index !== -1) {
        likedProjects.splice(index, 1)
      }
    }
    localStorage.setItem("likedProjects", JSON.stringify(likedProjects))

    toast({
      title: newLiked ? "Добавлено в понравившиеся" : "Удалено из понравившихся",
      type: "success",
    })
  }

  const handleBookmark = () => {
    if (!currentUser) {
      toast({
        title: "Необходимо войти",
        description: "Для сохранения проекта необходимо войти в систему",
        type: "error",
      })
      return
    }

    const newBookmarked = !bookmarked
    setBookmarked(newBookmarked)

    // Сохраняем состояние в localStorage
    const bookmarkedProjects = JSON.parse(localStorage.getItem("bookmarkedProjects") || "[]")
    if (newBookmarked) {
      if (!bookmarkedProjects.includes(project.id)) {
        bookmarkedProjects.push(project.id)
      }
    } else {
      const index = bookmarkedProjects.indexOf(project.id)
      if (index !== -1) {
        bookmarkedProjects.splice(index, 1)
      }
    }
    localStorage.setItem("bookmarkedProjects", JSON.stringify(bookmarkedProjects))

    toast({
      title: newBookmarked ? "Проект сохранен" : "Проект удален из сохраненных",
      type: "success",
    })
  }

  const handleFollow = () => {
    if (!currentUser) {
      toast({
        title: "Необходимо войти",
        description: "Для подписки на автора необходимо войти в систему",
        type: "error",
      })
      return
    }

    const newFollowed = !followed
    setFollowed(newFollowed)

    // Сохраняем состояние в localStorage
    const followedAuthors = JSON.parse(localStorage.getItem("followedAuthors") || "[]")
    if (newFollowed) {
      if (!followedAuthors.includes(project.author.id)) {
        followedAuthors.push(project.author.id)
      }
    } else {
      const index = followedAuthors.indexOf(project.author.id)
      if (index !== -1) {
        followedAuthors.splice(index, 1)
      }
    }
    localStorage.setItem("followedAuthors", JSON.stringify(followedAuthors))

    toast({
      title: newFollowed ? `Вы подписались на ${project.author.name}` : `Вы отписались от ${project.author.name}`,
      type: "success",
    })
  }

  const handleShare = () => {
    // Копируем URL в буфер обмена
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Ссылка скопирована",
      description: "Ссылка скопирована в буфер обмена",
      type: "success",
    })
  }

  const handleReport = () => {
    if (!currentUser) {
      toast({
        title: "Необходимо войти",
        description: "Для отправки жалобы необходимо войти в систему",
        type: "error",
      })
      return
    }

    toast({
      title: "Жалоба отправлена",
      description: "Спасибо за сообщение! Мы рассмотрим вашу жалобу.",
      type: "success",
    })
  }

  if (!mounted || !project) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Breadcrumbs */}
          <nav className="flex text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground">
              Главная
            </Link>
            <span className="mx-2">/</span>
            <Link href="/projects" className="hover:text-foreground">
              Проекты
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{project.title}</span>
          </nav>

          {/* Project Header */}
          <div className="mb-6">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold">{project.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">{project.category}</Badge>
                  <span className="text-sm text-muted-foreground">{project.date}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className={liked ? "text-rose-500" : ""} onClick={handleLike}>
                  <Heart className={`h-4 w-4 mr-2 ${liked ? "fill-rose-500" : ""}`} />
                  {liked ? "Нравится" : "Нравится"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={bookmarked ? "text-primary" : ""}
                  onClick={handleBookmark}
                >
                  <Bookmark className={`h-4 w-4 mr-2 ${bookmarked ? "fill-primary" : ""}`} />
                  {bookmarked ? "Сохранено" : "Сохранить"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Поделиться
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={project.author.avatar} alt={project.author.name} />
                <AvatarFallback>{project.author.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{project.author.name}</div>
                <div className="text-sm text-muted-foreground">{project.author.faculty}</div>
              </div>
            </div>
          </div>

          {/* Project Image */}
          <div className="rounded-lg overflow-hidden mb-8">
            <img src={project.image || "/placeholder.svg"} alt={project.title} className="w-full object-cover" />
          </div>

          {/* Project Content */}
          <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="description">Описание</TabsTrigger>
              <TabsTrigger value="details">Детали</TabsTrigger>
              <TabsTrigger value="comments" className="relative">
                Комментарии
                {unreadComments > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {unreadComments}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description">
              <div className="prose prose-sm sm:prose dark:prose-invert max-w-none">
                <p>{project.fullDescription || project.description}</p>
                {project.content &&
                  project.content.split("\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              </div>
            </TabsContent>

            <TabsContent value="details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-4">Информация о проекте</h3>
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Категория:</dt>
                        <dd>{project.category}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Дата публикации:</dt>
                        <dd>{project.date}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Статус:</dt>
                        <dd>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          >
                            Завершен
                          </Badge>
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Просмотры:</dt>
                        <dd>{project.views}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-4">Теги</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags &&
                        project.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      {(!project.tags || project.tags.length === 0) && (
                        <span className="text-muted-foreground">Нет тегов</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="comments">
              <CommentSection comments={project.comments} projectId={project.id} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Об авторе</h3>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={project.author.avatar} alt={project.author.name} />
                    <AvatarFallback>{project.author.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{project.author.name}</div>
                    <div className="text-sm text-muted-foreground">{project.author.faculty}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{project.author.bio || "Автор проекта"}</p>
                <div className="flex flex-col gap-2">
                  <Button className="w-full" variant={followed ? "default" : "outline"} onClick={handleFollow}>
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
                  <Button variant="outline" asChild>
                    <Link href={`/author/${project.author.id}`}>Посмотреть профиль</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Действия</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={handleReport}>
                    <Flag className="h-4 w-4 mr-2" />
                    Сообщить о проблеме
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

