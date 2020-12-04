<template>
  <div>
    <md-app md-waterfall md-mode="fixed-last">
      <md-app-toolbar class="md-large md-dense md-primary">
        <div class="md-toolbar-row">
          <div class="md-toolbar-section-start">
            <span class="md-title">AppointX</span>
          </div>

          <div class="md-toolbar-section-end">
            <md-menu>
              <md-button md-menu-trigger class="md-icon-button">
                <md-icon>more_vert</md-icon>
              </md-button>
              <md-menu-content>
                <md-menu-item>
                  <md-button @click="logout">
                    <md-icon>logout</md-icon>
                    Logout
                  </md-button>
                </md-menu-item>
              </md-menu-content>
            </md-menu>
          </div>
          <div class="md-toolbar-row">
            <md-tabs class="md-primary" :md-active-tab="`tab-${viewMode}`">
              <md-tab
                id="tab-hourly"
                md-label="Hourly"
                @click="viewMode = 'hourly'"
              ></md-tab>
              <md-tab
                id="tab-daily"
                md-label="Daily"
                @click="viewMode = 'daily'"
              ></md-tab>
              <md-tab
                id="tab-weekly"
                md-label="Weekly"
                @click="viewMode = 'weekly'"
              ></md-tab>
            </md-tabs>
          </div>
        </div>
      </md-app-toolbar>
      <md-app-content>
        <md-progress-spinner v-if="loading"></md-progress-spinner>
        <div v-else-if="viewMode == 'hourly'">
          <AppointmentCard
            v-for="appointment in filterAppointments()"
            v-bind="appointment"
            :key="appointment._id"
            @click="goToStatusPage(appointment)"
          />
        </div>
        <template v-else-if="viewMode == 'daily'">
          <div class="md-layout">
            <div class="md-layout-item" v-for="date in getDays()" :key="date">
              <md-list class="md-dense">
                <md-list-item
                  ><h2>{{ date | prettyDate }}</h2></md-list-item
                >
                <md-list-item
                  v-for="appointment in getAppointmentsOnDay(date)"
                  :key="appointment._id"
                >
                  <AppointmentCard
                    v-bind="appointment"
                    @click="goToStatusPage(appointment)"
                  >
                  </AppointmentCard>
                </md-list-item>
              </md-list>
            </div>
          </div>
        </template>
        <template v-else-if="viewMode == 'weekly'">
          <div class="md-list">
            <div
              class="md-list-item md-layout md-gutter md-alignment-top-left weekly-day-container"
              v-for="date in getWeekDays()"
              :key="date"
            >
              <h2 style="margin-right: 20px">{{ date | prettyDate }}</h2>
              <md-divider />
              <h2 v-if="getAppointmentsOnDay(date).length == 0">
                There are no appointments on this day.
              </h2>
              <AppointmentCard
                class="md-layout-item"
                v-for="appointment in getAppointmentsOnDay(date)"
                :key="appointment._id"
                v-bind="appointment"
                @click="goToStatusPage(appointment)"
              >
              </AppointmentCard>
            </div>
          </div>
        </template>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import { get } from "../api";
import AppointmentCard from "./AppointmentCard";

export default {
  name: "AdminPage",
  components: { AppointmentCard },
  data() {
    return {
      loggedIn: localStorage.getItem("authtoken") != null,
      menuVisible: false,
      loading: true,
      beginDateTime: new Date(),
      appointments: [],
      viewMode: "hourly",
    };
  },
  created() {
    // Redirect to login page if no auth token present
    if (!this.loggedIn) {
      this.$router.push("/admin/login");
    }

    console.log(this.$route.query);
    if (this.$route.query == null || this.$route.query.viewMode == null) {
      this.$router.push({ path: "/admin", query: { viewMode: "hourly" } });
    }
    this.viewMode = this.$route.query.viewMode ?? "hourly";

    // Just fetch all of the appointments for the time being.
    // As the app scales this will need to be adjusted to be a date range.
    get("/list_appointments").then((response) => {
      this.loading = false;
      try {
        if (
          response.data === "Unauthorized" ||
          !response.data.success ||
          response.data.appointments == null
        ) {
          this.$router.push("/admin/login");
          return;
        }
      } catch {
        this.$router.push("/admin/login");
        return;
      }
      this.appointments = response.data.appointments;
      console.log(this.appointments);
    });
  },
  methods: {
    logout() {
      // JWT is stateless, so we just have to remove the auth token client side and we're logged out.
      localStorage.removeItem("authtoken");
      this.$router.push("/admin/login");
    },
    nextPage() {
      if (this.viewMode == "daily") {
        this.beginDateTime = this.beginDateTime + new Date(0, 0, 4);
      } else if (this.viewMode == "hourly") {
        this.beginDateTime = this.beginDateTime + new Date(0, 0, 7);
      }
    },
    goToStatusPage(appointment) {
      this.$router.push("/status/" + appointment._id);
    },
    filterAppointments() {
      let filtered = this.appointments.filter((app) => {
        let date = new Date(app.datetime);
        console.log(date);
        if (date <= this.beginDateTime) {
          return false;
        }

        console.log(this.viewMode);
        if (this.viewMode == "hourly") {
          // View all appointments until midnight for today.

          // Classic JavaScript. Assigning a date does not copy and all the methods to mutate the date
          // act on the instance instead of creating a new one.
          let midnight = new Date(this.beginDateTime.getTime());
          midnight.setHours(24, 0, 0, 0);

          return date <= midnight;
        } else if (this.viewMode == "daily") {
          let endDateTime = new Date(this.beginDateTime.getTime());
          endDateTime.setDate(this.beginDateTime.getDate() + 5);
          console.log("end date " + endDateTime);
          return date <= endDateTime && date >= this.beginDateTime;
        } else {
          let endDateTime = new Date(this.beginDateTime.getTime());
          endDateTime.setDate(this.beginDateTime.getDate() + 7);
          return date <= endDateTime;
        }
      });
      console.log(filtered);
      return filtered;
    },
    getDays() {
      let days = new Set();
      let appointments = this.filterAppointments();
      for (let appointment of appointments) {
        let date = new Date(new Date(appointment.datetime).toDateString());
        days.add(date.getTime());
      }

      console.log("Days:");
      console.log(days);

      return days;
    },
    getWeekDays() {
      let days = [];
      let weekStart = new Date(this.beginDateTime.toDateString());
      var day = weekStart.getDay();
      var diff = weekStart.getDate() - day + (day == 0 ? -6 : 1);
      weekStart.setDate(diff);
      let currentDay = new Date(weekStart.getTime());
      for (let i = 0; i < 7; i++) {
        days.push(currentDay.getTime());
        currentDay.setDate(currentDay.getDate() + 1);
      }

      console.log("Days:");
      console.log(days);

      return days;
    },
    getAppointmentsOnDay(date) {
      let appointments = this.filterAppointments().filter((app) => {
        let appDate = new Date(new Date(app.datetime).toDateString());
        return appDate.getTime() === date;
      });
      console.log("Appointments on " + new Date(date).toDateString());
      console.log(appointments);
      return appointments;
    },
  },
  filters: {
    prettyDate(date) {
      let d = new Date(date);
      return d.getMonth() + "/" + d.getDate();
    },
  },
  watch: {
    viewMode() {
      this.$router.push({ path: "/admin", query: { viewMode: this.viewMode } });
    },
    $route() {
      this.viewMode = this.$route.query.viewMode ?? "hourly";
    },
  },
};
</script>

<style scoped>
.md-card {
  width: 420px;
  margin: 4px;
  display: inline-block;
  vertical-align: top;
}

.weekly-day-container {
  margin-left: 20px;
  margin-right: auto;
  flex-shrink: 0;
  flex-grow: 0;
}
</style>