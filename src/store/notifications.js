import { defineStore } from "pinia";

export const useNotificationsStore = defineStore("notifications", {
  state: () => ({
    message: "",
    visible: false,
    type: "default",
  }),
  actions: {
    toggle() {
      this.visible = !this.visible;
    },
    hide() {
      this.visible = false;
    },
    show() {
      this.visible = true;
    },
    setMessage(msg) {
      this.message = msg;
    },
    setType(type) {
      this.type = type;
    },
    showNotification({ message, type }) {
      this.hide();
      this.setMessage(message);
      this.setType(type);
      this.show();
    },
  },
});
