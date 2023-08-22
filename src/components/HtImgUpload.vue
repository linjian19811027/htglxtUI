<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { UploadInstance, UploadProps } from 'element-plus'
import axios from 'axios'
import { Plus } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'HtImgUpload',
  components: {
    Plus,
  },
  props: {
    value: String,
    disabled: Boolean,
    buttonText: { type: String, default: '选择文件' },
    submitText: { type: String, default: '上传文件' },
    class: String,
    buttonType: { type: String, default: 'success' },
    tipText: { type: String, default: '支持格式：jpg/png/gif，文件大小不超过2M' },
    limit: { type: Number, default: 1 },
    headers: { type: Object, default: () => ({}) },
    action: { type: String, default: '' },
    uuid: { type: String, default: '' },
    beforeAvatarUpload: { type: Function, default: null }, // Change the default value to null
    fileList: {
      type: Array,
      // default: function () { return [] }
      default: () => []
    }, // 添加 fileList 属性
    //fileList: Array,
  },
  setup(props, { emit }) {
    
    // const fileList =UploadUserFile  ref([])
    //const fileList = ref([])
    //const fileList = ref(props.fileList || []) // 使用 props.fileList
    const uploadImgRef = ref<UploadInstance>()
    const uuid = ref<string>('')
    const dialogImageUrl = ref('')
    const dialogVisible = ref(false)
    const imageUrl = ref('')

    const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
      if (props.beforeAvatarUpload) { // Check if beforeAvatarUpload is defined
        return props.beforeAvatarUpload(rawFile)
      } else {
        if (rawFile.type !== 'image/jpeg') {
          ElMessage.error('必须为JPG格式!')
          return false
        }
        else if (rawFile.size / 1024 / 1024 > 20) {
          ElMessage.error('不能超过20MB!')
          return false
        }
        return true
      }
    }

    const submit = () => {
      uploadImgRef.value!.submit()
    }

    const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
      if (uploadFile.status !== 'success')// ready
        return
      // 按id删除
      const token = localStorage.getItem('token') || ''
      axios.delete(`https://htglxtapi.inscode.cc/sysFile/${uploadFile.id}`, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          ElMessage.success('删除成功')
        })
        .catch((error) => {
          ElMessage.error(`删除失败${error}`)
        })
    }
    const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
      dialogImageUrl.value = uploadFile.url!
      dialogVisible.value = true
    }

    const onSuccess: UploadProps['onSuccess'] = (
      response,
      uploadFile,
    ) => {
      if (response.resultCode === 200) {
        const url = `https://htglxtapi.inscode.cc/sysFile/download/${response.message}`
        // debugger
        // fileList.value = [uploadFile]
        uploadFile.url = url
        uploadFile.id = response.message
        props.fileList.value.push(uploadFile) // 将上传成功的文件添加到数组中
        emit('update:value', uuid.value)
        emit('success', response, uploadFile)
      }
      else {
        ElMessage.error(response.message)
      }
    }

    return {
      //fileList,
      isEditting: !props.disabled,
      beforeUpload,
      submit,
      onSuccess,
      uploadImgRef,
      imageUrl,
      handleRemove,
      handlePictureCardPreview,
      dialogVisible,
      dialogImageUrl,
    }
  },
})
</script>

<template>
  <el-upload ref="uploadImgRef" :class="class" :data="{ folder: uuid }" :disabled="!isEditting" name="file"
    :file-list="fileList" :headers="headers" :action="action" :before-upload="beforeUpload" :on-success="onSuccess"
    list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
    <el-icon>
      <Plus />
    </el-icon>
    <template #tip>
      <div class="el-upload__tip">
        {{ tipText }}
      </div>
    </template>
  </el-upload>
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image">
  </el-dialog>
</template>
