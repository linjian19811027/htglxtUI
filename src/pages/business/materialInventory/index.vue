<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import type { MaterialInventory } from './materialInventory'
import { MaterialInventoryService } from './materialInventory'
import MaterialInventoryForm from './components/form.vue'

export default defineComponent({

  components: {
    MaterialInventoryForm,
  },
  setup() {
    const currentPage = ref<number>(1)
    const pageSize = 10
    const materialInventorys = ref<MaterialInventory[]>([])
    const total = ref<number>(0)
    const materialName = ref<string>('')
    const materialNo = ref<string>('')

    const dialogVisible = ref<boolean>(false)
    const editDialogVisible = ref<boolean>(false)
    const selectedMaterialInventory = ref<MaterialInventory | null>(null)

    const fetchMaterialInventorys = async () => {
      const { materialInventorys: data, total: count } = await MaterialInventoryService.fetchMaterialInventorys(
        currentPage.value,
        pageSize,
        materialName.value || undefined,
        materialNo.value || undefined,

      )

      materialInventorys.value = data
      total.value = count
    }

    const handlePageChange = (page: number) => {
      currentPage.value = page
      fetchMaterialInventorys()
    }

    const handleSearch = () => {
      currentPage.value = 1

      fetchMaterialInventorys()
    }

    const handleAdd = async (materialInventory: MaterialInventory) => {
      await MaterialInventoryService.addMaterialInventory(materialInventory)
      dialogVisible.value = false
      fetchMaterialInventorys()
    }

    const handleEdit = (materialInventory: MaterialInventory) => {
      selectedMaterialInventory.value = materialInventory
      editDialogVisible.value = true
    }

    const handleUpdate = async (materialInventory: MaterialInventory) => {
      await MaterialInventoryService.updateMaterialInventory(materialInventory)
      editDialogVisible.value = false
      fetchMaterialInventorys()
    }

    const handleDelete = async (materialInventory: MaterialInventory) => {
      await MaterialInventoryService.deleteMaterialInventory(materialInventory.id)
      fetchMaterialInventorys()
    }

    const handleCancel = () => {
      dialogVisible.value = false
    }

    const handleCancelEdit = () => {
      editDialogVisible.value = false
    }

    onMounted(() => {
      fetchMaterialInventorys()
    })

    return {
      currentPage,
      pageSize,
      materialInventorys,
      total,

      materialName,
      materialNo,
      dialogVisible,
      editDialogVisible,

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
        </el-row>
        <!-- <el-row type="flex" justify="end">
          <el-button-group>
            <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">
              添加
            </el-button>
          </el-button-group>
        </el-row> -->
        <el-table :data="materialInventorys" stripe sticky-header border>
          <el-table-column prop="materialName" label="材料名称" />
          <el-table-column prop="materialNo" label="材料编号" />
          <el-table-column prop="materialInventory" label="数量" />

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
            v-model:current-page="currentPage" :page-size="pageSize" layout="prev, pager, next"
            :total="total" @current-change="handlePageChange"
          />
        </div>
        <!-- <el-dialog title="添加日志" :visible.sync="dialogVisible" width="50%"> -->
        <el-dialog
          v-model="dialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="添加材料"
          destroy-on-close="true"
        >
          <MaterialInventoryForm @submit="handleAdd" @cancel="handleCancel" />
        </el-dialog>
        <!-- <el-dialog title="编辑日志" :visible.sync="editDialogVisible" width="50%"> -->

        <el-dialog v-model="editDialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="编辑材料">
          <MaterialInventoryForm :material-log="selectedMaterialInventory" @submit="handleUpdate" @cancel="handleCancelEdit" />
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
  title: 库存查看
  icon: i-carbon:cube-view
</route>
