/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-void */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-return-await */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-return-assign */
// Generates a localStorage adapter.
// It's a bit verbose, but takes less characters than writing it manually.
const storageApi = {};
['set', 'get', 'remove'].forEach((m) => (storageApi[m] = async (k, v) => localStorage[`${m}Item`](k, v)));

export default class Auth {
  constructor({
    apiKey, redirectUri, name = 'default', storage = storageApi,
  } = {}) {
    if (!apiKey) throw Error('The argument "apiKey" is required');

    Object.assign(this, {
      apiKey,
      redirectUri,
      name,
      storage,
      listeners: [],
    });

    this.storage.get(this.sKey('User')).then((user) => {
      this.setState(JSON.parse(user), false);
      if (this.user) {
        this.refreshIdToken()
          .then(() => this.fetchProfile())
          .catch((e) => {
            if (e.message === 'TOKEN_EXPIRED' || e.message === 'INVALID_ID_TOKEN' || e.message === 'USER_NOT_FOUND') return this.signOut();
            throw e;
          });
      }
    });

    // Because this library is also used in React Native, outside the browser as well,
    // we need to check if this environment supports `addEventListener` on the window.
    'addEventListener' in window
&& window.addEventListener('storage', (e) => {
// This code will run if localStorage for this user
// data was updated from a different browser window.
  if (e.key !== this.sKey('User')) return;
  this.setState(JSON.parse(e.newValue), false);
});
  }

  emit() {
    this.listeners.forEach((cb) => cb(this.user));
  }

  listen(cb) {
    this.listeners.push(cb);

    // Return a function to unbind the callback.
    return () => (this.listeners = this.listeners.filter((fn) => fn !== cb));
  }

  sKey(key) {
    return `Auth:${key}:${this.apiKey}:${this.name}`;
  }

  api(endpoint, body) {
    const url = endpoint === 'token'
      ? `https://securetoken.googleapis.com/v1/token?key=${this.apiKey}`
      : `https://identitytoolkit.googleapis.com/v1/accounts:${endpoint}?key=${this.apiKey}`;

    return fetch(url, {
      method: 'POST',
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }).then(async (response) => {
      const data = await response.json();

      // If the response returned an error, try to get a Firebase error code/message.
      // Sometimes the error codes are joined with an explanation, we don't need that(its a bug).
      // So we remove the unnecessary part.
      if (!response.ok) {
        const code = data.error.message.replace(/ ?: [\w ,.'"()]+$/, '');
        throw Error(code);
      }

      // Add a hidden date property to the returned object.
      // Used mostly to calculate the expiration date for tokens.
      Object.defineProperty(data, 'expiresAt', { value: Date.parse(response.headers.get('date')) + 3600 * 1000 });
      return data;
    });
  }

  async enforceAuth() {
    if (!this.user) throw Error('The user must be signed-in to use this method.');
    return this.refreshIdToken(); // Won't do anything if the token is valid.
  }

  async setState(userData, persist = true, emit = true) {
    this.user = userData;
    persist && (await this.storage[userData ? 'set' : 'remove'](this.sKey('User'), JSON.stringify(userData)));
    emit && this.emit();
  }

  signOut() {
    return this.setState(null);
  }

  async refreshIdToken() {
    // If the idToken didn't expire, return.
    if (Date.now() < this.user.tokenManager.expiresAt) return;

    // If the request for a new token was already made, then wait for it and return.
    if (this._ref) return void (await this._ref);

    // If the idToken is expired or the request for a new token was made, then refresh.
    try {
      // Save the promise when this function is called,
      // else we don't make more than one request.
      this._ref = this.api('token', {
        grant_type: 'refresh_token',
        refresh_token: this.user.tokenManager.refreshToken,
      }).then((data) => {
        const tokenManager = {
          idToken: data.id_token,
          refreshToken: data.refresh_token,
          expiresAt: data.expiresAt,
        };
        return this.setState({ ...this.user, tokenManager }, true, false);
      });
      await this._ref;
    } finally {
      this._ref = null;
    }
  }

  async authorizedRequest(resource, init) {
    const request = resource instanceof Request ? resource : new Request(resource, init);

    if (this.user) {
      await this.refreshIdToken(); // Won't do anything if the token didn't expire yet.
      request.headers.set('Authorization', `Bearer ${this.user.tokenManager.idToken}`);
    }

    return fetch(request);
  }

  async signInWithCustomToken(token) {
    // Try to exchange the Auth Code for an idToken and refreshToken.
    // And then get the user profile.
    return await this.fetchProfile(
      await this.api('signInWithCustomToken', {
        token,
        returnSecureToken: true,
      }),
    );
  }

  async signInWithProvider(options) {
    if (!this.redirectUri) {
      throw Error(
        'In order to use an Identity provider, you should initiate the "Auth" instance with a "redirectUri".',
      );
    }

    // The options can be a string, or an object, so here we make sure we extract the right data in each case.
    const {
      provider, oauthScope, context, linkAccount,
    } = typeof options === 'string' ? { provider: options } : options;

    // Make sure the user is logged in when an "account link" was requested.
    linkAccount && (await this.enforceAuth());

    // Get the url and other data necessary for the authentication.
    const { authUri, sessionId } = await this.api('createAuthUri', {
      continueUri: this.redirectUri,
      authFlowType: 'CODE_FLOW',
      providerId: provider,
      oauthScope,
      context,
    });

    // Save the sessionId that we just received in the local storage.
    // Is required to finish the auth flow, I believe this is used to mitigate CSRF attacks.
    // (No docs on this...)
    await this.storage.set(this.sKey('SessionId'), sessionId);
    // Save if this is a fresh log-in or a "link account" request.
    linkAccount && (await this.storage.set(this.sKey('LinkAccount'), true));

    // Finally - redirect the page to the auth endpoint.
    location.assign(authUri);
  }

  async finishProviderSignIn(requestUri = location.href) {
    // Get the sessionId we received before the redirect from storage.
    const sessionId = await this.storage.get(this.sKey('SessionId'));
    // Get the indication if this was a "link account" request.
    const linkAccount = await this.storage.get(this.sKey('LinkAccount'));

    // Check for the edge case in which the user signed-out
    // before completing the linkAccount request.
    if (linkAccount && !this.user) throw Error('Request to "Link account" was made, but user is no longer signed-in');

    await this.storage.remove(this.sKey('LinkAccount'));

    // Try to exchange the Auth Code for an idToken and refreshToken.
    const {
      idToken, refreshToken, expiresAt, context,
    } = await this.api('signInWithIdp', {
      // If this is a "link account" flow, then attach the idToken of the currently signed-in account.
      idToken: linkAccount ? this.user.tokenManager.idToken : undefined,
      requestUri,
      sessionId,
      returnSecureToken: true,
    });

    // Now, get the user profile.
    await this.fetchProfile({ idToken, refreshToken, expiresAt });

    // Remove sensitive data from the URLSearch params in the location bar.
    history.replaceState(null, null, location.origin + location.pathname);

    return context;
  }

  async handleSignInRedirect(options = {}) {
    // OAuth Federated Identity Provider flow.
    if (location.href.match(/[&?]code=/)) return this.finishProviderSignIn();

    // Email sign-in flow.
    if (location.href.match(/[&?]oobCode=/)) {
      const oobCode = location.href.match(/[?&]oobCode=([^&]+)/)[1];
      const email = (options && options.email) || location.href.match(/[?&]email=([^&]+)/)[1];
      const expiresAt = Date.now() + 3600 * 1000;
      const { idToken, refreshToken } = await this.api('signInWithEmailLink', { oobCode, email });

      // Now, get the user profile.
      await this.fetchProfile({ idToken, refreshToken, expiresAt });

      // Remove sensitive data from the URLSearch params in the location bar.
      history.replaceState(null, null, location.origin + location.pathname);
    }
  }

  async signUp(email, password) {
    // Sign up and then retrieve the user profile and persist it in the session.
    return await this.fetchProfile(
      await this.api('signUp', {
        email,
        password,
        returnSecureToken: true,
      }),
    );
  }

  async signIn(email, password) {
    // Sign in and then retrieve the user profile and persist it in the session.
    return await this.fetchProfile(
      await this.api('signInWithPassword', {
        email,
        password,
        returnSecureToken: true,
      }),
    );
  }

  async sendOobCode(requestType, email) {
    const verifyEmail = requestType === 'VERIFY_EMAIL';
    if (verifyEmail) {
      await this.enforceAuth();
      email = this.user.email;
    }

    return void this.api('sendOobCode', {
      idToken: verifyEmail ? this.user.tokenManager.idToken : undefined,
      requestType,
      email,
      continueUrl: `${this.redirectUri}?email=${email}`,
    });
  }

  async resetPassword(oobCode, newPassword) {
    return (await this.api('resetPassword', { oobCode, newPassword })).email;
  }

  async fetchProvidersForEmail(email) {
    const response = await this.api('createAuthUri', { identifier: email, continueUri: location.href });
    delete response.kind;
    return response;
  }

  async fetchProfile(tokenManager = this.user && this.user.tokenManager) {
    if (!tokenManager) await this.enforceAuth();

    const [userData] = (await this.api('lookup', { idToken: tokenManager.idToken })).users;

    delete userData.kind;
    userData.tokenManager = tokenManager;

    await this.setState(userData);
  }

  async updateProfile(newData) {
    await this.enforceAuth();

    // Calculate the expiration date for the idToken.
    const updatedData = await this.api('update', {
      ...newData,
      idToken: this.user.tokenManager.idToken,
      returnSecureToken: true,
    });

    const { idToken, refreshToken, expiresAt } = updatedData;

    if (updatedData.idToken) {
      updatedData.tokenManager = { idToken, refreshToken, expiresAt };
    } else {
      updatedData.tokenManager = this.user.tokenManager;
    }

    delete updatedData.kind;
    delete updatedData.idToken;
    delete updatedData.refreshToken;

    await this.setState(updatedData);
  }

  async deleteAccount() {
    await this.enforceAuth();
    await this.api('delete', `{"idToken": "${this.user.tokenManager.idToken}"}`);
    this.signOut();
  }
}
