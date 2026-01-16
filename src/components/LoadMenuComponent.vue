<template>
  <SlideDownPanelComponent v-model="loading">
    <template #closed-heading> Load </template>
    <div class="grid grid-rows gap-1 my-2">
      <input type="file" class="hidden" ref="upload" @change="load" />
      <ButtonComponent class="w-full" @click="$refs.upload.click()">
        From File
      </ButtonComponent>
      <ButtonComponent
        class="w-full"
        @click="fromLocalStorage"
        v-if="doesSupportLocalStorage"
      >
        From Local Storage
      </ButtonComponent>
    </div>
  </SlideDownPanelComponent>
</template>

<script setup>
import ButtonComponent from "./ButtonComponent";
import SlideDownPanelComponent from "Components/SlideDownPanelComponent";
import { restoreState, deserialize } from "Libs/gameState";
import localStorage, { supportsLocalStorage } from "Libs/localStorage";
import { useNotificationsStore } from "Stores/notifications";
import { ref, computed } from "vue";

const notificationsStore = useNotificationsStore();

const loading = ref(false);

const doesSupportLocalStorage = computed(() => supportsLocalStorage());

const load = (evt) => {
  if (evt.target.files.length !== 1) {
    notificationsStore.showNotification({
      message: "Unable to load file.  You must select one file to load.",
      type: "warning",
    });
    return;
  }

  notificationsStore.hide();

  const file = evt.target.files[0];

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const data = deserialize(reader.result);
      restoreState(data);
      loading.value = false;
    } catch (err) {
      notificationsStore.showNotification({
        message: "Unable to decode save state.",
        type: "danger",
      });
    }
  };

  reader.onerror = () => {
    notificationsStore.showNotification({
      message: "Unable to read file.",
      type: "danger",
    });
  };

  reader.readAsText(file);
};

const fromLocalStorage = () => {
  notificationsStore.hide();

  try {
    const data = deserialize(localStorage.get("save-game"));
    restoreState(data);
  } catch (err) {
    notificationsStore.showNotification({
      message: "Unable to decode save state.",
      type: "danger",
    });
  }

  loading.value = false;
};
</script>
