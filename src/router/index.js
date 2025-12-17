import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('../views/admin/Dashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/tables',
    name: 'AdminTables',
    component: () => import('../views/admin/Tables.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/menu',
    name: 'AdminMenu',
    component: () => import('../views/admin/Menu.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/bookings',
    name: 'AdminBookings',
    component: () => import('../views/admin/Bookings.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/user/hall-map',
    name: 'HallMap',
    component: () => import('../views/user/HallMap.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/user/booking/:tableId',
    name: 'Booking',
    component: () => import('../views/user/Booking.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/user/order/:bookingId',
    name: 'Order',
    component: () => import('../views/user/Order.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/user/my-bookings',
    name: 'MyBookings',
    component: () => import('../views/user/MyBookings.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/user/edit-booking/:bookingId',
    name: 'EditBooking',
    component: () => import('../views/user/EditBooking.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresAdmin && authStore.user.role !== 'admin') {
    next('/');
  } else {
    next();
  }
});

export default router;
