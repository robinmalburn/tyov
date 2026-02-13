<template>
  <div id="app" class="p-6 flex flex-col min-h-screen">
    <HeadingComponent level="1" class="text-center"
      >TYOV ~ Companion</HeadingComponent
    >
    <NotificationPane />
    <div class="flex flex-col md:flex-row flex-grow">
      <div class="flex-1">
        <SlideDownPanelComponent class="flex-1">
          <template #closed-heading> Open Actions </template>
          <ActionsPane />
          <PromptsPane />
        </SlideDownPanelComponent>
        <div class="flex-1">
          <MemoriesPane />
        </div>
      </div>
      <div class="flex-1">
        <MarksPane />
        <SkillsPane />
        <ResourcesPane />
        <CharactersPane />
      </div>
    </div>
    <div class="border-t mt-4 text-right">
      <ul>
        <li>
          <a
            class="hover:text-gray-400"
            href="https://www.version1.net/"
            v-html="copyright"
          />
        </li>
        <li>
          <a
            class="hover:text-gray-400"
            href="https://thousandyearoldvampire.com/"
            v-html="'Thousand Year Old Vampire Copyright &copy; Tim Hutchings'"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ActionsPane from './components/ActionsPane.vue'
import CharactersPane from './components/CharactersPane.vue'
import HeadingComponent from './components/HeadingComponent.vue'
import PromptsPane from './components/PromptsPane.vue'
import MarksPane from './components/MarksPane.vue'
import MemoriesPane from './components/MemoriesPane.vue'
import NotificationPane from './components/NotificationPane.vue'
import ResourcesPane from './components/ResourcesPane.vue'
import SlideDownPanelComponent from './components/SlideDownPanelComponent.vue'
import SkillsPane from './components/SkillsPane.vue'

const copyright = computed(() => {
  const year = Math.max(2021, new Date().getUTCFullYear())
  return `Copyright &copy; ${year} Robin Malburn`
})
</script>
