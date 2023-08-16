<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import type { Task } from './task'
import { TaskService } from './task'
import TaskFormOne from './components/formOne.vue'
import TaskFormTwo from './components/formTwo.vue'
import TaskFormThree from './components/formThree.vue'
import UserRate from './components/userRate.vue'

export default defineComponent({

  components: {
    TaskFormOne, TaskFormTwo, TaskFormThree, UserRate,
  },
  setup() {
    const currentPage = ref<number>(1)
    const pageSize = 10
    const tasks = ref<Task[]>([])
    const total = ref<number>(0)
    const taskId = ref<number>(0)

    const dialogVisible = ref<boolean>(false)
    const editDialogVisible = ref<boolean>(false)
    const rateDialogVisible = ref<boolean>(false)

    const selectedTask = ref<Task | null>(null)

    const options2 = ref([])
    const options5 = ref([])

    const taskTitle = ref<string>('')
    const taskCompany = ref<string>('')

    const taskType = ref<undefined>(undefined)
    const state = ref<undefined>(undefined)

    const taskCreateTimeRange = ref<string[]>([])
    const taskEndTimeRange = ref<string[]>([])

    const fetchSysDict2 = async () => {
      const data = await TaskService.fetchSysDict2()
      options2.value = data
    }
    const fetchSysDict5 = async () => {
      const data = await TaskService.fetchSysDict5()
      options5.value = data
    }
    const fetchTasks = async () => {
      const { tasks: data, total: count } = await TaskService.fetchTasks(
        currentPage.value,
        pageSize,
        taskTitle.value || undefined,
        taskCompany.value || undefined,
        taskType.value,
        state.value,
        taskCreateTimeRange.value[0] || undefined,
        taskCreateTimeRange.value[1] || undefined,
        taskEndTimeRange.value[0] || undefined,
        taskEndTimeRange.value[1] || undefined,
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
      if (!taskCreateTimeRange.value) { // 检查 timeRange 是否为 null
        taskCreateTimeRange.value = []
      }
      if (!taskEndTimeRange.value) { // 检查 timeRange 是否为 null
        taskEndTimeRange.value = []
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
      if (typeof selectedTask.value.participantsIds === 'string')
        selectedTask.value.participantsIds = selectedTask.value.participantsIds.split(',').map(Number)

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

    const handleRate = (taskId1) => {
      taskId.value = taskId1
      rateDialogVisible.value = true
    }

    const handleCancel = () => {
      dialogVisible.value = false
    }

    const handleCancelEdit = () => {
      editDialogVisible.value = false
    }
    const handleCancelUserRateEdit = () => {
      rateDialogVisible.value = false
    }
    const handleUserRateUpdate =  () => {
     // await TaskService.updateTask(task)
      rateDialogVisible.value = false
 
    }
    onMounted(() => {
      fetchTasks()
      fetchSysDict2()
      fetchSysDict5()
    })

    return {
      options2,
      options5,
      taskTitle,
      taskCompany,
      taskType,
      state,
      taskCreateTimeRange,
      taskEndTimeRange,
      currentPage,
      pageSize,
      tasks,
      total,
      dialogVisible,
      editDialogVisible,
      selectedTask,
      handlePageChange,
      handleSearch,
      handleAdd,
      handleEdit,
      handleUpdate,
      handleDelete,
      handleCancel,
      handleCancelEdit,
      taskId,
      handleRate,
      rateDialogVisible,
      handleUserRateUpdate,
      handleCancelUserRateEdit
    }
  },

})
</script>

<template>
  <div>
    <el-tabs type="border-card" m-3 flex-1 overflow-auto>
      <el-tab-pane label="任务管理">
        <el-row type="flex" justify="space-between">
          <el-col :span="12">
            <el-input v-model.trim="taskTitle" placeholder="请输入任务标题" @keyup.enter.native="handleSearch" />
          </el-col>
          <el-col :span="12">
            <el-input v-model.trim="taskCompany" placeholder="请输入任务单位" @keyup.enter.native="handleSearch" />
          </el-col>
          <el-col :span="12">
            <el-select v-model="taskType" placeholder="请选择任务类别" @change="handleSearch">
              <el-option key="undefined" label="请选择任务类别" :value="undefined" />
              <el-option v-for="item in options2" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-select v-model="state" placeholder="请选择任务状态" @change="handleSearch">
              <el-option key="undefined" label="请选择任务类别" :value="undefined" />
              <el-option v-for="item in options5" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-date-picker
              v-model="taskCreateTimeRange" type="daterange" format="YYYY-MM-DD"
              start-placeholder="任务创建开始日期" end-placeholder="任务创建结束日期" range-separator="至" value-format="YYYY-MM-DD"
              @change="handleSearch"
            />
          </el-col>
          <el-col :span="12">
            <el-date-picker
              v-model="taskEndTimeRange" type="daterange" format="YYYY-MM-DD" start-placeholder="任务预计完成开始日期"
              end-placeholder="任务预计完成结束日期" range-separator="至" value-format="YYYY-MM-DD" @change="handleSearch"
            />
          </el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-button-group>
            <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">
              添加
            </el-button>
          </el-button-group>
        </el-row>
        <el-table :data="tasks" stripe sticky-header border>
          <el-table-column prop="taskNo" label="流水号" />
          <el-table-column prop="taskTitle" label="任务标题" />
          <el-table-column prop="taskType_txt" label="任务类别" />
          <el-table-column prop="taskState_txt" label="任务状态" />
          <el-table-column prop="participantsNames" label="参与人" />
          <el-table-column prop="taskReceiver" label="任务接受人" />
          <el-table-column prop="taskCompany" label="任务单位" />
          <el-table-column prop="taskContacts" label="联系人" />
          <el-table-column prop="taskTel" label="联系人电话" />
          <el-table-column prop="taskMaterial" label="项目素材存放地址" />
          <el-table-column prop="taskContent" label="项目内容描述" />
          <el-table-column prop="taskEndTime" label="要求完成时间" />
          <el-table-column prop="taskCreateUser" label="任务下达人" />
          <el-table-column prop="taskCreateTime" label="任务下达时间" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button-group>
                <el-button type="primary" size="small" @click="handleEdit(row)">
                  查看
                </el-button>
                <el-button type="danger" size="small" @click="handleRate(row.id)">
                  评分
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage" :page-size="pageSize" layout="prev, pager, next"
            :total="total" @current-change="handlePageChange"
          />
        </div>
        <!-- <el-dialog title="添加日志" :visible.sync="dialogVisible" width="50%"> -->
        <el-dialog
          v-model="dialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="创建任务"
          destroy-on-close="true"
        >
          <TaskFormOne is-editting="true" @submit="handleAdd" @cancel="handleCancel" />
        </el-dialog>
        <!-- <el-dialog title="编辑日志" :visible.sync="editDialogVisible" width="50%"> -->

        <el-dialog
          v-model="editDialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="查看任务"
          destroy-on-close="true"
        >
          <TaskFormOne :task="selectedTask" is-editting="true" @submit="handleUpdate" @cancel="handleCancelEdit" />
        </el-dialog>

        <el-dialog
          v-model="rateDialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="查看任务"
          destroy-on-close="true"
        >
          <UserRate :task-id="taskId" is-editting="true" @submit="handleUserRateUpdate" @cancel="handleCancelUserRateEdit" />
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
  title: 任务列表
  icon: i-carbon:ibm-cloud-event-streams
</route>
