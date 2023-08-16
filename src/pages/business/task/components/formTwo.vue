<script   lang="ts">
import { defineComponent, ref, watch } from 'vue'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { Task } from '../task'
import { TaskService } from '../task'

interface TaskFormProps {
  task?: Task
  isEditting?: boolean
  onSubmit?: (task: Task) => void
  onCancel?: () => void
}

export default defineComponent({
  props: {
    task: {
      type: Object as () => Task,
      default: () => ({
        id: undefined,
        parentTaskId: undefined,
        taskTitle: undefined,
        taskType: undefined,
        taskCompany: undefined,
        taskContacts: undefined,
        taskTel: undefined,
        taskMaterial: undefined,
        taskContent: undefined,
        taskEndTime: undefined,
        taskCreateUser: undefined,
        taskCreateUserId: undefined,
        taskCreateTime: undefined,
        participantsIds: undefined,
        participantsNames: undefined,
        taskReceiver: undefined,
        taskReceiverId: undefined,
        taskState: undefined,
        taskFactEndTime: undefined,
        taskFactContent: undefined,
        taskFactAddress: undefined,
        contentUpload1: undefined,
        contentUpload2: undefined,
        yaoQiuUpload1: undefined,
        yaoQiuUpload2: undefined,
        wanChengUpload1: undefined,
        wanChengUpload2: undefined,
        nextTaskType: undefined,
        mainId: undefined,
        nextTaskEndTime: undefined,
        state: undefined,
      }),
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
    const form = ref<Nullable<ElForm>>()
    const options = ref([])
    const fetchMaterialDict = async () => {
      const data = await TaskService.fetchMaterialDict()
      options.value = data
    }
    const token = localStorage.getItem('token') || ''
    const task = ref<Task>(props.task)
    const imageUrl = ref('')
    watch(
      () => props.task,
      (newVal) => {
        task.value = newVal
      },
    )
    onMounted(() => {

    })
    const handleSubmit = () => {
      form.value?.validate(async (valid) => {
        if (valid)
          emit('submit', task.value)
      })
    }

    const handleCancel = () => {
      emit('cancel')
    }
    const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
      if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('必须为JPG格式!')
        return false
      } else if (rawFile.size / 1024 / 1024 > 20) {
        ElMessage.error('不能超过20MB!')
        return false
      }
      return true
    }
    const handleAvatarSuccess: UploadProps['onSuccess'] = (
      res,
      uploadFile
    ) => {

      if (res.data.resultCode === 200) {
        //task.value.contentUpload2 = res.data.filePath // 根据实际响应结构修改属性名
        imageUrl.value = "https://htglxtapi.inscode.cc/sysFile/download/" + res.data.message // URL.createObjectURL(uploadFile.raw!)
        // const reader = new FileReader()
        // reader.readAsDataURL(file.raw)
        // reader.onload = () => {
        //   imageUrl.value = reader.result as string
        // }
      } else {
        this.$message.error(res.msg)
      }
      //imageUrl.value = URL.createObjectURL(uploadFile.raw!)
    }
    return {
      form,
      task,
      handleSubmit,
      handleCancel,
      beforeAvatarUpload,
      handleAvatarSuccess,
      imageUrl,
      token,
    }
  },
})
</script>

<template>
  <el-form ref="form" :model="task" label-width="80px" size="small">
    <el-form-item label="任务标题" prop="taskTitle">
      <el-input v-model.lazy="task.taskTitle" :disabled="!isEditting" />
    </el-form-item>
    <el-form-item label="任务类型" prop="taskType">
      <el-input v-model.lazy="task.taskType" :disabled="!isEditting" />
    </el-form-item>
    <el-form-item label="任务公司" prop="taskCompany">
      <el-input v-model.lazy="task.taskCompany" :disabled="!isEditting" />
    </el-form-item>
    <el-form-item label="任务联系人" prop="taskContacts">
      <el-input v-model.lazy="task.taskContacts" :disabled="!isEditting" />
    </el-form-item>
    <el-form-item label="任务电话" prop="taskTel">
      <el-input v-model.lazy="task.taskTel" :disabled="!isEditting" />
    </el-form-item>
    <el-form-item label="项目素材存放地址" prop="taskMaterial">
      <el-input v-model.lazy="task.taskMaterial" :disabled="!isEditting" />
    </el-form-item>
    <el-form-item label="任务内容" prop="taskContent">
      <el-input v-model.lazy="task.taskContent" :disabled="!isEditting" />
    </el-form-item>
    <el-form-item label="任务预计完成时间" prop="taskEndTime">
      <el-date-picker v-model="task.taskEndTime" type="date" placeholder="选择日期" :disabled="!isEditting"
        value-format="yyyy-MM-dd" />
    </el-form-item>
    <!-- <el-form-item label="任务创建人" prop="taskCreateUser">
      <el-input v-model.lazy="task.taskCreateUser" :disabled="!isEditting" />
    </el-form-item>
    <el-form-item label="任务创建人ID" prop="taskCreateUserId">
      <el-input v-model.lazy="task.taskCreateUserId" :disabled="!isEditting" />
    </el-form-item>
    <el-form-item label="任务创建时间" prop="taskCreateTime">
      <el-date-picker
        v-model="task.taskCreateTime"
        type="date"
        placeholder="选择日期"
        :disabled="!isEditting"
        value-format="yyyy-MM-dd"
      />
    </el-form-item> -->
    <el-form-item label="任务参与者" prop="participantsIds">
      <el-input v-model.lazy="task.participantsIds" :disabled="!isEditting" />
    </el-form-item>
    <!-- <el-form-item label="任务参与者名称" prop="participantsNames">
      <el-input v-model.lazy="task.participantsNames" :disabled="!isEditting" />
    </el-form-item> -->
    <!-- <el-form-item label="任务接收者" prop="taskReceiver">
      <el-input v-model.lazy="task.taskReceiver" :disabled="!isEditting" />
    </el-form-item> -->
    <el-form-item label="任务接收者" prop="taskReceiverId">
      <el-input v-model.lazy="task.taskReceiverId" :disabled="!isEditting" />
    </el-form-item>
    <!-- <el-form-item label="任务状态" prop="taskState">
      <el-radio-group v-model="task.taskState" :disabled="!isEditting">
        <el-radio label="进行中" />
        <el-radio label="已完成" />
      </el-radio-group>
    </el-form-item> -->
    <el-form-item label="任务实际完成时间" prop="taskFactEndTime">
      <el-date-picker v-model="task.taskFactEndTime" type="date" placeholder="选择日期" :disabled="!isEditting"
        value-format="yyyy-MM-dd" />
    </el-form-item>
    <el-form-item label="任务实际内容" prop="taskFactContent">
      <el-input v-model.lazy="task.taskFactContent" :disabled="!isEditting" />
    </el-form-item>
    <el-form-item label="任务实际地址" prop="taskFactAddress">
      <el-input v-model.lazy="task.taskFactAddress" :disabled="!isEditting" />
    </el-form-item>
    <el-form-item label="图片展示没什么用">
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    </el-form-item>
    <el-form-item label="任务内容上传1" prop="contentUpload1">
      <el-upload class="avatar-uploader" :disabled="!isEditting" name="file" :auto-upload="false" :file-list="[]"
        :limit="1" :data="{ type: 'contentUpload1' }"
        :headers="{ Authorization: 'Bearer ' + token }"
        action="https://htglxtapi.inscode.cc/sysFile/upload" :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <el-button slot="trigger" size="small" :disabled="!isEditting">
          <i class="el-icon-upload2" /> 选择文件
        </el-button>
        <el-button size="small" type="success" :disabled="!isEditting">
          上传文件
        </el-button>
        <div slot="tip" class="el-upload__tip">
          支持格式：jpg/png/gif，文件大小不超过2M
        </div>
      </el-upload>
    </el-form-item>
    <el-form-item label="任务内容上传2" prop="contentUpload2">
      <el-upload class="avatar-uploader" :disabled="!isEditting" name="file" :auto-upload="false" :file-list="[]"
        :data="{ type: 'contentUpload2' }" :limit="1"
        :headers="{ Authorization: 'Bearer ' + token }"
        action="https://htglxtapi.inscode.cc/sysFile/upload" :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <el-button slot="trigger" size="small" :disabled="!isEditting">
          <i class="el-icon-upload2" /> 选择文件
        </el-button>
        <el-button size="small" type="success" :disabled="!isEditting">
          上传文件
        </el-button>
        <div slot="tip" class="el-upload__tip">
          支持格式：jpg/png/gif，文件大小不超过2M
        </div>
      </el-upload>
    </el-form-item>
    <el-form-item label="任务要求上传1" prop="yaoQiuUpload1">
      <el-upload class="avatar-uploader" :disabled="!isEditting" name="file" :auto-upload="false" :file-list="[]"
        :limit="1" :data="{ type: 'yaoQiuUpload1' }"
        :headers="{ Authorization: 'Bearer ' + token }"
        action="https://htglxtapi.inscode.cc/sysFile/upload" :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <el-button slot="trigger" size="small" :disabled="!isEditting">
          <i class="el-icon-upload2" /> 选择文件
        </el-button>
        <el-button size="small" type="success" :disabled="!isEditting">
          上传文件
        </el-button>
        <div slot="tip" class="el-upload__tip">
          支持格式：jpg/png/gif，文件大小不超过2M
        </div>
      </el-upload>
    </el-form-item>
    <el-form-item label="任务要求上传2" prop="yaoQiuUpload2">
      <el-upload class="avatar-uploader" :disabled="!isEditting" name="file" :auto-upload="false" :file-list="[]"
        :limit="1" :data="{ type: 'yaoQiuUpload2' }"
        :headers="{ Authorization: 'Bearer ' + token }"
        action="https://htglxtapi.inscode.cc/sysFile/upload" :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <el-button slot="trigger" size="small" :disabled="!isEditting">
          <i class="el-icon-upload2" /> 选择文件
        </el-button>
        <el-button size="small" type="success" :disabled="!isEditting">
          上传文件
        </el-button>
        <div slot="tip" class="el-upload__tip">
          支持格式：jpg/png/gif，文件大小不超过2M
        </div>
      </el-upload>
    </el-form-item>
    <el-form-item label="任务完成上传1" prop="wanChengUpload1">
      <el-upload class="avatar-uploader" :disabled="!isEditting" name="file" :limit="1" :auto-upload="false"
        :file-list="[]" :data="{ type: 'wanChengUpload1' }"
        :headers="{ Authorization: 'Bearer ' + token }"
        action="https://htglxtapi.inscode.cc/sysFile/upload" :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <el-button slot="trigger" size="small" :disabled="!isEditting">
          <i class="el-icon-upload2" /> 选择文件
        </el-button>
        <el-button size="small" type="success" :disabled="!isEditting">
          上传文件
        </el-button>
        <div slot="tip" class="el-upload__tip">
          支持格式：jpg/png/gif，文件大小不超过2M
        </div>
      </el-upload>
    </el-form-item>
    <el-form-item label="任务完成上传2" prop="wanChengUpload2">
      <el-upload class="avatar-uploader" :disabled="!isEditting" name="file" :limit="1" :auto-upload="false"
        :file-list="[]" :data="{ type: 'wanChengUpload2' }"
        :headers="{ Authorization: 'Bearer ' + token }"
        action="https://htglxtapi.inscode.cc/sysFile/upload" :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <el-button slot="trigger" size="small" :disabled="!isEditting">
          <i class="el-icon-upload2" /> 选择文件
        </el-button>
        <el-button size="small" type="success" :disabled="!isEditting">
          上传文件
        </el-button>
        <div slot="tip" class="el-upload__tip">
          支持格式：jpg/png/gif，文件大小不超过2M
        </div>
      </el-upload>
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
<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}</style>