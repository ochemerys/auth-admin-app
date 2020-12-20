import store from '@/store/index';

jest.mock('../../../src/firebase-auth.conf', () => ({
  __esModule: true,
}));

describe('store mutations', () => {
  it('should successfully set loggedUser on commit AUTH_LOGIN', () => {
    const loggedUser = { id: 'tst', displayName: 'test user' };
    store.commit('AUTH_LOGIN', loggedUser);
    expect(store.state.loggedUser).toBe(loggedUser);
  });

  it('should successfully remove loggedUser on commit AUTH_LOGOUT', () => {
    store.state.loggedUser = { id: 'tst', displayName: 'test user' };
    store.commit('AUTH_LOGOUT');
    expect(store.state.loggedUser).toBe(null);
  });

  it('should successfully set users on commit SET_USERS', () => {
    const users = [{ id: 'tst', displayName: 'test user' }];
    store.commit('SET_USERS', users);
    expect(store.state.users).toBe(users);
  });

  it('should successfully add new user on commit CREATE_USER', () => {
    store.state.users = [{ id: 'tst1', displayName: 'test user 1' }];
    const user = { id: 'tst2', displayName: 'test user 2' };
    store.commit('CREATE_USER', user);
    const createdUser = store.state.users.find((u) => u.id === user.id);

    expect(createdUser.id).toBe(user.id);
  });

  it('should successfully update user on commit PATCH_USER when user exists in state user collection', () => {
    store.state.users = [{ id: 'tst1', displayName: 'test user 1' }];
    const user = { id: 'tst1', displayName: 'test user 2 updated' };
    store.commit('PATCH_USER', user);
    const patchedUser = store.state.users.find((u) => u.id === user.id);

    expect(patchedUser.displayName).toBe(user.displayName);
  });

  it('should throw error on commit PATCH_USER when user does not exists in state user collection', () => {
    store.state.users = [{ id: 'tst1', displayName: 'test user 1' }];
    const user = { id: 'wrong', displayName: 'test user 2 updated' };

    expect(() => {
      store.commit('PATCH_USER', user);
    }).toThrow('User is not found.');
  });

  it('should successfully delete user on commit DELETE_USER when user exists in state user collection', () => {
    store.state.users = [{ id: 'tst1', displayName: 'test user 1' }];
    const user = { userId: 'tst1' };
    store.commit('DELETE_USER', user);

    expect(store.state.users.length).toBe(0);
  });

  it('should throw error on commit DELETE_USER when user does not exists in state user collection', () => {
    store.state.users = [{ id: 'tst1', displayName: 'test user 1' }];
    const user = { userId: 'wrong' };

    expect(() => {
      store.commit('DELETE_USER', user);
    }).toThrow('User is not found.');
  });

  it('should set property show to "false" on commit UPDATE_SNACKBAR when message is empty', () => {
    const sb = { message: '', variant: '' };
    store.commit('UPDATE_SNACKBAR', sb);

    expect(store.state.snackbar.show).toBe(false);
  });

  it('should set property show to "true" on commit UPDATE_SNACKBAR when message is not empty', () => {
    const sb = { message: 'test message', variant: 'info' };
    store.commit('UPDATE_SNACKBAR', sb);

    expect(store.state.snackbar.show).toBe(true);
    expect(store.state.snackbar.message).toBe(sb.message);
  });
});
