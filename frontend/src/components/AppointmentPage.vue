<template>
  <div id="appointmentPage">
    <AppointmentForm></AppointmentForm>
  </div>
</template>

<script>
import AppointmentForm from "./AppointmentForm";

export default {
  name: "AppointmentPage",
  components: {
    AppointmentForm,
  },
};
</script>

<style scoped>
body {
  overflow: hidden;
}
#appointmentPage {
  margin-top: 60px;
  margin-bottom: 0px;
}
</style>