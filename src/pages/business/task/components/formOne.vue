<script   lang="ts">
import { defineComponent, ref, watch } from 'vue'
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
        taskMaterials: undefined,
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

    const upload1 = ref()

    const action = 'https://htglxtapi.inscode.cc/sysFile/upload'
    const options = ref([])
    const materiaOptions = ref([])

    const materialId = ref(undefined)
    const materialNo = ref('')
    const predictAmount = ref(0)

    // const materiaOptions1 = ref([])

    const uploadUuid1 = ref<string>('')
    const uploadUuid2 = ref<string>('')
    const uploadUuid3 = ref<string>('')
    const uploadUuid4 = ref<string>('')
    const uploadUuid5 = ref<string>('')
    const uploadUuid6 = ref<string>('')


    const uploadFileList1 = ref([])
    const uploadFileList2 = ref([])
    const uploadFileList3 = ref([])
    const uploadFileList4 = ref([])
    const uploadFileList5 = ref([])
    const uploadFileList6 = ref([])

    const getFileList = async () => {
      if (task.value.id) {
        debugger
        const data1 = await TaskService.fetchSysFile(task.value.contentUpload1)
        uploadFileList1.value = data1

        const data2 = await TaskService.fetchSysFile(task.value.contentUpload2)
        uploadFileList2.value = data2

        const data3 = await TaskService.fetchSysFile(task.value.yaoQiuUpload1)
        uploadFileList3.value = data3

        const data4 = await TaskService.fetchSysFile(task.value.yaoQiuUpload2)
        uploadFileList4.value = data4


        const data5 = await TaskService.fetchSysFile(task.value.wanChengUpload1)
        uploadFileList5.value = data5

        const data6 = await TaskService.fetchSysFile(task.value.wanChengUpload2)
        uploadFileList6.value = data6
      }


    }

    const activeNames = ref(['1'])
    const hduser = ref([])
    const fetchMaterialDict = async () => {
      const data = await TaskService.fetchMaterialDict()
      materiaOptions.value = data
    }
    const fetchSysDict2 = async () => {
      const data = await TaskService.fetchSysDict2()
      options.value = data
    }

    const upLoadHeaders = reactive({
      Authorization: localStorage.getItem('token'),
      // 'Content-Type': 'multipart/form-data', // 不要此参数，不要此参数，不要此参数
    })
    const task = ref<Task>(props.task)
    const imageUrl = ref('')

    // const handleSuccess = (response, uploadFile) => {
    //   // 处理上传成功后的逻辑
    //   console.log('File uploaded:', uploadFile, 'Response:', response)
    // }
    const generateGUID = () => {
      let d = new Date().getTime()
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
      })
      return uuid
    }
    watch(
      () => props.task,
      (newVal) => {
        task.value = newVal
      },
    )
    const InitFileUploadUUid = async () => {
      if (!task.value.id) {
        task.value.contentUpload1 = generateGUID()
        task.value.contentUpload2 = generateGUID()
        task.value.yaoQiuUpload1 = generateGUID()
        task.value.yaoQiuUpload2 = generateGUID()
        task.value.wanChengUpload1 = generateGUID()
        task.value.wanChengUpload2 = generateGUID()
      }
    }
    const fetchUserDict = async () => {
      const data = await TaskService.fetchUserDict()
      hduser.value = data
    }
    const fetchTaskMaterial = async () => {
      if (task.value.id) {
        const data = await TaskService.fetchTaskMaterial(task.value.id)
        if (data && data.length) { // 判断 data 是否有值并且长度大于 0
          data.forEach((item) => {
            item.uuid = generateGUID() // 为每一项添加一个 uuid
          })
          task.value.taskMaterials = data
        }

        // task.value.taskMaterials = data
      }
    }

    onMounted(() => {
      InitFileUploadUUid()
      fetchSysDict2()
      fetchUserDict()
      fetchMaterialDict()
      fetchTaskMaterial()
      getFileList()
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
    const handleAddTaskMaterials = () => {
      let zz = ''
      let zzz = 0
      materiaOptions.value.map((option) => {
        // console.log(option)
        if (option.id === materialId.value)
          zz = option.materialName
        zzz = materialId.value
      })

      if (task.value.taskMaterials) { task.value.taskMaterials.push({ uuid: generateGUID(), materialId: zzz, predictAmount: predictAmount.value, materialNo: zz, actualAmount: 0 }) }
      else {
        task.value.taskMaterials = []
        task.value.taskMaterials.push({ uuid: generateGUID(), materialId: zzz, predictAmount: predictAmount.value, materialNo: zz, actualAmount: 0 })
      }
    }
    const handleDeleteTaskMaterials = (row) => {
      const index = task.value.taskMaterials.findIndex(item => item.uuid === row.uuid)

      if (index !== -1)
        task.value.taskMaterials.splice(index, 1)
    }

    const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
      if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ElMessage.error('必须为JPG或者PNG格式!')
        return false
      }
      else if (rawFile.size / 1024 / 1024 > 20) {
        ElMessage.error('不能超过20MB!')
        return false
      }
      return true
    }

    // const submit1 = () => {
    //   upload1.value!.submit()
    // }
    // const handleAvatarSuccess: UploadProps['onSuccess'] = (
    //   response,
    //   uploadFile,
    // ) => {
    //   if (response.resultCode === 200) {
    //     // task.value.contentUpload2 = res.data.filePath // 根据实际响应结构修改属性名
    //     imageUrl.value = `https://htglxtapi.inscode.cc/sysFile/download/${response.message}` // URL.createObjectURL(uploadFile.raw!)
    //     // const reader = new FileReader()
    //     // reader.readAsDataURL(file.raw)
    //     // reader.onload = () => {
    //     //   imageUrl.value = reader.result as string
    //     // }
    //   }
    //   else {
    //     ElMessage.error(response.message)
    //   }
    //   // imageUrl.value = URL.createObjectURL(uploadFile.raw!)
    // }

    return {
      form,
      task,
      handleSubmit,
      handleCancel,
      beforeAvatarUpload,
      // handleAvatarSuccess,
      imageUrl,
      upLoadHeaders,
      action,
      options,
      hduser,
      materiaOptions,
      // materiaOptions1
      activeNames,
      materialNo,
      materialId,
      predictAmount,
      handleAddTaskMaterials,
      handleDeleteTaskMaterials,
      uploadFileList1,
      uploadFileList2,
      uploadFileList3,
      uploadFileList4,
      uploadFileList5,
      uploadFileList6,

 
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
      <!-- <el-input v-model.lazy="task.taskType" :disabled="!isEditting" /> -->
      <el-select v-model.lazy="task.taskType" placeholder="请选择任务类别" :disabled="!isEditting">
        <el-option key="undefined" label="请选择任务类别" :value="undefined" />
        <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.value" />
      </el-select>
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
    <el-form-item label="项目所需材料" prop="taskMaterials">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="材料" name="1">
          <el-row type="flex" justify="space-between">
            <el-col :span="12">
              <el-select v-model="materialId" placeholder="请选择材料">
                <el-option key="undefined" label="请选择材料" :value="undefined" />
                <el-option v-for="item in materiaOptions" :key="item.id" :label="item.materialName" :value="item.id" />
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-input v-model="predictAmount" placeholder="请输入预估数量" />
            </el-col>
          </el-row>
          <el-row type="flex" justify="start">
            <el-button-group>
              <el-button type="primary" icon="el-icon-plus" :disabled="!isEditting" @click="handleAddTaskMaterials">
                添加
              </el-button>
            </el-button-group>
          </el-row>
          <el-table :data="task.taskMaterials" stripe sticky-header border>
            <el-table-column prop="materialNo" label="材料" />
            <el-table-column prop="predictAmount" label="预估数量" />
            <el-table-column prop="actualAmount" label="实际数量">
              <template #default="scope">
                <el-input v-model="scope.row.actualAmount" class="item" placeholder="请输入内容" />
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button-group>
                  <el-button type="danger" :disabled="!isEditting" size="small" @click="handleDeleteTaskMaterials(row)">
                    删除
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-form-item>
    <el-form-item label="任务内容" prop="taskContent">
      <el-input v-model.lazy="task.taskContent" :disabled="!isEditting" />
    </el-form-item>
    <el-form-item label="任务预计完成时间" prop="taskEndTime">
      <el-date-picker v-model="task.taskEndTime" type="date" placeholder="选择日期" :disabled="!isEditting"
        format="YYYY-MM-DD" value-format="YYYY-MM-DD HH:mm:ss" />
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
      <!-- <el-input v-model.lazy="task.participantsIds" :disabled="!isEditting" /> -->
      <!-- <ChoseUser v-model:key="task.participantsIds" :disabled="isEditting" :data="hduser" /> -->
      <!-- <transfer-input v-model="selectedIds" :data="data"></transfer-input> -->
      <el-select v-model="task.participantsIds" multiple placeholder="选择参与者">
        <el-option v-for="item in hduser" :key="item.id" :label="item.username" :value="item.id" />
      </el-select>
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
        format="YYYY-MM-DD" value-format="YYYY-MM-DD HH:mm:ss" />
    </el-form-item>
    <el-form-item label="任务实际内容" prop="taskFactContent">
      <el-input v-model.lazy="task.taskFactContent" :disabled="!isEditting" />
    </el-form-item>
    <el-form-item label="任务实际地址" prop="taskFactAddress">
      <el-input v-model.lazy="task.taskFactAddress" :disabled="!isEditting" />
    </el-form-item>
    <!-- <el-form-item label="图片展示没什么用">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
    </el-form-item> -->
    <el-form-item label="任务内容上传1" prop="contentUpload1">
      <HtImgUpload :uuid="task.contentUpload1" :file-list="uploadFileList1" button-text="选文件" :disabled="!isEditting"
        :action="action" :headers="upLoadHeaders" :before-avatar-upload="beforeAvatarUpload" />
        <!-- <pre>12356{{ uploadFileList1Ref }}</pre> -->
      <!-- <el-upload ref="upload1" class="avatar-uploader" :disabled="!isEditting" name="file" :auto-upload="false"
        :file-list="[]" :limit="1" :data="{ type: 'contentUpload1' }" :headers="upLoadHeaders"
        action="https://htglxtapi.inscode.cc/sysFile/upload" :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <template #trigger>
          <el-button type="primary">选择文件</el-button>
        </template>

        <el-button class="ml-3" type="success" :disabled="!isEditting" @click="submit1">
          上传文件
        </el-button>

        <template #tip>
          <div class="el-upload__tip">
            支持格式：jpg/png/gif，文件大小不超过2M
          </div>
        </template>

      </el-upload> -->
    </el-form-item>
    <el-form-item label="任务内容上传2" prop="contentUpload2">
      <!-- <HtUpload
        v-model:value="task.contentUpload2" :uuid="task.contentUpload2" button-text="选文件" :disabled="!isEditting"
        :action="action" :headers="upLoadHeaders" :before-upload="beforeAvatarUpload"
      /> -->
      <HtImgUpload :uuid="task.contentUpload2" :file-list="uploadFileList2" button-text="选文件" :disabled="!isEditting"
        :action="action" :headers="upLoadHeaders" :before-avatar-upload="beforeAvatarUpload" />
      <!-- <el-upload
        ref="upload1"
        class="avatar-uploader" :disabled="!isEditting" name="file" :auto-upload="false" :file-list="[]"
        :data="{ type: 'contentUpload2' }" :limit="1" :headers="upLoadHeaders"
        action="https://htglxtapi.inscode.cc/sysFile/upload" :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <el-button slot="trigger" size="small" :disabled="!isEditting">
          <i class="el-icon-upload2" /> 选择文件
        </el-button>
        <el-button size="small" type="success" :disabled="!isEditting" @click="submit1">
          上传文件
        </el-button>
        <div slot="tip" class="el-upload__tip">
          支持格式：jpg/png/gif，文件大小不超过2M
        </div>
      </el-upload> -->
    </el-form-item>
    <el-form-item label="任务要求上传1" prop="yaoQiuUpload1">
      <HtUpload :uuid="task.yaoQiuUpload1" :file-list="uploadFileList3" button-text="选文件" :disabled="!isEditting"
        :action="action" :headers="upLoadHeaders" :before-upload="beforeAvatarUpload" />

      <!-- <el-upload
        class="avatar-uploader" :disabled="!isEditting" name="file" :auto-upload="false" :file-list="[]"
        :limit="1" :data="{ type: 'yaoQiuUpload1' }" :headers="{ Authorization: `Bearer ${token}` }"
        action="https://htglxtapi.inscode.cc/sysFile/upload" :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <el-button slot="trigger" size="small" :disabled="!isEditting">
          <i class="el-icon-upload2" /> 选择文件
        </el-button>
        <el-button size="small" type="success" :disabled="!isEditting">
          上传文件
        </el-button>
        <div slot="tip" class="el-upload__tip">
          支持格式：jpg/png/gif，文件大小不超过2M
        </div>
      </el-upload> -->
    </el-form-item>
    <el-form-item label="任务要求上传2" prop="yaoQiuUpload2">
      <HtUpload :uuid="task.yaoQiuUpload2" :file-list="uploadFileList4" button-text="选文件" :disabled="!isEditting"
        :action="action" :headers="upLoadHeaders" :before-upload="beforeAvatarUpload" />

      <!-- <el-upload
        class="avatar-uploader" :disabled="!isEditting" name="file" :auto-upload="false" :file-list="[]"
        :limit="1" :data="{ type: 'yaoQiuUpload2' }" :headers="{ Authorization: `Bearer ${token}` }"
        action="https://htglxtapi.inscode.cc/sysFile/upload" :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <el-button slot="trigger" size="small" :disabled="!isEditting">
          <i class="el-icon-upload2" /> 选择文件
        </el-button>
        <el-button size="small" type="success" :disabled="!isEditting">
          上传文件
        </el-button>
        <div slot="tip" class="el-upload__tip">
          支持格式：jpg/png/gif，文件大小不超过2M
        </div>
      </el-upload> -->
    </el-form-item>
    <el-form-item label="任务完成上传1" prop="wanChengUpload1">
      <HtUpload :uuid="task.wanChengUpload1" :file-list="uploadFileList5" button-text="选文件" :disabled="!isEditting"
        :action="action" :headers="upLoadHeaders" :before-upload="beforeAvatarUpload" />

      <!-- <el-upload
        class="avatar-uploader" :disabled="!isEditting" name="file" :limit="1" :auto-upload="false"
        :file-list="[]" :data="{ type: 'wanChengUpload1' }" :headers="{ Authorization: `Bearer ${token}` }"
        action="https://htglxtapi.inscode.cc/sysFile/upload" :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <el-button slot="trigger" size="small" :disabled="!isEditting">
          <i class="el-icon-upload2" /> 选择文件
        </el-button>
        <el-button size="small" type="success" :disabled="!isEditting">
          上传文件
        </el-button>
        <div slot="tip" class="el-upload__tip">
          支持格式：jpg/png/gif，文件大小不超过2M
        </div>
      </el-upload> -->
    </el-form-item>
    <el-form-item label="任务完成上传2" prop="wanChengUpload2">
      <HtUpload :uuid="task.wanChengUpload2" :file-list="uploadFileList6" button-text="选文件" :disabled="!isEditting"
        :action="action" :headers="upLoadHeaders" :before-upload="beforeAvatarUpload" />

      <!-- <el-upload
        class="avatar-uploader" :disabled="!isEditting" name="file" :limit="1" :auto-upload="false"
        :file-list="[]" :data="{ type: 'wanChengUpload2' }" :headers="{ Authorization: `Bearer ${token}` }"
        action="https://htglxtapi.inscode.cc/sysFile/upload" :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <el-button slot="trigger" size="small" :disabled="!isEditting">
          <i class="el-icon-upload2" /> 选择文件
        </el-button>
        <el-button size="small" type="success" :disabled="!isEditting">
          上传文件
        </el-button>
        <div slot="tip" class="el-upload__tip">
          支持格式：jpg/png/gif，文件大小不超过2M
        </div>
      </el-upload> -->
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
}
</style>
