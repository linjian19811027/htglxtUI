<script setup lang="ts">
import SidebarItem from './SidebarItem.vue'

const route = useRoute()
const router = useRouter()

const defaultActive = computed(() =>
  route.meta.hidden ? router.resolve(route).matched.at(-2)?.path || route?.path : route?.path,
)
</script>

<template>
  <ElMenu :default-active="defaultActive" b-r-none="!" overflow-auto>
    <SidebarItem v-for="(item, index) in user.sidebarList" :key="index" :route="item" />
  </ElMenu>
</template>

<style scoped>
::v-deep(.el-menu-item.is-active) {
  background: linear-gradient(to left, var(--el-color-primary) 2%, transparent 2%);
  background-color: rgba(var(--el-color-primary-rgb), 5%);
}

.el-menu:not(.el-menu--collapse) {
  width: 200px;
}
</style>
