<template>
<v-hover v-slot="{ hover }">
  <v-expand-transition>
    <v-card
    :elevation="hover ? 6 : 3"
    :height="height"
    :min-height="height"
    :max-height="height"
    :width="width"
    :min-width="width"
    :max-width="width"
    class="transition-fast-in-fast-out v-card--reveal"
    >
      <v-img
      @click="$emit('expand', cam.name)"
      :width="width"
      :height="height - 30"
      :src="imgSource"
      @load="loading = false"
      style="background-color: #e0e0e0; cursor: pointer;"
      >
        <v-row
        class="fill-height ma-0"
        align="center"
        justify="center"
        v-if="loading"
        >
          <v-progress-circular
          indeterminate
          color="grey"
          ></v-progress-circular>
        </v-row>
      </v-img>

      <v-card-actions class="pa-0 ma-0">
        <v-card-text class="pa-0 pb-1 pl-3 text--primary cam-preview-title">
          {{ cam.title }}
        </v-card-text>

        <v-spacer />

        <v-btn icon class="ma-0 pa-0 pb-1" @click="$emit('hide', cam)">
          <v-icon small v-if="cam.hide">mdi-eye</v-icon>
          <v-icon small v-else>mdi-eye-off-outline</v-icon>
        </v-btn>

        <v-btn icon class="ma-0 pa-0 pb-1" @click="$emit('pin', cam)">
          <v-icon small v-if="cam.pin">mdi-pin</v-icon>
          <v-icon small v-else>mdi-pin-outline</v-icon>
        </v-btn>

      </v-card-actions>
    </v-card>
  </v-expand-transition>
</v-hover>
</template>

<script>
export default {
  data () {
    return {
      server: localStorage.server,
      height: 220,
      width: 320,
      loading: true,
      imgSource: ''
      // imgSource: `http://${localStorage.server}/screenshot/${this.cam.name}`
    }
  },

  props: [
    'cam'
  ]
}
</script>

<style scoped>
.cam-preview-title {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
</style>
