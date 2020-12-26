// eslint-disable-next-line import/order
import authMock from '../mocks/firebase-auth-lite.mock';
import authProxy from '@/services/firebase-auth-proxy';
import store from '@/store/index';

// mock dependency
authMock();
jest.mock('@/services/firebase-auth-proxy');
const authSigIn = authProxy.signIn;
const authGetAllUsers = authProxy.getAllUsers;
const authPatchUser = authProxy.patchUser;
const authCreateUser = authProxy.createUser;

describe('store actions', () => {
  beforeEach(() => {
    authSigIn.mockReset();
    authGetAllUsers.mockReset();
    authPatchUser.mockReset();
    store.commit('SET_USERS', []);
  });

  describe('AUTH_LOGIN', () => {
    let userEmail;
    let userPassword;
    let loggedUser;
    let users;

    beforeEach(() => {
      userEmail = 'tst@testr.com';
      userPassword = 'password';
      loggedUser = {
        email: userEmail,
        role: '',
      };
      users = [
        { email: 'email1' },
        { email: 'email2' },
      ];
    });

    it('should set loggedUser on dispatch AUTH_LOGIN when user role is "user"', async () => {
      loggedUser.role = 'user';
      authSigIn.mockResolvedValue(loggedUser);

      await store.dispatch('AUTH_LOGIN', { userEmail, userPassword });

      expect(store.state.loggedUser.email).toBe(userEmail);
    });

    it('should users one item as logged user on dispatch AUTH_LOGIN when user role is "user"', async () => {
      loggedUser.role = 'user';
      authSigIn.mockResolvedValue(loggedUser);

      await store.dispatch('AUTH_LOGIN', { userEmail, userPassword });

      expect(store.state.users.length).toBe(1);
      expect(store.state.users[0].email).toBe('tst@testr.com');
    });

    it('should not call getAllUsers on dispatch AUTH_LOGIN when user role is "user"', async () => {
      loggedUser.role = 'user';
      authSigIn.mockResolvedValue(loggedUser);

      await store.dispatch('AUTH_LOGIN', { userEmail, userPassword });

      expect(authGetAllUsers).not.toHaveBeenCalled();
    });

    it('should set loggedUser on dispatch AUTH_LOGIN when user role is "admin"', async () => {
      loggedUser.role = 'admin';
      authSigIn.mockResolvedValue(loggedUser);

      await store.dispatch('AUTH_LOGIN', { userEmail, userPassword });

      expect(store.state.loggedUser.email).toBe(userEmail);
    });

    it('should set users collection on dispatch AUTH_LOGIN when user role is "admin"', async () => {
      loggedUser.role = 'admin';
      authSigIn.mockResolvedValue(loggedUser);
      authGetAllUsers.mockResolvedValue(users);

      await store.dispatch('AUTH_LOGIN', { userEmail, userPassword });

      expect(store.state.users.length).toBe(2);
    });

    it('should call getAllUsers on dispatch AUTH_LOGIN when user role is "admin"', async () => {
      loggedUser.role = 'admin';
      authSigIn.mockResolvedValue(loggedUser);

      await store.dispatch('AUTH_LOGIN', { userEmail, userPassword });

      expect(authGetAllUsers).toHaveBeenCalledTimes(1);
    });
  });

  describe('AUTH_LOGOUT', () => {
    it('should remove loggedUser and users collection on dispatch AUTH_LOGOUT', async () => {
      await store.dispatch('AUTH_LOGOUT');

      expect(store.state.loggedUser).toBe(null);
      expect(store.state.users.length).toBe(0);
    });
  });

  describe('PATCH_USER', () => {
    let users;
    let patchedUser;

    beforeEach(() => {
      patchedUser = {
        id: '123',
        displayName: 'Patched Name',
        email: 'patched@email.com',
        role: 'user',
      };
      users = [
        {
          id: '122', email: 'email1', displayName: 'Name', role: 'admin',
        },
        {
          id: '123', email: 'email2', displayName: 'Name', role: 'admin',
        },
        {
          id: '124', email: 'email1', displayName: 'Name', role: 'admin',
        },
      ];
    });

    it('should update the user on dispatch PATCH_USER', async () => {
      store.commit('SET_USERS', users);
      authPatchUser.mockResolvedValue(patchedUser);

      await store.dispatch('PATCH_USER', patchedUser);

      // it should patch second user in collection (matching id)
      expect(store.state.users[1].email).toBe(patchedUser.email);
      expect(store.state.users[1].displayName).toBe(patchedUser.displayName);
      expect(store.state.users[1].role).toBe(patchedUser.role);
    });
  });

  describe('CREATE_USER', () => {
    let newUser;

    beforeEach(() => {
      newUser = {
        id: null,
        displayName: 'New Name',
        email: 'new@email.com',
        role: 'admin',
      };
    });

    it('should update the user on dispatch CREATE_USER', async () => {
      const newId = '234';
      const createdUser = { id: newId, ...newUser };
      authCreateUser.mockResolvedValue(newId);

      await store.dispatch('CREATE_USER', newUser);

      // it should patch first user in collection (before id was empty)
      expect(store.state.users[0].id).toBe(createdUser.id);
      expect(store.state.users[0].email).toBe(createdUser.email);
      expect(store.state.users[0].displayName).toBe(createdUser.displayName);
      expect(store.state.users[0].role).toBe(createdUser.role);
    });
  });
  describe('DELETE_USER', () => {
    let users;

    beforeEach(() => {
      users = [
        {
          id: '122', email: 'email1', displayName: 'Name', role: 'admin',
        },
        {
          id: '123', email: 'email2', displayName: 'Name', role: 'admin',
        },
        {
          id: '124', email: 'email1', displayName: 'Name', role: 'admin',
        },
      ];
    });

    it('should update the user on dispatch DELETE_USER', async () => {
      store.commit('SET_USERS', users);
      const userId = '123';
      authPatchUser.mockResolvedValue({ userId });

      await store.dispatch('DELETE_USER', { userId });

      expect(store.state.users.length).toBe(2);
      expect(store.state.users[0].id).not.toBe(userId);
      expect(store.state.users[1].id).not.toBe(userId);
    });
  });
});
