import { AppState } from "../AppState.js"
import { Comment } from "../models/Comment.js"
import { logger } from "../utils/Logger.js"
import { api } from "./AxiosService.js"


class CommentsService {

  async getCommentsByEvent(eventId, formData) {
    const res = await api.get(`api/events/${eventId}/comments`, formData)
    const comments = res.data.map(c => new Comment(c))
    AppState.comments = comments
  }

  async createComment(formData) {
    const res = await api.post('api/comments', formData)
    const newComment = new Comment(res.data)
    AppState.comments.unshift(newComment)
  }
  async removeComment(commentId) {
    const res = await api.delete(`api/comments/${commentId}`)
    logger.log('comment delete', res.data)
    const commentIndex = AppState.comments.findIndex(c => c.id == commentId)
    AppState.comments.splice(commentIndex, 1)
  }

}


export const commentsService = new CommentsService()