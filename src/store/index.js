import Vue from 'vue';
import Vuex from 'vuex';

import storeActions from './actions';
import storeMutations from './mutations';
import storeGetters from './getters';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loggedUser: null,
    users: null,
    snackbar: {
      show: false,
      variant: 'success',
      message: 'Success! Admin role is added.',
    },
  },
  mutations: {
    ...storeMutations,
  },
  actions: {
    ...storeActions,
  },
  getters: {
    ...storeGetters,
  },
  modules: {
  },
});
