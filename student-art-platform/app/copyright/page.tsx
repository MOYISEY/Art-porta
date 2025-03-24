import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CopyrightPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Авторские права</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Общие положения</h2>
            <p>
              Все материалы, размещенные на платформе ArtCampus (далее — «Платформа»), включая тексты, изображения,
              аудио и видео файлы, защищены законодательством об авторском праве.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Права пользователей</h2>
            <p>
              Пользователи сохраняют все права на размещаемый ими контент. Размещая контент на Платформе, пользователь
              предоставляет Платформе неисключительную лицензию на использование, воспроизведение и отображение этого
              контента в рамках функционирования Платформы.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Ограничения использования</h2>
            <p>Пользователям запрещается:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Размещать контент, нарушающий авторские права третьих лиц.</li>
              <li>
                Копировать, распространять или использовать в коммерческих целях контент других пользователей без их
                явного разрешения.
              </li>
              <li>Использовать технические средства для массового копирования контента с Платформы.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Уведомление о нарушении</h2>
            <p>
              Если вы считаете, что ваши авторские права были нарушены на Платформе, пожалуйста, свяжитесь с нами,
              предоставив следующую информацию:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Описание произведения, авторские права на которое, по вашему мнению, были нарушены.</li>
              <li>Ссылку на материал на Платформе, который, по вашему мнению, нарушает ваши права.</li>
              <li>Ваши контактные данные.</li>
              <li>
                Заявление о том, что вы добросовестно полагаете, что использование материала не разрешено владельцем
                авторских прав.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Изменения</h2>
            <p>
              Платформа оставляет за собой право изменять настоящие правила в любое время. Пользователи будут уведомлены
              о существенных изменениях.
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

