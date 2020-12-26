import auth from '../services/firebase-auth-proxy';

export default {
  async AUTH_LOGIN(context, payload) {
    const { email, password } = payload;
    let loggedUser = null;
    try {
      loggedUser = await auth.signIn(email, password);
      // console.log('loggedUser', loggedUser);
      context.commit('AUTH_LOGIN', loggedUser);

      let users = [];

      if (loggedUser.role === 'user') {
        users.push(loggedUser);
      } else {
        users = await auth.getAllUsers();
      }

      context.commit('SET_USERS', users);
    } catch (err) {
      console.log('ERR', err);
    }
    return loggedUser;
  },

  async AUTH_LOGOUT({ commit }) {
    await auth.signOut();
    commit('AUTH_LOGOUT');
    commit('SET_USERS', []);
  },

  async PATCH_USER({ state, commit }, payload) {
    const {
      id, displayName, email, role,
    } = payload;

    let user = null;

    try {
      const patchedUser = await auth.patchUser(id, displayName, email, role);

      commit('PATCH_USER', patchedUser);
      user = state.users.find((u) => u.id === patchedUser.id);
    } catch (err) {
      console.log('ERR', err);
    }
    return user;
  },

  async CREATE_USER({ state, commit }, payload) {
    let user = null;
    try {
      const uid = await auth.createUser(payload);

      commit('CREATE_USER', { id: uid, ...payload });
      user = state.users.find((u) => u.id === uid);
    } catch (err) {
      console.log('ERR', err);
    }
    return user;
  },
  async DELETE_USER({ commit }, payload) {
    const { userId } = payload;
    try {
      await auth.deleteUser(userId);
      commit('DELETE_USER', payload);
    } catch (err) {
      console.log('ERR', err);
    }
  },
};
