import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"
import { towerEventService } from "./TowerEventService.js"

class TicketsService {
  async deleteTicket(ticketId, userId) {
    const foundTicket = await (await dbContext.Tickets.findById(ticketId)).populate('profile')
    if (!foundTicket) {
      throw new BadRequest('No ticket with that id')
    }
    if (foundTicket.accountId != userId) {
      throw new Forbidden("You cannot delete others' tickets")
    }
    await foundTicket.remove()
    return 'Ticket has been removed.'
  }
  async getEventTickets(eventId) {
    const tickets = await dbContext.Tickets.find({ eventId }).populate('profile', 'name picture')
    return tickets

  }
  async getTicketsByAccount(accountId) {
    const tickets = await dbContext.Tickets.find({ accountId })
      .populate({
        path: 'event',
        populate: { path: 'ticketCount' }
      })
    return tickets

  }
  async createTicket(ticketData) {
    const foundEvent = await towerEventService.getTowerEventById(ticketData.eventId)
    if (foundEvent.isCanceled == true) {
      throw new BadRequest('Event has been cancelled.')
    }


    const ticket = (await dbContext.Tickets.create(ticketData)).populate('profile', 'name picture')

    return ticket
  }



}



export const ticketsService = new TicketsService()