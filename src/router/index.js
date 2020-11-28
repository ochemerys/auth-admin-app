import Vue from 'vue';
import Router from 'vue-router';

import routes from './routes';
// import store from '../store';
// import auth from '../../config/firebase-auth.conf';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes,
});

// --- route guards
// router.beforeEach((to, from, next) => {
//   console.log('router - auth.user', store.state);
//   console.log('router.beforeEach::to , from', to, from);
//   next();
// //   if (to.matched.some((record) => record.meta.requiresAuth)) {
// //     if (!self.$store.getters.isLoggedIn) {
// //       next({
// //         path: '/',
// //         params: { nextUrl: to.fullPath },
// //       });
// //     } else if (to.matched.some((record) => record.meta.isAdmin)) {
// //       if (self.$store.getters.isLoggedUserAdmin) {
// //         next();
// //       } else {
// //         next({ name: 'profile' });
// //       }
// //     } else {
// //       next();
// //     }
// //   } else if (to.matched.some((record) => record.meta.guest)) {
// //     if (!self.$store.getters.isLoggedIn) {
// //       next();
// //     } else {
// //       next({ name: 'profile' });
// //     }
// //   } else {
// //     next();
// //   }
// });

export default router;
