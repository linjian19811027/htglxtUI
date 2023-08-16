import { useUserStore } from '~/stores/user'

export const install: UserModule = ({ app, router, isClient }) => {
// export default (_: any, { router }: { router: Router }) => {
  router.beforeEach(async (to) => {
    // Obtaining System Settings
    const settings = useSettingsStore()

    const user = useUserStore()
    if (!user.token) {
      // Pages that can be accessed without logging in
      // if (to.meta?.permission === false)
      return
      // return { name: 'login', query: { redirect: to.fullPath } }
    }

    // if (!user.userInfo.permissions) {
    await user.generateRoutes()
    //  return to.fullPath
    // }

    // if (to.name === 'login')
    //   return '/'

    // keep-alive
    if (to.matched?.length > 2)
      to.matched.splice(1, to.matched.length - 2)
  })
}
