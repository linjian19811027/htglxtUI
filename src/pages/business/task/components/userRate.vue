<script   lang="ts">
import { defineComponent } from 'vue'
import type { Task } from '../task'
import { TaskService } from '../task'

interface TaskFormProps {
  taskId?: number
  isEditting?: boolean
  onSubmit?: (task: Task) => void
  onCancel?: () => void
}

export default defineComponent({
  props: {
    taskId: {
      type: Number,
    },
    isEditting: {
      type: Boolean,
      default: false,
    },
    onSubmit: {
      type: Function as () => (task: Task) => void,
      required: true,
    },
    onCancel: {
      type: Function as () => () => void,
      required: true,
    },
  },
  emits: ['submit', 'cancel'],
  setup(props: TaskFormProps, { emit }) {
    // watch(
    //   () => props.task,
    //   (newVal) => {
    //     task.value = newVal
    //   },
    // )
    const taskUsers = ref([])
    const fetchTaskUser = async () => {
      if (props.taskId) {
        const data = await TaskService.fetchTaskUser(props.taskId)
        if (data && data.length) { // 判断 data 是否有值并且长度大于 0
          taskUsers.value = data
        }

        // task.value.taskMaterials = data
      }
    }
    const handleSubmit = async () => {
      try {
        // 构造需要提交的数据
        const data = taskUsers.value.map((user) => {
          return {
            id:user.id,
            score: user.score,
          }
        })

        // Promise.all方法并发执行多个异步任务，即将每个元素提交到后台接口，使用await关键字等待所有任务完成。
        await Promise.all(
          data.map((item) => {
            return TaskService.submitTaskUserScore(item)
          }),
        )

        // 提交成功，触发submit事件
        emit('submit')
      } catch (error) {
        // 处理异常情况
        console.error(error)
      }
    }


    onMounted(() => {
      fetchTaskUser()
    })

    const handleCancel = () => {
      emit('cancel')
    }

    return {
      taskUsers,
      handleSubmit,
      handleCancel,

    }
  },
})
</script>

<template>
  <el-form label-width="80px" size="small">
    <el-form-item label="参与人打分" prop="taskMaterials">
      <el-table :data="taskUsers" stripe sticky-header border>
        <el-table-column prop="userName" label="参与人" />
        <el-table-column prop="score" label="分数">
          <template #default="scope">
            <el-rate v-model="scope.row.score" :max="5" show-score text-color="#ff9900" score-template="{value} 分" />
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-button v-if="isEditting" type="primary" @click="handleSubmit">
        保存
      </el-button>
      <el-button @click="handleCancel">
        {{ isEditting ? '取消' : '返回' }}
      </el-button>
    </el-form-item>
  </el-form>
</template>
