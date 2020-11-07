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
    // which is lazy-loaded when the route is visited.
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Login.vue'),
    meta: {
      guest: true,
    },
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import('@/views/Logout.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      requiresAuth: true,
      isAdmin: true,
    },
  },
  {
    path: '/profile/:id?',
    name: 'profile',
    component: () => import('@/views/UserDetails.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '*',
    name: 'notFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '404 (Page Not Found)',
    },
  },
];
