<script   lang="ts">
import { defineComponent, ref, watch } from 'vue'
import type { Role } from '../role'
import { RoleService } from '../role'


export default defineComponent({
    props: {
        roleId: {
            type: Number,
            default: 0,
        },
    },
    emits: ['submit', 'cancel'],
    setup(props, { emit }) {
        const form = ref<Nullable<ElForm>>()

        const role = ref<Role>(props.role)

        const value = ref([])
        const options = ref([])



        const handleSubmit = () => {
            try {
                // 构造需要提交的数据
                const data = value.value.map((permissionId) => {
                    return {
                        roleId: props.roleId,
                        permissionId: permissionId,
                    }
                })

                // Promise.all方法并发执行多个异步任务，即将每个元素提交到后台接口，使用await关键字等待所有任务完成。

                RoleService.submitRp(data)


                // 提交成功，触发submit事件
                emit('submit')
            } catch (error) {
                // 处理异常情况
                console.error(error)
            }
        }





        const handleCancel = () => {
            emit('cancel')
        }

        const fetchPermission = async () => {
            const data = await RoleService.fetchPermission()
            options.value = data
        }
        const fetchPermissionByRole = async () => {
            const data = await RoleService.fetchPermissionByRole(props.roleId)
            if (data?.length > 0) {
                data.forEach((item) => {
                    value.value.push(item.permissionId);
                })
            }

        }
        onMounted(() => {
            fetchPermission()
            fetchPermissionByRole()
        })
        return {
            form,
            role,
            handleSubmit,
            handleCancel,
            value,
            options
        }
    },
})
</script>

<template>
    <el-form ref="form" label-width="80px" size="small">
        <el-transfer v-model="value" :data="options" :props="{
            key: 'id',
            label: 'name',
        }" />

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
