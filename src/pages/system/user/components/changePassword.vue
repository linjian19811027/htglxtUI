<script   lang="ts">
import { defineComponent, ref, watch } from 'vue'
import type { User } from '../user'
import { UserService } from '../user'

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
        oldPassword: undefined,
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

    const options = ref([])
    const fetchRole = async () => {
      const data = await UserService.fetchRole()
      options.value = data
    }
    onMounted(() => {
      fetchRole()
    })
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

    // const handleSubmit = () => {
    //   form.value?.validate(async (valid) => {
    //     if (valid)
    //     {
    //       emit('submit')
    //     }
    //   })
    // }

    const handleSubmit = () => {
      form.value?.validate(async (valid) => {
        if (valid) {
          UserService.editPassWord(user.value).then((response) => {
            if (response.resultCode == '200') {
              ElMessage.success('修改成功重新登陆')
              useUserStore().logout()
            }
            else { ElMessage.error(response.message) }
          }).catch((error) => {
            ElMessage.error(error)
          })
        }
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
      options,
    }
  },
})
</script>

<template>
  <el-form ref="form" :model="user" label-width="80px" size="small">
    <el-form-item v-if="user.id" label="原密码" prop="oldPassword" :rules="[{ message: '不能为空', required: true }]">
      <el-input v-model.trim="user.oldPassword" type="password" show-password />
    </el-form-item>
    <el-form-item v-if="user.id" label="新密码" prop="password" :rules="[{ message: '不能为空', required: true }]">
      <el-input v-model.trim="user.password" type="password" show-password />
    </el-form-item>
    <el-form-item
      v-if="user.id" label="确认密码" prop="confirmPassword"
      :rules="[{ message: '不能为空', required: true }, { validator: validatePass, trigger: 'blur' }]"
    >
      <el-input v-model.trim="user.confirmPassword" type="password" show-password />
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
