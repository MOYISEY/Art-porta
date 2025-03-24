"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Heart, Reply } from "lucide-react"
import { addComment, markCommentsAsRead, getCurrentUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface Comment {
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

interface CommentSectionProps {
  comments: Comment[]
  projectId: string
}

export function CommentSection({ comments: initialComments, projectId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [commentsList, setCommentsList] = useState(initialComments)
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()
  const currentUser = getCurrentUser()

  useEffect(() => {
    setMounted(true)

    // Загружаем состояние лайков комментариев из localStorage
    const likedCommentsData = JSON.parse(localStorage.getItem("likedComments") || "{}")
    setLikedComments(likedCommentsData)

    // Отмечаем комментарии как прочитанные при просмотре
    markCommentsAsRead(projectId)
  }, [projectId])

  // Обновляем список комментариев при изменении initialComments
  useEffect(() => {
    setCommentsList(initialComments)
  }, [initialComments])

  // Обновим функцию handleSubmitComment, чтобы она корректно обрабатывала отправку комментария
  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    if (!currentUser) {
      toast({
        title: "Необходимо войти",
        description: "Для добавления комментария необходимо войти в систему",
        type: "error",
      })
      return
    }

    // Добавляем комментарий через функцию из lib/auth
    const result = addComment(projectId, newComment)

    if (result.success && result.comment) {
      // Добавляем комментарий в список
      setCommentsList([...commentsList, result.comment])
      setNewComment("")

      toast({
        title: "Комментарий добавлен",
        description: "Ваш комментарий успешно добавлен",
        type: "success",
      })
    } else {
      toast({
        title: "Ошибка",
        description: result.message,
        type: "error",
      })
    }
  }

  // Обновим функцию handleLikeComment, чтобы она корректно обрабатывала лайки
  const handleLikeComment = (commentId: string) => {
    if (!currentUser) {
      toast({
        title: "Необходимо войти",
        description: "Для оценки комментария необходимо войти в систему",
        type: "error",
      })
      return
    }

    // Обновляем состояние лайков
    const newLikedComments = { ...likedComments }
    newLikedComments[commentId] = !newLikedComments[commentId]
    setLikedComments(newLikedComments)

    // Обновляем список комментариев, чтобы отразить изменение лайков
    const updatedComments = commentsList.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: newLikedComments[commentId] ? comment.likes + 1 : comment.likes - 1,
        }
      }
      return comment
    })

    setCommentsList(updatedComments)

    // Сохраняем состояние в localStorage
    localStorage.setItem("likedComments", JSON.stringify(newLikedComments))
  }

  const handleReplyToComment = (commentId: string) => {
    // Находим комментарий, на который отвечаем
    const comment = commentsList.find((c) => c.id === commentId)
    if (!comment) return

    // Устанавливаем текст ответа в поле ввода
    setNewComment(`@${comment.author.name}: `)

    // Фокусируемся на поле ввода
    document.getElementById("comment-textarea")?.focus()

    toast({
      title: "Ответ на комментарий",
      description: `Вы отвечаете на комментарий пользователя ${comment.author.name}`,
      type: "info",
    })
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <div className="space-y-4">
        <h3 className="font-medium">Оставить комментарий</h3>
        <Textarea
          id="comment-textarea"
          placeholder={currentUser ? "Напишите ваш комментарий..." : "Войдите, чтобы оставить комментарий"}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
          disabled={!currentUser}
        />
        <div className="flex justify-end">
          <Button disabled={!newComment.trim() || !currentUser} onClick={handleSubmitComment}>
            Отправить
          </Button>
        </div>
      </div>

      <Separator />

      {/* Comments List */}
      <div className="space-y-6">
        <h3 className="font-medium">Комментарии ({commentsList.length})</h3>

        {commentsList.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Пока нет комментариев. Будьте первым!</p>
        ) : (
          <div className="space-y-6">
            {commentsList.map((comment) => (
              <div key={comment.id} className="space-y-2">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    <AvatarFallback>{comment.author.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{comment.author.name}</div>
                      <div className="text-sm text-muted-foreground">{comment.date}</div>
                    </div>
                    <p className="mt-1">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-auto p-0 ${likedComments[comment.id] ? "text-rose-500" : ""}`}
                        onClick={() => handleLikeComment(comment.id)}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${likedComments[comment.id] ? "fill-rose-500" : ""}`} />
                        <span className="text-xs">{likedComments[comment.id] ? comment.likes + 1 : comment.likes}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0"
                        onClick={() => handleReplyToComment(comment.id)}
                        disabled={!currentUser}
                      >
                        <Reply className="h-4 w-4 mr-1" />
                        <span className="text-xs">Ответить</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

