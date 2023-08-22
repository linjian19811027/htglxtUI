<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import type { Permission } from './permission'
import { PermissionService } from './permission'
import PermissionForm from './components/form.vue'

export default defineComponent({

  components: {
    PermissionForm,
  },
  setup() {
    const currentPage = ref<number>(1)
    const pageSize = 10
    const permissions = ref<Permission[]>([])
    const total = ref<number>(0)
    const name = ref<string>('')
    const dialogVisible = ref<boolean>(false)
    const editDialogVisible = ref<boolean>(false)
    const selectedPermission = ref<Permission | null>(null)

    const fetchPermissions = async () => {
      const { permissions: data, total: count } = await PermissionService.fetchPermissions(
        currentPage.value,
        pageSize,
        name.value || undefined,
      )

      permissions.value = data
      total.value = count
    }

    const handlePageChange = (page: number) => {
      currentPage.value = page
      fetchPermissions()
    }

    const handleSearch = () => {
      currentPage.value = 1
      fetchPermissions()
    }

    const handleAdd = async (permission: Permission) => {
      await PermissionService.addPermission(permission)
      dialogVisible.value = false
      fetchPermissions()
    }

    const handleEdit = (permission: Permission) => {
      selectedPermission.value = permission
      editDialogVisible.value = true
    }

    const handleUpdate = async (permission: Permission) => {
      await PermissionService.updatePermission(permission)
      editDialogVisible.value = false
      fetchPermissions()
    }

    const handleDelete = async (permission: Permission) => {
      await PermissionService.deletePermission(permission.id)
      fetchPermissions()
    }

    const handleCancel = () => {
      dialogVisible.value = false
    }

    const handleCancelEdit = () => {
      editDialogVisible.value = false
    }

    onMounted(() => {
      fetchPermissions()
    })

    return {
      currentPage,
      pageSize,
      permissions,
      total,
      name,
      dialogVisible,
      editDialogVisible,
      selectedPermission,
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
      <el-tab-pane label="权限管理">
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
        <el-table :data="permissions" stripe sticky-header border>
          <el-table-column prop="name" label="权限名称" />
          <el-table-column prop="url" label="权限地址" />
          <el-table-column prop="description" label="描述" />

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
        <el-dialog v-model="dialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="添加权限">
          <PermissionForm @submit="handleAdd" @cancel="handleCancel" />
        </el-dialog>
        <!-- <el-dialog title="编辑日志" :visible.sync="editDialogVisible" width="50%"> -->

        <el-dialog v-model="editDialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="编辑权限">
          <PermissionForm :permission="selectedPermission" @submit="handleUpdate" @cancel="handleCancelEdit" />
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
  title: 权限管理
  icon: i-icon-park:permissions
  order: 11
</route>
