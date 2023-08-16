import NProgress from 'nprogress'
import { type UserModule } from '~/types'

export const install: UserModule = ({ isClient, router }) => {
  if (isClient) {
    router.beforeEach((to, from) => {
      // const user = useUserStore()
      // console.log(to)

      // console.log(from)
      // if (!user.token)
      //  user.generateRoutes()
      //
      if (to.path !== from.path)
        NProgress.start()
    })
    router.afterEach(() => {
      NProgress.done()
    })
  }
}
