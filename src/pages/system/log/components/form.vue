<script   lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { Log } from '../log'

interface LogFormProps {
    log?: Log
    isEditting?: boolean
    onSubmit?: (log: Log) => void
    onCancel?: () => void
}

export default defineComponent({
    props: {
        log: {
            type: Object as () => Log,
            default: () => ({
                id: 0,
                userId: 0,
                userName: '',
                action: '',
                module: '',
                ip: '',
                time: '',
                comment: '',
                errorMessage: '',
            }),
        },
        isEditting: {
            type: Boolean,
            default: false,
        },
        onSubmit: {
            type: Function as () => (log: Log) => void,
            required: true,
        },
        onCancel: {
            type: Function as () => () => void,
            required: true,
        },
    },
    emits: ['submit', 'cancel'],
    setup(props: LogFormProps, { emit }) {
        const form = ref<Nullable<ElForm>>()

        const log = ref<Log>(props.log)

        watch(
            () => props.log,
            (newVal) => {
                log.value = newVal
            }
        )

        const handleSubmit = () => {
            form.value?.validate(async (valid) => {
                if (valid) {
                    emit('submit', log.value)
                }
            })
        }

        const handleCancel = () => {
            emit('cancel')
        }

        return {
            form,
            log,
            handleSubmit,
            handleCancel,
        }
    },
}) </script>
<template>
    <el-form ref="form" :model="log" label-width="80px" size="small">
        <el-form-item label="操作人ID" prop="userId">
            <el-input v-model.number="log.userId" :disabled="isEditting" />
        </el-form-item>
        <el-form-item label="操作人姓名" prop="userName">
            <el-input v-model.trim="log.userName" :disabled="isEditting" />
        </el-form-item>
        <el-form-item label="操作类型" prop="action">
            <el-input v-model.trim="log.action" />
        </el-form-item>
        <el-form-item label="操作模块" prop="module">
            <el-input v-model.trim="log.module" />
        </el-form-item>
        <el-form-item label="操作IP地址" prop="ip">
            <el-input v-model.trim="log.ip" />
        </el-form-item>
        <el-form-item label="操作时间" prop="time">
            <el-date-picker v-model="log.time" type="datetime" format="YYYY-MM-DD HH:mm:ss"  value-format="YYYY-MM-DD HH:mm:ss"/>
        </el-form-item>
        <el-form-item label="备注" prop="comment">
            <el-input v-model.trim="log.comment" />
        </el-form-item>
        <el-form-item label="错误记录" prop="errorMessage">
            <el-input v-model.trim="log.errorMessage" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleSubmit">保存</el-button>
            <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>
 

  