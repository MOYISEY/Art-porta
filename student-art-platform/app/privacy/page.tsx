import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Политика конфиденциальности</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Введение</h2>
            <p>
              Настоящая Политика конфиденциальности (далее — «Политика») объясняет, как ArtCampus (далее — «Платформа»)
              собирает, использует, хранит и защищает персональные данные пользователей.
            </p>
            <p>
              Используя Платформу, Пользователь подтверждает, что прочитал, понял и согласен с условиями настоящей
              Политики.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Собираемая информация</h2>
            <p>Платформа может собирать следующие типы информации:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Личная информация: имя, фамилия, email, факультет и другие данные, предоставляемые при регистрации.
              </li>
              <li>Информация о контенте: проекты, комментарии, лайки и другие действия на Платформе.</li>
              <li>
                Техническая информация: IP-адрес, тип браузера, устройство, время доступа и другие данные о
                использовании Платформы.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Использование информации</h2>
            <p>Собранная информация используется для:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Предоставления доступа к функциям Платформы.</li>
              <li>Улучшения и персонализации пользовательского опыта.</li>
              <li>Анализа использования Платформы и улучшения её работы.</li>
              <li>Связи с пользователями по вопросам, связанным с Платформой.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Защита информации</h2>
            <p>
              Платформа принимает все необходимые меры для защиты персональных данных пользователей от
              несанкционированного доступа, изменения, раскрытия или уничтожения.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Изменения в Политике</h2>
            <p>
              Платформа оставляет за собой право изменять настоящую Политику в любое время. Пользователи будут
              уведомлены о существенных изменениях.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Button asChild>
              <Link href="/">Вернуться на главную</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

