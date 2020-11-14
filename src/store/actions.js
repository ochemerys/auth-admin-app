import auth from '../firebase-auth.conf';

const baseUrl = process.env.VUE_APP_API_BASE_URL;

function mapResponseUser(fbUser) {
  const rootEmail = process.env.VUE_APP_ROOT_USER_EMAIL;
  const isRoot = fbUser.email === rootEmail;
  const user = {
    id: fbUser.uid,
    displayName: isRoot ? 'root' : fbUser.displayName,
    email: fbUser.email,
    role: isRoot ? 'admin' : fbUser.role || 'user',
    isActive: true,
  };
  return user;
}

function mapRequestUser(uiUser) {
  const user = {};

  if (uiUser.displayName) {
    user.displayName = uiUser.displayName;
  }
  if (uiUser.email) {
    user.email = uiUser.email;
  }
  if (uiUser.role) {
    user.role = uiUser.role;
  }
  if (uiUser.password) {
    user.password = uiUser.password;
  }

  return user;
}

export default {
  async AUTH_LOGIN(context, payload) {
    const { email, password } = payload;
    let loggedUser = null;
    try {
      await auth.signIn(email, password);
      const authUserId = auth.user.localId;

      const loggedUserResp = await auth.authorizedRequest(`${baseUrl}/users/${authUserId}`);
      // console.log('loggedUserResp.status', loggedUserResp.status);
      const fbUser = (await loggedUserResp.json()).user;
      loggedUser = mapResponseUser(fbUser);

      context.commit('AUTH_LOGIN', loggedUser);

      const users = [];
      if (loggedUser.role === 'user') {
        users.push(loggedUser);
      } else {
        const resp = await auth.authorizedRequest(`${baseUrl}/users`);
        console.log('resp.status', resp.status);
        const fbUsers = (await resp.json()).users;
        fbUsers.forEach((usr) => {
          users.push(mapResponseUser(usr));
        });
      }

      context.commit('GET_USERS', users);
    } catch (err) {
      console.log('ERR', err);
    }
    return loggedUser;
  },
  async AUTH_LOGOUT({ commit }) {
    await auth.signOut();
    commit('AUTH_LOGOUT');
    commit('GET_USERS', []);
  },
  async PATCH_USER({ commit }, payload) {
    const {
      id, displayName, password, email, role,
    } = payload;
    let user = null;

    try {
      const respOnPatch = await auth.authorizedRequest(`${baseUrl}/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(mapRequestUser({
          displayName, password, email, role,
        })),
      });
      // console.log('respOnPatch', respOnPatch);
      // console.log('text', await respOnPatch.text());
      const json = await respOnPatch.json();
      // console.log('json', json);
      const fbUser = json.user;
      // console.log('fbUser', fbUser);
      // console.log('mapResponseUser(fbUser)', mapResponseUser(fbUser));
      user = commit('PATCH_USER', mapResponseUser(fbUser));
    } catch (err) {
      console.log('ERR', err);
    }
    return user;
  },
  async CREATE_USER({ commit }, payload) {
    let user = null;
    try {
      const respOnCreate = await auth.authorizedRequest(`${baseUrl}/users`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const { uid } = await respOnCreate.json();
      console.log('uid', uid);

      user = commit('CREATE_USER', { id: uid, ...payload });
    } catch (err) {
      console.log('ERR', err);
    }
    return user;
  },
  async DELETE_USER({ commit }, payload) {
    const { userId } = payload;
    console.log('userId', userId);
    try {
      await auth.authorizedRequest(`${baseUrl}/users/${userId}`, {
        method: 'DELETE',
      });
      commit('DELETE_USER', payload);
    } catch (err) {
      console.log('ERR', err);
    }
  },
};
