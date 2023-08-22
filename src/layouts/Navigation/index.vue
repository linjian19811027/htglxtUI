<script setup lang="ts">
import UserForm from '~/pages/system/user/components/form.vue'
import ChangePassword from '~/pages/system/user/components/changePassword.vue'

const props = defineProps<{
  isCollapse: boolean
}>()
const isCollapse = useVModel(props, 'isCollapse')
watch(useBreakpoints({ tablet: 768 }).smaller('tablet'), (val) => {
  isCollapse.value = val
})

const { isFullscreen, toggle } = useFullscreen()
const showMenu = ref(false)
const showPaw = ref(false)
function handleUpdate() {
  showMenu.value = false
}
function handleCancelEdit() {
  showMenu.value = false
}
function handlePwa() {
  showPaw.value = false
}
function handleCancelPwa() {
  showPaw.value = false
}
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
    <button i-fa6-solid:sun dark:i-fa6-solid-moon text-sm btn v-bind="$attrs" @click="toggleDark()" />

    <button text-sm btn :class="isFullscreen ? 'fa6-solid:compress' : 'fa6-solid:expand'" @click="toggle" />

    <el-dropdown>
      <div flex cursor-pointer items-center gap-1>
        <i i-fa6-solid:circle-user mx-1 text-xl text-gray-300 />
        {{ user.userInfo.username }}
        <i i-fa6-solid:sort-down self-start />
      </div>
      <template #dropdown>
        <!-- <el-dropdown-item mt="!1.5" @click="$router.push('/')">
          控制台
        </el-dropdown-item> -->
        <!-- <el-dropdown-item @click="showMenu = true">
          个人设置
        </el-dropdown-item> -->
        <el-dropdown-item @click="showPaw = true">
          修改密码
        </el-dropdown-item>
        <el-dropdown-item divided mb="!1.5" @click="user.logout()">
          退出登陆
        </el-dropdown-item>
      </template>
    </el-dropdown>
    <el-dialog v-model="showMenu" :close-on-click-modal="false" class="!w-2xl" draggable title="编辑用户">
      <UserForm :user="user.userInfo" @submit="handleUpdate" @cancel="handleCancelEdit" />
    </el-dialog>

    <el-dialog v-model="showPaw" :close-on-click-modal="false" class="!w-2xl" draggable title="修改密码">
      <ChangePassword :user="user.userInfo" @submit="handlePwa" @cancel="handleCancelPwa" />
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
