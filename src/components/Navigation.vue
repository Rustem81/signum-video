<template>
  <v-navigation-drawer
    color="grey darken-4"
    app
    dark
    fixed
    touchless
    permanent
    :mini-variant="miniVariant"
    height="100%"
    >

    <v-list-item class="px-2">
      <v-list-item-avatar style="margin-right: 4px">
        <v-img
        src="@/assets/logo_white.svg"
        />
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title class="title">
          Signum Video
        </v-list-item-title>

        <v-list-item-subtitle style="font-size: 12px">
          Видеонаблюдение в вашем доме
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider />

    <NavigationList />

  </v-navigation-drawer>
</template>

<script>
import NavigationList from './NavigationList'

export default {
  data () {
    return {
      miniVariant: null
    }
  },

  components: {
    NavigationList
  },

  created () {
    this.$eventEmitter.$on('toggleStatusNavigation', event => {
      this.miniVariant = event
    })
  }
}
</script>
