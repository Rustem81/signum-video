<template>
  <div>
    <v-snackbar
    app
    top
    right
    v-model="downloading"
    timeout="0"
    >
      <v-row>
        <v-col cols="10">

          Загрузка видео

        </v-col>
      </v-row>
      <v-row>
        <v-col>

          <v-progress-linear
          rounded
          height="8"
          :value="value"
          />

        </v-col>
      </v-row>

    </v-snackbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      downloading: false,
      value: 0
    }
  },

  methods: {
    close () {
      this.downloading = false
    },

    startDownload (src) {
      this.downloading = true
      this.$eventEmitter.$emit('startDownloading')

      const filename = this.$moment(src.title.replace('.mp3', ''), 'YYYY MM DD hh mm ss').format('LLL') + '.mp4'

      this.$axios(
        {
          url: `https://${localStorage.getItem('server')}/api/recording/${src.cam.name}/${src.title}`,
          method: 'GET',
          responseType: 'blob',
          onDownloadProgress: (event) => {
            this.value = Math.round((event.loaded * 100) / event.total)
          }
        }
      )
        .then(response => {
          const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'video/mp4' }))
          const fileLink = document.createElement('a')

          fileLink.href = fileURL
          fileLink.setAttribute('download', filename)
          fileLink.click()
          fileLink.remove()
        })
        .finally(() => {
          this.$eventEmitter.$emit('stopDownloading')
          this.downloading = false
          this.value = 0
        })
    }
  },

  mounted () {
    this.$eventEmitter.$on('downloadVideo', (event) => {
      this.startDownload(event)
    })
  }
}
</script>
