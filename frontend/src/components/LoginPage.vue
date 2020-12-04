<template>
  <div class="centered-container">
    <md-content class="md-elevation-3">
      <div class="title">
        <div class="md-title">AppointX</div>
        <div class="md-body-1">Check in on your appointments!</div>
      </div>

      <div class="form">
        <md-field>
          <label>Username</label>
          <md-input v-model="username" autofocus></md-input>
        </md-field>

        <md-field md-has-password>
          <label>Password</label>
          <md-input v-model="password" type="password"></md-input>
        </md-field>

        <span class="error-message" v-if="error">
          Invalid login credentials. Please try again.
        </span>
      </div>

      <div class="actions md-layout md-alignment-center-space-between">
        <md-button class="md-raised md-primary" @click="login"
          >Log in</md-button
        >
      </div>

      <div class="loading-overlay" v-if="loading">
        <md-progress-spinner
          md-mode="indeterminate"
          :md-stroke="2"
        ></md-progress-spinner>
      </div>
    </md-content>
    <div class="background" />
  </div>
</template>

<script>
import axios from "axios";
import settings from "../settings";

export default {
  name: "App",
  data() {
    return {
      loading: false,
      username: "",
      password: "",
      error: false,
    };
  },
  methods: {
    login() {
      this.loading = true;
      axios
        .post(settings.apiEndpoint + "/login", {
          username: this.username,
          password: this.password,
        })
        .then((response) => {
          try {
            console.log(response);
            console.log(response.data.success);
            if (response.data.success === true) {
              let token = response.data.token;
              localStorage.setItem("authtoken", token);
              this.$router.push("/admin");
            } else {
              this.error = true;
              this.loading = false;
            }
          } catch {
            this.error = true;
            this.loading = false;
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.centered-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 90vh;
}

.title .centered-container {
  text-align: center;
  margin-bottom: 30px;
}

.centered-container .actions .md-button {
  margin: 0px;
}

.centered-container .form {
  margin-bottom: 60px;
}

.centered-container .background {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 0;
}

.centered-container .md-content {
  z-index: 1;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  position: relative;
}

.centered-container .loading-overlay {
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}

.centered-container .error-message {
  color: red;
  margin-bottom: 0px;
  margin-top: 20px;
}
</style>