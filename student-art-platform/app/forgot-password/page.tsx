"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError("Пожалуйста, введите ваш email")
      return
    }

    // В реальном приложении здесь был бы запрос на сервер
    // Для демонстрации просто показываем сообщение об успехе
    setIsSubmitted(true)

    toast({
      title: "Инструкции отправлены",
      description: "Проверьте вашу электронную почту для восстановления пароля",
      type: "success",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Восстановление пароля</CardTitle>
            <CardDescription className="text-center">
              Введите ваш email для получения инструкций по восстановлению пароля
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center space-y-4">
                <p className="text-green-600 dark:text-green-400">
                  Инструкции по восстановлению пароля отправлены на ваш email.
                </p>
                <p>Пожалуйста, проверьте вашу электронную почту и следуйте инструкциям для сброса пароля.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@mail.ru"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full">
                  Отправить инструкции
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" asChild>
              <Link href="/register">Вернуться к входу</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

