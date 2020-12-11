<template>
  <v-dialog
  v-model="dialog"
  persistent
  overlay-opacity=".75"
  width="500px"
  >
    <v-card
    style="overflow: hidden;"
    >

    <v-card-title>
      <v-icon class="mr-4" color="black">
        mdi-account-lock
      </v-icon>
      Авторизация
    </v-card-title>

    <v-container>
      <v-card-text>

        <v-row>
          <v-col>
            <CodeInput
            v-resize="onResize"
            :loading="loading"
            type="text"
            class="input mx-auto"
            :fields="fields.count"
            :fieldHeight="fields.size.h"
            :fieldWidth="fields.size.w"
            @change="codeInputChanged"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-row>
        <v-col>
          <v-card-actions>
            <v-spacer />
            <v-btn
            color="blue darken-1"
            :disabled="btnDisabled"
            text
            @click="verification()"
            >
            Войти
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>

      </v-container>
    </v-card>

    <v-snackbar
    transition="fab-transition"
    v-model="snackbar.show"
    :color="snackbar.color"
    timeout="2000"
    bottom
    style="top: -100px;"
    >
    {{ snackbar.text }}
    </v-snackbar>

  </v-dialog>
</template>

<script>
import CodeInput from 'vue-verification-code-input'
import db from '@/assets/db.json'

export default {
  components: {
    CodeInput
  },

  data () {
    return {
      dialog: false,
      btnDisabled: true,
      code: '',
      loading: false,
      fields: {
        count: 6,
        size: { w: 0, h: 0 }
      },
      snackbar: {
        show: false,
        color: '',
        text: ''
      }
    }
  },

  mounted () {
    if (localStorage.code) {
      this.dialog = false
    } else {
      this.dialog = true
    }
  },

  methods: {
    verification () {
      this.loading = true
      this.btnDisabled = true

      const upperCode = this.code.toString().toUpperCase()
      if (/^[A-Z0-9]{6}$/.test(upperCode)) {
        const objectId = upperCode.substr(0, 3)
        const key = upperCode.substr(3)
        if (objectId in db && db[objectId].keys.includes(key)) {
          localStorage.auth = true
          localStorage.code = this.code
          localStorage.server = db[objectId].server
          localStorage.title = db[objectId].title
          window.location.reload()
        } else {
          this.showSnackbar('Неверный код', 'red darken-1')
        }
      } else {
        this.showSnackbar('Ошибка сервера. Пожалуйста, повторите попытку позже', 'red darken-1')
      }
    },

    codeInputChanged (v) {
      this.code = v
    },

    showSnackbar (msg, color) {
      this.snackbar = {
        show: true,
        color: color,
        text: msg
      }
    },

    onResize () {
      const b = this.$vuetify.breakpoint
      switch (true) {
        case (b.xl):
          this.fields.size = { w: 50, h: 58 }
          break
        case (b.lg):
          this.fields.size = { w: 48, h: 56 }
          break
        case (b.md):
          this.fields.size = { w: 46, h: 54 }
          break
        case (b.sm):
          this.fields.size = { w: 44, h: 52 }
          break
        case (b.xs):
          this.fields.size = { w: 36, h: 44 }
          break
        default:
          this.fields.size = { w: 30, h: 38 }
      }
    }
  },

  watch: {
    code: function () {
      this.btnDisabled = !(this.code.length === this.fields.count)
    }
  }
}
</script>

<style>
.react-code-input > input {
  text-transform: uppercase !important;
}
</style>
