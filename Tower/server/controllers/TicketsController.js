import { Auth0Provider } from "@bcwdev/auth0provider";
import BaseController from "../utils/BaseController.js";
import { ticketsService } from "../services/TicketsService.js";

export class TicketsController extends BaseController {
  constructor() {
    super('api/tickets')
    this.router


      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createTicket)
      .delete('/:ticketId', this.deleteTicket)

  }
  async deleteTicket(req, res, next) {
    try {
      const ticketId = req.params.ticketId
      const userId = req.userInfo.id
      const message = await ticketsService.deleteTicket(ticketId, userId)
      res.send(message)
    } catch (error) {
      next(error)
    }
  }

  async createTicket(req, res, next) {
    try {
      const ticketData = req.body
      ticketData.accountId = req.userInfo.id
      const ticket = await ticketsService.createTicket(ticketData)
      res.send(ticket)
    } catch (error) {
      next(error)
    }
  }

  async getTicketsByAccount(req, res, next) {
    try {
      const accountId = req.params.accountId
      const tickets = await ticketsService.getTicketsByAccount(accountId)
    } catch (error) {
      next(error)
    }
  }
}