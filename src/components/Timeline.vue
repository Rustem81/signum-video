<template>
<div>
  <v-row
  class="px-4"
  align="center"
  justify="center">
    <v-col
    class="text-right"
    cols="1"
    >
      <v-btn
      icon
      @click="timeline.moveTo(timeline.getWindow().start.valueOf() - 2800000)"
      >
        <v-icon
        center
        >
        mdi-chevron-left
        </v-icon>
      </v-btn>
    </v-col>

    <v-col
    class="text-center"
    >
      <div>
        <Timeline
        ref="timeline"
        :items="items"
        :groups="groups"
        :options="options"
        @click="onClick"
        @timechanged="onTimechange"
        />
      </div>
    </v-col>

    <v-col
    class="text-left"
    cols="1"
    >
      <v-btn
      icon
      @click="timeline.moveTo(timeline.getWindow().end.valueOf() + 2800000)"
      >
        <v-icon
        center
        >
        mdi-chevron-right
        </v-icon>
      </v-btn>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="6" class="text-right py-0">
      <v-btn icon @click="timeline.zoomOut(1)">
        <v-icon>
          mdi-magnify-minus-outline
        </v-icon>
      </v-btn>
    </v-col>

    <v-col cols="2" class="text-left py-0">
      <v-btn icon @click="timeline.zoomIn(1)">
        <v-icon>
          mdi-magnify-plus-outline
        </v-icon>
      </v-btn>
    </v-col>

    <v-col cols="2" class="text-right py-0">
      <v-btn icon @click="dateSelector = true">
        <v-icon>
          mdi-calendar
        </v-icon>
      </v-btn>
    </v-col>

    <v-col cols="1" class="text-left py-0">
        <v-btn
        :disabled="downloading || streaming"
        icon
        @click="$eventEmitter.$emit('downloadVideo',{title:currentItem.title, cam:cam})"
        >
          <v-icon>
            mdi-download
          </v-icon>
        </v-btn>
    </v-col>
  </v-row>

  <!-- Date selector -->
  <v-dialog
  v-model="dateSelector"
  max-width="290"
  persistent
  >
    <v-card
    max-width="290"
    >
      <v-date-picker
      reactive
      v-model="date"
      :show-current="$moment().format('YYYY-MM-DD')"
      flat
      />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
        color="blue darken-1"
        text
        @click="dateSelector = false"
        >
        Отмена
        </v-btn>
        <v-btn
        color="blue darken-1"
        text
        @click="selectDate (); dateSelector = false"
        >
        Поиск
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>

<script>
import { Timeline } from 'vue2vis/dist/vue2vis.umd.min.js'

import 'vue2vis/dist/vue2vis.css'

export default {
  components: {
    Timeline
  },

  data () {
    return {
      timeline: null,

      date: null,
      dateSelector: false,

      downloading: false,

      currentItem: null,
      streaming: null,
      lastFixedTime: null,
      groups: [{ id: 0 }],
      items: [],
      options: {
        height: '120px',
        minHeight: '120px',
        maxHeight: '120px',
        zoomMin: 100000,
        zoomMax: 86400000,
        start: this.$moment().subtract(1, 'day'),
        end: this.$moment().add(1, 'day'),

        type: 'range',
        editable: false,
        selectable: false,
        stack: false,
        stackSubgroups: false,

        showCurrentTime: false,
        showMajorLabels: true,
        showMinorLabels: true,
        showTooltips: false,

        margin: 0
      }
    }
  },

  methods: {
    selectDate () {
      /**
       * Поиск записи с помощью календаря
       * Вначале проверяется, есть ли запись в выбранное время.
       * Если да - включает ее, а иначе ничего не делает.
       * Далее в любом случае передвигаем камеру к выбранной дате
       */
      const time = this.$moment(this.date)

      for (const iterItem of this.items) {
        if (
          time.valueOf() >= this.$moment(iterItem.start).valueOf() &&
          time.valueOf() <= this.$moment(iterItem.end).valueOf()
        ) {
          this.changeVideo(iterItem, Math.floor((time.valueOf() - this.$moment(iterItem.start).valueOf()) / 1000))
          break
        }
      }

      this.timeline.moveTo(time)
    },

    enableStream () {
      this.$eventEmitter.$emit('enableStream')
      this.currentItem = null
    },

    changeVideo (item, rewind = 0) {
      this.$eventEmitter.$emit('changeFrame', {
        src: `https://${localStorage.server}/api/recording/${this.cam.name}/${item.title}`,
        type: 'video/mp4',
        rewind: rewind
      })
      this.currentItem = item
    },

    changeFrame (time) {
      // Если time > последней записи - включаем стрим
      if (time.getTime() >= this.$moment(this.items[this.items.length - 1].end).valueOf()) {
        this.enableStream()
        return
      }

      // Выбираем подходящее по времени видео
      for (const iterItem of this.items) {
        if (
          time.getTime() >= this.$moment(iterItem.start).valueOf() &&
          time.getTime() <= this.$moment(iterItem.end).valueOf()
        ) {
          this.changeVideo(iterItem,
            Math.floor((this.$moment(time).valueOf() - this.$moment(iterItem.start).valueOf()) / 1000))
          return
        } else {
          this.currentItem = null
        }
      }

      /**
       * Поиск ближайшего (следующего) видео
       * Если time < первый записи - включам первую запись
       * Если time > i && time < i + 1 - включаем i
       */
      if (time.getTime() <= this.$moment(this.items[0].start).valueOf()) {
        this.changeVideo(this.items[0])
      } else {
        for (const i in this.items) {
          if (
            time.getTime() > this.$moment(this.items[i].end).valueOf() &&
            time.getTime() <= this.$moment(this.items[Number(i) + 1].start).valueOf()
          ) {
            this.changeVideo(this.items[Number(i) + 1])
            break
          }
        }
      }
    },

    onClick (event) {
      if (this.streaming) {
        this.lastFixedTime = this.$moment() // Необходимо для корректного расчета позиции полоски во время стрима
      }
      this.timeline.setCustomTime(event.time, 0)
      this.changeFrame(event.time)
    },

    onTimechange (id, time, event) {
      // Вызывается когда пользователем перетаскивает полоску
      if (id === 0) {
        this.changeFrame(time)
      }
    },

    onTimeUpdate (event) {
      if (this.streaming) {
        this.timeline.setCustomTime(
          this.lastFixedTime.valueOf() + Math.floor(event - 23.0) * 1000,
          0
        )
      } else {
        for (const iterItem of this.items) {
          if (this.currentItem === iterItem) {
            this.timeline.setCustomTime(
              new Date(this.$moment(iterItem.start).valueOf() + event * 1000), 0
            )
            break
          }
        }
      }
    },

    onEnded () {
      /**
       * Вычисляем следующее действие после окончания отрывка
       * Если это последний объект, то включает стрим, иначе
       * узнаем какое видео должно быть следующим и включаем его
       */
      if (this.currentItem) {
        if (this.currentItem.id === this.items[this.items.length - 1].id) {
          this.enableStream()
        } else {
          const nextVideo = this.items[this.items.indexOf(this.currentItem) + 1]
          this.changeVideo(nextVideo)
        }
      }
    },

    onChangeStreamingStatus (event) {
      this.lastFixedTime = this.$moment()
      this.streaming = event
    }
  },

  mounted () {
    this.timeline = this.$refs.timeline

    /* В таймлайне присутствует баг, при котором он не видит опцию preferZoom на этапе загрузки,
    поэтому приходится вот таким способом после загрузки таймлайна передавать ему эту опцию
    и перерисовывать его */
    setTimeout(() => {
      this.options.preferZoom = true
      this.timeline.redraw()
    }, 0)

    this.timeline.addCustomTime(new Date(), 0) // Добавляем "кастомную" полоску времени

    this.$axios // Получение архива с сервера
      .get(`https://${localStorage.server}/api/records?id=${this.cam.name}`)
      .then(response => {
        const responseItems = Array.from(response.data[this.cam.name].values())
        for (const file of responseItems.slice(0, responseItems.length - 1)) {
          this.items.push({
            group: 0,
            title: file.name,
            start: file.start,
            end: file.end
          })
        }
      })
      /*
      .catch(error => {
        if (error) console.error(error)
      })
      */
      .finally(() => {
        setTimeout(() => { this.timeline.redraw() }, 0)
      })

    this.$eventEmitter.$on('timeUpdate', this.onTimeUpdate)
    this.$eventEmitter.$on('Ended', this.onEnded)
    this.$eventEmitter.$on('changeStreamingStatus', this.onChangeStreamingStatus)
    this.$eventEmitter.$on('startDownloading', () => { this.downloading = true })
    this.$eventEmitter.$on('stopDownloading', () => { this.downloading = false })
  },

  beforeDestroy () {
    this.$eventEmitter.$off('timeUpdate', this.onTimeUpdate)
    this.$eventEmitter.$off('Ended', this.onEnded)
    this.$eventEmitter.$off('changeStreamingStatus', this.onChangeStreamingStatus)
    this.$eventEmitter.$off('startDownloading', () => { this.downloading = true })
    this.$eventEmitter.$off('stopDownloading', () => { this.downloading = false })
  },

  props: [
    'cam'
  ]
}
</script>

<style>
.vis-bottom{
  border: 1px solid#9fb8bf;
  border-left: none;
  border-right: none;
  border-radius: 4px;
}

.vis-group, .vis-itemset {
  height: 40px !important;
}

.vis-content {
  top: 0px !important;
  min-height: 100% !important;
}

.vis-item {
  border: none !important;
  border-radius: 0px !important;
  background-color: #448AFF;
  top: 0px !important;
  height: 100%;
}
</style>
