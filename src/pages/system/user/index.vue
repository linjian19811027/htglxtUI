<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import type { User } from './user'
import { UserService } from './user'
import UserForm from './components/form.vue'

export default defineComponent({

  components: {
    UserForm,
  },
  setup() {
    const currentPage = ref<number>(1)
    const pageSize = 10
    const users = ref<User[]>([])
    const total = ref<number>(0)
    const username = ref<string>('')
    const dialogVisible = ref<boolean>(false)
    const editDialogVisible = ref<boolean>(false)
    const selectedUser = ref<User | null>(null)

    const fetchUsers = async () => {
      const { users: data, total: count } = await UserService.fetchUsers(
        currentPage.value,
        pageSize,
        username.value || undefined,
      )

      users.value = data
      total.value = count
    }

    const handlePageChange = (page: number) => {
      currentPage.value = page
      fetchUsers()
    }

    const handleSearch = () => {
      currentPage.value = 1
      fetchUsers()
    }

    const handleAdd = async (user: User) => {
      await UserService.addUser(user)
      dialogVisible.value = false
      fetchUsers()
    }

    const handleEdit = (user: User) => {
      selectedUser.value = user
      editDialogVisible.value = true
    }

    const handleUpdate = async (user: User) => {
      await UserService.updateUser(user)
      editDialogVisible.value = false
      fetchUsers()
    }

    const handleDelete = async (user: User) => {
      await UserService.deleteUser(user.id)
      fetchUsers()
    }

    const handleCancel = () => {
      dialogVisible.value = false
    }

    const handleCancelEdit = () => {
      editDialogVisible.value = false
    }

    onMounted(() => {
      fetchUsers()
    })

    return {
      currentPage,
      pageSize,
      users,
      total,
      username,
      dialogVisible,
      editDialogVisible,
      selectedUser,
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
      <el-tab-pane label="用户管理">
        <el-row type="flex" justify="space-between">
          <el-col :span="12">
            <el-input v-model.trim="username" placeholder="请输入用户名称" @keyup.enter.native="handleSearch" />
          </el-col>
        </el-row>
        <el-row type="flex" justify="end">
          <el-button-group>
            <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">
              添加
            </el-button>
          </el-button-group>
        </el-row>
        <el-table :data="users" stripe sticky-header border>
          <el-table-column prop="username" label="用户名称" />
          <el-table-column prop="email" label="电邮" />
          <el-table-column prop="mobile" label="电话" />
          <el-table-column prop="sex_txt" label="性别" />
          <el-table-column prop="roleId_txt" label="角色" />
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
        <el-dialog v-model="dialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="添加用户">
          <UserForm @submit="handleAdd" @cancel="handleCancel" />
        </el-dialog>
        <!-- <el-dialog title="编辑日志" :visible.sync="editDialogVisible" width="50%"> -->

        <el-dialog v-model="editDialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="编辑用户">
          <UserForm :user="selectedUser" @submit="handleUpdate" @cancel="handleCancelEdit" />
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
  title: 用户管理
  icon: i-ep:user
  order: 13
</route>
