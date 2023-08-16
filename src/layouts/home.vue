<script setup lang="ts">
import Sidebar from './Sidebar/index.vue'
import Navigation from './Navigation/index.vue'
import TagsView from './TagsView/index.vue'

const router = useRouter()
const isCollapse = $ref(false)

if (!localStorage.getItem('token') || localStorage.getItem('token') === '')

  router.push('/login')

//  useUserStore().logout()
</script>

<template>
  <div text="gray-700 dark:gray-200" h-screen flex>
    <aside
      flex="~ col"
      b="0 r-1 r-zinc-200 dark:r-zinc-700"
      z-3
      row-span-2
      shadow-md
    >
      <header
        z-1
        h-12
        flex
        cursor-pointer
        items-center
        px-3
        shadow-sm
        @click="$router.push('/')"
      >
        <img :src="settings.logo" mx-1 w-8>
        <div relative overflow-hidden>
          <transition
            enter-active-class="absolute"
            :duration="300"
            leave-active-class="absolute"
          >
            <h1 v-if="!isCollapse" ml-1 text-primary>
              {{ settings.name }}
            </h1>
          </transition>
        </div>
      </header>
      <Sidebar row-span-2 flex-1 :collapse="isCollapse" />
    </aside>

    <main grid="~ rows-[3rem_34px_auto]" relative flex-1 overflow-x-hidden>
      <Navigation v-model:isCollapse="isCollapse" />
      <TagsView />
      <!-- TagsView 会引发这个错误 Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead
       -->
      <RouterView v-slot="{ Component, route }">
        <Transition mode="out-in" name="main" appear>
          <KeepAlive :include="tagsView.cachedViews" :max="20">
            <component :is="Component" :key="route.path" />
          </KeepAlive>
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
.main-leave-active,
.main-enter-active {
  position: absolute;
  top: 82px;
  right: 0;
  bottom: 0;
  left: 0;
  transition: 0.15s;
}

.main-enter-active {
  transition: 0.2s;
}

.main-enter-from {
  margin-left: -20px;
  opacity: 0;
}

.main-leave-to {
  margin-left: 20px;
  opacity: 0;
}
</style>
