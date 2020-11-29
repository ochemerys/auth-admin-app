export default {
  isLoggedIn(state) {
    let isValidToken = false;
    const currentDateTime = new Date();
    if (state.loggedUser && state.loggedUser) {
      const tokenLifespanMinutes = 30; // move to .env
      const expiredDateTime = new Date(state.loggedUser.lastSignInTime);
      expiredDateTime.setMinutes(expiredDateTime.getMinutes() + tokenLifespanMinutes);
      isValidToken = expiredDateTime > currentDateTime;
    }

    return !!state.loggedUser
      && !!state.loggedUser.id
      && isValidToken;
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
