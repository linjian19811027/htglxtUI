<script setup lang="ts">
import type { RouteLocation } from 'vue-router'
import draggable from 'vuedraggable-es'
import ScrollPane from './ScrollPane.vue'

const route = useRoute()
const router = useRouter()

const tagTitle = (tag = route) =>
  `${tag.meta.title || ''}${tag.query?.pageTitle ? ` : ${tag.query?.pageTitle}` : ''}`
useTitle(computed(tagTitle), { titleTemplate: `%s | ${settings.name}` })

watch(() => route.fullPath, () => {
  tagsView.addView(route)
  moveToCurrentTag()
}, { immediate: true })

const tags = $shallowRef<{ to: RouteLocation }[]>([])
const scrollPaneRef = $shallowRef<any>()
async function moveToCurrentTag() {
  await nextTick()
  if (!tags.length)
    return
  const tag = tags.find((i: any) => i.to?.path === route.path)
  if (tag)
    scrollPaneRef?.moveToTarget(tag)
}

function toLastView() {
  const latestView = tagsView.visitedViews.slice(-1)[0]
  if (latestView)
    router.push(latestView)
  else
    router.push('/')
}

const isActive = $computed(() =>
  (tag: RouteLocation) => tag.path === route.path,
)

function closeTag(view = route) {
  tagsView.dropView(view)

  if (isActive(view))
    toLastView()
}

function closeOthersTags(view = route) {
  tagsView.delOthersViews(view)
  if (view !== route)
    router.push(view)
}

function closeAllTags() {
  tagsView.delOthersViews()

  toLastView()
}

const selectedTag = $ref<any>()
let show = $ref(false)

const menuRef = ref()
onClickOutside(menuRef, (event: any) => {
  if (event.type === 'click')
    selectedTag && show && (show = false)
})
</script>

<template>
  <div px-1 bg="gray-200 !dark:(zinc-700 opacity-60)" overflow-hidden relative flex flex-nowrap z-2>
    <ScrollPane ref="scrollPaneRef" :tag-list="tags">
      <draggable
        v-model="tagsView.visitedViews"
        item-key="path"
        animation="200"
        class="flex gap-1 px-2.5 flex-1"
      >
        <template #item="{ element: tag, index: i }">
          <span
            :ref="(val:any) => { if (val){ val.to = tag;tags[i] = val } }"
            :class="{ active: isActive(tag) }"
            class="tab-item group"
            @click="tagsView.push(tag)"
            @contextmenu.prevent="selectedTag = tags[i];show = true"
          >
            <span class="split" absolute left="-6px" z="-1" text-gray-400>｜</span>
            <div v-show="isActive(tag)" absolute left="3" h-2 w-2 rounded-full mr="1.5" bg-green-500 />
            <div>{{ tagTitle(tag) }}</div>
            <span :class="{ 'opacity-0': !isActive(tag) }" ml=".5" text-xs flex items-center hover:bg-gray-300 group-hover:opacity-100 rounded-full>
              <i i-ic:baseline-close @click.prevent.stop="closeTag(tag)" />
            </span>
          </span>
        </template>
      </draggable>
    </ScrollPane>
    <div ref="menuRef" bg="white dark:zinc-600" h="[18px]" px-1 rounded my-auto mx-2 shadow cursor-pointer @click="selectedTag = menuRef;show = true">
      <i text-xs my=".5" i-fa6-solid:angle-down />
    </div>
    <el-popover v-if="show" v-model:visible="show" trigger="click" :popper-options="{ modifiers: [{ name: 'offset', options: { offset: [0, selectedTag === menuRef ? 8 : -1] } }] }" popper-class="!min-w-[unset] !w-auto" :virtual-ref="selectedTag" virtual-triggering>
      <ul class="v-dropdown">
        <li @click="tagsView.push(selectedTag?.to || route)">
          刷新
        </li>
        <li @click="closeTag(selectedTag?.to)">
          关闭
        </li>
        <li @click="closeOthersTags(selectedTag?.to)">
          关闭其他
        </li>
        <li @click="closeAllTags">
          关闭全部
        </li>
      </ul>
    </el-popover>
  </div>
</template>

<style lang="scss" scoped>
.tab-item {
  --color: transparent;

  @apply relative text-sm h-7 cursor-pointer rounded-t-lg -mx-0.75
    relative inline-flex items-center pl-6 pr-2 bg-[var(--color)];

  &::before,
  &::after {
    @apply absolute bottom-0 content-none rounded-full w-5 h-5;

    box-shadow: 0 0 0 4px var(--color);
  }

  &::before {
    @apply -left-5;

    clip-path: inset(50% -10px 0 50%);
  }

  &::after {
    @apply -right-5;

    clip-path: inset(50% 50% 0 -10px);
  }

  &:hover {
    --color: #f3f4f6;

    .dark & {
      --color: #52525b;
    }
  }

  &:first-child .split {
    @apply hidden;
  }

  &.active {
    --color: white;

    .dark & {
      --color: #18181b;
    }

    @apply z-1;

    .split {
      @apply hidden;
    }
  }
}

.v-dropdown {
  @apply flex flex-col -mx-3 -my-2;

  li {
    @apply hover:(bg-primary-1 text-primary) py-1.5 px-4 cursor-pointer;
  }
}
</style>
