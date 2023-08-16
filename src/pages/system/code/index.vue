<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import type { Code } from './code'
import { CodeService } from './code'
import CodeForm from './components/form.vue'

export default defineComponent({

  components: {
    CodeForm,
  },
  setup() {
    const currentPage = ref<number>(1)
    const pageSize = 10
    const codes = ref<Code[]>([])
    const total = ref<number>(0)
    const name = ref<string>('')
    const dialogVisible = ref<boolean>(false)
    const editDialogVisible = ref<boolean>(false)
    const selectedCode = ref<Code | null>(null)

    const fetchCodes = async () => {
      const { codes: data, total: count } = await CodeService.fetchCodes(
        currentPage.value,
        pageSize,
        name.value || undefined,
      )

      codes.value = data
      total.value = count
    }

    const handlePageChange = (page: number) => {
      currentPage.value = page
      fetchCodes()
    }

    const handleSearch = () => {
      currentPage.value = 1
      fetchCodes()
    }

    const handleAdd = async (code: Code) => {
      await CodeService.addCode(code)
      dialogVisible.value = false
      fetchCodes()
    }

    const handleEdit = (code: Code) => {
      selectedCode.value = code
      editDialogVisible.value = true
    }

    const handleUpdate = async (code: Code) => {
      await CodeService.updateCode(code)
      editDialogVisible.value = false
      fetchCodes()
    }

    const handleDelete = async (code: Code) => {
      await CodeService.deleteCode(code.id)
      fetchCodes()
    }

    const handleCancel = () => {
      dialogVisible.value = false
    }

    const handleCancelEdit = () => {
      editDialogVisible.value = false
    }

    onMounted(() => {
      fetchCodes()
    })

    return {
      currentPage,
      pageSize,
      codes,
      total,
      name,
      dialogVisible,
      editDialogVisible,
      selectedCode,
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
      <el-tab-pane label="编号管理">
        <el-row type="flex" justify="space-between">
          <el-col :span="12">
            <el-input v-model.trim="prefix" placeholder="请输入操作类型" @keyup.enter.native="handleSearch" />
          </el-col>
        </el-row>
        <el-row type="flex" justify="end">
          <el-button-group>
            <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">
              添加
            </el-button>
          </el-button-group>
        </el-row>
        <el-table :data="codes" stripe sticky-header border>
          <el-table-column prop="id" label="序号" />
          <el-table-column prop="prefix" label="编号前缀" />
          <el-table-column prop="dateFormat" label="日期格式" />
          <el-table-column prop="digit" label="流水位数" />
          <el-table-column prop="step" label="编号步长" />
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
        <el-dialog v-model="dialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="添加编号">
          <CodeForm @submit="handleAdd" @cancel="handleCancel" />
        </el-dialog>
        <!-- <el-dialog title="编辑日志" :visible.sync="editDialogVisible" width="50%"> -->

        <el-dialog v-model="editDialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="编辑编号">
          <CodeForm :code="selectedCode" @submit="handleUpdate" @cancel="handleCancelEdit" />
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
  title: 编号管理
  icon: i-system-uicons:code
</route>
