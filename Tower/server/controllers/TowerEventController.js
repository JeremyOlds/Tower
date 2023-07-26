import { Auth0Provider } from "@bcwdev/auth0provider";
import BaseController from "../utils/BaseController.js";
import { towerEventService } from "../services/TowerEventService.js";
import { ticketsService } from "../services/TicketsService.js";
import { commentsService } from "../services/CommentsService.js";

export class TowerEventController extends BaseController {
  constructor() {
    super('api/events')
    this.router

      .get('', this.getTowerEvents)
      .get('/:eventId', this.getTowerEventById)
      .get('/:eventId/tickets', this.getEventTickets)
      .get('/:eventId/comments', this.getEventComments)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createTowerEvent)
      .put('/:eventId', this.editTowerEvent)
      .delete('/:eventId', this.cancelEvent)

  }
  async getEventComments(req, res, next) {
    try {
      const eventId = req.params.eventId
      const comments = await commentsService.getEventComments(eventId)
      res.send(comments)
    } catch (error) {
      next(error)
    }
  }
  async getEventTickets(req, res, next) {
    try {
      const eventId = req.params.eventId
      const tickets = await ticketsService.getEventTickets(eventId)
      res.send(tickets)
    } catch (error) {
      next(error)
    }
  }

  async cancelEvent(req, res, next) {
    try {
      const eventId = req.params.eventId
      const userId = req.userInfo.id
      const message = await towerEventService.cancelEvent(eventId, userId)
      return res.send(message)
    } catch (error) {
      next(error)
    }
  }
  async editTowerEvent(req, res, next) {
    try {
      const eventId = req.params.eventId
      const userId = req.userInfo.id
      const eventData = req.body
      const editedTowerEvent = await towerEventService.editTowerEvent(eventId, userId, eventData)
      res.send(editedTowerEvent)
    } catch (error) {
      next(error)
    }
  }
  async getTowerEventById(req, res, next) {
    try {
      const eventId = req.params.eventId
      const towerEvent = await (await towerEventService.getTowerEventById(eventId))
      res.send(towerEvent)
    } catch (error) {
      next(error)
    }
  }

  async getTowerEvents(req, res, next) {
    try {
      const towerEvents = await towerEventService.getTowerEvents()
      res.send(towerEvents)
    } catch (error) {
      next(error)
    }
  }

  async createTowerEvent(req, res, next) {
    try {
      const towerEventData = req.body
      towerEventData.creatorId = req.userInfo.id
      const createdTower = await towerEventService.createTowerEvent(towerEventData)
      res.send(createdTower)
    } catch (error) {
      next(error)
    }
  }


}