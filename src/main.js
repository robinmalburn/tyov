import { createApp } from "vue";
import App from "./App.vue";
import "./assets/tailwind.css";
import store from "./store";

createApp(App).mount("#app").use(store);
