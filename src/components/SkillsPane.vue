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

    <FormComponent
      class="my-2"
      @save="validatedUpdateSkill"
      @cancel="toggleEditingControls"
      @remove="removeSkill"
      v-show="showEditingControls"
      :buttons="[
        {
            type: 'default',
            event: 'save',
            label: 'Save',
        },
        {
            type: 'default',
            event: 'cancel',
            label: 'Cancel',
        },
        {
            type: 'default',
            event: 'remove',
            label: 'Remove',
        },
      ]"
    >
      <input 
          type="text"
          placeholder="Description"
          class="shadow appearance-none border rounded w-full py-1 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
          v-model="editSkill.name"
          @keyup.enter="validatedUpdateSkill"
        />
        <label>
          <input
              type="checkbox"
              class="shadow border rounded py-2 px-2 m-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 ring-gray-200"
              v-model="editSkill.checked"
              :true-value="true"
              :false-value="false"
          />
          Checked?
        </label>
    </FormComponent>

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
          class="select-none"
          v-for="skill in skills"
          :key="`skill-${skill.id}`"
      >
        <div class="grid grid-cols-6">
          <span class="col-span-5">
            <span 
              class="cursor-pointer hover:text-gray-400"
              @click="validatedToggleSkill(skill)"
            >
              <span>{{skill.name}}</span>
              <span v-if="skill.checked">
                (x)
              </span>
            </span>
          </span>
          <span 
              class="cursor-pointer select-none flex-initial text-right mx-2 hover:text-gray-400"
              @click="edit(skill)"
            >
            Edit
          </span>
      </div>
      </li>
    </transition-group>
  </CardComponent>
</template>

<script>
import CardComponent from 'Components/CardComponent';
import HeadingComponent from 'Components/HeadingComponent';
import FormComponent from 'Components/FormComponent';
import FormToggleComponent from 'Components/FormToggleComponent';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import uuid from 'Libs/uuid';


export default {
  name: 'SkillsPane',
  data: function() {
      return {
          showControls: false,
          showEditingControls: false,
          newSkill: {
              name: '',
              checked: false,
          },
          editSkill: {},
      }
  },
  components: {
    CardComponent,
    FormComponent,
    FormToggleComponent,
    HeadingComponent
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
      update: 'update',
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
    edit(skill) {
      this.editSkill = {...skill};
      this.showEditingControls = true;
    },
    validatedToggleSkill(skill) {
      this.hideNotification();

      if (this.editSkill.id === skill.id) {
        this.showNotification({message: 'You cannot change this skill whilst it is being edited.', type:'warning'});
        return;
      }

      this.toggle(skill);
    },
    validatedUpdateSkill() {
      if (this.editSkill.name === '') {
        this.showNotification({message: 'You must provide a description', type:'warning'});
        return;
      }

      this.update(this.editSkill);
      this.toggleEditingControls();
    },
    removeSkill() {
      let skillToRemove;

      this.skills.some(skill => {
        if (skill.id === this.editSkill.id) {
          skillToRemove = skill;
          return true;
        }
      });

      this.remove(skillToRemove);
      this.toggleEditingControls();
    },
    toggleControls() {
      this.hideNotification();
      this.showControls = !this.showControls;
      this.newSkill = {name: '', checked: false};
    },
    toggleEditingControls() {
      this.hideNotification();
      this.showEditingControls = !this.showEditingControls;
      this.editSkill = {};
    },
  },
}
</script>