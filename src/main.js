import Vue from 'vue'
import App from './App.vue'

import vuetify from './plugins/vuetify'
import router from './router/index'
import { store } from './store'

import axios from 'axios/dist/axios.min.js'
import moment from 'moment/min/moment.min.js'
import 'moment/locale/ru'

Vue.prototype.$axios = axios
Vue.prototype.$moment = moment
Vue.prototype.$eventEmitter = new Vue() // "Шина" событий между компонентами

Vue.config.productionTip = true

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
