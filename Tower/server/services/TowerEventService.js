import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"
import { logger } from "../utils/Logger.js"


class TowerEventService {
  async cancelEvent(eventId, userId) {
    const foundEvent = await this.getTowerEventById(eventId)

    if (foundEvent.creatorId != userId) {
      throw new Forbidden("You are not allowed to cancel others' events")
    }
    foundEvent.isCanceled = true
    await foundEvent.save()
    return `${foundEvent.name} has been Cancelled.`

  }
  async editTowerEvent(eventId, userId, eventData) {
    const foundEvent = await this.getTowerEventById(eventId)
    if (foundEvent.creatorId != userId) {
      throw new Forbidden("You are not allowed to cancel others' events")
    }
    if (foundEvent.isCanceled == true) {
      throw new BadRequest('you cannot edit a cancelled event')
    }

    foundEvent.name = eventData.name
    foundEvent.description = eventData.description

    await foundEvent.save()
    return foundEvent
  }
  async getTowerEventById(eventId) {
    const foundEvent = await dbContext.TowerEvents.findById(eventId).populate('ticketCount')
    if (!foundEvent) {
      throw new BadRequest('There is no event with that id')
    }
    return foundEvent
  }
  async createTowerEvent(towerEventData) {
    const towerEvent = await dbContext.TowerEvents.create(towerEventData)
    await towerEvent.populate('ticketCount')
    return towerEvent
  }
  async getTowerEvents() {
    const towerEvents = await dbContext.TowerEvents.find().populate('ticketCount')
    return towerEvents
  }

}

export const towerEventService = new TowerEventService()