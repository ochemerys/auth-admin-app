export default {
  AUTH_LOGIN(state, payload) {
    state.loggedUser = payload;
  },
  AUTH_LOGOUT(state) {
    state.loggedUser = null;
  },
  GET_USERS(state, payload) {
    state.users = payload;
  },
  PATCH_USER(state, payload) {
    const {
      id,
      displayName,
      email,
      password,
      role,
    } = payload;

    // console.log('mutations PATCH_USER: id', id);
    // console.log('mutations PATCH_USER: state.users', state.users);

    const userIndex = state.users.findIndex((user) => user.id === id);

    // console.log('mutations PATCH_USER: userIndex', userIndex);
    if (userIndex >= 0) {
      const user = state.users[userIndex];
      user.displayName = displayName;
      user.email = email;
      user.role = role;
      (!!password) && (user.password = password);
    } else {
      throw new Error('User is not found.');
    }
    return state.users.findIndex((user) => user.id === id);
  },
  CREATE_USER(state, payload) {
    console.log('CREATE_USER', payload);

    state.users.push({
      ...payload,
      isActive: true,
    });

    return state.users.findIndex((user) => user.id === payload.id);
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
