import Auth from 'firebase-auth-lite';

// The multiple options can be seen in the API Reference,
// but only the apiKey is required across all auth flows.
const auth = new Auth({
  apiKey: process.env.VUE_APP_API_KEY,
  redirectUri: process.env.VUE_APP_AUTH_REDIRECT_URL,
});

export default auth;
