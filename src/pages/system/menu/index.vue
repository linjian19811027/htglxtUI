<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import type { Menu } from './menu'
import { MenuService } from './menu'
import MenuForm from './components/form.vue'

export default defineComponent({

  components: {
    MenuForm,
  },
  setup() {
    const currentPage = ref<number>(1)
    const pageSize = 10
    const menus = ref<Menu[]>([])
    const total = ref<number>(0)
    const name = ref<string>('')
    const dialogVisible = ref<boolean>(false)
    const editDialogVisible = ref<boolean>(false)
    const selectedMenu = ref<Menu | null>(null)

    const fetchMenus = async () => {
      const { menus: data, total: count } = await MenuService.fetchMenus(
        currentPage.value,
        pageSize,
        name.value || undefined,
      )

      menus.value = data
      total.value = count
    }

    const handlePageChange = (page: number) => {
      currentPage.value = page
      fetchMenus()
    }

    const handleSearch = () => {
      currentPage.value = 1
      fetchMenus()
    }

    const handleAdd = async (menu: Menu) => {
      await MenuService.addMenu(menu)
      dialogVisible.value = false
      fetchMenus()
    }

    const handleEdit = (menu: Menu) => {
      selectedMenu.value = menu
      editDialogVisible.value = true
    }

    const handleUpdate = async (menu: Menu) => {
      await MenuService.updateMenu(menu)
      editDialogVisible.value = false
      fetchMenus()
    }

    const handleDelete = async (menu: Menu) => {
      await MenuService.deleteMenu(menu.id)
      fetchMenus()
    }

    const handleCancel = () => {
      dialogVisible.value = false
    }

    const handleCancelEdit = () => {
      editDialogVisible.value = false
    }

    onMounted(() => {
      fetchMenus()
    })

    return {
      currentPage,
      pageSize,
      menus,
      total,
      name,
      dialogVisible,
      editDialogVisible,
      selectedMenu,
      handlePageChange,
      handleSearch,
      handleAdd,
      handleEdit,
      handleUpdate,
      handleDelete,
      handleCancel,
      handleCancelEdit,
    }
  },

})
</script>

<template>
  <div>
    <el-tabs type="border-card" m-3 flex-1 overflow-auto>
      <el-tab-pane label="菜单管理">
        <el-row type="flex" justify="space-between">
          <el-col :span="12">
            <el-input v-model.trim="name" placeholder="请输入操作类型" @keyup.enter.native="handleSearch" />
          </el-col>
        </el-row>
        <el-row type="flex" justify="end">
          <el-button-group>
            <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">
              添加
            </el-button>
          </el-button-group>
        </el-row>
        <el-table :data="menus" stripe sticky-header border>
          <el-table-column prop="name" label="菜单名称" />
          <el-table-column prop="url" label="菜单地址" />
          <el-table-column prop="icon" label="菜单图标" />
          <el-table-column prop="orderNum" label="菜单顺序" />

          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button-group>
                <el-button type="primary" size="small" @click="handleEdit(row)">
                  修改
                </el-button>
                <el-button type="danger" size="small" @click="handleDelete(row)">
                  删除
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage" :page-size="pageSize" layout="prev, pager, next" :total="total"
            @current-change="handlePageChange"
          />
        </div>
        <!-- <el-dialog title="添加日志" :visible.sync="dialogVisible" width="50%"> -->
        <el-dialog v-model="dialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="添加菜单">
          <MenuForm @submit="handleAdd" @cancel="handleCancel" />
        </el-dialog>
        <!-- <el-dialog title="编辑日志" :visible.sync="editDialogVisible" width="50%"> -->

        <el-dialog v-model="editDialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="编辑菜单">
          <MenuForm :menu="selectedMenu" @submit="handleUpdate" @cancel="handleCancelEdit" />
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.pagination {
    text-align: right;
    margin-top: 20px;
}
</style>

<route lang="yaml">
meta:
  layout: home
  title: 菜单管理
  icon: i-ep:menu
  order: 10
</route>
