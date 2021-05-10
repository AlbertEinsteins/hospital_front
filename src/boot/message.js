import Vue from 'vue'

class Message {
  success (text) {
    this.message(text, 'cyan', 'top', 'lightbulb_outline')
  }

  error (text) {
    this.message(text, 'negative', 'top', 'lightbulb_outline')
  }

  info (text) {
    this.message(text, 'blue-orange-5', 'top', 'lightbulb_outline')
  }

  warn (text) {
    this.message(text, 'warning', 'top')
  }

  message (text, color, position, icon) {
    Vue.prototype.$q.notify({
      message: text,
      color,
      position,
      icon
    })
  }
}

Vue.prototype.$message = new Message()
