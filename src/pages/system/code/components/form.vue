<script   lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { Code } from '../code'

interface CodeFormProps {
    code?: Code
    isEditting?: boolean
    onSubmit?: (code: Code) => void
    onCancel?: () => void
}

export default defineComponent({
    props: {
        code: {
            type: Object as () => Code,
            default: () => ({
                id: undefined,
  prefix: undefined,
  dateFormat: undefined,
  digit: undefined,
  currentCode: undefined,
  nowDate: undefined,
  step: undefined,
  description: undefined,
  createName: undefined,
  createTime: undefined,

            }),
        },
        isEditting: {
            type: Boolean,
            default: false,
        },
        onSubmit: {
            type: Function as () => (code: Code) => void,
            required: true,
        },
        onCancel: {
            type: Function as () => () => void,
            required: true,
        },
    },
    emits: ['submit', 'cancel'],
    setup(props: CodeFormProps, { emit }) {
        const form = ref<Nullable<ElForm>>()

        const code = ref<Code>(props.code)

        watch(
            () => props.code,
            (newVal) => {
                code.value = newVal
            }
        )

        const handleSubmit = () => {
            form.value?.validate(async (valid) => {
                if (valid) {
                    emit('submit', code.value)
                }
            })
        }

        const handleCancel = () => {
            emit('cancel')
        }

        return {
            form,
            code,
            handleSubmit,
            handleCancel,
        }
    },
}) 
</script>
<template>
    <el-form ref="form" :model="code" label-width="80px" size="small">
        <el-form-item label="编号前缀" prop="prefix">
            <el-input v-model.trim="code.prefix" />
        </el-form-item>
        <el-form-item label="日期格式" prop="dateFormat">
            <el-input v-model.trim="code.dateFormat" />
        </el-form-item>
        <el-form-item label="流水位数" prop="digit">
            <el-input v-model.number="code.digit" />
        </el-form-item>
        <el-form-item label="编号步长" prop="step">
            <el-input v-model.number="code.step" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
            <el-input v-model.trim="code.description" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleSubmit">保存</el-button>
            <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>
 

  