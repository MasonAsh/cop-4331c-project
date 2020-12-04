import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import AppointmentPage from "./components/AppointmentPage.vue";
import AdminPage from "./components/AdminPage.vue";
import LoginPage from "./components/LoginPage.vue";
import StatusPage from "./components/StatusPage.vue";
import NotFoundPage from "./components/NotFoundPage.vue";
import App from './App.vue'

Vue.use(VueMaterial)

Vue.config.productionTip = false

Vue.use(VueRouter)


const routes = [
  { path: "/", component: AppointmentPage },
  { path: "/status/:id", component: StatusPage },
  { path: "/admin", component: AdminPage },
  { path: "/admin/login", component: LoginPage },
  { path: "*", component: NotFoundPage },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
