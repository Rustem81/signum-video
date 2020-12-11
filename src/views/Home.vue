<template>
  <v-container fluid>
    <div v-if="isAuthorized">
      <div v-if="status" class="pl-6">
        <v-tabs
        v-model="tab"
        color="blue accent-2"
        right
        fixed-tabs
        >
          <v-tab>Список</v-tab>
          <v-tab>Скрыто</v-tab>
        </v-tabs>
        <v-tabs-items
        v-model="tab"
        touchless
        >
          <!-- Первая вкладка -->
          <v-tab-item>
            <div v-if="getPinTitleStatus()" class="mt-6">
              <v-subheader>ИЗБРАННЫЕ</v-subheader>
              <v-row class="justify-center">
                <div v-for="cam in cams" :key="cam.name">
                  <v-col
                  v-if="cam.pin && !(cam.hide)"
                  class="px-6 py-4"
                  >
                    <CamPreview
                    @expand="openCamModal($event)"
                    @pin="pin($event)"
                    @hide="hide($event)"
                    :cam="cam"
                    />
                  </v-col>
                </div>
              </v-row>
            </div>

            <div class="mt-8">
              <v-subheader>КАМЕРЫ</v-subheader>
              <v-row class="justify-center">
                <div v-for="cam in cams" :key="cam.name">
                  <v-col
                  v-if="!(cam.pin) && !(cam.hide)"
                  class="px-6 py-4"
                  >
                    <CamPreview
                    @expand="openCamModal($event)"
                    @pin="pin($event)"
                    @hide="hide($event)"
                    :cam="cam"
                    />
                  </v-col>
                </div>
              </v-row>
            </div>
          </v-tab-item>

          <!-- Вторая вкладка -->
          <v-tab-item>
            <div>
              <v-subheader class="mt-7">СКРЫТЫЕ КАМЕРЫ</v-subheader>
              <v-row class="justify-center">
                <div v-for="cam in cams" :key="cam.name">
                  <v-col
                  v-if="cam.hide"
                  class="px-6 py-4"
                  >
                    <CamPreview
                    @expand="openCamModal($event)"
                    @pin="pin($event)"
                    @hide="hide($event)"
                    :cam="cam"
                    />
                  </v-col>
                </div>
              </v-row>
            </div>
          </v-tab-item>
        </v-tabs-items>
        <CamModal
        v-if="camModal.state"
        @close="closeCamModel()"
        :cam="camModal.cam"
        />
      </div>
    </div>
  </v-container>
</template>

<script>
import CamPreview from '@/components/CamPreview'
import CamModal from '@/components/CamModal'

export default {
  components: {
    CamPreview,
    CamModal
  },

  data () {
    return {
      isAuthorized: localStorage.auth,
      tab: null,
      cams: null,
      status: true,
      camModal: {
        state: false,
        cam: null
      }
    }
  },

  methods: {
    closeCamModel () {
      this.camModal.cam = null
      this.camModal.state = false
    },

    openCamModal (cam) {
      this.camModal.cam = this.cams[cam]
      this.camModal.state = true
    },

    getPinTitleStatus () {
      try {
        return Boolean(localStorage.pins.trim().length)
      } catch {
        return false
      }
    },

    pin (cam) {
      cam.pin = !cam.pin
      let PinsLocalStorage = []
      try {
        PinsLocalStorage = JSON.parse(localStorage.getItem('pins'))
      } catch { /**/ }

      if (PinsLocalStorage.includes(cam.name)) {
        PinsLocalStorage.splice(PinsLocalStorage.indexOf(cam.name), 1)
      } else {
        PinsLocalStorage.push(cam.name)
      }
      localStorage.setItem('pins', JSON.stringify(PinsLocalStorage))
    },

    hide (cam) {
      cam.hide = !cam.hide
      let HiddensLocalStorage = []
      try {
        HiddensLocalStorage = JSON.parse(localStorage.getItem('hiddens'))
      } catch { /**/ }

      if (HiddensLocalStorage.includes(cam.name)) {
        HiddensLocalStorage.splice(HiddensLocalStorage.indexOf(cam.name), 1)
      } else {
        HiddensLocalStorage.push(cam.name)
      }
      localStorage.setItem('hiddens', JSON.stringify(HiddensLocalStorage))
    },

    isPin (cam) {
      if (localStorage.pins) {
        return JSON.parse(localStorage.getItem('pins')).includes(cam)
      } else {
        localStorage.pins = '[]'
        return false
      }
    },

    isHide (cam) {
      if (localStorage.hiddens) {
        return JSON.parse(localStorage.getItem('hiddens')).includes(cam)
      } else {
        localStorage.hiddens = '[]'
        return false
      }
    }
  },

  created () {
    this.$axios
      .get(`http://${localStorage.server}/cams`,
        {
          timeout: 8000
        }
      )
      .then(response => {
        for (const cam in response.data) {
          response.data[cam].pin = this.isPin(cam)
          response.data[cam].hide = this.isHide(cam)
        }
        this.cams = response.data
        this.status = true
      })
      .catch(error => {
        if (error) {
          console.error(error)
          this.status = false
        }
      })
  }
}
</script>
