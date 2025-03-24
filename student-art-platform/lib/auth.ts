// Типы для пользователей и проектов
export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  password: string // В реальном приложении пароли должны быть хешированы
  faculty: string
  avatar?: string
  role: "user" | "admin"
  createdAt: string
  birthDate?: string
  bio?: string
  occupation?: string // Студент, дизайнер, художник и т.д.
  skills?: string[]
  website?: string
  socialLinks?: {
    instagram?: string
    facebook?: string
    twitter?: string
    behance?: string
    github?: string
  }
}

export interface Project {
  id: string
  title: string
  category: string
  description: string
  content?: string
  tags?: string[]
  date: string
  image: string
  author: {
    id: string
    name: string
    avatar: string
  }
  likes: number
  comments: Comment[]
  views: number
  featured?: boolean
}

export interface Comment {
  id: string
  author: {
    id: string
    name: string
    avatar: string
  }
  date: string
  content: string
  likes: number
  isRead?: boolean
}

// Инициализация базы данных
export function initializeDatabase() {
  // Проверяем, инициализирована ли уже база данных
  if (!localStorage.getItem("db_initialized")) {
    // Создаем администратора
    const adminUser: User = {
      id: "admin",
      username: "admin",
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      password: "1234", // В реальном приложении пароли должны быть хешированы
      faculty: "Administration",
      role: "admin",
      createdAt: new Date().toISOString(),
      occupation: "Администратор",
      bio: "Администратор платформы ArtCampus",
    }

    // Сохраняем администратора в localStorage
    const users = [adminUser]
    localStorage.setItem("users", JSON.stringify(users))

    // Очищаем демо-проекты
    localStorage.setItem("projects", JSON.stringify([]))

    // Отмечаем базу данных как инициализированную
    localStorage.setItem("db_initialized", "true")

    console.log("База данных инициализирована с администратором:", adminUser)
  }
}

// Регистрация пользователя
export function registerUser(userData: Omit<User, "id" | "role" | "createdAt">): {
  success: boolean
  message: string
  user?: User
} {
  try {
    // Получаем существующих пользователей
    const users = JSON.parse(localStorage.getItem("users") || "[]") as User[]

    // Проверяем, существует ли пользователь с таким email или username
    const existingUserByEmail = users.find((user) => user.email === userData.email)
    const existingUserByUsername = users.find((user) => user.username === userData.username)

    if (existingUserByEmail) {
      return { success: false, message: "Пользователь с таким email уже существует" }
    }

    if (existingUserByUsername) {
      return { success: false, message: "Пользователь с таким именем пользователя уже существует" }
    }

    // Создаем нового пользователя
    const newUser: User = {
      id: `user_${Date.now()}`,
      role: "user",
      createdAt: new Date().toISOString(),
      ...userData,
    }

    // Добавляем пользователя в базу данных
    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    // Устанавливаем текущего пользователя
    localStorage.setItem("currentUserId", newUser.id)

    return { success: true, message: "Регистрация успешно завершена", user: newUser }
  } catch (error) {
    console.error("Ошибка при регистрации пользователя:", error)
    return { success: false, message: "Произошла ошибка при регистрации" }
  }
}

// Вход пользователя
export function loginUser(email: string, password: string): { success: boolean; message: string; user?: User } {
  try {
    // Получаем существующих пользователей
    const users = JSON.parse(localStorage.getItem("users") || "[]") as User[]

    // Ищем пользователя по email
    const user = users.find((user) => user.email === email)

    if (!user) {
      return { success: false, message: "Пользователь с таким email не найден" }
    }

    // Проверяем пароль
    if (user.password !== password) {
      return { success: false, message: "Неверный пароль" }
    }

    // Устанавливаем текущего пользователя
    localStorage.setItem("currentUserId", user.id)

    return { success: true, message: "Вход выполнен успешно", user }
  } catch (error) {
    console.error("Ошибка при входе пользователя:", error)
    return { success: false, message: "Произошла ошибка при входе" }
  }
}

// Получение текущего пользователя
export function getCurrentUser(): User | null {
  try {
    const userId = localStorage.getItem("currentUserId")

    if (!userId) {
      return null
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]") as User[]
    return users.find((user) => user.id === userId) || null
  } catch (error) {
    console.error("Ошибка при получении текущего пользователя:", error)
    return null
  }
}

// Обновление профиля пользователя
export function updateUserProfile(
  userId: string,
  userData: Partial<User>,
): { success: boolean; message: string; user?: User } {
  try {
    // Получаем существующих пользователей
    const users = JSON.parse(localStorage.getItem("users") || "[]") as User[]

    // Находим пользователя по ID
    const userIndex = users.findIndex((user) => user.id === userId)

    if (userIndex === -1) {
      return { success: false, message: "Пользователь не найден" }
    }

    // Обновляем данные пользователя
    users[userIndex] = {
      ...users[userIndex],
      ...userData,
    }

    // Сохраняем обновленных пользователей
    localStorage.setItem("users", JSON.stringify(users))

    return { success: true, message: "Профиль успешно обновлен", user: users[userIndex] }
  } catch (error) {
    console.error("Ошибка при обновлении профиля пользователя:", error)
    return { success: false, message: "Произошла ошибка при обновлении профиля" }
  }
}

// Выход пользователя
export function logoutUser(): boolean {
  try {
    localStorage.removeItem("currentUserId")
    return true
  } catch (error) {
    console.error("Ошибка при выходе пользователя:", error)
    return false
  }
}

// Создание проекта
export function createProject(projectData: Omit<Project, "id" | "author" | "likes" | "comments" | "views">): {
  success: boolean
  message: string
  project?: Project
} {
  try {
    // Получаем текущего пользователя
    const currentUser = getCurrentUser()

    if (!currentUser) {
      return { success: false, message: "Необходимо войти в систему для создания проекта" }
    }

    // Получаем существующие проекты
    const projects = JSON.parse(localStorage.getItem("projects") || "[]") as Project[]

    // Создаем новый проект
    const newProject: Project = {
      id: `project_${Date.now()}`,
      author: {
        id: currentUser.id,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        avatar: currentUser.avatar || "/placeholder.svg?height=32&width=32",
      },
      likes: 0,
      comments: [],
      views: 0,
      ...projectData,
    }

    // Добавляем проект в базу данных
    projects.push(newProject)
    localStorage.setItem("projects", JSON.stringify(projects))

    return { success: true, message: "Проект успешно создан", project: newProject }
  } catch (error) {
    console.error("Ошибка при создании проекта:", error)
    return { success: false, message: "Произошла ошибка при создании проекта" }
  }
}

// Получение проектов пользователя
export function getUserProjects(userId?: string): Project[] {
  try {
    // Если userId не указан, используем текущего пользователя
    const targetUserId = userId || getCurrentUser()?.id

    if (!targetUserId) {
      return []
    }

    // Получаем все проекты
    const projects = JSON.parse(localStorage.getItem("projects") || "[]") as Project[]

    // Фильтруем проекты по userId
    return projects.filter((project) => project.author.id === targetUserId)
  } catch (error) {
    console.error("Ошибка при получении проектов пользователя:", error)
    return []
  }
}

// Получение всех проектов
export function getAllProjects(): Project[] {
  try {
    return JSON.parse(localStorage.getItem("projects") || "[]") as Project[]
  } catch (error) {
    console.error("Ошибка при получении всех проектов:", error)
    return []
  }
}

// Получение проекта по ID
export function getProjectById(projectId: string): Project | null {
  try {
    const projects = JSON.parse(localStorage.getItem("projects") || "[]") as Project[]
    return projects.find((project) => project.id === projectId) || null
  } catch (error) {
    console.error("Ошибка при получении проекта по ID:", error)
    return null
  }
}

// Добавление комментария к проекту
export function addComment(
  projectId: string,
  content: string,
): { success: boolean; message: string; comment?: Comment } {
  try {
    // Получаем текущего пользователя
    const currentUser = getCurrentUser()

    if (!currentUser) {
      return { success: false, message: "Необходимо войти в систему для добавления комментария" }
    }

    // Получаем все проекты
    const projects = JSON.parse(localStorage.getItem("projects") || "[]") as Project[]

    // Находим проект по ID
    const projectIndex = projects.findIndex((project) => project.id === projectId)

    if (projectIndex === -1) {
      return { success: false, message: "Проект не найден" }
    }

    // Создаем новый комментарий
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      author: {
        id: currentUser.id,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        avatar: currentUser.avatar || "/placeholder.svg?height=32&width=32",
      },
      date: new Date().toLocaleDateString("ru-RU"),
      content,
      likes: 0,
      isRead: false,
    }

    // Добавляем комментарий к проекту
    projects[projectIndex].comments.push(newComment)

    // Сохраняем обновленные проекты
    localStorage.setItem("projects", JSON.stringify(projects))

    return { success: true, message: "Комментарий успешно добавлен", comment: newComment }
  } catch (error) {
    console.error("Ошибка при добавлении комментария:", error)
    return { success: false, message: "Произошла ошибка при добавлении комментария" }
  }
}

// Отметка комментариев как прочитанных
export function markCommentsAsRead(projectId: string): boolean {
  try {
    // Получаем все проекты
    const projects = JSON.parse(localStorage.getItem("projects") || "[]") as Project[]

    // Находим проект по ID
    const projectIndex = projects.findIndex((project) => project.id === projectId)

    if (projectIndex === -1) {
      return false
    }

    // Отмечаем все комментарии как прочитанные
    projects[projectIndex].comments = projects[projectIndex].comments.map((comment) => ({
      ...comment,
      isRead: true,
    }))

    // Сохраняем обновленные проекты
    localStorage.setItem("projects", JSON.stringify(projects))

    return true
  } catch (error) {
    console.error("Ошибка при отметке комментариев как прочитанных:", error)
    return false
  }
}

// Получение количества непрочитанных комментариев для проекта
export function getUnreadCommentsCount(projectId: string): number {
  try {
    const project = getProjectById(projectId)

    if (!project) {
      return 0
    }

    return project.comments.filter((comment) => !comment.isRead).length
  } catch (error) {
    console.error("Ошибка при получении количества непрочитанных комментариев:", error)
    return 0
  }
}

// Инициализация базы данных при загрузке модуля
initializeDatabase()

