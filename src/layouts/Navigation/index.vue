<script setup lang="ts">
import UserForm from '~/pages/system/user/components/form.vue'

const props = defineProps<{
  isCollapse: boolean
}>()
const isCollapse = useVModel(props, 'isCollapse')
watch(useBreakpoints({ tablet: 768 }).smaller('tablet'), (val) => {
  isCollapse.value = val
})

const { isFullscreen, toggle } = useFullscreen()
const showMenu = ref(false)

const route = useRoute()
const router = useRouter()
const list = computed(() =>
  router.resolve(route).matched.filter(i => i?.meta.title),
)
</script>

<template>
  <nav flex items-center gap-3 px-3 text-sm>
    <i
      cursor-pointer :class="isCollapse ? 'i-line-md:menu-fold-right' : 'i-line-md:menu-fold-left'"
      @click="isCollapse = !isCollapse"
    />
    <!-- 面包屑 -->
    <el-breadcrumb relative mr-auto>
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item, index) in list" :key="index">
          <router-link :to="item" cursor-pointer="!" font-400="!" @click.stop="tagsView.push(item)">
            {{ item.meta?.title }}
          </router-link>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>

    <!-- <Palette /> -->

    <button text-sm btn :class="isFullscreen ? 'fa6-solid:compress' : 'fa6-solid:expand'" @click="toggle" />

    <el-dropdown>
      <div flex cursor-pointer items-center gap-1>
        <i i-fa6-solid:circle-user mx-1 text-xl text-gray-300 />
        admin
        <i i-fa6-solid:sort-down self-start />
      </div>
      <template #dropdown>
        <!-- <el-dropdown-item mt="!1.5" @click="$router.push('/')">
          控制台
        </el-dropdown-item> -->
        <el-dropdown-item @click="showMenu = true">
          个人设置
        </el-dropdown-item>
        <el-dropdown-item divided mb="!1.5" @click="user.logout()">
          退出登陆
        </el-dropdown-item>
      </template>
    </el-dropdown>
    <el-dialog v-model="showMenu" :close-on-click-modal="false" class="!w-2xl" draggable title="编辑用户">
      <UserForm :user="user.userInfo" @submit="handleUpdate" @cancel="handleCancelEdit" />
    </el-dialog>
    <!-- <UserForm v-if="showMenu" v-model="showMenu" :row="user.userInfo" /> -->
  </nav>
</template>

<style>
/* breadcrumb transition */
.breadcrumb-enter-active {
  transition: all 0.25s;
}

.breadcrumb-enter-from,
.breadcrumb-leave-to {
  opacity: 0;
  transform: translateX(30px) skewX(-50deg);
}
</style>
