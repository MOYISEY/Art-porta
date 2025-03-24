import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">О платформе ArtCampus</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <p className="text-lg mb-4">
            ArtCampus — это платформа для студентов, где они могут делиться своими творческими проектами, получать
            обратную связь и находить вдохновение в работах других.
          </p>
          <p className="text-lg mb-4">
            Наша миссия — создать сообщество творческих людей, которые могут учиться друг у друга, сотрудничать и
            развивать свои таланты.
          </p>
          <p className="text-lg">
            Платформа разработана для студентов колледжа AITU, чтобы предоставить им возможность демонстрировать свои
            работы и получать признание за свои творческие достижения.
          </p>
        </div>

        <div className="flex justify-center items-center">
          <div className="h-64 w-64 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30 rounded-xl">
            <h2 className="text-7xl font-bold text-primary tracking-tighter">AITU</h2>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Наша команда</h2>

      <Card className="mb-12">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <Avatar className="w-32 h-32">
              <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Бахтияр Зикирин" />
              <AvatarFallback className="text-2xl">БЗ</AvatarFallback>
            </Avatar>

            <div>
              <h3 className="text-xl font-bold mb-2">Зикирин Бахтияр Сакенулы</h3>
              <p className="text-muted-foreground mb-2">Основатель и разработчик</p>
              <p className="mb-4">
                Студент колледжа AITU, увлеченный веб-разработкой и дизайном. Создал ArtCampus с целью объединить
                творческих студентов и дать им платформу для самовыражения.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Свяжитесь с нами</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">Контактная информация</h3>

            <div className="space-y-3">
              <div>
                <p className="font-medium">Email:</p>
                <p className="text-muted-foreground">b.zikirin@gmail.com</p>
              </div>

              <div>
                <p className="font-medium">Телефон:</p>
                <p className="text-muted-foreground">+7 (708) 275-52-38</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">Социальные сети</h3>

            <div className="space-y-3">
              <div>
                <p className="font-medium">Instagram:</p>
                <p className="text-muted-foreground">@artcampus.aitu</p>
              </div>

              <div>
                <p className="font-medium">Telegram:</p>
                <p className="text-muted-foreground">@artcampus_bot</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

