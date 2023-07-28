<template>
  <form @submit.prevent="createEvent()">
    <div>
      <label for="name">Event Name</label>
      <input v-model="editable.name" class="form-control" type="text" id="name" name="name" maxlength="50" required>
    </div>
    <div>
      <label for="coverImg">Cover Image</label>
      <input v-model="editable.coverImg" class="form-control" type="url" id="coverImg" name="coverImg" required>
    </div>
    <div>
      <label for="startDate">Start Date</label>
      <input v-model="editable.startDate" class="form-control" type="datetime-local" id="startDate" name="startDate"
        required>
    </div>
    <div>
      <label for="location">Location</label>
      <input v-model="editable.location" class="form-control" type="text" id="location" name="location" required>
    </div>
    <div>
      <label for="capacity">Capacity</label>
      <input v-model="editable.capacity" class="form-control" type="number" id="capacity" name="capacity" required>
    </div>
    <div>
      <label for="type">Type of Event</label>
      <select v-model="editable.type" name="type" id="type" class="form-control">
        <option value="concert">Concert</option>
        <option value="convention">Convention</option>
        <option value="sport">Sport</option>
        <option value="digital">Digital</option>
      </select>
    </div>
    <div>
      <label for="description">Description</label>
      <textarea class="form-control" v-model="editable.description" name="description" id="description" cols="30"
        rows="10"></textarea>
    </div>
    <div class="pt-2">
      <button class="btn btn-outline-info" type="submit">Submit</button>
    </div>
  </form>
</template>


<script>
import { ref } from "vue";
import Pop from "../utils/Pop.js";
import { logger } from "../utils/Logger.js";
import { towerEventsService } from "../services/TowerEventsService.js";
import { Modal } from "bootstrap";
import { router } from "../router.js";

export default {

  setup() {
    const editable = ref({})

    return {
      editable,

      async createEvent() {
        try {
          const formData = editable.value
          const newEvent = await towerEventsService.createEvent(formData)
          Modal.getOrCreateInstance('#createEventModal').hide()
          router.push({ name: 'TowerEvent', params: { eventId: newEvent.id } })
        } catch (error) {
          Pop.error(error.message)
          logger.log(error)
        }

      }
    }
  }
}
</script>


<style lang="scss" scoped></style>