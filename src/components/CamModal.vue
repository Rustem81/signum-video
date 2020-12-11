<template>
<div>
  <v-dialog
  v-model="dialog"
  fullscreen
  overlay-opacity="0.8"
  elevation="4"
  >
  <v-card>

    <v-toolbar dark>
      <v-btn icon @click="$emit('close')">
        <v-icon>mdi-close-thick</v-icon>
      </v-btn>
      <v-spacer />
      <v-toolbar-title>
        <v-icon class="mb-1 mr-3">mdi-cctv</v-icon>
        {{ cam.title }}
      </v-toolbar-title>
      <v-spacer />
    </v-toolbar>

    <v-container :style="{ 'margin-top': ($vuetify.breakpoint.width < 425) ? '16px !important' : '32px !important'  }">
      <!-- Видеоплеер -->
      <v-row>
        <v-col>
          <VideoPlayer :cam="cam" />
        </v-col>
      </v-row>
      <!-- Таймлайн -->
      <Timeline class="mt-8" :cam="cam" />
    </v-container>

  </v-card>
  </v-dialog>
</div>
</template>

<script>
import VideoPlayer from './VideoPlayer'
import Timeline from './Timeline'

export default {
  components: {
    VideoPlayer,
    Timeline
  },

  data () {
    return {
      dialog: true,
      size: {
        w: '50%'
      }
    }
  },

  props: [
    'cam'
  ]
}
</script>
