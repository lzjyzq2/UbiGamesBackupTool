import { createRouter, createWebHistory } from 'vue-router'

import Layout from '@/components/layout.vue'
import Home from '@/pages/home/index.vue'
import Backup from '@/pages/home/backup/index.vue'
import Restore from '@/pages/home/restore/index.vue'
import Settings from '@/pages/settings/index.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    children:[
      {
        path: '/',
        component: Home,
        children:[
          {
            path: '/',
            component: Backup,
          },
          {
            path: '/restore',
            component: Restore,
          }
        ]
      },
      {
        path: '/settings',
        component: Settings
      }
    ]
  },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router