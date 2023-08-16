<script   lang="ts">
import { defineComponent, ref, watch } from 'vue'
import type { Permission } from '../permission'

interface PermissionFormProps {
  permission?: Permission
  isEditting?: boolean
  onSubmit?: (permission: Permission) => void
  onCancel?: () => void
}

export default defineComponent({
  props: {
    permission: {
      type: Object as () => Permission,
      default: () => ({
        id: undefined,
        name: undefined,
        description: undefined,
        url: undefined,
        type: undefined,
        parentId: undefined,
        createTime: undefined,

      }),
    },
    isEditting: {
      type: Boolean,
      default: false,
    },
    onSubmit: {
      type: Function as () => (permission: Permission) => void,
      required: true,
    },
    onCancel: {
      type: Function as () => () => void,
      required: true,
    },
  },
  emits: ['submit', 'cancel'],
  setup(props: PermissionFormProps, { emit }) {
    const form = ref<Nullable<ElForm>>()

    const permission = ref<Permission>(props.permission)

    watch(
      () => props.permission,
      (newVal) => {
        permission.value = newVal
      },
    )

    const handleSubmit = () => {
      form.value?.validate(async (valid) => {
        if (valid)
          emit('submit', permission.value)
      })
    }

    const handleCancel = () => {
      emit('cancel')
    }

    return {
      form,
      permission,
      handleSubmit,
      handleCancel,
    }
  },
})
</script>

<template>
  <el-form ref="form" :model="permission" label-width="80px" size="small">
    <el-form-item label="权限名称" prop="name">
      <el-input v-model.trim="permission.name" />
    </el-form-item>
    <el-form-item label="权限编码" prop="url">
      <el-input v-model.trim="permission.url" />
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input v-model.trim="permission.description" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSubmit">
        保存
      </el-button>
      <el-button @click="handleCancel">
        取消
      </el-button>
    </el-form-item>
  </el-form>
</template>
