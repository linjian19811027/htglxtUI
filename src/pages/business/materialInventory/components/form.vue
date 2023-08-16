<script   lang="ts">
import { defineComponent, ref, watch } from 'vue'
import type { MaterialInventory } from '../materialInventory'
import { MaterialInventoryService } from '../materialInventory'

interface MaterialInventoryFormProps {
    materialInventory?: MaterialInventory
    isEditting?: boolean
    onSubmit?: (materialInventory: MaterialInventory) => void
    onCancel?: () => void
}

export default defineComponent({
    props: {
        materialInventory: {
            type: Object as () => MaterialInventory,
            default: () => ({
                id: undefined,
                materialId: undefined,
                materialNo: undefined,
                taskId: undefined,
                materialInventory: undefined,
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
            type: Function as () => (materialInventory: MaterialInventory) => void,
            required: true,
        },
        onCancel: {
            type: Function as () => () => void,
            required: true,
        },
    },
    emits: ['submit', 'cancel'],
    setup(props: MaterialInventoryFormProps, { emit }) {
        const form = ref<Nullable<ElForm>>()
        const options = ref([])
        const fetchMaterialDict = async () => {
            const data = await MaterialInventoryService.fetchMaterialDict()
            options.value = data
        }

        const materialInventory = ref<MaterialInventory>(props.materialInventory)

        const handleMaterialChange = (value) => {
            // let temp=  options.value[value]
            options.value.map((option) => {
                // console.log(option)
                if (option.id === value) {
                    materialInventory.value.materialName = option.materialName.split('/')[1]
                    materialInventory.value.materialNo = option.materialName.split('/')[0]
                }
            })
        }

        watch(
            () => props.materialInventory,
            (newVal) => {
                materialInventory.value = newVal
            },
        )
        onMounted(() => {
            fetchMaterialDict()
        })
        const handleSubmit = () => {
            form.value?.validate(async (valid) => {
                if (valid)
                    emit('submit', materialInventory.value)
            })
        }

        const handleCancel = () => {
            emit('cancel')
        }

        return {
            form,
            materialInventory,
            options, // 将 options 暴露给模板
            handleSubmit,
            handleCancel,
            handleMaterialChange,
        }
    },
})
</script>

<template>
    <el-form ref="form" :model="materialInventory" label-width="80px" size="small">
        <el-form-item label="材料 " prop="materialInventoryId">
            <el-select v-model.number="materialInventory.materialId" filterable placeholder="Select"
                @change="handleMaterialChange">
                <el-option v-for="item in options" :key="item.id" :label="item.materialName" :value="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item label="材料编号" prop="materialInventoryNo">
            <el-input v-model.trim="materialInventory.materialNo" disabled />
        </el-form-item>
        <el-form-item label="材料名称" prop="materialInventoryName">
            <el-input v-model.trim="materialInventory.materialName" disabled />
        </el-form-item>
        <el-form-item label="进料数量" prop="materialAmount">
            <el-input-number v-model="materialInventory.materialAmount" :precision="2"
                :rules="[{ required: true, message: '请输入进料数量', trigger: 'blur' }]" />
        </el-form-item>

        <el-form-item label="描述" prop="description">
            <el-input v-model.trim="materialInventory.description" />
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
