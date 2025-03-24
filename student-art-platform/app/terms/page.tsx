import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Условия использования</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Общие положения</h2>
            <p>
              Настоящие Условия использования (далее — «Условия») регулируют отношения между ArtCampus (далее —
              «Платформа») и пользователями платформы (далее — «Пользователи»).
            </p>
            <p>
              Используя Платформу, Пользователь подтверждает, что прочитал, понял и согласен соблюдать настоящие
              Условия.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Регистрация и аккаунт</h2>
            <p>
              Для использования всех функций Платформы Пользователю необходимо создать аккаунт. При регистрации
              Пользователь обязуется предоставить достоверную информацию о себе.
            </p>
            <p>
              Пользователь несет ответственность за сохранность своих учетных данных и за все действия, совершенные с
              использованием его аккаунта.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Контент</h2>
            <p>
              Пользователь сохраняет все права на размещаемый им контент, но предоставляет Платформе неисключительную
              лицензию на использование, воспроизведение и отображение этого контента.
            </p>
            <p>
              Пользователь обязуется не размещать контент, который нарушает права третьих лиц, содержит незаконные
              материалы или противоречит настоящим Условиям.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Правила поведения</h2>
            <p>
              Пользователь обязуется соблюдать правила поведения на Платформе, включая уважительное отношение к другим
              Пользователям, отсутствие спама, оскорблений и других форм неприемлемого поведения.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Изменения условий</h2>
            <p>
              Платформа оставляет за собой право изменять настоящие Условия в любое время. Пользователи будут уведомлены
              о существенных изменениях.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Button asChild>
              <Link href="/register">Вернуться к регистрации</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

