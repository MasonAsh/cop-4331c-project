<template>
  <div id="page">
    <md-card class="md-layout-item md-size-25 md-smal--size-100" id="card">
      <md-card-header>
        <div class="md-title">Appointment Status</div>
      </md-card-header>

      <md-card-content>
        <div v-if="appointment">
          <div class="md-layout md-size-25 md-alignment-top-left">
            <div class="md-layout-item fieldname">Customer Name:</div>
            <div class="md-layout-item">{{ appointment.customerName }}</div>
          </div>
          <div class="md-layout md-size-25 md-alignment-top-left">
            <div class="md-layout-item fieldname">Customer Email:</div>
            <div class="md-layout-item">{{ appointment.customerEmail }}</div>
          </div>
          <div class="md-layout md-size-25 md-alignment-top-left">
            <div class="md-layout-item fieldname">Customer Phone:</div>
            <div class="md-layout-item">{{ appointment.customerPhone }}</div>
          </div>
          <div class="md-layout md-size-25 md-alignment-top-left">
            <div class="md-layout-item fieldname">Subject:</div>
            <div class="md-layout-item">{{ appointment.subject }}</div>
          </div>
          <div class="md-layout md-size-25 md-alignment-top-left">
            <div class="md-layout-item fieldname">Date:</div>
            <div class="md-layout-item">
              {{ appointment.datetime | prettyDateTime }}
            </div>
          </div>
          <div class="md-layout md-size-25 md-alignment-top-left">
            <div class="md-layout-item fieldname">Duration (minutes):</div>
            <div class="md-layout-item">{{ appointment.duration }}</div>
          </div>
          <div class="md-layout md-size-25 md-alignment-top-left">
            <div class="md-layout-item fieldname">Status:</div>
            <div class="md-layout-item">
              {{ appointment.canceled ? "Canceled" : "Active" }}
            </div>
          </div>
          <template v-if="appointment.notes">
            <div class="md-layout-item fieldname">Notes:</div>
            <span>{{ appointment.notes }}</span>
          </template>
        </div>
        <md-progress-spinner
          md-mode="indeterminate"
          v-else
        ></md-progress-spinner>

        <md-card-actions>
          <md-button
            class="md-accent"
            v-if="!appointment.canceled"
            @click="cancel"
            >Cancel Appointment</md-button
          >
        </md-card-actions>

        <md-snackbar
          md-position="center"
          :md-duration="5000"
          :md-active.sync="showCancelSnackbar"
          md-persistent
        >
          <span>The appointment has been canceled.</span>
        </md-snackbar>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import axios from "axios";
import settings from "../settings";

export default {
  name: "StatusPage",
  data: () => ({
    loaded: false,
    error: null,
    appointment: null,
    showCancelSnackbar: false,
  }),
  created() {
    this.fetchAppointment();
  },
  methods: {
    fetchAppointment() {
      axios
        .get(settings.apiEndpoint + "/status", {
          params: {
            id: this.$route.params.id,
          },
        })
        .then((response) => {
          if (response.data.success) {
            this.appointment = response.data.appointment;
            console.log(response.data);
            this.loaded = true;
          } else {
            this.err = "Not found";
          }
        })
        .catch((err) => {
          this.err = err;
        });
    },
    cancel() {
      axios
        .put(settings.apiEndpoint + "/cancel", null, {
          params: { id: this.$route.params.id },
        })
        .then(() => {
          this.appointment.canceled = true;
          this.showCancelSnackbar = true;
        });
    },
  },
  filters: {
    prettyDateTime: (date) => {
      let d = new Date(date);
      console.log(date);
      return (
        (d.getMonth() + 1).toString() +
        "/" +
        d.getDate() +
        "/" +
        d.getFullYear() +
        " at " +
        d.toLocaleTimeString()
      );
    },
  },
};
</script>

<style scoped>
#page {
  justify-content: center;
  display: flex;
  margin-top: 60px;
}

div > .md-layout-item {
  text-align: left;
  margin-bottom: 15px;
}

.md-title {
  text-align: center;
}

.fieldname {
  font-weight: bold;
}
</style>