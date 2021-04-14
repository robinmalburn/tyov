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

    <ul class="my-3">
        <li
            class="cursor-pointer select-none"
            v-for="(skill, idx) in skills" :key="`skill-${idx}`"
        >
          <span @click="toggle(idx)">
            <span>{{skill.name}}</span>
            <span v-if="skill.checked">
             (x)
            </span>
          </span>
          <RemoveCrossComponent 
            @remove="remove(idx)"
          />
        </li>
    </ul>
  </CardComponent>
</template>

<script>
import RemoveCrossComponent from 'Components/RemoveCrossComponent';
import CardComponent from 'Components/CardComponent';
import HeadingComponent from 'Components/HeadingComponent';
import FormToggleComponent from 'Components/FormToggleComponent';
import { mapMutations, mapState, mapActions } from 'vuex';


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
    ...mapState('skills', ['skills']),
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

      this.addSkill(this.newSkill);
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