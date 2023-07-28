import { AppState } from "../AppState.js"
import { TowerEvent } from "../models/TowerEvent.js"
import { logger } from "../utils/Logger.js"
import { api } from "./AxiosService.js"


class TowerEventsService {
  async getEvents() {
    const res = await api.get('api/events')
    logger.log('getting events', res.data)
    const events = res.data.map(e => new TowerEvent(e))
    AppState.towerEvents = events
    logger.log('appstate events', AppState.towerEvents)
  }
  async createEvent(formData) {
    const res = await api.post('api/events', formData)
    logger.log('response from create event', res.data)
    const newEvent = new TowerEvent(res.data)
    AppState.towerEvents.unshift(newEvent)
    logger.log('appstate events after new create', AppState.towerEvents)
    return newEvent
  }
  async getActiveEvent(eventId) {
    logger.log(eventId)
    const res = await api.get(`api/events/${eventId}`)
    logger.log('res data active get', res.data)
    const activeEvent = new TowerEvent(res.data)
    AppState.ActiveTowerEvent = activeEvent
    logger.log('Appstate activeEvent', AppState.ActiveTowerEvent)
  }
  async cancelEvent(eventId) {

    const res = await api.delete(`api/events/${eventId}`)
    // TODO grab the active event from the appState
    // TODO change the one property in the appState
    AppState.ActiveTowerEvent.isCanceled = true
  }
  getMyEvents() {
    const myTowerEvents = AppState.towerEvents.filter(e => e.creatorId == AppState.account.id)
    logger.log('my events', myTowerEvents)
    AppState.myTowerEvents = myTowerEvents
  }


}

export const towerEventsService = new TowerEventsService()