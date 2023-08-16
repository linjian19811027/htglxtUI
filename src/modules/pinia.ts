import { createPinia } from 'pinia'
import { type UserModule } from '~/types'
import { createPersistedState } from "pinia-persistedstate-plugin"
// Setup Pinia
// https://pinia.vuejs.org/
export const install: UserModule = ({ isClient, initialState, app,router }) => {
  
  const pinia = createPinia()
  pinia.use(({ store }) => {
    store.router = router
    store.route = router.currentRoute as any
  })
  pinia.use(createPersistedState())
  app.use(pinia)
  // Refer to
  // https://github.com/antfu/vite-ssg/blob/main/README.md#state-serialization
  // for other serialization strategies.
  if (isClient)
    pinia.state.value = (initialState.pinia) || {}

  else
    initialState.pinia = pinia.state.value
}