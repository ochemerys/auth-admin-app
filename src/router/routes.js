import Landing from '@/views/Landing.vue';

export default [
  {
    path: '/',
    name: 'landing',
    component: Landing,
  },
  {
    path: '/login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // comment /* webpackChunkName: "login" */ is responible proper naming of related chunk
    // which is lazy-loaded when the route is visited.
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
    meta: {
      guest: true,
    },
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import(/* webpackChunkName: "logout" */ '@/views/Logout.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
    meta: {
      requiresAuth: true,
      isAdmin: true,
    },
  },
  {
    path: '/profile/:id?',
    name: 'profile',
    component: () => import(/* webpackChunkName: "user-details" */ '@/views/UserDetails.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '*',
    name: 'notFound',
    component: () => import(/* webpackChunkName: "not-found" */'@/views/NotFound.vue'),
    meta: {
      title: '404 (Page Not Found)',
    },
  },
];
