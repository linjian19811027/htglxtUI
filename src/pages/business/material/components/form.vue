<script   lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { Material } from '../material'

interface MaterialFormProps {
    material?: Material
    isEditting?: boolean
    onSubmit?: (material: Material) => void
    onCancel?: () => void
}

export default defineComponent({
    props: {
        material: {
            type: Object as () => Material,
            default: () => ({
                id: undefined,
                materialNo: undefined,
                materialName: undefined,
                materialPrice: undefined,
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
            type: Function as () => (material: Material) => void,
            required: true,
        },
        onCancel: {
            type: Function as () => () => void,
            required: true,
        },
    },
    emits: ['submit', 'cancel'],
    setup(props: MaterialFormProps, { emit }) {
        const form = ref<Nullable<ElForm>>()

        const material = ref<Material>(props.material)

        watch(
            () => props.material,
            (newVal) => {
                material.value = newVal
            }
        )

        const handleSubmit = () => {
            form.value?.validate(async (valid) => {
                if (valid) {
                    emit('submit', material.value)
                }
            })
        }

        const handleCancel = () => {
            emit('cancel')
        }

        return {
            form,
            material,
            handleSubmit,
            handleCancel,
        }
    },
}) 
</script>
<template>
    <el-form ref="form" :model="material" label-width="80px" size="small">
        <el-form-item label="材料编号" prop="materialNo">
            <el-input v-model.trim="material.materialNo" />
        </el-form-item>
        <el-form-item label="材料名称" prop="materialName">
            <el-input v-model.trim="material.materialName" />
        </el-form-item>
        <el-form-item label="材料单价" prop="materialPrice">
            <el-input-number :precision="2" v-model="material.materialPrice"
                :rules="[{ required: true, message: '请输入材料单价', trigger: 'blur' }]" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
            <el-input v-model.trim="material.description" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleSubmit">保存</el-button>
            <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>