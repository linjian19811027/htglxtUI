<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import type { Task } from './task'
import { TaskService } from './task'
import TaskFormOne from './components/formOne.vue'
import TaskFormTwo from './components/formTwo.vue'
import TaskFormThree from './components/formThree.vue'

export default defineComponent({

  components: {
    TaskFormOne,TaskFormTwo,TaskFormThree
  },
  setup() {
    const currentPage = ref<number>(1)
    const pageSize = 10
    const tasks = ref<Task[]>([])
    const total = ref<number>(0)
    const materialName = ref<string>('')
    const materialNo = ref<string>('')
    const flow = ref<undefined>(undefined)
    const timeRange = ref<string[]>([])
    const dialogVisible = ref<boolean>(false)
    const editDialogVisible = ref<boolean>(false)
    const selectedTask = ref<Task | null>(null)
    const options = ref([])

    const fetchSysDict = async () => {
      const data = await TaskService.fetchSysDict()
      options.value = data
    }

    const fetchTasks = async () => {
      const { tasks: data, total: count } = await TaskService.fetchTasks(
        currentPage.value,
        pageSize,
        materialName.value || undefined,
        materialNo.value || undefined,
        timeRange.value[0] || undefined,
        timeRange.value[1] || undefined,
        flow.value,
      )

      tasks.value = data
      total.value = count
    }

    const handlePageChange = (page: number) => {
      currentPage.value = page
      fetchTasks()
    }

    const handleSearch = () => {
      currentPage.value = 1
      if (!timeRange.value) { // 检查 timeRange 是否为 null
        timeRange.value = []
      }
      fetchTasks()
    }

    const handleAdd = async (task: Task) => {
      await TaskService.addTask(task)
      dialogVisible.value = false
      fetchTasks()
    }

    const handleEdit = (task: Task) => {
      selectedTask.value = task
      editDialogVisible.value = true
    }

    const handleUpdate = async (task: Task) => {
      await TaskService.updateTask(task)
      editDialogVisible.value = false
      fetchTasks()
    }

    const handleDelete = async (task: Task) => {
      await TaskService.deleteTask(task.id)
      fetchTasks()
    }

    const handleCancel = () => {
      dialogVisible.value = false
    }

    const handleCancelEdit = () => {
      editDialogVisible.value = false
    }

    onMounted(() => {
      fetchTasks()
      fetchSysDict()
    })

    return {
      options,
      currentPage,
      pageSize,
      tasks,
      total,
      flow,
      materialName,
      materialNo,
      dialogVisible,
      editDialogVisible,
      selectedTask,
      timeRange,
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
      <el-tab-pane label="进料管理">
        <el-row type="flex" justify="space-between">
          <el-col :span="12">
            <el-input v-model.trim="materialName" placeholder="请输入材料名称" @keyup.enter.native="handleSearch" />
          </el-col>
          <el-col :span="12">
            <el-input v-model.trim="materialNo" placeholder="请输入材料编号" @keyup.enter.native="handleSearch" />
          </el-col>
          <el-col :span="12">
            <el-select v-model="flow" placeholder="请选择" @change="handleSearch">
              <el-option key="undefined" label="请选择" :value="undefined" />
              <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-date-picker
              v-model="timeRange" type="daterange" format="YYYY-MM-DD" start-placeholder="开始日期"
              end-placeholder="结束日期" range-separator="至" value-format="YYYY-MM-DD" @change="handleSearch"
            />
          </el-col>
        </el-row>
        <!-- <el-row type="flex" justify="end">
          <el-button-group>
            <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">
              添加
            </el-button>
          </el-button-group>
        </el-row> -->
        <el-table :data="tasks" stripe sticky-header border>
          <el-table-column prop="materialName" label="材料名称" />
          <el-table-column prop="materialNo" label="材料编号" />
          <el-table-column prop="materialAmount" label="数量" />
          <el-table-column prop="flow_txt" label="方向" />
          <el-table-column prop="createTime" label="时间" />
          <el-table-column prop="description" label="描述" />

          <!-- <el-table-column label="操作">
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
          </el-table-column> -->
        </el-table>
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage" :page-size="pageSize" layout="prev, pager, next"
            :total="total" @current-change="handlePageChange"
          />
        </div>
        <!-- <el-dialog title="添加日志" :visible.sync="dialogVisible" width="50%"> -->
        <el-dialog
          v-model="dialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="添加材料"
          destroy-on-close="true"
        >
          <TaskForm @submit="handleAdd" @cancel="handleCancel" />
        </el-dialog>
        <!-- <el-dialog title="编辑日志" :visible.sync="editDialogVisible" width="50%"> -->

        <el-dialog v-model="editDialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="编辑材料">
          <TaskForm :material-log="selectedTask" @submit="handleUpdate" @cancel="handleCancelEdit" />
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
  title: 我的任务
  icon: i-carbon:ibm-cloud-event-streams
</route>
