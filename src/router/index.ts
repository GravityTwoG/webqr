import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Scan from '../views/ScanQR.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Scan',
    component: Scan,
  },
  {
    path: '/create',
    name: 'Create',
    // route level code-splitting
    // this generates a separate chunk (create.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "create" */ '../views/CreateQR.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
