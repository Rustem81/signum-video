<template>
    <v-app>
      <lazyAuthorization v-if="!isAuthorized"/>
      <lazyDownloader v-if="isAuthorized"/>
      <Bar />
      <Navigation />
      <Main />
    </v-app>
</template>

<script>
import Bar from './components/Bar'
import Navigation from './components/Navigation'
import Main from './components/Main'
const lazyDownloader = () => (import('./components/Downloader'))
const lazyAuthorization = () => (import('./components/Authorization'))

export default {
  name: 'App',

  data () {
    return {
      isAuthorized: Boolean(localStorage.auth)
    }
  },

  components: {
    lazyAuthorization,
    lazyDownloader,
    Bar,
    Navigation,
    Main
  }
}
</script>
