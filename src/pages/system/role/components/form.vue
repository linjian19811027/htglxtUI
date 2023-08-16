<script   lang="ts">
import { defineComponent, ref, watch } from 'vue'
import type { Role } from '../role'

interface RoleFormProps {
  role?: Role
  isEditting?: boolean
  onSubmit?: (role: Role) => void
  onCancel?: () => void
}

export default defineComponent({
  props: {
    role: {
      type: Object as () => Role,
      default: () => ({
        id: undefined,
        name: undefined,
        description: undefined,
        status: undefined,
        createTime: undefined,
      }),
    },
    isEditting: {
      type: Boolean,
      default: false,
    },
    onSubmit: {
      type: Function as () => (role: Role) => void,
      required: true,
    },
    onCancel: {
      type: Function as () => () => void,
      required: true,
    },
  },
  emits: ['submit', 'cancel'],
  setup(props: RoleFormProps, { emit }) {
    const form = ref<Nullable<ElForm>>()

    const role = ref<Role>(props.role)

    watch(
      () => props.role,
      (newVal) => {
        role.value = newVal
      },
    )

    const handleSubmit = () => {
      form.value?.validate(async (valid) => {
        if (valid) {
          console.log(role.value)
          emit('submit', role.value)
        }
      })
    }

    const handleCancel = () => {
      emit('cancel')
    }

    return {
      form,
      role,
      handleSubmit,
      handleCancel,
    }
  },
})
</script>

<template>
  <el-form ref="form" :model="role" label-width="80px" size="small">
    <el-form-item label="角色名称" prop="name">
      <el-input v-model.trim="role.name" />
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input v-model.trim="role.description" />
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
