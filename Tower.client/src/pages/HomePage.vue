<template>
  <div class="container-fluid bg-dark">
    <div class="row bg-dark">
      <!-- STUB Banner -->
      <div class="col-12 d-flex justify-content-center py-3 relative">
        <div class="absolute">
          <p class="text-dark fw-bold fs-3">Find your Event Today!</p>
        </div>
        <img class="banner"
          src="https://images.unsplash.com/photo-1522158637959-30385a09e0da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
          alt="Banner Image">
      </div>
      <!-- STUB Categories -->
      <div class="col-12">
        <div class="d-flex justify-content-center">
          <button class="btn btn-outline-info px-2 " @click="filterBy = ''">All</button>
          <button class="btn btn-outline-info px-2 " @click="filterBy = 'concert'">Concert</button>
          <button class="btn btn-outline-info px-2 " @click="filterBy = 'convention'">convention</button>
          <button class="btn btn-outline-info px-2 " @click="filterBy = 'sport'">Sport</button>
          <button class="btn btn-outline-info px-2 " @click="filterBy = 'digital'">Digital</button>
        </div>
      </div>
    </div>
    <!-- STUB Events -->
    <div class="col-12 bg-dark">
      <div class="row px-5">
        <div v-for="tower in  towerEvents " :key="tower.id" class="col-12 col-md-3 p-2">
          <TowerEventComponent :towerProp="tower" />
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import Pop from "../utils/Pop.js";
import { logger } from "../utils/Logger.js";
import { towerEventsService } from "../services/TowerEventsService.js"
import { computed } from "vue";
import { AppState } from "../AppState.js";
import TowerEventComponent from "../components/TowerEventComponent.vue";


export default {
  setup() {
    const filterBy = ref("");
    async function getEvents() {
      try {
        await towerEventsService.getEvents();
      }
      catch (error) {
        Pop.error(error.message);
        logger.log(error);
      }
    }
    onMounted(() => {
      getEvents();
    });
    return {
      filterBy,
      towerEvents: computed(() => {
        if (filterBy.value == "") {
          return AppState.towerEvents;
        }
        else {
          return AppState.towerEvents.filter(e => e.type == filterBy.value);
        }
      })
    };
  },
  components: { TowerEventComponent }
}
</script>

<style scoped lang="scss">
.banner {
  height: 30vh;
  width: 100vh;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0px 0px 10px aqua;
}

p {
  margin: 0;
}

.event-img {
  box-shadow: 0px 0px 10px aqua;
}

div.relative {
  position: relative
}

div.absolute {
  position: absolute;

}
</style>
