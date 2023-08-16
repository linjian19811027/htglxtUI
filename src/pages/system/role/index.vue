<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import type { Role } from './role'
import { RoleService } from './role'
import RoleForm from './components/form.vue'

export default defineComponent({

  components: {
    RoleForm,
  },
  setup() {
    const currentPage = ref<number>(1)
    const pageSize = 10
    const roles = ref<Role[]>([])
    const total = ref<number>(0)
    const name = ref<string>('')
    const dialogVisible = ref<boolean>(false)
    const editDialogVisible = ref<boolean>(false)
    const selectedRole = ref<Role | null>(null)

    const fetchRoles = async () => {
      const { roles: data, total: count } = await RoleService.fetchRoles(
        currentPage.value,
        pageSize,
        name.value || undefined,
      )

      roles.value = data
      total.value = count
    }

    const handlePageChange = (page: number) => {
      currentPage.value = page
      fetchRoles()
    }

    const handleSearch = () => {
      currentPage.value = 1
      fetchRoles()
    }

    const handleAdd = async (role: Role) => {
      await RoleService.addRole(role)
      dialogVisible.value = false
      fetchRoles()
    }

    const handleEdit = (role: Role) => {
      selectedRole.value = role
      editDialogVisible.value = true
    }

    const handleUpdate = async (role: Role) => {
      await RoleService.updateRole(role)
      editDialogVisible.value = false
      fetchRoles()
    }

    const handleDelete = async (role: Role) => {
      await RoleService.deleteRole(role.id)
      fetchRoles()
    }

    const handleCancel = () => {
      dialogVisible.value = false
    }

    const handleCancelEdit = () => {
      editDialogVisible.value = false
    }

    onMounted(() => {
      fetchRoles()
    })

    return {
      currentPage,
      pageSize,
      roles,
      total,
      name,
      dialogVisible,
      editDialogVisible,
      selectedRole,
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
      <el-tab-pane label="角色管理">
        <el-row type="flex" justify="space-between">
          <el-col :span="12">
            <el-input v-model.trim="name" placeholder="请输入角色名称" @keyup.enter.native="handleSearch" />
          </el-col>
        </el-row>
        <el-row type="flex" justify="end">
          <el-button-group>
            <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">
              添加
            </el-button>
          </el-button-group>
        </el-row>
        <el-table :data="roles" stripe sticky-header border>
          <el-table-column prop="name" label="角色名称" />
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
        <el-dialog v-model="dialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="添加角色">
          <RoleForm @submit="handleAdd" @cancel="handleCancel" />
        </el-dialog>
        <!-- <el-dialog title="编辑日志" :visible.sync="editDialogVisible" width="50%"> -->

        <el-dialog v-model="editDialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="编辑角色">
          <RoleForm :role="selectedRole" @submit="handleUpdate" @cancel="handleCancelEdit" />
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
  title: 角色管理
  icon: i-carbon:user-role
</route>
