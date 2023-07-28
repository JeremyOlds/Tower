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
      <div class="col-md-10 col-12 p-3"></div>

    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { AppState } from '../AppState';
import Pop from "../utils/Pop.js";
import { towerEventsService } from "../services/TowerEventsService.js";
import TowerEventComponent from "../components/TowerEventComponent.vue";

export default {
  setup() {
    onMounted(() => {
      getEventsByAccount();
    });
    async function getEventsByAccount() {
      try {
        await towerEventsService.getEventsByAccount();
      }
      catch (error) {
        Pop.error(error.message);
      }
    }
    return {
      myTowerEvents: computed(() => AppState.towerEvents),
      account: computed(() => AppState.account)
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
</style>
