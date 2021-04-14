const state = {
    message: '',
    visible: false,
    type: 'default',
}

const mutations = {
    toggle: state => state.visible = !state.visible,
    hide: state => state.visible = false,
    show: state => state.visible = true,
    setMessage: (state, msg) => state.message = msg,
    setType: (state, type) => state.type = type,
}

const actions = {
    showNotification({commit}, {message, type}) {
        commit('hide');
        commit('setMessage', message);
        commit('setType', type)
        commit('show');
    }
};

export default  {
    namespaced: true,
    state,
    mutations,
    actions,
}