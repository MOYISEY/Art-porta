"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, Bell, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchDialog } from "@/components/search-dialog"
import { LoginDialog } from "@/components/login-dialog"
import { getCurrentUser, logoutUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Используем useEffect для проверки авторизации только на клиенте
  useEffect(() => {
    setMounted(true)

    try {
      // Получаем текущего пользователя
      const user = getCurrentUser()
      setCurrentUser(user)
      setIsLoggedIn(!!user)
      setIsAdmin(user?.role === "admin")

      // Загружаем количество непрочитанных уведомлений
      const unreadCount = Number(localStorage.getItem("unreadNotificationsCount") || "0")
      setUnreadNotifications(unreadCount)

      // Обновляем счетчик уведомлений при изменении localStorage
      const handleStorageChange = () => {
        const newUnreadCount = Number(localStorage.getItem("unreadNotificationsCount") || "0")
        setUnreadNotifications(newUnreadCount)
      }

      window.addEventListener("storage", handleStorageChange)

      return () => {
        window.removeEventListener("storage", handleStorageChange)
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error)
    }
  }, [])

  // Функция для имитации входа
  const handleLogin = () => {
    setLoginDialogOpen(true)
  }

  // Функция для имитации выхода
  const handleLogout = () => {
    logoutUser()
    setIsLoggedIn(false)
    setCurrentUser(null)
    setIsAdmin(false)

    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы",
      type: "success",
    })

    router.push("/")
  }

  // Функция для успешного входа
  const handleLoginSuccess = (email: string, password: string) => {
    const user = getCurrentUser()
    setCurrentUser(user)
    setIsLoggedIn(!!user)
    setIsAdmin(user?.role === "admin")
    setLoginDialogOpen(false)
  }

  // Рендерим упрощенную версию до монтирования компонента
  if (!mounted) {
    return (
      <header className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-bold text-2xl text-primary">ArtCampus</div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-2xl text-primary">
          ArtCampus
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/projects" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Проекты</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Категории</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {categories.map((category) => (
                      <li key={category.title}>
                        <Link href={category.href} legacyBehavior passHref>
                          <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">{category.title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {category.description}
                            </p>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>О платформе</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchDialogOpen(true)}
            className="text-muted-foreground hover:text-foreground rounded-full"
            aria-label="Поиск"
          >
            <Search className="h-5 w-5" />
          </Button>

          <ThemeToggle />

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link href="/notifications">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                      {unreadNotifications > 9 ? "9+" : unreadNotifications}
                    </Badge>
                  )}
                </Link>
              </Button>

              {isAdmin && (
                <Button variant="ghost" size="icon" className="relative" asChild>
                  <Link href="/admin">
                    <Shield className="h-5 w-5" />
                  </Link>
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser?.avatar || "/placeholder.svg?height=32&width=32"} alt="@user" />
                      <AvatarFallback>{currentUser?.firstName?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {currentUser?.firstName} {currentUser?.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">{currentUser?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Профиль</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Мои проекты</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Настройки</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Панель администратора</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Выйти</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button asChild>
                <Link href="/submit">Создать проект</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={handleLogin}>
                Войти
              </Button>
              <Button asChild>
                <Link href="/register">Регистрация</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchDialogOpen(true)}
            className="text-muted-foreground rounded-full"
            aria-label="Поиск"
          >
            <Search className="h-5 w-5" />
          </Button>

          <ThemeToggle />

          {isLoggedIn && (
            <>
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link href="/notifications">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                      {unreadNotifications > 9 ? "9+" : unreadNotifications}
                    </Badge>
                  )}
                </Link>
              </Button>

              {isAdmin && (
                <Button variant="ghost" size="icon" className="relative" asChild>
                  <Link href="/admin">
                    <Shield className="h-5 w-5" />
                  </Link>
                </Button>
              )}
            </>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-6 mt-6">
                <Link href="/" className="font-bold text-2xl text-primary">
                  ArtCampus
                </Link>

                {isLoggedIn && (
                  <div className="flex items-center gap-3 py-2">
                    <Avatar>
                      <AvatarImage src={currentUser?.avatar || "/placeholder.svg?height=32&width=32"} alt="@user" />
                      <AvatarFallback>{currentUser?.firstName?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {currentUser?.firstName} {currentUser?.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Link href="/projects" className="block py-2 text-lg">
                    Проекты
                  </Link>
                  <div className="py-2">
                    <h3 className="text-lg mb-2">Категории</h3>
                    <div className="pl-4 space-y-2">
                      {categories.map((category) => (
                        <Link key={category.title} href={category.href} className="block py-1">
                          {category.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Link href="/about" className="block py-2 text-lg">
                    О платформе
                  </Link>
                </div>

                {isLoggedIn ? (
                  <div className="space-y-2 mt-4">
                    <Button asChild className="w-full">
                      <Link href="/submit">Создать проект</Link>
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button asChild variant="outline">
                        <Link href="/profile">Профиль</Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link href="/dashboard">Мои проекты</Link>
                      </Button>
                    </div>
                    {isAdmin && (
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/admin">Панель администратора</Link>
                      </Button>
                    )}
                    <Button variant="ghost" className="w-full" onClick={handleLogout}>
                      Выйти
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 mt-4">
                    <Button className="w-full" onClick={handleLogin}>
                      Войти
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/register">Регистрация</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Глобальный поиск */}
      {mounted && <SearchDialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen} />}

      {/* Диалог входа */}
      {mounted && <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} onLogin={handleLoginSuccess} />}
    </header>
  )
}

const categories = [
  {
    title: "Живопись",
    description: "Картины, иллюстрации и другие художественные работы",
    href: "/category/painting",
  },
  {
    title: "Фотография",
    description: "Фотопроекты, фотосерии и отдельные фотографии",
    href: "/category/photography",
  },
  {
    title: "Скульптура",
    description: "Трехмерные художественные объекты и инсталляции",
    href: "/category/sculpture",
  },
  {
    title: "Дизайн",
    description: "Графический дизайн, UI/UX, промышленный дизайн",
    href: "/category/design",
  },
  {
    title: "Музыка",
    description: "Музыкальные композиции, аранжировки и исполнения",
    href: "/category/music",
  },
  {
    title: "Литература",
    description: "Поэзия, проза, драматургия и другие литературные формы",
    href: "/category/literature",
  },
]

