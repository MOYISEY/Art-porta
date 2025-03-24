"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ImageIcon, Trash2 } from "lucide-react"
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

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false)
  const [toast, setToast] = useState<{ message: string } | null>(null)
  const [avatar, setAvatar] = useState<string>("/placeholder.svg?height=100&width=100")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)

    // Загружаем аватар из localStorage
    const savedAvatar = localStorage.getItem("userAvatar")
    if (savedAvatar) {
      setAvatar(savedAvatar)
    }
  }, [])

  // Простая функция для отображения toast
  const showToast = (message: string) => {
    setToast({ message })
    setTimeout(() => setToast(null), 3000)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          setAvatar(event.target.result)
          localStorage.setItem("userAvatar", event.target.result)
          showToast("Аватар успешно обновлен")
        }
      }

      reader.readAsDataURL(file)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveAvatar = () => {
    setAvatar("/placeholder.svg?height=100&width=100")
    localStorage.removeItem("userAvatar")
    showToast("Аватар удален")
  }

  const handleSaveProfile = () => {
    showToast("Профиль успешно обновлен")
  }

  const handleSaveAccount = () => {
    showToast("Настройки аккаунта успешно обновлены")
  }

  const handleSaveNotifications = () => {
    showToast("Настройки уведомлений успешно обновлены")
  }

  if (!mounted) return null

  return (
    <div className="container mx-auto px-4 py-8">
      {toast && (
        <div className="fixed bottom-4 right-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-4 rounded-md shadow-md z-50">
          {toast.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Настройки</h1>

        <Tabs defaultValue="profile">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-64 flex-shrink-0">
              <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 md:sticky md:top-20">
                <TabsTrigger value="profile" className="justify-start w-full mb-1">
                  Профиль
                </TabsTrigger>
                <TabsTrigger value="account" className="justify-start w-full mb-1">
                  Аккаунт
                </TabsTrigger>
                <TabsTrigger value="notifications" className="justify-start w-full mb-1">
                  Уведомления
                </TabsTrigger>
                <TabsTrigger value="privacy" className="justify-start w-full">
                  Приватность
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1">
              <TabsContent value="profile" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Профиль</CardTitle>
                    <CardDescription>Управляйте информацией о вашем профиле и настройками отображения</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                        <div className="relative">
                          <Avatar
                            className="h-24 w-24 cursor-pointer border-2 border-muted hover:border-primary transition-colors"
                            onClick={handleAvatarClick}
                          >
                            <AvatarImage src={avatar} alt="Аватар" />
                            <AvatarFallback className="text-2xl">БЗ</AvatarFallback>
                          </Avatar>
                          <div
                            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-full cursor-pointer"
                            onClick={handleAvatarClick}
                          >
                            <ImageIcon className="h-8 w-8 text-white" />
                          </div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarChange}
                          />
                        </div>
                        <div className="flex flex-col gap-2 text-center sm:text-left">
                          <h3 className="font-medium">Фото профиля</h3>
                          <p className="text-sm text-muted-foreground">
                            Нажмите на аватар, чтобы загрузить новое изображение. Рекомендуемый размер: 400x400
                            пикселей.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full sm:w-auto"
                            onClick={handleRemoveAvatar}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Удалить фото
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Имя</Label>
                          <Input id="firstName" defaultValue="Бахтияр" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Фамилия</Label>
                          <Input id="lastName" defaultValue="Зикирин" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="username">Имя пользователя</Label>
                        <Input id="username" defaultValue="bzikirin" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="b.zikirin@gmail.com" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="faculty">Факультет</Label>
                        <Select defaultValue="design">
                          <SelectTrigger id="faculty">
                            <SelectValue placeholder="Выберите факультет" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="arts">Факультет искусств</SelectItem>
                            <SelectItem value="design">Факультет дизайна</SelectItem>
                            <SelectItem value="music">Факультет музыки</SelectItem>
                            <SelectItem value="literature">Факультет литературы</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">О себе</Label>
                        <Textarea
                          id="bio"
                          placeholder="Расскажите о себе и своем творчестве"
                          className="min-h-[100px]"
                          defaultValue="Студент факультета дизайна, увлекаюсь графическим дизайном и UI/UX. Работаю над проектами в области веб-дизайна и мобильных приложений."
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={handleSaveProfile}>Сохранить изменения</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="account" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Аккаунт</CardTitle>
                    <CardDescription>Управляйте настройками вашего аккаунта и безопасностью</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Изменение пароля</h3>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Текущий пароль</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">Новый пароль</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Двухфакторная аутентификация</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="2fa" className="text-base">
                            Включить 2FA
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Добавьте дополнительный уровень безопасности для вашего аккаунта
                          </p>
                        </div>
                        <Switch id="2fa" />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-destructive">Опасная зона</h3>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">Удалить аккаунт</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Это действие нельзя отменить. Все ваши данные, проекты и комментарии будут удалены
                              навсегда.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Удалить аккаунт
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={handleSaveAccount}>Сохранить изменения</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Уведомления</CardTitle>
                    <CardDescription>Настройте, какие уведомления вы хотите получать</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Проекты</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="notify-likes" className="text-base">
                              Лайки
                            </Label>
                            <p className="text-sm text-muted-foreground">Уведомления о лайках на ваших проектах</p>
                          </div>
                          <Switch id="notify-likes" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="notify-comments" className="text-base">
                              Комментарии
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Уведомления о новых комментариях к вашим проектам
                            </p>
                          </div>
                          <Switch id="notify-comments" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="notify-mentions" className="text-base">
                              Упоминания
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Уведомления, когда вас упоминают в комментариях
                            </p>
                          </div>
                          <Switch id="notify-mentions" defaultChecked />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Подписки</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="notify-followers" className="text-base">
                              Новые подписчики
                            </Label>
                            <p className="text-sm text-muted-foreground">Уведомления о новых подписчиках</p>
                          </div>
                          <Switch id="notify-followers" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="notify-author-projects" className="text-base">
                              Проекты авторов
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Уведомления о новых проектах от авторов, на которых вы подписаны
                            </p>
                          </div>
                          <Switch id="notify-author-projects" defaultChecked />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Система</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="notify-updates" className="text-base">
                              Обновления платформы
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Уведомления о новых функциях и обновлениях платформы
                            </p>
                          </div>
                          <Switch id="notify-updates" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="notify-newsletter" className="text-base">
                              Новостная рассылка
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Получать ежемесячную рассылку с интересными проектами
                            </p>
                          </div>
                          <Switch id="notify-newsletter" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={handleSaveNotifications}>Сохранить изменения</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Приватность</CardTitle>
                    <CardDescription>Управляйте настройками приватности вашего профиля и проектов</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Видимость профиля</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="profile-public" className="text-base">
                              Публичный профиль
                            </Label>
                            <p className="text-sm text-muted-foreground">Ваш профиль будет виден всем пользователям</p>
                          </div>
                          <Switch id="profile-public" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="show-email" className="text-base">
                              Показывать email
                            </Label>
                            <p className="text-sm text-muted-foreground">Ваш email будет виден другим пользователям</p>
                          </div>
                          <Switch id="show-email" />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Проекты по умолчанию</h3>
                      <div className="space-y-2">
                        <Label htmlFor="default-visibility">Видимость новых проектов</Label>
                        <Select defaultValue="public">
                          <SelectTrigger id="default-visibility">
                            <SelectValue placeholder="Выберите видимость" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Публичные</SelectItem>
                            <SelectItem value="unlisted">По ссылке</SelectItem>
                            <SelectItem value="private">Приватные</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground mt-1">
                          Эта настройка будет применяться ко всем новым проектам по умолчанию
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Данные</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="analytics" className="text-base">
                              Аналитика использования
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Разрешить сбор анонимных данных для улучшения платформы
                            </p>
                          </div>
                          <Switch id="analytics" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="cookies" className="text-base">
                              Файлы cookie
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Разрешить использование файлов cookie для персонализации
                            </p>
                          </div>
                          <Switch id="cookies" defaultChecked />
                        </div>
                      </div>
                      <Button variant="outline">Скачать мои данные</Button>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button>Сохранить изменения</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

