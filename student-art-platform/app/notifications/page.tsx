"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Heart, MessageSquare, User, Star, Bookmark, Check, ExternalLink } from "lucide-react"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [toast, setToast] = useState<{ message: string } | null>(null)

  useEffect(() => {
    setMounted(true)

    // Загружаем уведомления из localStorage
    const storedNotifications = JSON.parse(localStorage.getItem("notifications") || "[]")
    setNotifications(storedNotifications)
  }, [])

  // Простая функция для отображения toast
  const showToast = (message: string) => {
    setToast({ message })
    setTimeout(() => setToast(null), 3000)
  }

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      isRead: true,
    }))

    setNotifications(updatedNotifications)
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
    localStorage.setItem("unreadNotificationsCount", "0")

    showToast("Все уведомления отмечены как прочитанные")
  }

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, isRead: true } : notification,
    )

    setNotifications(updatedNotifications)
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))

    // Обновляем счетчик непрочитанных уведомлений
    const unreadCount = updatedNotifications.filter((n) => !n.isRead).length
    localStorage.setItem("unreadNotificationsCount", unreadCount.toString())

    showToast("Уведомление отмечено как прочитанное")
  }

  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter((notification) => notification.id !== id)

    setNotifications(updatedNotifications)
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))

    // Обновляем счетчик непрочитанных уведомлений
    const unreadCount = updatedNotifications.filter((n) => !n.isRead).length
    localStorage.setItem("unreadNotificationsCount", unreadCount.toString())

    showToast("Уведомление удалено")
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  if (!mounted) return null

  return (
    <div className="container mx-auto px-4 py-8">
      {toast && (
        <div className="fixed bottom-4 right-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-4 rounded-md shadow-md z-50">
          {toast.message}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Уведомления</h1>
          {unreadCount > 0 && <Badge className="text-sm">{unreadCount} новых</Badge>}
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Отметить все как прочитанные
          </Button>
        )}
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="likes">Лайки</TabsTrigger>
          <TabsTrigger value="comments">Комментарии</TabsTrigger>
          <TabsTrigger value="follows">Подписки</TabsTrigger>
          <TabsTrigger value="system">Системные</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">У вас пока нет уведомлений.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="likes">
          <div className="space-y-4">
            {notifications.filter((n) => n.type === "like").length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">У вас пока нет уведомлений о лайках.</p>
                </CardContent>
              </Card>
            ) : (
              notifications
                .filter((n) => n.type === "like")
                .map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="comments">
          <div className="space-y-4">
            {notifications.filter((n) => n.type === "comment").length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">У вас пока нет уведомлений о комментариях.</p>
                </CardContent>
              </Card>
            ) : (
              notifications
                .filter((n) => n.type === "comment")
                .map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="follows">
          <div className="space-y-4">
            {notifications.filter((n) => n.type === "follow").length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">У вас пока нет уведомлений о подписках.</p>
                </CardContent>
              </Card>
            ) : (
              notifications
                .filter((n) => n.type === "follow")
                .map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="system">
          <div className="space-y-4">
            {notifications.filter((n) => n.type === "system" || n.type === "featured" || n.type === "bookmark")
              .length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">У вас пока нет системных уведомлений.</p>
                </CardContent>
              </Card>
            ) : (
              notifications
                .filter((n) => n.type === "system" || n.type === "featured" || n.type === "bookmark")
                .map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function NotificationCard({ notification, onMarkAsRead, onDelete }) {
  const getIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart className="h-5 w-5 text-rose-500" />
      case "comment":
        return <MessageSquare className="h-5 w-5 text-blue-500" />
      case "follow":
        return <User className="h-5 w-5 text-green-500" />
      case "bookmark":
        return <Bookmark className="h-5 w-5 text-purple-500" />
      case "system":
        return <Bell className="h-5 w-5 text-amber-500" />
      case "featured":
        return <Star className="h-5 w-5 text-yellow-500" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  // Определяем URL для перехода
  const getActionUrl = () => {
    if (notification.projectId) {
      return `/projects/${notification.projectId}`
    }
    if (notification.authorId) {
      return `/author/${notification.authorId}`
    }
    return null
  }

  const actionUrl = getActionUrl()

  return (
    <Card className={notification.isRead ? "" : "border-l-4 border-l-primary"}>
      <CardContent className="p-4 md:p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>

          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2 mb-2">
                {notification.authorAvatar && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={notification.authorAvatar} alt={notification.authorName || "System"} />
                    <AvatarFallback>
                      {notification.authorName ? notification.authorName.substring(0, 2) : "AC"}
                    </AvatarFallback>
                  </Avatar>
                )}
                <span className="font-medium">{notification.authorName || "ArtCampus"}</span>
              </div>

              <div className="text-sm text-muted-foreground whitespace-nowrap">{notification.time}</div>
            </div>

            <p className="text-sm md:text-base mb-2">{notification.message}</p>

            {notification.projectTitle && (
              <div className="flex items-center gap-2 mt-2">
                <div className="w-10 h-10 rounded overflow-hidden">
                  <img
                    src={notification.projectImage || "/placeholder.svg?height=40&width=40"}
                    alt={notification.projectTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium">{notification.projectTitle}</span>
              </div>
            )}

            <div className="mt-3 flex gap-2">
              {actionUrl && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={actionUrl}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Перейти
                  </Link>
                </Button>
              )}

              {!notification.isRead && (
                <Button variant="ghost" size="sm" onClick={() => onMarkAsRead(notification.id)}>
                  <Check className="h-4 w-4 mr-2" />
                  Отметить как прочитанное
                </Button>
              )}

              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => onDelete(notification.id)}>
                Удалить
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

