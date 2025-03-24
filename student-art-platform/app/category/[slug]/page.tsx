import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

export default function CategoryPage({ params }: { params: { slug: string } }) {
  // Получаем информацию о категории по slug
  const category = getCategoryBySlug(params.slug)

  // Получаем проекты для данной категории
  const projects = getProjectsByCategory(category?.title.toLowerCase() || "")

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Категория не найдена</h1>
        <p>Запрошенная категория не существует.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.title}</h1>
        <p className="text-muted-foreground">{category.description}</p>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">В этой категории пока нет проектов.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProjectCard({ project }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48">
        <img src={project.image || "/placeholder.svg"} alt={project.title} className="w-full h-full object-cover" />
        <Badge className="absolute top-2 right-2">{project.category}</Badge>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <Link href={`/projects/${project.id}`} className="hover:text-primary transition-colors">
          <h3 className="font-bold text-lg mb-2">{project.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">{project.description}</p>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={project.author.avatar} alt={project.author.name} />
              <AvatarFallback>{project.author.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{project.author.name}</span>
          </div>
          <span className="text-sm text-muted-foreground">{project.date}</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Функция для получения информации о категории по slug
function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.href.split("/").pop() === slug)
}

// Функция для получения проектов по категории
function getProjectsByCategory(category: string) {
  return allProjects.filter((project) => project.category.toLowerCase() === category)
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

const allProjects = [
  {
    id: "1",
    title: "Городские силуэты",
    category: "Фотография",
    description: "Серия черно-белых фотографий, исследующих геометрию и ритмы современной городской архитектуры.",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1920&auto=format&fit=crop",
    author: {
      name: "Анна Соколова",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    date: "15 мая 2023",
    likes: 24,
    comments: 8,
  },
  {
    id: "2",
    title: "Абстрактные композиции",
    category: "Живопись",
    description: "Серия абстрактных работ, исследующих взаимодействие цвета, формы и текстуры в современном искусстве.",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=1920&auto=format&fit=crop",
    author: {
      name: "Михаил Волков",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    date: "3 июня 2023",
    likes: 32,
    comments: 12,
  },
  {
    id: "3",
    title: "Эхо мегаполиса",
    category: "Музыка",
    description:
      "Экспериментальная композиция, созданная из звуков городской среды и преобразованная в современное электронное произведение.",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1920&auto=format&fit=crop",
    author: {
      name: "Елена Морозова",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    date: "20 апреля 2023",
    likes: 45,
    comments: 18,
  },
  {
    id: "4",
    title: "Цифровые миры",
    category: "Дизайн",
    description: "Серия цифровых иллюстраций, создающих фантастические миры с уникальной атмосферой и персонажами.",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1920&auto=format&fit=crop",
    author: {
      name: "Дмитрий Лебедев",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    date: "10 мая 2023",
    likes: 18,
    comments: 6,
  },
  {
    id: "5",
    title: "Стихи о современности",
    category: "Литература",
    description:
      "Сборник стихотворений, исследующих темы технологий, отчуждения и поиска идентичности в цифровую эпоху.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1920&auto=format&fit=crop",
    author: {
      name: "Ольга Белова",
      avatar: "https://randomuser.me/api/portraits/women/29.jpg",
    },
    date: "5 июня 2023",
    likes: 15,
    comments: 5,
  },
  {
    id: "6",
    title: "Органические формы",
    category: "Скульптура",
    description: "Серия керамических скульптур, вдохновленных природными формами и органическими структурами.",
    image: "https://images.unsplash.com/photo-1544413164-5f1b295eb435?q=80&w=1920&auto=format&fit=crop",
    author: {
      name: "Алексей Новиков",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    date: "25 мая 2023",
    likes: 28,
    comments: 10,
  },
]

