import { createRouter, createWebHistory } from 'vue-router'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import ControlPannelRoot from '../views/ControlPannelRoot.vue'
import ControlPannelUser from '../views/ControlPannelUser.vue'
import RestartDatabase from '../views/RestartDatabase.vue'
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register    
  },
  {
    path: '/ControlPannelRoot',
    name: 'ControlPannelRoot',
    component: ControlPannelRoot 
  },
  {
    path: '/controlPannelUser',
    name: 'ControlPannelUser',
    component: ControlPannelUser
  },
  {
    path: '/restartDatabase',
    name: 'RestartDatabase',
    component: RestartDatabase
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
