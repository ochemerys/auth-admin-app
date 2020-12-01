import Vue from 'vue';
import Router from 'vue-router';

import routes from './routes';
import store from '../store';
// import auth from '../../config/firebase-auth.conf';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes,
});

// --- route guards
router.beforeEach((to, from, next) => {
  // console.log('store state', store.state);
  // console.log('store getters isLoggedIn', store.getters.isLoggedIn);
  // console.log('store getters isLoggedUserAdmin', store.getters.isLoggedUserAdmin);

  // console.log('localeStorage',
  // JSON.parse(localStorage.getItem('Auth:User:<AuthKey>:default')) || {});

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
      next({ name: 'landing' });
    }
    if (to.matched.some((record) => record.meta.isAdmin)) {
      if (!store.getters.isLoggedUserAdmin && to.Name === 'dashboard') {
        next({ name: 'profile' });
      } else {
        next();
      }
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
