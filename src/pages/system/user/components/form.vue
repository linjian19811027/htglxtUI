<script   lang="ts">
import { defineComponent, ref, watch } from 'vue'
import type { User } from '../user'

interface UserFormProps {
  user?: User
  isEditting?: boolean
  onSubmit?: (user: User) => void
  onCancel?: () => void
}

export default defineComponent({
  props: {
    user: {
      type: Object as () => User,
      default: () => ({
        id: undefined,
        username: undefined,
        email: undefined,
        mobile: undefined,
        sex: undefined,

        password: undefined,
        confirmPassword: undefined,
      }),
    },
    isEditting: {
      type: Boolean,
      default: false,
    },
    onSubmit: {
      type: Function as () => (user: User) => void,
      required: true,
    },
    onCancel: {
      type: Function as () => () => void,
      required: true,
    },
  },
  emits: ['submit', 'cancel'],
  setup(props: UserFormProps, { emit }) {
    const form = ref<Nullable<ElForm>>()

    const user = ref<User>(props.user)

    watch(
      () => props.user,
      (newVal) => {
        user.value = newVal
      },
    )
    const validatePass = (_: any, value: any, callback: any) => {
      if (value !== user.value.password)
        callback(new Error('两次密码不一致'))
      else
        callback()
    }

    const handleSubmit = () => {
      form.value?.validate(async (valid) => {
        if (valid)
          emit('submit', user.value)
      })
    }

    const handleCancel = () => {
      emit('cancel')
    }

    return {
      form,
      user,
      handleSubmit,
      handleCancel,
      validatePass,
    }
  },
})
</script>

<template>
  <el-form ref="form" :model="user" label-width="80px" size="small">
    <el-form-item label="用户名" prop="username" :rules="[{ message: '不能为空', required: true }]">
      <el-input v-model.trim="user.username" />
    </el-form-item>
    <el-form-item v-if="!user.id" label="密码" prop="password" :rules="[{ message: '不能为空', required: true }]">
      <el-input v-model.trim="user.password" type="password" show-password />
    </el-form-item>
    <el-form-item
      v-if="!user.id" label="确认密码" prop="confirmPassword"
      :rules="[{ message: '不能为空', required: true }, { validator: validatePass, trigger: 'blur' }]"
    >
      <el-input v-model.trim="user.confirmPassword" type="password" show-password />
    </el-form-item>

    <el-form-item label="邮箱" prop="email">
      <el-input v-model.trim="user.email" />
    </el-form-item>

    <el-form-item label="电话" w="1/2" :rules="[{ max: 12, message: '请输入正确的手机号', trigger: 'blur' }]" prop="mobile">
      <el-input v-model.trim="user.mobile" />
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <el-radio-group v-model="user.sex">
        <el-radio :label="1">
          男
        </el-radio>
        <el-radio :label="2">
          女
        </el-radio>
      </el-radio-group>
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
