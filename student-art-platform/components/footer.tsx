import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t py-8 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary">ArtCampus</h3>
            <p className="text-muted-foreground">
              Платформа для публикации и обсуждения культурных и художественных проектов студентов.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-primary transition-colors">
                  Проекты
                </Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-primary transition-colors">
                  Создать проект
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  О платформе
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Правовая информация</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Условия использования
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/copyright" className="hover:text-primary transition-colors">
                  Авторские права
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

