"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { registerUser, loginUser } from "@/lib/auth"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

export default function RegisterPage() {
  const [authType, setAuthType] = useState("register")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [faculty, setFaculty] = useState("")
  const [occupation, setOccupation] = useState("")
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined)
  const [bio, setBio] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  // Функция для обработки клика по ссылке условий использования
  const handleTermsClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push("/terms")
  }

  // Функция для обработки клика по ссылке "Забыли пароль?"
  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push("/forgot-password")
  }

  // Функция для обработки входа
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Пожалуйста, заполните все поля")
      return
    }

    // Вход пользователя через функцию из lib/auth
    const result = loginUser(email, password)

    if (result.success && result.user) {
      // Показываем уведомление об успешном входе
      toast({
        title: "Вход выполнен успешно",
        description: "Добро пожаловать на ArtCampus!",
        type: "success",
      })

      // Перенаправляем на главную страницу
      router.push("/")
    } else {
      setError(result.message)
    }
  }

  // Функция для обработки регистрации
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    if (!firstName || !lastName || !username || !email || !password || !faculty) {
      setError("Пожалуйста, заполните все обязательные поля")
      return
    }

    if (!termsAccepted) {
      setError("Необходимо принять условия использования")
      return
    }

    // Регистрация пользователя через функцию из lib/auth
    const result = registerUser({
      username,
      email,
      firstName,
      lastName,
      password,
      faculty,
      occupation,
      birthDate: birthDate ? format(birthDate, "yyyy-MM-dd") : undefined,
      bio,
    })

    if (result.success && result.user) {
      // Показываем уведомление об успешной регистрации
      toast({
        title: "Регистрация выполнена успешно",
        description: "Добро пожаловать на ArtCampus!",
        type: "success",
      })

      // Перенаправляем на страницу профиля
      router.push("/profile")
    } else {
      setError(result.message)
    }
  }

  // Функция для переключения между вкладками
  const handleTabChange = (value: string) => {
    setAuthType(value)
    setError("")
  }

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {authType === "register" ? "Создать аккаунт" : "Войти в аккаунт"}
            </CardTitle>
            <CardDescription className="text-center">
              {authType === "register" ? "Введите свои данные для регистрации" : "Введите свои данные для входа"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={authType} value={authType} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="register">Регистрация</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-login">Email</Label>
                    <Input
                      id="email-login"
                      type="email"
                      placeholder="example@mail.ru"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password-login">Пароль</Label>
                      <Button type="button" variant="link" className="p-0 h-auto" onClick={handleForgotPassword}>
                        Забыли пароль?
                      </Button>
                    </div>
                    <Input
                      id="password-login"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Запомнить меня
                    </label>
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full">
                    Войти
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">
                        Имя <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="first-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">
                        Фамилия <span className="text-red-500">*</span>
                      </Label>
                      <Input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">
                      Имя пользователя <span className="text-red-500">*</span>
                    </Label>
                    <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@mail.ru"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      Пароль <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faculty">
                      Факультет <span className="text-red-500">*</span>
                    </Label>
                    <Select value={faculty} onValueChange={setFaculty} required>
                      <SelectTrigger id="faculty">
                        <SelectValue placeholder="Выберите факультет" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="arts">Факультет искусств</SelectItem>
                        <SelectItem value="design">Факультет дизайна</SelectItem>
                        <SelectItem value="architecture">Факультет архитектуры</SelectItem>
                        <SelectItem value="media">Факультет медиа</SelectItem>
                        <SelectItem value="other">Другой</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Род деятельности</Label>
                    <Select value={occupation} onValueChange={setOccupation}>
                      <SelectTrigger id="occupation">
                        <SelectValue placeholder="Выберите род деятельности" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Студент</SelectItem>
                        <SelectItem value="designer">Дизайнер</SelectItem>
                        <SelectItem value="artist">Художник</SelectItem>
                        <SelectItem value="photographer">Фотограф</SelectItem>
                        <SelectItem value="musician">Музыкант</SelectItem>
                        <SelectItem value="writer">Писатель</SelectItem>
                        <SelectItem value="other">Другое</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthdate">Дата рождения</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {birthDate ? format(birthDate, "PPP", { locale: ru }) : "Выберите дату"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={birthDate} onSelect={setBirthDate} initialFocus locale={ru} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">О себе</Label>
                    <Input
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Расскажите немного о себе"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                      required
                    />
                    <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Я согласен с{" "}
                      <Button type="button" variant="link" className="p-0 h-auto" onClick={handleTermsClick}>
                        условиями использования
                      </Button>
                    </div>
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full">
                    Зарегистрироваться
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-center text-sm text-muted-foreground mt-2">
              {authType === "register" ? (
                <>
                  Уже есть аккаунт?{" "}
                  <Button type="button" variant="link" className="p-0 h-auto" onClick={() => handleTabChange("login")}>
                    Войти
                  </Button>
                </>
              ) : (
                <>
                  Нет аккаунта?{" "}
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => handleTabChange("register")}
                  >
                    Зарегистрироваться
                  </Button>
                </>
              )}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

