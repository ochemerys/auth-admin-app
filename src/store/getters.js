export default {
  isLoggedIn(state) {
    return !!state.loggedUser && !!state.loggedUser.id;
  },
  loggedUserEmail(state) {
    return state.loggedUser ? state.loggedUser.email : '';
  },
  loggedUserName(state) {
    return state.loggedUser ? state.loggedUser.displayName : '';
  },
  loggedUserId(state) {
    return state.loggedUser ? state.loggedUser.id : '';
  },
  activeUsers(state) {
    return state.users ? state.users.filter((user) => user.isActive === true) : [];
  },
  isLoggedUserAdmin(state) {
    return !!state.loggedUser && state.loggedUser.role === 'admin';
  },
};
