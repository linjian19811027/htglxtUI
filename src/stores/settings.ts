import { defineStore } from 'pinia'
//import type { System } from '~/pages/system/settings/api'
//import { getSystemList } from '~/pages/system/settings/api'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    name: '后台管理系统',
    description: 'Vitesse Background Management System',
    logo: '/logo.jpg',
    pageSize: 50,
    
  }),
  actions: {
     async getList() {
       try {
        
         ({
           name: this.name,
           logo: this.logo,
           pageSize: this.pageSize,
         })
       } catch {}
     },
  },
})
