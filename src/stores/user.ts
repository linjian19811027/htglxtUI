import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import routes from '~pages'

function filterAsyncRoutes(routes: RouteRecordRaw[], permissions: any) {
  return routes.reduce((result: RouteRecordRaw[], route) => {
    result.push({
      ...route,
      children: route.children ? filterAsyncRoutes(route.children, permissions) : [],
    })
    return result
  }, [])
}

export const useUserStore = defineStore('main', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    routeList: [] as RouteRecordRaw[],
    removeRouteList: [] as Function[],
    userInfo: '',
  }),

  getters: {
    sidebarList() {
      const getSidebarList = (routes: RouteRecordRaw[]) => routes
        .reduce((result: RouteRecordRaw[], route) => {
          // debugger
          if (route.path == '/') {
            result.push({
              ...route,
              path: this.router.resolve(<string>route.redirect || route).path,
              children: route.children ? getSidebarList(route.children) : [],
            })
          }
          else {
            if (!route.meta?.hidden && this.userInfo.sysPermissions.find(obj => obj.url == route.path)) {
              result.push({
                ...route,
                path: this.router.resolve(<string>route.redirect || route).path,
                children: route.children ? getSidebarList(route.children) : [],
              })
            }
          }
          return result
        }, [])
        .sort((a, b) => (a.meta?.order || Number.POSITIVE_INFINITY) - (b.meta?.order || Number.POSITIVE_INFINITY))

      const result = getSidebarList(this.routeList)
      return result
    },
  },
  actions: {
    async logout() {
      localStorage.setItem('token', '')
      localStorage.setItem('visitedViews', '')
      localStorage.setItem('userInfo', '')
      if (this.route.name !== 'login')
        await this.router.push('/login')

      this.removeRouteList.forEach(i => i())
      localStorage.clear()
    },

    async generateRoutes() {
      // localStorage.setItem('visitedViews','[]')
      const permissions = ['sys:menu:list', 'sys:log:list']
      // this.removeRouteList.forEach(i => i())// 会出现i is not a function
      if (localStorage.getItem('userInfo') && localStorage.getItem('userInfo') !== '')
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
      this.routeList = filterAsyncRoutes(routes, permissions)// 把两个list过滤掉了，把别的反而剩下了
      // this.removeRouteList = this.routeList.map(this.router.addRoute)
    },
  },
})
