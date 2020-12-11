<template>
<div>
  <v-row>
    <v-col>

      <video
      autoplay
      muted
      playsinline
      ref="videoPlayer"
      class="video-js vjs-theme pa-0 ma-0 mx-auto mt-8 player-cam-modal"
      :width="size.w"
      :height="size.h"
      @timeupdate="onTimeupdate"
      @ended="onEnded"
      />

    </v-col>
  </v-row>
  <v-row justify="center">
    <div>
      <v-row>
        <v-col>

          <v-btn icon class="mr-8" @click="changePlaybackRate()">
            <v-icon v-if="!player || player.playbackRate() == 1">mdi-speedometer-slow</v-icon>
            <v-icon v-else-if="player.playbackRate() == 4">mdi-speedometer-medium</v-icon>
            <v-icon v-else>mdi-speedometer</v-icon>
          </v-btn>

        </v-col>
        <v-col>

          <v-btn icon class="mx-16" @click="playPause()">
            <v-icon v-if="paused">mdi-pause</v-icon>
            <v-icon v-else>mdi-play</v-icon>
          </v-btn>

        </v-col>
        <v-col>

          <v-btn icon class="ml-8" @click="fullscreen()">
            <v-icon>mdi-fullscreen</v-icon>
          </v-btn>

        </v-col>
      </v-row>
    </div>
  </v-row>
</div>
</template>

<script>
import videojs from 'video.js/dist/video.min.js'
import 'video.js/dist/video-js.min.css'
import '@/assets/styles/videojs-theme.css'

export default {
  name: 'VideoPlayer',

  props: [
    'cam'
  ],

  data () {
    return {
      player: null,
      paused: true,
      size: { w: 160, h: 90 },
      streaming: null,
      playbackRate: 1.0
    }
  },

  methods: {
    onFullscreenChange (event) {
      this.player.controls(this.player.isFullscreen())
    },

    changePlaybackRate () {
      switch (this.player.playbackRate()) {
        case (1):
          this.player.playbackRate(4)
          break
        case (4):
          this.player.playbackRate(12)
          break
        default:
          this.player.playbackRate(1)
      }
    },

    fullscreen () {
      this.player.requestFullscreen() ||
      this.player.webkitRequestFullScreen() ||
      this.player.mozRequestFullScreen() ||
      this.player.msRequestFullscreen()
    },

    playPause () {
      this.paused = !this.paused
      this.paused ? this.player.play() : this.player.pause()
    },

    onEnded (event) {
      this.$eventEmitter.$emit('Ended', this.player.currentTime())
    },

    enableStream () {
      this.player.src(
        {
          src: `http://${localStorage.server}/rel/${this.cam.name}/index.m3u8`,
          type: 'application/x-mpegURL'
        }
      )
      this.streaming = true
    },

    onTimeupdate (event) {
      /**
       * Если это самый первый кадр, то не передавать таймлайну сигнал.
       * Нужно для того, чтобы перед перемещением полосы времени на таймлайне
       * она не перемещалась сначала в качалу отрывка, а затем к необходимому моменту
       */
      if (this.player.currentTime() !== 0.0) {
        this.$eventEmitter.$emit('timeUpdate', this.player.currentTime())
      }
    },

    adaptiveVideoPlayer () {
      const w = this.$vuetify.breakpoint.width
      switch (true) {
        case (w >= 1440):
          this.size = { w: 16 * 64, h: 9 * 56 }
          break
        case (w >= 1024):
          this.size = { w: 16 * 50, h: 9 * 45 }
          break
        case (w >= 768):
          this.size = { w: 16 * 46, h: 9 * 40 }
          break
        case (w >= 425):
          this.size = { w: 16 * 28, h: 9 * 30 }
          break
        case (w >= 375):
          this.size = { w: 16 * 26, h: 9 * 24 }
          break
        case (w >= 320):
          this.size = { w: 16 * 22, h: 9 * 22 }
          break
        default:
          this.size = { w: 16 * 22, h: 9 * 22 }
      }
    },

    onChangeFrame (event) {
      this.player.src(
        {
          src: event.src,
          type: event.type
        }
      )
      this.streaming = false
      this.player.currentTime(event.rewind)
      this.player.playbackRate(1)
    }
  },

  watch: {
    size: function () {
      this.player.width(this.size.w)
      this.player.height(this.size.h)
    },

    streaming: function () {
      this.$eventEmitter.$emit('changeStreamingStatus', this.streaming)
      this.paused = this.player.paused
      this.player.playbackRate(1)
    }
  },

  created () {
    this.adaptiveVideoPlayer()
  },

  mounted () {
    this.player = videojs(
      this.$refs.videoPlayer,
      {
        playbackRates: [1.0, 4.0, 12.0],
        html5: {
          hls: { overrideNative: true },
          nativeVideoTracks: false,
          nativeAudioTracks: false,
          nativeTextTracks: false
        }
      }
    )
    this.enableStream()
    this.paused = this.player.paused

    this.$eventEmitter.$on('changeFrame', this.onChangeFrame)
    this.$eventEmitter.$on('enableStream', this.enableStream)

    document.querySelector('.player-cam-modal').addEventListener('fullscreenchange', this.onFullscreenChange)
  },

  beforeDestroy () {
    this.$eventEmitter.$off('changeFrame')
    this.$eventEmitter.$off('enableStream')
  }
}
</script>
