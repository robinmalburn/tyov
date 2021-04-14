<template>
  <div id="app" class="m-10">
    <HeadingComponent level="1" class="text-center">TYOV ~ Companion</HeadingComponent>
    <NotificationPane />
    <div class="flex flex-col md:flex-row">
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
}
</script>