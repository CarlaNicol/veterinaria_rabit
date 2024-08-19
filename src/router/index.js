import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ClienteView from '../views/cliente/ClienteView'
import MascotaView from '../views/mascota/MascotaView'
import KardexVacunaView from '../views/mascota/KardexVacunaView'
import CitaView from '../views/cita/CitaView'
import LoginView from '../views/LoginView'
import store from '../store/index'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/cliente',
    name: 'cliente',
    component: ClienteView,
    meta: { requiresAuth: true, role: ['admin','secretaria','veterinario'] } 
  },
  {
    path: '/cita',
    name: 'cita',
    component: CitaView,
    meta: { requiresAuth: true, role: ['admin','secretaria'] } 
  },
  {
    path: '/mascota',
    name: 'mascota',
    component: MascotaView,
    meta: { requiresAuth: true, role: ['admin','veterinario'] } 
  },
  {
    path: '/mascota/:id/vacunas',
    name: 'masctaVacunas',
    component: KardexVacunaView,
    meta: { requiresAuth: true, role: ['admin','veterinario'] } 
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {

  if (to.matched.some(record => record.meta.requiresAuth)) {
    const userRole = store.getters.rol;
    console.log('guard', userRole);
    if (to.meta.role.includes(userRole)) {
      next();
    } else {
      next('/login'); // Redirigir a la página de inicio si no tiene permisos
    }
  } else {
    next(); // Asegúrate de llamar a next()
  }
});

export default router
