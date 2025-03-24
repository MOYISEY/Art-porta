"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, X, ArrowRight } from "lucide-react"
import Link from "next/link"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  // Предотвращаем проблемы с гидратацией
  useEffect(() => {
    setMounted(true)

    // Загружаем недавние поисковые запросы из localStorage
    try {
      const savedSearches = localStorage.getItem("recentSearches")
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches))
      }
    } catch (error) {
      console.error("Ошибка при загрузке недавних поисковых запросов:", error)
    }
  }, [])

  // Имитация поиска
  useEffect(() => {
    if (!searchQuery.trim() && !selectedCategory) {
      setSearchResults([])
      return
    }

    // Фильтруем проекты по запросу
    let filteredProjects = [...allProjects]

    if (searchQuery.trim()) {
      filteredProjects = filteredProjects.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.author.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      // Сохраняем поисковый запрос в недавние
      if (searchQuery.trim().length > 2 && !recentSearches.includes(searchQuery.trim())) {
        const newRecentSearches = [searchQuery.trim(), ...recentSearches.slice(0, 4)]
        setRecentSearches(newRecentSearches)
        localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches))
      }
    }

    // Если выбрана конкретная категория, фильтруем по ней
    if (selectedCategory) {
      filteredProjects = filteredProjects.filter(
        (project) => project.category.toLowerCase() === selectedCategory.toLowerCase(),
      )
    } else if (activeTab !== "all") {
      filteredProjects = filteredProjects.filter(
        (project) => project.category.toLowerCase() === activeTab.toLowerCase(),
      )
    }

    setSearchResults(filteredProjects)
  }, [searchQuery, activeTab, selectedCategory, recentSearches])

  const handleClearSearch = () => {
    setSearchQuery("")
    setSelectedCategory(null)
  }

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category.toLowerCase())
    setActiveTab("all")
  }

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // В реальном приложении здесь был бы переход на страницу результатов поиска
    // Для демонстрации просто закрываем диалог
    if (searchQuery.trim()) {
      onOpenChange(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0">
        <form onSubmit={handleSearchSubmit} className="flex items-center border-b p-4">
          <div className="relative w-full flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Поиск проектов, авторов, категорий..."
              className="pl-10 pr-10 border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-12 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {(searchQuery || selectedCategory) && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 h-full"
                onClick={handleClearSearch}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
          <Button type="submit" className="ml-2 rounded-full" size="icon">
            <ArrowRight className="h-5 w-5" />
          </Button>
        </form>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-4 pt-2 pb-0">
            <TabsList className="w-full justify-start border-b pb-0 h-auto">
              <TabsTrigger value="all" className="rounded-b-none">
                Все
              </TabsTrigger>
              <TabsTrigger value="живопись" className="rounded-b-none">
                Живопись
              </TabsTrigger>
              <TabsTrigger value="фотография" className="rounded-b-none">
                Фотография
              </TabsTrigger>
              <TabsTrigger value="дизайн" className="rounded-b-none">
                Дизайн
              </TabsTrigger>
              <TabsTrigger value="музыка" className="rounded-b-none">
                Музыка
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4 h-[400px] overflow-y-auto">
            <TabsContent value="all" className="m-0">
              <SearchResults results={searchResults} onSelect={() => onOpenChange(false)} />
            </TabsContent>
            <TabsContent value="живопись" className="m-0">
              <SearchResults results={searchResults} onSelect={() => onOpenChange(false)} />
            </TabsContent>
            <TabsContent value="фотография" className="m-0">
              <SearchResults results={searchResults} onSelect={() => onOpenChange(false)} />
            </TabsContent>
            <TabsContent value="дизайн" className="m-0">
              <SearchResults results={searchResults} onSelect={() => onOpenChange(false)} />
            </TabsContent>
            <TabsContent value="музыка" className="m-0">
              <SearchResults results={searchResults} onSelect={() => onOpenChange(false)} />
            </TabsContent>
          </div>
        </Tabs>

        {searchQuery && searchResults.length === 0 && !selectedCategory && (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Ничего не найдено по запросу "{searchQuery}"</p>
          </div>
        )}

        {selectedCategory && searchResults.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Ничего не найдено в категории "{selectedCategory}"</p>
          </div>
        )}

        {!searchQuery && !selectedCategory && (
          <div className="p-4 border-t">
            {recentSearches.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">Недавние поиски</h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => handleRecentSearchClick(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <h3 className="font-medium mb-2">Популярные категории</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.value}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleCategoryClick(category.label)}
                >
                  {category.label}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function SearchResults({ results, onSelect }) {
  if (results.length === 0) return null

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <Link
          key={result.id}
          href={`/projects/${result.id}`}
          className="flex gap-3 p-3 hover:bg-muted rounded-md transition-colors"
          onClick={onSelect}
        >
          <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
            <img src={result.image || "/placeholder.svg"} alt={result.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{result.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {result.category}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={result.author.avatar} alt={result.author.name} />
                  <AvatarFallback>{result.author.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                {result.author.name}
              </div>
            </div>
            <p className="text-sm text-muted-foreground truncate mt-1">{result.description}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

const categories = [
  { label: "Живопись", value: "живопись" },
  { label: "Фотография", value: "фотография" },
  { label: "Скульптура", value: "скульптура" },
  { label: "Дизайн", value: "дизайн" },
  { label: "Музыка", value: "музыка" },
  { label: "Литература", value: "литература" },
  { label: "Видео", value: "видео" },
]

const allProjects = [
  {
    id: "1",
    title: "Городские силуэты",
    category: "Фотография",
    description:
      "Серия черно-белых фотографий, исследующих архитектуру и атмосферу современного города через призму света и тени.",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1920&auto=format&fit=crop",
    author: {
      name: "Анна Соколова",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
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
  },
]

