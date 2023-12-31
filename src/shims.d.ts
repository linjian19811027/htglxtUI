import 'pinia'
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'


declare interface Window {
  // extend the window
}

// with vite-plugin-vue-markdown, markdown files can be treated as Vue components
declare module '*.md' {
  import { type DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.vue' {
  import { type DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-router' {
  interface RouteMeta {
    // is optional
    hidden?: boolean
    permission?: string | boolean | RouteMeta[]
    title?: string
    icon?: string
    order?: number
  }
}

declare module "pinia" {
  export interface PiniaCustomProperties {
        router: Router;//在modules的pinia里面做的初始化
        route: RouteLocationNormalizedLoaded
  }
}
