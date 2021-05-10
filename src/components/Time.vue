<template>
  <div class="q-pa-sm">
    <q-separator />

    <div class="text-h5 q-px-md">
      <div class="q-mt-sm">{{ nowDate }}</div>
      <div class="text-bold">{{ nowTime }}</div>
    </div>
    <q-separator />
  </div>
</template>

<script>
import { date } from 'quasar'

export default {
  name: 'Time',
  data () {
    return {
      timeStamp: Date.now(),
      timer: null
    }
  },
  created () {
    this.timer = setInterval(() => {
      this.timeStamp = Date.now()
    }, 1000)
  },
  destroyed () {
    clearInterval(this.timer)
  },
  computed: {
    nowDate () {
      return date.formatDate(this.timeStamp, 'YYYY年MM月DD日')
    },
    nowTime () {
      return date.formatDate(this.timeStamp, 'HH:mm:ss')
    }
  }
}
</script>
