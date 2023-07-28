<template>
  <router-link :to="{ name: 'TowerEvent', params: { eventId: towerProp.id } }">
    <div class="p-2 elevation-5 event-card text-light rounded">
      <img class="img-fluid event-img rounded" :src="towerProp.coverImg" :alt="towerProp.name">
      <div>
        <p class="fw-bold">{{ towerProp.name }}</p>
        <p>{{ towerProp.location }}</p>
        <p>{{ towerProp.startDate.toLocaleDateString() }}</p>
        <div v-if="towerProp.isCanceled == false && towerProp.capacity - towerProp.ticketCount > 0"
          class="d-flex justify-content-end">
          <p>{{ towerProp.capacity - towerProp.ticketCount }} spots left</p>
        </div>
        <div class="bg-danger text-center" v-else-if="towerProp.capacity - towerProp.ticketCount <= 0">
          <p>At Capacity</p>
        </div>
        <div class="bg-danger text-center" v-else-if="towerProp.isCanceled == true">
          <p>Canceled</p>
        </div>
      </div>
    </div>
  </router-link>
</template>


<script>
import { TowerEvent } from "../models/TowerEvent.js";
import { towerEventsService } from "../services/TowerEventsService.js";
import { logger } from "../utils/Logger.js";
import Pop from "../utils/Pop.js";

export default {
  props: {
    towerProp: { type: TowerEvent, required: true }
  },
  setup() {


    return {

    }
  }
}
</script>


<style lang="scss" scoped>
.event-card {
  box-shadow: 0px 0px 10px aqua;
}

.event-img {
  max-height: 25vh;
  object-fit: cover;
  width: 30vh;
  object-position: center;
}
</style>