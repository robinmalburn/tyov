import { defineStore } from 'pinia'

type NotificationType = 'default' | string

type NotificationsState = {
  message: string
  visible: boolean
  type: NotificationType
}

export const useNotificationsStore = defineStore('notifications', {
  state: (): NotificationsState => ({
    message: '',
    visible: false,
    type: 'default',
  }),
  actions: {
    toggle() {
      this.visible = !this.visible
    },
    hide() {
      this.visible = false
    },
    show() {
      this.visible = true
    },
    setMessage(msg: string) {
      this.message = msg
    },
    setType(type: NotificationType) {
      this.type = type
    },
    showNotification({
      message,
      type,
    }: {
      message: string
      type: NotificationType
    }) {
      this.hide()
      this.setMessage(message)
      this.setType(type)
      this.show()
    },
  },
})
