"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, ImageIcon } from "lucide-react"

export default function SubmitProjectPage() {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("details")
  const [toast, setToast] = useState<{ message: string } | null>(null)
  const router = useRouter()

  // Простая функция для отображения toast
  const showToast = (message: string) => {
    setToast({ message })
    setTimeout(() => setToast(null), 3000)
  }

  // Функция для создания уведомления
  const createNotification = (notificationData: any) => {
    try {
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
      const unreadCount = notifications.filter((n: any) => !n.isRead).length
      localStorage.setItem("unreadNotificationsCount", unreadCount.toString())
    } catch (error) {
      console.error("Ошибка при создании уведомления:", error)
    }
  }

  // Упрощенная функция для отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Проверка обязательных полей
      if (!title || !category || !description || !content) {
        showToast("Пожалуйста, заполните все обязательные поля")
        return
      }

      // Создаем новый проект
      const newProject = {
        id: `project-${Date.now()}`,
        title,
        category,
        description,
        content,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        date: new Date().toLocaleDateString("ru-RU"),
        image:
          images[0] || "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1920&auto=format&fit=crop",
        author: {
          id: "current-user",
          name: "Бахтияр Зикирин",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        likes: 0,
        comments: [],
        views: 0,
      }

      // Сохраняем проект в localStorage
      const userProjects = JSON.parse(localStorage.getItem("userProjects") || "[]")
      userProjects.push(newProject)
      localStorage.setItem("userProjects", JSON.stringify(userProjects))

      // Создаем уведомление о новом проекте
      createNotification({
        type: "system",
        projectId: newProject.id,
        projectTitle: newProject.title,
        projectImage: newProject.image,
        message: "Ваш проект был успешно опубликован",
      })

      showToast("Проект успешно опубликован!")

      // Перенаправляем на страницу проектов
      setTimeout(() => {
        router.push("/projects")
      }, 1500)
    } catch (error) {
      console.error("Ошибка при создании проекта:", error)
      showToast("Произошла ошибка при создании проекта. Пожалуйста, попробуйте еще раз.")
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
      setImages([...images, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const nextStep = () => {
    if (activeTab === "details") {
      if (!title || !category || !description) {
        showToast("Пожалуйста, заполните все обязательные поля")
        return
      }
      setActiveTab("content")
    } else if (activeTab === "content") {
      if (!content) {
        showToast("Пожалуйста, заполните содержание проекта")
        return
      }
      setActiveTab("media")
    } else if (activeTab === "media") {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent)
    }
  }

  const prevStep = () => {
    if (activeTab === "content") {
      setActiveTab("details")
    } else if (activeTab === "media") {
      setActiveTab("content")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {toast && (
        <div className="fixed bottom-4 right-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-4 rounded-md shadow-md z-50">
          {toast.message}
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Опубликовать проект</h1>
          <p className="text-muted-foreground mt-2">Поделитесь своим творческим проектом с сообществом студентов</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Информация о проекте</CardTitle>
            <CardDescription>Заполните все необходимые поля для публикации вашего проекта</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="details">Детали</TabsTrigger>
                <TabsTrigger value="content">Содержание</TabsTrigger>
                <TabsTrigger value="media">Медиа</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-8">
                <TabsContent value="details" className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Название проекта</Label>
                    <Input
                      id="title"
                      placeholder="Введите название проекта"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Название должно быть кратким и отражать суть проекта
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Категория</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="painting">Живопись</SelectItem>
                        <SelectItem value="photography">Фотография</SelectItem>
                        <SelectItem value="sculpture">Скульптура</SelectItem>
                        <SelectItem value="design">Дизайн</SelectItem>
                        <SelectItem value="music">Музыка</SelectItem>
                        <SelectItem value="literature">Литература</SelectItem>
                        <SelectItem value="video">Видео</SelectItem>
                        <SelectItem value="other">Другое</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Выберите категорию, которая лучше всего соответствует вашему проекту
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Краткое описание</Label>
                    <Textarea
                      id="description"
                      placeholder="Введите краткое описание проекта"
                      className="min-h-[100px]"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Краткое описание будет отображаться в карточке проекта
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Теги</Label>
                    <Input
                      id="tags"
                      placeholder="Введите теги через запятую"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Добавьте теги, чтобы помочь другим пользователям найти ваш проект
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="content">Содержание проекта</Label>
                    <Textarea
                      id="content"
                      placeholder="Опишите ваш проект подробно..."
                      className="min-h-[300px]"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Подробно расскажите о вашем проекте, его целях, процессе создания и результатах
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-6">
                  <div>
                    <Label>Изображения проекта</Label>
                    <div className="mt-2">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative rounded-md overflow-hidden h-32">
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Изображение ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-md border-muted-foreground/25 cursor-pointer hover:bg-muted transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Добавить изображение</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                            multiple
                          />
                        </label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Загрузите изображения вашего проекта. Рекомендуемый размер: не менее 1200x800 пикселей.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </form>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            {activeTab !== "details" ? (
              <Button type="button" variant="outline" onClick={prevStep}>
                Назад
              </Button>
            ) : (
              <Button type="button" variant="outline" asChild>
                <Link href="/projects">Отмена</Link>
              </Button>
            )}
            <Button type="button" onClick={nextStep}>
              {activeTab === "media" ? "Опубликовать" : "Далее"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

