<template>
  <v-app-bar
  app
  flat
  color="white"
  >
    <v-app-bar-nav-icon
    @click="statusNavigation = !statusNavigation"
    />

    <v-spacer></v-spacer>

    <v-toolbar-title>{{ objectTitle }}</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn
    icon
    @click="exit()"
    >
      <v-icon>mdi-exit-to-app</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>

export default {
  data () {
    return {
      objectTitle: '',
      statusNavigation: null
    }
  },

  mounted () {
    if (localStorage.auth) {
      this.objectTitle = localStorage.title
    }

    this.adaptiveToggleNavbar()
  },

  methods: {
    exit () {
      delete localStorage.auth
      try {
        delete localStorage.code
        delete localStorage.server
        delete localStorage.title
        delete localStorage.pins
        delete localStorage.hiddens
      } catch {
        // ...
      }
      window.location.reload()
    },

    adaptiveToggleNavbar () {
      this.statusNavigation = this.$vuetify.breakpoint.xs
    }
  },

  watch: {
    statusNavigation: function () {
      this.$eventEmitter.$emit('toggleStatusNavigation', this.statusNavigation)
    }
  }
}
</script>
