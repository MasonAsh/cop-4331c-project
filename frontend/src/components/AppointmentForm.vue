<template>
  <div>
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-50 md-smal--size-100">
        <md-card-header>
          <div class="md-title">Book Appointment</div>
        </md-card-header>

        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('firstName')">
                <label for="first-name">Full Name</label>
                <md-input
                  name="full-name"
                  id="full-name"
                  autocomplete="given-name"
                  v-model="form.fullName"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.form.fullName.required"
                  >The first name is required</span
                >
                <span class="md-error" v-else-if="!$v.form.fullName.minlength"
                  >Invalid first name</span
                >
              </md-field>
            </div>
          </div>
          <md-field :class="getValidationClass('email')">
            <label for="email">Email</label>
            <md-input
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              v-model="form.email"
              :disabled="sending"
            />
            <span class="md-error" v-if="!$v.form.email.required"
              >The email is required</span
            >
            <span class="md-error" v-else-if="!$v.form.email.email"
              >Invalid email</span
            >
          </md-field>
          <md-field :class="getValidationClass('phone')">
            <label for="phone">Phone</label>
            <md-input
              type="phone"
              name="phone"
              id="phone"
              autocomplete="phone"
              v-model="form.phone"
              :disabled="sending"
            />
            <span class="md-error" v-if="!$v.form.phone.required"
              >The phone number is required</span
            >
            <span class="md-error" v-else-if="!$v.form.phone.minlength"
              >Invalid phone number</span
            >
          </md-field>
          <md-field :class="getValidationClass('subject')">
            <label for="subject">Subject</label>
            <md-input
              type="text"
              name="subject"
              id="subject"
              v-model="form.subject"
              :disabled="sending"
            />
            <span class="md-error" v-if="!$v.form.subject.required"
              >The subject is required</span
            >
          </md-field>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-datepicker v-model="form.date" />
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('time')">
                <label for="time">Time</label>
                <md-select v-model="form.time">
                  <md-option value="09:00">9:00 AM</md-option>
                  <md-option value="09:30">9:30 AM</md-option>
                  <md-option value="10:00">10:00 AM</md-option>
                  <md-option value="10:30">10:30 AM</md-option>
                  <md-option value="11:00">11:00 AM</md-option>
                  <md-option value="11:30">11:30 AM</md-option>
                  <md-option value="12:00">12:00 PM</md-option>
                  <md-option value="12:30">12:30 PM</md-option>
                  <md-option value="13:00">1:00 PM</md-option>
                  <md-option value="13:30">1:30 PM</md-option>
                  <md-option value="14:00">2:00 PM</md-option>
                  <md-option value="14:30">2:30 PM</md-option>
                  <md-option value="15:00">3:00 PM</md-option>
                  <md-option value="15:30">3:30 PM</md-option>
                  <md-option value="16:00">4:00 PM</md-option>
                  <md-option value="16:30">4:30 PM</md-option>
                  <md-option value="17:00">5:00 PM</md-option>
                </md-select>
              </md-field>
            </div>
          </div>
          <md-field :class="getValidationClass('duration')">
            <label for="duration">Duration</label>
            <md-select v-model="form.duration" name="duration" id="duration">
              <md-option value="30">30 Minutes</md-option>
              <md-option value="60">1 Hour</md-option>
              <md-option value="90">1 Hour and 30 Minutes</md-option>
              <md-option value="120">2 Hours</md-option>
              <md-option value="150">2 Hours and 30 Minutes</md-option>
              <md-option value="180">3 Hours</md-option>
            </md-select>
          </md-field>
          <md-field :class="getValidationClass('notes')">
            <label for="notes">Notes</label>
            <md-textarea v-model="form.notes"></md-textarea>
          </md-field>
          <md-card-actions>
            <md-button
              type="submit"
              class="md-primary md-raised"
              :disabled="sending"
              >Book
            </md-button>
          </md-card-actions>
        </md-card-content>
      </md-card>
    </form>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email, minLength } from "vuelidate/lib/validators";
import axios from "axios";
import settings from "../settings";

export default {
  name: "AppointmentForm",
  props: {},
  mixins: [validationMixin],
  data: () => ({
    form: {
      fullName: null,
      phone: null,
      email: null,
      subject: null,
      duration: null,
      date: null,
      time: null,
      notes: null,
    },
    userSaved: false,
    sending: false,
    lastUser: null,
  }),
  validations: {
    form: {
      fullName: {
        required,
        minLength: minLength(3),
      },
      phone: {
        required,
        minLength: minLength(10),
      },
      subject: {
        required,
      },
      duration: {
        required,
      },
      date: {
        required,
      },
      time: {
        required,
      },
      notes: {},
      email: {
        required,
        email,
      },
    },
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty,
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      this.form.fullName = null;
      this.form.email = null;
      this.form.phone = null;
    },
    book() {
      this.sending = true;

      // JavaScript PAIN
      let timeMap = {
        "09:00": { hour: 9, minute: 0 },
        "09:30": { hour: 9, minute: 30 },
        "10:00": { hour: 10, minute: 0 },
        "10:30": { hour: 10, minute: 30 },
        "11:00": { hour: 11, minute: 0 },
        "11:30": { hour: 11, minute: 30 },
        "12:00": { hour: 12, minute: 0 },
        "12:30": { hour: 12, minute: 30 },
        "13:00": { hour: 13, minute: 0 },
        "13:30": { hour: 13, minute: 30 },
        "14:00": { hour: 14, minute: 0 },
        "14:30": { hour: 14, minute: 30 },
        "15:00": { hour: 15, minute: 0 },
        "15:30": { hour: 15, minute: 30 },
        "16:00": { hour: 16, minute: 0 },
        "16:30": { hour: 16, minute: 30 },
        "17:00": { hour: 17, minute: 0 },
      };
      let hour = timeMap[this.form.time].hour;
      let minute = timeMap[this.form.time].minute;
      console.log("year " + this.form.date.getFullYear());
      console.log("month " + this.form.date.getMonth());
      console.log("date " + this.form.date.getDate());
      let datetime = new Date(
        this.form.date.getFullYear(),
        this.form.date.getMonth(),
        this.form.date.getDate(),
        hour,
        minute,
        0,
        0
      );
      axios
        .post(settings.apiEndpoint + "/create_appointment", {
          name: this.form.fullName,
          email: this.form.email,
          phone: this.form.phone,
          subject: this.form.subject,
          duration: this.form.duration,
          notes: this.form.notes,
          date: datetime,
        })
        .then((response) => {
          this.form.sending = false;
          let id = response.data.appointment._id;
          this.$router.push("/status/" + id);
        })
        .catch((err) => {
          console.error(err);
          this.form.sending = false;
        });
    },
    validateUser() {
      this.$v.$touch();
      console.log(this.form.date);

      if (!this.$v.$invalid) {
        this.book();
      }
    },
  },
};
</script>

<style scoped>
form {
  justify-content: center;
}
</style>