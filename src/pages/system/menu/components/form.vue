<script   lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { Menu } from '../menu'

interface MenuFormProps {
    menu?: Menu
    isEditting?: boolean
    onSubmit?: (menu: Menu) => void
    onCancel?: () => void
}

export default defineComponent({
    props: {
        menu: {
            type: Object as () => Menu,
            default: () => ({
                id: 0,
                name: 0,
                url: '',
                icon: '',
                orderNum: '',

            }),
        },
        isEditting: {
            type: Boolean,
            default: false,
        },
        onSubmit: {
            type: Function as () => (menu: Menu) => void,
            required: true,
        },
        onCancel: {
            type: Function as () => () => void,
            required: true,
        },
    },
    emits: ['submit', 'cancel'],
    setup(props: MenuFormProps, { emit }) {
        const form = ref<Nullable<ElForm>>()

        const menu = ref<Menu>(props.menu)

        watch(
            () => props.menu,
            (newVal) => {
                menu.value = newVal
            }
        )

        const handleSubmit = () => {
            form.value?.validate(async (valid) => {
                if (valid) {
                    emit('submit', menu.value)
                }
            })
        }

        const handleCancel = () => {
            emit('cancel')
        }

        return {
            form,
            menu,
            handleSubmit,
            handleCancel,
        }
    },
}) 
</script>
<template>
    <el-form ref="form" :model="menu" label-width="80px" size="small">
        <el-form-item label="菜单名称" prop="name">
            <el-input v-model.trim="menu.name" />
        </el-form-item>
        <el-form-item label="菜单地址" prop="url">
            <el-input v-model.trim="menu.url" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
            <el-input v-model.trim="menu.icon" />
        </el-form-item>
        <el-form-item label="菜单顺序" prop="orderNum">
            <el-input v-model.number="menu.orderNum" />
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="handleSubmit">保存</el-button>
            <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>
 

  