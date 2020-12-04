<template>
  <md-card class="appointment-card" @click.native="$emit('click')">
    <md-ripple>
      <md-card-header md-with-hover>
        <div class="md-title">{{ subject }}</div>
        <div class="md-subhead">{{ customerName }}</div>
      </md-card-header>
      <md-card-content>
        <span
          ><md-icon>access_time</md-icon> {{ datetime | prettyDateTime }} for
          {{ duration | prettyDuration }}</span
        >
        <md-divider v-if="notes" />
        <md-content>
          <span>{{ notes }}</span>
        </md-content>
      </md-card-content>
    </md-ripple>
  </md-card>
</template>

<script>
export default {
  name: "AppointmentCard",
  props: [
    "datetime",
    "customerName",
    "customerPhone",
    "subject",
    "duration",
    "notes",
    "canceled",
  ],
  emits: ["click"],
  filters: {
    prettyDateTime: (date) => {
      let d = new Date(date);
      return (
        (d.getMonth() + 1).toString() +
        "/" +
        d.getDate() +
        " at " +
        d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    },
    prettyDuration: (duration) => {
      return {
        30: "30 Minutes",
        60: "1 Hour",
        90: "1 Hour and 30 Minutes",
        120: "2 Hours",
        150: "2 Hours and 30 Minutes",
        180: "3 Hours",
      }[duration];
    },
  },
};
</script>

<style scoped>
.md-divider {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>