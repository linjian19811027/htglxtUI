<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import type { Log } from './log'
import { LogService } from './log'
import LogForm from './components/form.vue'

export default defineComponent({
  components: {
    LogForm,
  },
  setup() {
    const currentPage = ref<number>(1)
    const pageSize = 10
    const logs = ref<Log[]>([])
    const total = ref<number>(0)
    const action = ref<string>('')
    const timeRange = ref<string[]>([])
    const dialogVisible = ref<boolean>(false)
    const editDialogVisible = ref<boolean>(false)
    const selectedLog = ref<Log | null>(null)

    const fetchLogs = async () => {
      const { logs: data, total: count } = await LogService.fetchLogs(
        currentPage.value,
        pageSize,
        action.value || undefined,
        timeRange.value[0] || undefined,
        timeRange.value[1] || undefined,
      )

      logs.value = data
      total.value = count
    }

    const handlePageChange = (page: number) => {
      currentPage.value = page
      fetchLogs()
    }

    const handleSearch = () => {
      currentPage.value = 1
      fetchLogs()
    }

    const handleAdd = async (log: Log) => {
      await LogService.addLog(log)
      dialogVisible.value = false
      fetchLogs()
    }

    const handleEdit = (log: Log) => {
      selectedLog.value = log
      editDialogVisible.value = true
    }

    const handleUpdate = async (log: Log) => {
      await LogService.updateLog(log)
      editDialogVisible.value = false
      fetchLogs()
    }

    const handleDelete = async (log: Log) => {
      await LogService.deleteLog(log.id)
      fetchLogs()
    }

    const handleCancel = () => {
      dialogVisible.value = false
    }

    const handleCancelEdit = () => {
      editDialogVisible.value = false
    }

    onMounted(() => {
      fetchLogs()
    })

    return {
      currentPage,
      pageSize,
      logs,
      total,
      action,
      timeRange,
      dialogVisible,
      editDialogVisible,
      selectedLog,
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
      <el-tab-pane label="日志管理">
        <el-row type="flex" justify="space-between">
          <el-col :span="12">
            <el-input v-model.trim="action" placeholder="请输入操作类型" @keyup.enter.native="handleSearch" />
          </el-col>
          <el-col :span="12">
            <el-date-picker
              v-model="timeRange" type="daterange" format="YYYY-MM-DD" start-placeholder="开始日期"
              end-placeholder="结束日期" range-separator="至" value-format="YYYY-MM-DD" @change="handleSearch"
            />
          </el-col>
        </el-row>
        <el-row type="flex" justify="end">
          <el-button-group>
            <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">
              添加
            </el-button>
          </el-button-group>
        </el-row>
        <el-table height="500" :data="logs" stripe sticky-header border>
          <el-table-column prop="userName" label="操作人" />
          <el-table-column prop="action" label="操作类型" />
          <el-table-column prop="module" label="操作模块" />
          <el-table-column prop="ip" label="操作IP地址" />
          <el-table-column prop="time" label="操作时间" />
          <el-table-column prop="comment" label="备注" />
          <el-table-column prop="errorMessage" label="错误记录" />
          <el-table-column label="操作" fixed="right">
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
        <el-dialog v-model="dialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="添加日志">
          <LogForm @submit="handleAdd" @cancel="handleCancel" />
        </el-dialog>
        <!-- <el-dialog title="编辑日志" :visible.sync="editDialogVisible" width="50%"> -->

        <el-dialog v-model="editDialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="编辑日志">
          <LogForm :log="selectedLog" @submit="handleUpdate" @cancel="handleCancelEdit" />
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
  title: 日志管理
  icon: i-iconoir:ecology-book
  order: 14
</route>
