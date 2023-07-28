import { AppState } from "../AppState.js"
import { Ticket } from "../models/Ticket.js"
import { logger } from "../utils/Logger.js"
import { api } from "./AxiosService.js"


class TicketsService {

  async createTicket(eventId) {
    const res = await api.post('api/tickets', eventId)
    logger.log('create ticket res data', res.data)
    const ticket = new Ticket(res.data)
    AppState.tickets.push(ticket)
    AppState.ActiveTowerEvent.ticketCount++
  }
  async removeTicket() {
    const foundTicket = AppState.tickets.find(t => t.accountId == AppState.account.id)
    const res = await api.delete(`api/tickets/${foundTicket.id}`)
    const ticketIndex = AppState.tickets.findIndex(t => t.id == foundTicket.id)
    AppState.tickets.splice(ticketIndex, 1)
    AppState.ActiveTowerEvent.ticketCount--
  }
  async removeAccountTicket(eventId) {
    const foundTicket = AppState.myTickets.find(t => t.eventId == eventId)
    const res = await api.delete(`api/tickets/${foundTicket.id}`)
    const ticketIndex = AppState.myTickets.findIndex(t => t.id == foundTicket.id)
    AppState.myTickets.splice(ticketIndex, 1)
  }
  async getTicketsByEvent(eventId) {
    const res = await api.get(`api/events/${eventId}/tickets`)
    logger.log('getting tickets', res.data)
    const tickets = res.data.map(t => new Ticket(t))
    AppState.tickets = tickets
  }
  async getMyTickets() {
    const res = await api.get(`account/tickets`)
    const myTickets = res.data.map(t => new Ticket(t))
    logger.log('my tickets', myTickets)
    AppState.myTickets = myTickets
  }

}


export const ticketsService = new TicketsService()