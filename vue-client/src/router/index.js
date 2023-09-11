import { createRouter, createWebHistory } from 'vue-router'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import ControlPannelRoot from '../views/ControlPannelRoot.vue'
import GetProxmoxVMs from '../components/GetProxmoxVMs'
import Dashboard from '../components/Dashboard'
import GetUsuaris from '../components/GetUsuaris'
import GetSubjects from '../components/GetSubjects'
import GetGroups from '../components/GetGroups'
import ControlPannelUser from '../views/ControlPannelUser.vue'
import notFound404 from '../views/notFound404.vue'
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
    component: ControlPannelRoot,
    children: [
      {
        name: "dashboardOnLogin",
        path: '',
        component: Dashboard,
      },
      {
        name: "dashboard",
        path: 'dashboard',
        component: Dashboard,
      },
      {
        // UserProfile will be rendered inside User's <router-view>
        // when /user/:id/profile is matched
        path: 'proxmox',
        component: GetProxmoxVMs,
      },
      {
        // UserProfile will be rendered inside User's <router-view>
        // when /user/:id/profile is matched
        path: 'grups',
        component: GetGroups,
      },
      {
        // UserPosts will be rendered inside User's <router-view>
        // when /user/:id/posts is matched
        path: 'usuaris',
        component: GetUsuaris,
      },
      {
        // UserPosts will be rendered inside User's <router-view>
        // when /user/:id/posts is matched
        path: 'assignatures',
        component: GetSubjects,
      },
    ],
  },
  {
    path: '/controlPannelUser',
    name: 'ControlPannelUser',
    component: ControlPannelUser
  },
  {
    path: '/:catchAll(.*)',
    name: 'notFOund',
    component: notFound404
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
