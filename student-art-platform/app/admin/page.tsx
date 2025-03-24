"use client"

import { Switch } from "@/components/ui/switch"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Search, MoreHorizontal, Users, FileText, Bell, Shield, BarChart3, Eye, Edit, Trash2 } from "lucide-react"

export default function AdminPage() {
  const [mounted, setMounted] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [toast, setToast] = useState<{ message: string } | null>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setMounted(true)

    // Проверяем, является ли пользователь администратором
    const userRole = localStorage.getItem("userRole") || "user"
    setIsAdmin(userRole === "admin")

    // Если пользователь не админ, устанавливаем его роль как админ для демонстрации
    if (userRole !== "admin") {
      localStorage.setItem("userRole", "admin")
      setIsAdmin(true)
    }

    // Загружаем проекты из localStorage
    const storedProjects = JSON.parse(localStorage.getItem("userProjects") || "[]")
    setProjects(storedProjects.length > 0 ? storedProjects : demoProjects)

    // Загружаем пользователей (демо-данные)
    setUsers(demoUsers)
  }, [])

  // Простая функция для отображения toast
  const showToast = (message: string) => {
    setToast({ message })
    setTimeout(() => setToast(null), 3000)
  }

  const handleDeleteProject = (projectId: string) => {
    // Удаляем проект из списка
    const updatedProjects = projects.filter((project) => project.id !== projectId)
    setProjects(updatedProjects)

    // Сохраняем обновленный список в localStorage
    localStorage.setItem("userProjects", JSON.stringify(updatedProjects))

    showToast("Проект успешно удален")
  }

  const handleFeatureProject = (projectId: string) => {
    // Обновляем статус проекта на "featured"
    const updatedProjects = projects.map((project) =>
      project.id === projectId ? { ...project, featured: !project.featured } : project,
    )
    setProjects(updatedProjects)

    // Сохраняем обновленный список в localStorage
    localStorage.setItem("userProjects", JSON.stringify(updatedProjects))

    const project = projects.find((p) => p.id === projectId)
    showToast(project.featured ? "Проект удален из избранного" : "Проект добавлен в избранное")
  }

  const handleBlockUser = (userId: string) => {
    // Обновляем статус пользователя на "blocked"
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, status: user.status === "blocked" ? "active" : "blocked" } : user,
    )
    setUsers(updatedUsers)

    const user = users.find((u) => u.id === userId)
    showToast(user.status === "blocked" ? "Пользователь разблокирован" : "Пользователь заблокирован")
  }

  const handleMakeAdmin = (userId: string) => {
    // Обновляем роль пользователя на "admin"
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, role: user.role === "admin" ? "user" : "admin" } : user,
    )
    setUsers(updatedUsers)

    const user = users.find((u) => u.id === userId)
    showToast(user.role === "admin" ? "Права администратора удалены" : "Пользователь назначен администратором")
  }

  // Фильтрация проектов по поисковому запросу
  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.author.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Фильтрация пользователей по поисковому запросу
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.faculty.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (!mounted) return null

  // Если пользователь не администратор, показываем сообщение об ошибке
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Доступ запрещен</h1>
        <p className="text-muted-foreground mb-8">У вас нет прав для доступа к панели администратора.</p>
        <Button asChild>
          <Link href="/">Вернуться на главную</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {toast && (
        <div className="fixed bottom-4 right-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-4 rounded-md shadow-md z-50">
          {toast.message}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Панель администратора</h1>
          <p className="text-muted-foreground">Управление проектами, пользователями и настройками платформы</p>
        </div>

        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск..."
            className="pl-9 w-full md:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Всего проектов</p>
              <p className="text-2xl font-bold">{projects.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Пользователей</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Уведомления</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Просмотры</p>
              <p className="text-2xl font-bold">1,254</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects">
        <TabsList className="mb-8">
          <TabsTrigger value="projects">Проекты</TabsTrigger>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="reports">Жалобы</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Управление проектами</CardTitle>
              <CardDescription>Просмотр, редактирование и удаление проектов пользователей</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Проект</TableHead>
                    <TableHead>Автор</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {searchQuery ? "Проекты не найдены" : "Нет проектов для отображения"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded overflow-hidden">
                              <img
                                src={project.image || "/placeholder.svg?height=40&width=40"}
                                alt={project.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">{project.title}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {project.description?.substring(0, 50)}...
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={project.author.avatar} alt={project.author.name} />
                              <AvatarFallback>{project.author.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span>{project.author.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{project.category}</TableCell>
                        <TableCell>{project.date}</TableCell>
                        <TableCell>
                          {project.featured ? (
                            <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-0">
                              Избранное
                            </Badge>
                          ) : (
                            <Badge variant="outline">Обычный</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Действия</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/projects/${project.id}`} className="flex items-center">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Просмотреть
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/projects/edit/${project.id}`} className="flex items-center">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Редактировать
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleFeatureProject(project.id)}>
                                <Shield className="h-4 w-4 mr-2" />
                                {project.featured ? "Убрать из избранного" : "Добавить в избранное"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Удалить
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Это действие нельзя отменить. Проект будет удален навсегда.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      onClick={() => handleDeleteProject(project.id)}
                                    >
                                      Удалить
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Управление пользователями</CardTitle>
              <CardDescription>Просмотр, редактирование и управление аккаунтами пользователей</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Факультет</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {searchQuery ? "Пользователи не найдены" : "Нет пользователей для отображения"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">Проектов: {user.projectCount}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.faculty}</TableCell>
                        <TableCell>
                          {user.role === "admin" ? (
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                              Администратор
                            </Badge>
                          ) : (
                            <Badge variant="outline">Пользователь</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.status === "blocked" ? (
                            <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-0">
                              Заблокирован
                            </Badge>
                          ) : (
                            <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0">
                              Активен
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Действия</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/author/${user.id}`} className="flex items-center">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Просмотреть профиль
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/users/edit/${user.id}`} className="flex items-center">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Редактировать
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMakeAdmin(user.id)}>
                                <Shield className="h-4 w-4 mr-2" />
                                {user.role === "admin" ? "Убрать права администратора" : "Сделать администратором"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleBlockUser(user.id)}
                                className={user.status === "blocked" ? "text-green-500" : "text-destructive"}
                              >
                                {user.status === "blocked" ? (
                                  <>
                                    <Shield className="h-4 w-4 mr-2" />
                                    Разблокировать
                                  </>
                                ) : (
                                  <>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Заблокировать
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Жалобы и обращения</CardTitle>
              <CardDescription>Просмотр и обработка жалоб от пользователей</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <Card key={report.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={report.status === "new" ? "default" : "outline"}>
                              {report.status === "new" ? "Новая" : "Обработана"}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{report.date}</span>
                          </div>
                          <h3 className="font-medium mb-1">{report.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{report.description}</p>

                          <div className="flex items-center gap-3 mt-4">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={report.user.avatar} alt={report.user.name} />
                              <AvatarFallback>{report.user.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{report.user.name}</span>
                          </div>
                        </div>

                        <div className="flex flex-row md:flex-col gap-2 justify-end">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/projects/${report.projectId}`}>Просмотреть проект</Link>
                          </Button>
                          <Button size="sm">Обработать</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Настройки платформы</CardTitle>
              <CardDescription>Управление глобальными настройками платформы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Основные настройки</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">Название сайта</Label>
                    <Input id="site-name" defaultValue="ArtCampus" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site-description">Описание сайта</Label>
                    <Input id="site-description" defaultValue="Платформа для студенческого творчества" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Модерация</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-moderation" className="text-base">
                        Автоматическая модерация
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Автоматически проверять новые проекты и комментарии
                      </p>
                    </div>
                    <Switch id="auto-moderation" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pre-moderation" className="text-base">
                        Премодерация проектов
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Требовать одобрения администратора перед публикацией
                      </p>
                    </div>
                    <Switch id="pre-moderation" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Категории</h3>
                <div className="space-y-2">
                  <Label>Управление категориями</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <div key={category.title} className="flex items-center justify-between p-2 border rounded-md">
                        <span>{category.title}</span>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-2">
                    Добавить категорию
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button>Сохранить настройки</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Компонент для отображения метки
function Label({ htmlFor, className, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ""}`}
    >
      {children}
    </label>
  )
}

// Демо-данные для проектов
const demoProjects = [
  {
    id: "1",
    title: "Городские силуэты",
    description: "Серия черно-белых фотографий, исследующих геометрию и ритмы современной городской архитектуры.",
    category: "Фотография",
    date: "15 мая 2023",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1920&auto=format&fit=crop",
    featured: true,
    author: {
      name: "Анна Соколова",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  },
  {
    id: "2",
    title: "Абстрактные композиции",
    description: "Серия абстрактных работ, исследующих взаимодействие цвета, формы и текстуры в современном искусстве.",
    category: "Живопись",
    date: "3 июня 2023",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=1920&auto=format&fit=crop",
    featured: false,
    author: {
      name: "Михаил Волков",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  },
  {
    id: "3",
    title: "Эхо мегаполиса",
    description:
      "Экспериментальная композиция, созданная из звуков городской среды и преобразованная в современное электронное произведение.",
    category: "Музыка",
    date: "20 апреля 2023",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1920&auto=format&fit=crop",
    featured: false,
    author: {
      name: "Дмитрий Лебедев",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    },
  },
]

// Демо-данные для пользователей
const demoUsers = [
  {
    id: "user1",
    name: "Анна Соколова",
    email: "a.sokolova@example.com",
    faculty: "Факультет искусств",
    role: "user",
    status: "active",
    projectCount: 8,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "user2",
    name: "Михаил Волков",
    email: "m.volkov@example.com",
    faculty: "Факультет искусств",
    role: "user",
    status: "active",
    projectCount: 6,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "user3",
    name: "Дмитрий Лебедев",
    email: "d.lebedev@example.com",
    faculty: "Факультет музыки",
    role: "user",
    status: "active",
    projectCount: 5,
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    id: "user4",
    name: "Елена Морозова",
    email: "e.morozova@example.com",
    faculty: "Факультет дизайна",
    role: "admin",
    status: "active",
    projectCount: 4,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: "user5",
    name: "Иван Петров",
    email: "i.petrov@example.com",
    faculty: "Факультет литературы",
    role: "user",
    status: "blocked",
    projectCount: 2,
    avatar: "https://randomuser.me/api/portraits/men/62.jpg",
  },
]

// Демо-данные для жалоб
const reports = [
  {
    id: "report1",
    title: "Неприемлемый контент",
    description: "В проекте содержится неприемлемый контент, нарушающий правила платформы.",
    date: "2 дня назад",
    status: "new",
    projectId: "3",
    user: {
      name: "Елена Морозова",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  },
  {
    id: "report2",
    title: "Нарушение авторских прав",
    description: "Автор использует чужие материалы без указания источника и разрешения.",
    date: "5 дней назад",
    status: "processed",
    projectId: "2",
    user: {
      name: "Дмитрий Лебедев",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    },
  },
  {
    id: "report3",
    title: "Оскорбительные комментарии",
    description: "Пользователь оставляет оскорбительные комментарии под проектами.",
    date: "неделю назад",
    status: "new",
    projectId: "1",
    user: {
      name: "Михаил Волков",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  },
]

// Категории для настроек
const categories = [
  {
    title: "Живопись",
    description: "Картины, иллюстрации и другие художественные работы",
  },
  {
    title: "Фотография",
    description: "Фотопроекты, фотосерии и отдельные фотографии",
  },
  {
    title: "Дизайн",
    description: "Графический дизайн, UI/UX, промышленный дизайн",
  },
  {
    title: "Музыка",
    description: "Музыкальные композиции, аранжировки и исполнения",
  },
  {
    title: "Литература",
    description: "Поэзия, проза, драматургия и другие литературные формы",
  },
  {
    title: "Скульптура",
    description: "Трехмерные художественные объекты и инсталляции",
  },
]

