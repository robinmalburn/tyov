<template>
  <CardComponent id="skills">
    <HeadingComponent level="2">Skills</HeadingComponent>
    <FormToggleComponent 
      @save="add"
      @toggle="toggleControls"
      :showControls="showControls"
    >
      <template #button>
        Add a new Skill?
      </template>
      <template #form>
        <input 
          type="text"
          placeholder="Description"
          class="shadow appearance-none border rounded w-full py-1 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
          v-model="newSkill.name"
          @keyup.enter="add"
        />
        <label>
          <input
              type="checkbox"
              class="shadow border rounded py-2 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
              v-model="newSkill.checked"
              :true-value="true"
              :false-value="false"
          />
          Checked?
        </label>
      </template>
    </FormToggleComponent>

    <transition-group
      class="my-2"
      tag="ul"
      enter-active-class="transition-all duration-100 ease-out"
      leave-active-class="transition-all duration-100 ease-in"
      enter-class="opacity-0"
      enter-to-class="opacity-100"
      leave-class="opacity-100"
      leave-to-class="opacity-0"
      move-class="transition-transform duration-500 ease-in-out"
    >
      <li
          class="cursor-pointer select-none"
          v-for="skill in skills"
          :key="`skill-${skill.id}`"
      >
        <span @click="toggle(skill)">
          <span>{{skill.name}}</span>
          <span v-if="skill.checked">
            (x)
          </span>
        </span>
        <RemoveCrossComponent 
          @remove="remove(skill)"
        />
      </li>
    </transition-group>
  </CardComponent>
</template>

<script>
import RemoveCrossComponent from 'Components/RemoveCrossComponent';
import CardComponent from 'Components/CardComponent';
import HeadingComponent from 'Components/HeadingComponent';
import FormToggleComponent from 'Components/FormToggleComponent';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import uuid from 'Libs/uuid';


export default {
  name: 'SkillsPane',
  data: function() {
      return {
          showControls: false,
          newSkill: {
              name: '',
              checked: false,
          },
      }
  },
  components: {
    CardComponent,
    FormToggleComponent,
    HeadingComponent,
    RemoveCrossComponent,
  },
  computed: {
    ...mapGetters('skills', ['skills']),
  },
  methods: {
    ...mapMutations('notifications', {
      hideNotification: 'hide'
    }),
    ...mapActions('notifications', ['showNotification']),
    ...mapMutations('skills', {
      addSkill: 'add',
      remove: 'remove',
      toggle: 'toggle',
    }),
    add(){
      if (this.newSkill.name === '') {
        this.showNotification({message: 'You must provide a description.', type:'warning'});
        return;
      }

      this.addSkill({
        id: uuid('skill'),
        ...this.newSkill
      });

      this.toggleControls();
    },
    toggleControls() {
      this.hideNotification();
      this.showControls = !this.showControls;
      this.newSkill = {name: '', checked: false};
    },
  }
}
</script>