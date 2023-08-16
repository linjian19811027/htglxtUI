<script   lang="ts">
import { defineComponent, ref, watch } from 'vue'
import type { Dict } from '../dict'

interface DictFormProps {
  dict?: Dict
  isEditting?: boolean
  onSubmit?: (dict: Dict) => void
  onCancel?: () => void
}

export default defineComponent({
  props: {
    dict: {
      type: Object as () => Dict,
      default: () => ({
        id: 0,
        name: '',
        code: '',
        description: '',
        createTime: '',
      }),
    },
    isEditting: {
      type: Boolean,
      default: false,
    },
    onSubmit: {
      type: Function as () => (dict: Dict) => void,
      required: true,
    },
    onCancel: {
      type: Function as () => () => void,
      required: true,
    },
  },
  emits: ['submit', 'cancel'],
  setup(props: DictFormProps, { emit }) {
    const form = ref<Nullable<ElForm>>()

    const dict = ref<Dict>(props.dict)

    watch(
      () => props.dict,
      (newVal) => {
        dict.value = newVal
      },
    )

    const handleSubmit = () => {
      form.value?.validate(async (valid) => {
        if (valid)
          emit('submit', dict.value)
      })
    }

    const handleCancel = () => {
      emit('cancel')
    }

    return {
      form,
      dict,
      handleSubmit,
      handleCancel,
    }
  },
})
</script>

<template>
  <el-form ref="form" :model="dict" label-width="80px" size="small">
    <el-form-item label="字典名称" prop="name">
      <el-input v-model.trim="dict.name" />
    </el-form-item>
    <el-form-item label="字典编号" prop="code">
      <el-input v-model.trim="dict.code" />
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input v-model.trim="dict.description" />
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
