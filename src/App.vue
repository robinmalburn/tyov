<template>
  <div id="app" class="p-6 flex flex-col min-h-screen">
    <HeadingComponent level="1" class="text-center">TYOV ~ Companion</HeadingComponent>
    <NotificationPane />
    <div class="flex flex-col md:flex-row flex-grow">
      <div class="flex-1">
        <SlideDownPanelComponent class="flex-1">
          <template #closed-heading>
            Open Actions
          </template>
          <ActionsPane />
          <PromptsPane />
        </SlideDownPanelComponent>
        <div class="flex-1">
          <MemoriesPane />
        </div>
      </div>
      <div  class="flex-1">
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
            v-html="'Thousand Year Old Vampire Copyright &copy; Tim Tim Hutchings'"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ActionsPane from "./components/ActionsPane";
import CharactersPane from "./components/CharactersPane";
import HeadingComponent from "./components/HeadingComponent";
import PromptsPane from "./components/PromptsPane";
import MarksPane from "./components/MarksPane";
import MemoriesPane from "./components/MemoriesPane";
import NotificationPane from "./components/NotificationPane";
import ResourcesPane from "./components/ResourcesPane";
import SlideDownPanelComponent from "./components/SlideDownPanelComponent";
import SkillsPane from "./components/SkillsPane";

export default {
  name: 'App',
  components: {
    ActionsPane,
    PromptsPane,
    MarksPane,
    SkillsPane,
    ResourcesPane,
    CharactersPane,
    HeadingComponent,
    MemoriesPane,
    NotificationPane,
    SlideDownPanelComponent,
  },
  computed: {
    copyright() {
      // Be a little defensive since we're trusting local clocks, but querying
      // a remote API for the copyright year seemed a bit overkill.
      const year = Math.max(2021, (new Date()).getUTCFullYear());
      return `Copyright &copy; ${year} Robin Malburn`
    }
  },
}
</script>