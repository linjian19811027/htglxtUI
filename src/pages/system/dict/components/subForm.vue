<script   lang="ts">
import { defineComponent, ref, watch } from 'vue'
import type { DictData } from '../dictSub'

interface DictDataFormProps {
  dictData?: DictData
  isEditting?: boolean
  onSubmit?: (dictData: DictData) => void
  onCancel?: () => void
}

export default defineComponent({
  props: {
    dictData: {
      type: Object as () => DictData,
      default: () => ({
        id: 0,
        typeId: 0,
        code: '',
        name: '',
        value: '',
        orderNum: 0,
        createTime: undefined,
      }),
    },
    isEditting: {
      type: Boolean,
      default: false,
    },
    onSubmit: {
      type: Function as () => (dictData: DictData) => void,
      required: true,
    },
    onCancel: {
      type: Function as () => () => void,
      required: true,
    },
  },
  emits: ['submit', 'cancel'],
  setup(props: DictDataFormProps, { emit }) {
    const form = ref<Nullable<ElForm>>()

    const dictData = ref<DictData>(props.dictData)

    watch(
      () => props.dictData,
      (newVal) => {
        dictData.value = newVal
      },
    )

    const handleSubmit = () => {
      form.value?.validate(async (valid) => {
        if (valid)
          emit('submit', dictData.value)
      })
    }

    const handleCancel = () => {
      emit('cancel')
    }

    return {
      form,
      dictData,
      handleSubmit,
      handleCancel,
    }
  },
})
</script>

<template>
  <el-form ref="form" :model="dictData" label-width="80px" size="small">
    <el-form-item label="字典名称" prop="name">
      <el-input v-model.trim="dictData.name" />
    </el-form-item>
    <el-form-item label="字典编号" prop="code">
      <el-input v-model.trim="dictData.code" />
    </el-form-item>
    <el-form-item label="字典值" prop="value">
      <el-input v-model.trim="dictData.value" />
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
