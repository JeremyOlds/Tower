import { Auth0Provider } from "@bcwdev/auth0provider";
import BaseController from "../utils/BaseController.js";
import { commentsService } from "../services/CommentsService.js";


export class CommentsController extends BaseController {
  constructor() {
    super('api/comments')
    this.router

      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createComment)
      .delete('/:commentId', this.deleteComment)
  }

  async deleteComment(req, res, next) {
    try {
      const userId = req.userInfo.id
      const commentId = req.params.commentId
      const message = await commentsService.deleteComment(userId, commentId)
      res.send(message)
    } catch (error) {
      next(error)
    }
  }
  async createComment(req, res, next) {
    try {
      const commentData = req.body
      commentData.creatorId = req.userInfo.id
      const createdComment = await commentsService.createComment(commentData)
      res.send(createdComment)
    } catch (error) {
      next(error)
    }
  }
}