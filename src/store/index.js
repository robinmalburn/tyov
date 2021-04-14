import Vue from 'vue'
import Vuex from 'vuex'
import actions from 'Stores/actions'
import characters from 'Stores/characters'
import marks from 'Stores/marks'
import memories from 'Stores/memories'
import notifications from 'Stores/notifications'
import resources from 'Stores/resources'
import skills from 'Stores/skills'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    actions,
    characters,
    marks,
    memories,
    notifications,
    resources,
    skills,
  }
})
