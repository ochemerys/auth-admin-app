import Auth from './firebase-auth-lite';

// The multiple options can be seen in the API Reference,
// but only the apiKey is required across all auth flows.
const auth = new Auth({
  apiKey: process.env.VUE_APP_API_KEY,
  redirectUri: process.env.VUE_APP_AUTH_REDIRECT_URL,
});

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
    lastSignInTime: fbUser.lastSignInTime,
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
  async signIn(email, password) {
    // console.log('auth.signIn', auth.signIn);
    // console.log('auth.user', auth.user);
    await auth.signIn(email, password);
    const authUserId = auth.user.localId;
    // console.log('auth.user', auth.user);
    const loggedUserResp = await auth.authorizedRequest(`${baseUrl}/users/${authUserId}`);
    const fbUser = (await loggedUserResp.json()).user;
    const loggedUser = mapResponseUser(fbUser);
    // console.log('loggedUser', loggedUser);
    return loggedUser;
  },
  async signOut() {
    await auth.signOut();
  },
  async changePasswordRequest(userEmail) {
    await auth.sendOobCode('PASSWORD_RESET', userEmail);
  },
  async verifyEmailRequest(userEmail) {
    await auth.sendOobCode('VERIFY_EMAIL', userEmail);
  },
  async getAllUsers() {
    const users = [];
    const resp = await auth.authorizedRequest(`${baseUrl}/users`);
    const fbUsers = (await resp.json()).users;
    fbUsers.forEach((usr) => {
      users.push(mapResponseUser(usr));
    });
    return users;
  },
  async patchUser(id, displayName, email, role) {
    const respOnPatch = await auth.authorizedRequest(`${baseUrl}/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(mapRequestUser({
        displayName, email, role,
      })),
    });
    const respJson = await respOnPatch.json();
    return respJson.user;
  },
  async createUser(postedUser) {
    const respOnCreate = await auth.authorizedRequest(`${baseUrl}/users`, {
      method: 'POST',
      body: JSON.stringify(postedUser),
    });
    const { uid } = await respOnCreate.json();
    return { id: uid, ...postedUser };
  },
  async deleteUser(id) {
    await auth.authorizedRequest(`${baseUrl}/users/${id}`, {
      method: 'DELETE',
    });
  },
};
