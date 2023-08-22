<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import type { Material } from './material'
import { MaterialService } from './material'
import MaterialForm from './components/form.vue'

export default defineComponent({

  components: {
    MaterialForm,
  },
  setup() {
    const currentPage = ref<number>(1)
    const pageSize = 10
    const materials = ref<Material[]>([])
    const total = ref<number>(0)
    const materialName = ref<string>('')
    const materialNo = ref<string>('')
    const dialogVisible = ref<boolean>(false)
    const editDialogVisible = ref<boolean>(false)
    const selectedMaterial = ref<Material | null>(null)

    const fetchMaterials = async () => {
      const { materials: data, total: count } = await MaterialService.fetchMaterials(
        currentPage.value,
        pageSize,
        materialName.value || undefined,
        materialNo.value || undefined,
      )

      materials.value = data
      total.value = count
    }

    const handlePageChange = (page: number) => {
      currentPage.value = page
      fetchMaterials()
    }

    const handleSearch = () => {
      currentPage.value = 1
      fetchMaterials()
    }

    const handleAdd = async (material: Material) => {
      await MaterialService.addMaterial(material)
      dialogVisible.value = false
      fetchMaterials()
    }

    const handleEdit = (material: Material) => {
      selectedMaterial.value = material
      editDialogVisible.value = true
    }

    const handleUpdate = async (material: Material) => {
      await MaterialService.updateMaterial(material)
      editDialogVisible.value = false
      fetchMaterials()
    }

    const handleDelete = async (material: Material) => {
      await MaterialService.deleteMaterial(material.id)
      fetchMaterials()
    }

    const handleCancel = () => {
      dialogVisible.value = false
    }

    const handleCancelEdit = () => {
      editDialogVisible.value = false
    }

    onMounted(() => {
      fetchMaterials()
    })

    return {
      currentPage,
      pageSize,
      materials,
      total,
      materialName,
      materialNo,
      dialogVisible,
      editDialogVisible,
      selectedMaterial,
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
      <el-tab-pane label="材料管理">
        <el-row type="flex" justify="space-between">
          <el-col :span="12">
            <el-input v-model.trim="materialName" placeholder="请输入材料名称" @keyup.enter.native="handleSearch" />
          </el-col>
          <el-col :span="12">
            <el-input v-model.trim="materialNo" placeholder="请输入材料编号" @keyup.enter.native="handleSearch" />
          </el-col>
        </el-row>
        <el-row type="flex" justify="end">
          <el-button-group>
            <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">
              添加
            </el-button>
          </el-button-group>
        </el-row>
        <el-table :data="materials" stripe sticky-header border>
          <el-table-column prop="materialName" label="材料名称" />
          <el-table-column prop="materialNo" label="材料编号" />
          <el-table-column prop="materialPrice" label="材料单价" />
          <el-table-column prop="description" label="描述" />

          <el-table-column label="操作">
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
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage" :page-size="pageSize" layout="prev, pager, next" :total="total"
            @current-change="handlePageChange"
          />
        </div>
        <!-- <el-dialog title="添加日志" :visible.sync="dialogVisible" width="50%"> -->
        <el-dialog v-model="dialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="添加材料">
          <MaterialForm @submit="handleAdd" @cancel="handleCancel" />
        </el-dialog>
        <!-- <el-dialog title="编辑日志" :visible.sync="editDialogVisible" width="50%"> -->

        <el-dialog v-model="editDialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="编辑材料">
          <MaterialForm :material="selectedMaterial" @submit="handleUpdate" @cancel="handleCancelEdit" />
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
  title: 材料管理
  icon: i-icon-park:material-two
  order: 7
</route>
