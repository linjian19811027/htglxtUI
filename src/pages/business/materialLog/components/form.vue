<script   lang="ts">
import { defineComponent, ref, watch } from 'vue'
import type { MaterialLog } from '../materialLog'
import { MaterialLogService } from '../materialLog'

interface MaterialLogFormProps {
    materialLog?: MaterialLog
    isEditting?: boolean
    onSubmit?: (materialLog: MaterialLog) => void
    onCancel?: () => void
}

export default defineComponent({
    props: {
        materialLog: {
            type: Object as () => MaterialLog,
            default: () => ({
                id: undefined,
                materialId: undefined,
                materialNo: undefined,
                taskId: undefined,
                materialAmount: undefined,
                flow: 0,
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
            type: Function as () => (materialLog: MaterialLog) => void,
            required: true,
        },
        onCancel: {
            type: Function as () => () => void,
            required: true,
        },
    },
    emits: ['submit', 'cancel'],
    setup(props: MaterialLogFormProps, { emit }) {
        const form = ref<Nullable<ElForm>>()
        const options = ref([])
        const fetchMaterialDict = async () => {
            const data = await MaterialLogService.fetchMaterialDict()
            options.value = data
        }

        const materialLog = ref<MaterialLog>(props.materialLog)

        const handleMaterialChange = (value) => {
            // let temp=  options.value[value]
            options.value.map((option) => {
                // console.log(option)
                if (option.id === value) {
                    materialLog.value.materialName = option.materialName.split('/')[1]
                    materialLog.value.materialNo = option.materialName.split('/')[0]
                }
            })
        }

        watch(
            () => props.materialLog,
            (newVal) => {
                materialLog.value = newVal
            },
        )
        onMounted(() => {
            fetchMaterialDict()
        })
        const handleSubmit = () => {
            form.value?.validate(async (valid) => {
                if (valid)
                    emit('submit', materialLog.value)
            })
        }

        const handleCancel = () => {
            emit('cancel')
        }

        return {
            form,
            materialLog,
            options, // 将 options 暴露给模板
            handleSubmit,
            handleCancel,
            handleMaterialChange,
        }
    },
})
</script>

<template>
    <el-form ref="form" :model="materialLog" label-width="80px" size="small">
        <el-form-item label="材料 " prop="materialLogId">
            <el-select v-model.number="materialLog.materialId" filterable placeholder="Select"
                @change="handleMaterialChange">
                <el-option v-for="item in options" :key="item.id" :label="item.materialName" :value="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item label="材料编号" prop="materialLogNo">
            <el-input v-model.trim="materialLog.materialNo" disabled />
        </el-form-item>
        <el-form-item label="材料名称" prop="materialLogName">
            <el-input v-model.trim="materialLog.materialName" disabled />
        </el-form-item>
        <el-form-item label="进料数量" prop="materialAmount">
            <el-input-number v-model="materialLog.materialAmount" :precision="2"
                :rules="[{ required: true, message: '请输入进料数量', trigger: 'blur' }]" />
        </el-form-item>

        <el-form-item label="描述" prop="description">
            <el-input v-model.trim="materialLog.description" />
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
