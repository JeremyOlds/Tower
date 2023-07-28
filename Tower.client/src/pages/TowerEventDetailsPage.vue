<template>
  <div class="container-fluid bg-dark">
    <div class="row">
      <div class="col-12">
        <div class="row event-img m-3 rounded">
          <div class="col-md-6 col-12 d-flex justify-content-center m-auto py-3">
            <div class="pe-4">
              <img class="img-fluid rounded active-img" :src="activeEvent.coverImg" :alt="activeEvent?.name">
            </div>

          </div>
          <div class="col-md-6 col-12 py-3">
            <div class="d-flex justify-content-end"
              v-if="account.id == activeEvent.creatorId && activeEvent.isCanceled == false">
              <button @click="cancelEvent()" class="btn btn-outline-danger"> Cancel Event</button>
            </div>
            <div class="d-flex justify-content-between px-3">
              <div class="pe-2">
                <h4>{{ activeEvent.name }}</h4>
                <h4>{{ activeEvent.location }}</h4>
              </div>
              <div class="ps-2">
                <h4>{{ activeEvent.startDate.getDate() }}<span>{{ setCorrectTime(activeEvent.startDate.getDate())
                }} of {{ activeEvent.startDate.toLocaleDateString('en-us', { month: 'long' }) }}</span>
                </h4>
                <h4>Starting at {{ activeEvent.startDate.toLocaleTimeString('en-us') }}</h4>
              </div>
            </div>
            <div>
              <p>{{ activeEvent.description }}</p>
            </div>
            <div class="d-flex justify-content-between align-items-end">
              <p><span class="spot-text">{{ activeEvent.capacity - activeEvent.ticketCount }}</span> Spots Left</p>
              <div v-if="activeEvent.isCanceled == false">
                <button @click="createTicket()" class="btn btn-warning"
                  v-if="activeEvent.capacity - activeEvent.ticketCount > 0 && !hasTicket">Attend</button>
                <button @click="removeTicket()" v-else-if="hasTicket" class="btn btn-danger">Stop Attending</button>
                <p class="bg-danger rounded p-2" v-else>No Spots Left</p>
              </div>
              <div v-else>
                <p class="bg-danger rounded p-2">Canceled</p>
              </div>

            </div>

          </div>




        </div>
      </div>
      <!-- STUB event details -->
      <!-- STUB tickets -->

      <div class="col-md-10 col-12 m-auto">
        <div class=" p-2 mb-5 event-img rounded">

          <div>
            <img v-for="   t    in    tickets   " :key="t.id" class="avatar p-1" :src="t.profile.picture"
              :alt="t.profile.name">
          </div>
        </div>
      </div>
      <!-- STUB comments section -->

      <div class="col-md-8 col-12 m-auto event-img">
        <div class="py-3">
          <form v-if="account.id && activeEvent.isCanceled == false" @submit.prevent="createComment()">
            <textarea v-model="editable.body" class="form-control" name="body" id="body" cols="30" rows="3"
              placeholder="Join the Conversation..."></textarea>
            <button class="btn btn-info mt-2" type="submit">Post Comment</button>
          </form>
        </div>
        <div v-for="   c    in    comments   " :key="c.id" class="d-flex p-2">
          <img class="avatar mb-0" :src="c.creator.picture" alt="">
          <div class="px-3">
            <div class="d-flex">
              <p class="fw-bold">{{ c.creator.name }}</p>
              <button v-if="account.id == c.creatorId && activeEvent.isCanceled == false" @click="removeComment(c.id)"
                class="btn btn-danger mx-2"><i class="mdi mdi-delete"></i></button>
            </div>
            <p>{{ c.body }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { computed, onMounted, ref, watchEffect } from "vue";
import { logger } from "../utils/Logger.js";
import Pop from "../utils/Pop.js";
import { towerEventsService } from "../services/TowerEventsService.js";
import { useRoute } from "vue-router";
import { AppState } from "../AppState.js";
import { ticketsService } from "../services/TicketsService.js"
import { commentsService } from "../services/CommentsService.js"

export default {
  setup() {
    const route = useRoute()
    const editable = ref({})

    onMounted(() => {
      // getTicketsByEvent()
    })

    watchEffect(() => {
      getActiveEvent(route.params.eventId)
      getTicketsByEvent(route.params.eventId)
      getCommentsByEvent(route.params.eventId)
    })
    async function getCommentsByEvent(eventId) {
      try {
        const formData = editable.value
        formData.eventId = eventId
        await commentsService.getCommentsByEvent(eventId, formData)
      } catch (error) {
        Pop.error(error.message)
        logger.log(error)
      }
    }

    async function getActiveEvent(eventId) {
      try {
        await towerEventsService.getActiveEvent(eventId)
      } catch (error) {
        Pop.error(error.message)
        logger.log(error)
      }
    }
    async function getTicketsByEvent(eventId) {
      try {
        await ticketsService.getTicketsByEvent(eventId)
      } catch (error) {
        Pop.error(error.message)
        logger.log(error)
      }
    }
    return {
      editable,
      isCanceled: computed(() => AppState.ActiveTowerEvent.isCanceled),
      activeEvent: computed(() => AppState.ActiveTowerEvent),
      tickets: computed(() => AppState.tickets),
      account: computed(() => AppState.account),
      comments: computed(() => AppState.comments),
      hasTicket: computed(() => {
        return AppState.tickets.find(t => t.accountId == AppState.account.id)
      }),

      setCorrectTime(number) {

        if (number == 1 || (number == 21) || (number == 31)) {
          return 'st'
        } else if (number == 2 || number == 22) {
          return 'nd'
        } else if (number == 3 || number == 23) {
          return 'rd'
        } else {
          return 'th'
        }
      },

      async createTicket() {
        try {
          const eventId = { eventId: route.params.eventId }
          await ticketsService.createTicket(eventId)

        } catch (error) {
          Pop.error(error.message)
          logger.log(error)
        }
      },
      async removeTicket() {
        try {
          await ticketsService.removeTicket()
        } catch (error) {
          Pop.error(error.message)
          logger.log(error)
        }
      },

      async createComment() {
        try {
          const formData = editable.value
          await commentsService.createComment(formData)
          editable.value = {}
        } catch (error) {
          Pop.error(error.message)
          logger.log(error)
        }
      },
      async removeComment(commentId) {
        try {
          await commentsService.removeComment(commentId)
        } catch (error) {
          Pop.error(error.message)
          logger.log(error)
        }
      },

      async cancelEvent() {
        try {
          const eventId = route.params.eventId
          await towerEventsService.cancelEvent(eventId)
        } catch (error) {
          Pop.error(error.message)
          logger.log(error)
        }

      }
    }
  }
}
</script>


<style lang="scss" scoped>
.event-img {
  box-shadow: 0px 0px 10px aqua;
  // max-width: 70%;
}

.eventImgCanceled {
  box-shadow: 0px 0px 10px red;

}

.active-img {
  max-height: 50vh;
  max-width: 35vh;
}

.spot-text {
  color: aqua;
  text-shadow: 0px 0px 3px aqua;
}

.avatar {
  height: 10vh;
  width: 10vh;
  border-radius: 50%;

}
</style>