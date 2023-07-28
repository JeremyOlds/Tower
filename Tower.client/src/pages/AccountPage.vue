<template>
  <div class="container-fluid">
    <div class="row">
      <div class="underline">
        <h1>My Events</h1>
      </div>
      <div v-for="e in myTowerEvents" :key="e.id" class="col-md-3 col-12 p-3">
        <TowerEventComponent :towerProp="e" />
      </div>
    </div>
    <!-- STUB Tickets -->
    <div class="row">
      <div class="underline my-2">
        <h1>My Tickets</h1>
      </div>
      <div class="col-12">
        <div v-for="t in myTickets" :key="t.id" class="row event-img m-auto rounded my-3 py-3">
          <div class="col-md-6 col-12">
            <img class="img-fluid active-img rounded" :src="t.event.coverImg" alt="">
          </div>
          <div class="col-md-6 col-12">
            <h4>{{ t.event.name }}</h4>
            <h4> {{ t.event.location }}</h4>
            <h4>{{ new Date(t.event.startDate).toDateString() }}</h4>
            <button @click="removeAccountTicket(t.eventId)" class="btn btn-danger">Stop Attending</button>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, watchEffect } from 'vue';
import { AppState } from '../AppState';
import Pop from "../utils/Pop.js";
import { towerEventsService } from "../services/TowerEventsService.js";
import TowerEventComponent from "../components/TowerEventComponent.vue";
import { logger } from "../utils/Logger.js";
import { ticketsService } from "../services/TicketsService.js";

export default {
  setup() {
    onMounted(() => {
      getEvents();

    });
    async function getEvents() {
      try {
        await towerEventsService.getEvents();
      }
      catch (error) {
        Pop.error(error.message);
      }
    }
    watchEffect(() => {
      getMyEvents()
      getMyTickets()
    })

    function getMyEvents() {
      towerEventsService.getMyEvents()
    }
    async function getMyTickets() {
      try {
        await ticketsService.getMyTickets()
      } catch (error) {
        Pop.error(error.message)
        logger.log(error)
      }
    }
    return {
      myTowerEvents: computed(() => AppState.myTowerEvents),
      account: computed(() => AppState.account),
      myTickets: computed(() => AppState.myTickets),

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
      async removeAccountTicket(eventId) {
        try {
          await ticketsService.removeAccountTicket(eventId)
        } catch (error) {
          Pop.error(error.message)
          logger.log(error)
        }
      }
    };
  },
  components: { TowerEventComponent }
}
</script>

<style scoped>
/* img {
  max-width: 100px;
} */

.underline {
  border-bottom: 1px solid aqua;
}

.event-img {
  box-shadow: 0px 0px 10px aqua;
}

.active-img {
  max-height: 50vh;
  max-width: 35vh;
}
</style>
