import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"


class CommentsService {
  async deleteComment(userId, commentId) {
    const foundComment = await dbContext.Comments.findById(commentId)
    if (!foundComment) {
      throw new BadRequest('No comment with that Id')
    }
    if (foundComment.creatorId != userId) {
      throw new Forbidden("You cannot delete others' comments")
    }
    await foundComment.remove()
    return 'Comment has been deleted.'
  }
  async getEventComments(eventId) {
    const comments = await dbContext.Comments.find({ eventId }).populate('creator', 'name picture')
    return comments
  }
  async createComment(commentData) {
    const comment = (await dbContext.Comments.create(commentData)).populate('creator', 'name picture')
    return comment
  }


}



export const commentsService = new CommentsService()