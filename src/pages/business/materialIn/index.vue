<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import type { MaterialLog } from './materialIn'
import { MaterialLogService } from './materialIn'
import MaterialLogForm from './components/form.vue'

export default defineComponent({

  components: {
    MaterialLogForm,
  },
  setup() {
    const currentPage = ref<number>(1)
    const pageSize = 10
    const materialLogs = ref<MaterialLog[]>([])
    const total = ref<number>(0)
    const materialName = ref<string>('')
    const materialNo = ref<string>('')
    const timeRange = ref<string[]>([])
    const dialogVisible = ref<boolean>(false)
    const editDialogVisible = ref<boolean>(false)
    const selectedMaterialLog = ref<MaterialLog | null>(null)

    const fetchMaterialLogs = async () => {
      const { materialLogs: data, total: count } = await MaterialLogService.fetchMaterialLogs(
        currentPage.value,
        pageSize,
        materialName.value || undefined,
        materialNo.value || undefined,
        timeRange.value[0] || undefined,
        timeRange.value[1] || undefined,
      )

      materialLogs.value = data
      total.value = count
    }

    const handlePageChange = (page: number) => {
      currentPage.value = page
      fetchMaterialLogs()
    }

    const handleSearch = () => {
      currentPage.value = 1
      fetchMaterialLogs()
    }

    const handleAdd = async (materialLog: MaterialLog) => {
      await MaterialLogService.addMaterialLog(materialLog)
      dialogVisible.value = false
      fetchMaterialLogs()
    }

    const handleEdit = (materialLog: MaterialLog) => {
      selectedMaterialLog.value = materialLog
      editDialogVisible.value = true
    }

    const handleUpdate = async (materialLog: MaterialLog) => {
      await MaterialLogService.updateMaterialLog(materialLog)
      editDialogVisible.value = false
      fetchMaterialLogs()
    }

    const handleDelete = async (materialLog: MaterialLog) => {
      await MaterialLogService.deleteMaterialLog(materialLog.id)
      fetchMaterialLogs()
    }

    const handleCancel = () => {
      dialogVisible.value = false
    }

    const handleCancelEdit = () => {
      editDialogVisible.value = false
    }

    onMounted(() => {
      fetchMaterialLogs()
    })

    return {
      currentPage,
      pageSize,
      materialLogs,
      total,
      materialName,
      materialNo,
      dialogVisible,
      editDialogVisible,
      selectedMaterialLog,
      timeRange,
      handlePageChange,
      handleSearch,
      handleAdd,
      handleEdit,
      handleUpdate,
      handleDelete,
      handleCancel,
      handleCancelEdit,
    }
  },

})
</script>

<template>
  <div>
    <el-tabs type="border-card" m-3 flex-1 overflow-auto>
      <el-tab-pane label="进料管理">
        <el-row type="flex" justify="space-between">
          <el-col :span="12">
            <el-input v-model.trim="materialName" placeholder="请输入材料名称" @keyup.enter.native="handleSearch" />
          </el-col>
          <el-col :span="12">
            <el-input v-model.trim="materialNo" placeholder="请输入材料编号" @keyup.enter.native="handleSearch" />
          </el-col>
          <el-col :span="12">
            <el-date-picker
              v-model="timeRange" type="daterange" format="YYYY-MM-DD" start-placeholder="开始日期"
              end-placeholder="结束日期" range-separator="至" value-format="YYYY-MM-DD" @change="handleSearch"
            />
          </el-col>
        </el-row>
        <el-row type="flex" justify="end">
          <el-button-group>
            <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">
              添加
            </el-button>
          </el-button-group>
        </el-row>
        <el-table :data="materialLogs" stripe sticky-header border>
          <el-table-column prop="materialName" label="材料名称" />
          <el-table-column prop="materialNo" label="材料编号" />
          <el-table-column prop="materialAmount" label="进货数量" />
          <el-table-column prop="createTime" label="进货时间" />
          <el-table-column prop="description" label="描述" />

          <!-- <el-table-column label="操作">
            <template #default="{ row }">
              <el-button-group>
                <el-button type="primary" size="small" @click="handleEdit(row)">
                  修改
                </el-button>
                <el-button type="danger" size="small" @click="handleDelete(row)">
                  删除
                </el-button>
              </el-button-group>
            </template>
          </el-table-column> -->
        </el-table>
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage" :page-size="pageSize" layout="prev, pager, next" :total="total"
            @current-change="handlePageChange"
          />
        </div>
        <!-- <el-dialog title="添加日志" :visible.sync="dialogVisible" width="50%"> -->
        <el-dialog v-model="dialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="添加材料" destroy-on-close="true">
          <MaterialLogForm @submit="handleAdd" @cancel="handleCancel" />
        </el-dialog>
        <!-- <el-dialog title="编辑日志" :visible.sync="editDialogVisible" width="50%"> -->

        <el-dialog v-model="editDialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="编辑材料">
          <MaterialLogForm :material-log="selectedMaterialLog" @submit="handleUpdate" @cancel="handleCancelEdit" />
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.pagination {
    text-align: right;
    margin-top: 20px;
}
</style>

<route lang="yaml">
meta:
  layout: home
  title: 进货管理
  icon: i-mdi:login
</route>
