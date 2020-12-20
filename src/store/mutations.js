export default {
  AUTH_LOGIN(state, payload) {
    state.loggedUser = payload;
  },

  AUTH_LOGOUT(state) {
    state.loggedUser = null;
  },

  SET_USERS(state, payload) {
    state.users = payload;
  },

  CREATE_USER(state, payload) {
    state.users.push({
      ...payload,
      isActive: true,
    });
    // VUEX 3: mutations cannot return value
  },

  PATCH_USER(state, payload) {
    const {
      id,
      displayName,
      email,
      password,
      role,
    } = payload;

    const userIndex = state.users.findIndex((user) => user.id === id);

    if (userIndex >= 0) {
      const user = state.users[userIndex];
      user.displayName = displayName;
      user.email = email;
      user.role = role;
      (!!password) && (user.password = password);
    } else {
      throw new Error('User is not found.');
    }
    // VUEX 3: mutations cannot return value
  },

  DELETE_USER(state, payload) {
    const { userId } = payload;
    const userIndex = state.users.findIndex((user) => user.id === userId);
    if (userIndex >= 0) {
      state.users.splice([userIndex], 1);
    } else {
      throw new Error('User is not found.');
    }
  },

  UPDATE_SNACKBAR(state, payload) {
    const { message, variant } = payload;
    let show = false;
    if (message) {
      show = true;
    }
    state.snackbar.variant = variant;
    state.snackbar.message = message;
    state.snackbar.show = show;
  },
};
