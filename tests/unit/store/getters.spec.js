import store from '@/store/index';

jest.mock('../../../src/services/firebase-auth-proxy', () => ({
  __esModule: true,
}));

describe('store getters', () => {
  describe('isLoggedIn', () => {
    it('should return "false" when logged user does not exist', () => {
      expect(store.getters.isLoggedIn).toBe(false);
    });
    it('should return "false" when logged user exists but time is expired', () => {
      const loggedTime = new Date();
      loggedTime.setTime(loggedTime.getTime() - 1.5 * 60 * 60 * 1000);
      store.state.loggedUser = {
        id: 'tst1',
        lastSignInTime: loggedTime,
      };
      expect(store.getters.isLoggedIn).toBe(false);
    });
    it('should return "true" when logged user exists but time is not expired', () => {
      const loggedTime = new Date();
      loggedTime.setTime(loggedTime.getTime() - 0.5 * 60 * 60 * 1000);
      store.state.loggedUser = {
        id: 'tst1',
        lastSignInTime: loggedTime,
      };
      expect(store.getters.isLoggedIn).toBe(true);
    });
  });
  describe('loggedUserEmail', () => {
    it('should return loggedUser email if user exists', () => {
      const userEmail = 'tst@test.com';
      store.state.loggedUser = {
        id: 'tst1',
        email: userEmail,
      };
      expect(store.getters.loggedUserEmail).toBe(userEmail);
    });
  });
  describe('loggedUserName', () => {
    it('should return loggedUser displayName if user exists', () => {
      const userName = 'Test Tester';
      store.state.loggedUser = {
        id: 'tst1',
        displayName: userName,
      };
      expect(store.getters.loggedUserName).toBe(userName);
    });
  });
  describe('loggedUserId', () => {
    it('should return loggedUser id if user exists', () => {
      const userId = 'tst1';
      store.state.loggedUser = {
        id: userId,
      };
      expect(store.getters.loggedUserId).toBe(userId);
    });
  });
  describe('activeUsers', () => {
    it('should return array of active users', () => {
      const activeUserId = 'tst2';
      store.state.users = [
        { id: 'tst1' },
        { id: activeUserId, isActive: true },
        { id: 'tst3', isActive: false },
      ];
      expect(store.getters.activeUsers.length).toBe(1);
      expect(store.getters.activeUsers[0].id).toBe(activeUserId);
    });
  });
  describe('isLoggedUserAdmin', () => {
    it('should return "false" when logged user does not exist', () => {
      expect(store.getters.isLoggedUserAdmin).toBe(false);
    });
    it('should return "true" when logged user with role "admin" exists', () => {
      store.state.loggedUser = {
        id: 'tst1',
        role: 'admin',
      };
      expect(store.getters.isLoggedUserAdmin).toBe(true);
    });
  });
});
