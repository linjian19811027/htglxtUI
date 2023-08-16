<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { UploadInstance, UploadProps } from 'element-plus'
import axios from 'axios'

export default defineComponent({
  name: 'HtUpload',

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
    //fileList: Array, // 添加 fileList 属性
    fileList: {
      type: Array,
      // default: function () { return [] }
      default: () => []
    }, // 添加 fileList 属性
  },
  setup(props, { emit }) {
    // const fileList =UploadUserFile  ref([])
    //const fileList = ref([])
    //const fileList = ref(props.fileList || []) // 使用 props.fileList
    const uploadRef = ref<UploadInstance>()
    const uuid = ref<string>('')
    const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
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

    const submit = () => {
      uploadRef.value!.submit()
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

    const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
      if (!uploadFile.url)
        return
      // 需要下载
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = uploadFile.url
      link.download = uploadFile.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
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

        // 传递给父组件或者调用外部方法
        // emit('update:value', imageUrl)
        // emit('update:value', response.message)
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
      uploadRef,
      handlePreview,
      handleRemove,
    }
  },
})
</script>

<template>
  <el-upload
    ref="uploadRef" :class="class" :data="{ folder: uuid }" :disabled="!isEditting" name="file"
    :auto-upload="false" :file-list="fileList" :headers="headers" :action="action" :before-upload="beforeUpload"
    :on-success="onSuccess" :on-preview="handlePreview" :on-remove="handleRemove"
  >
    <template #trigger>
      <el-button type="primary">
        {{ buttonText }}
      </el-button>
    </template>

    <el-button class="ml-3" :type="buttonType" @click="submit">
      {{ submitText }}
    </el-button>

    <template #tip>
      <div class="el-upload__tip">
        {{ tipText }}
      </div>
    </template>
    <!-- <template v-for="file in fileList" :key="file.uid" #file>
      <div>
        <div class="file-name">
          {{ file.name }}
        </div>
        <a :href="file.url" class="file-download">
          下载
        </a>
      </div>
    </template> -->
  </el-upload>
</template>
