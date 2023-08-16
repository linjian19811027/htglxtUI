<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { DictDataService } from '../dictSub'
import type { DictData } from '../dictSub'
import DictDataForm from './subForm.vue'

interface DictSubFormProps {
  typeId?: number

}

export default defineComponent({
  components: {
    DictDataForm,
  },
  props: {
    typeId: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const currentPage = ref<number>(1)
    const pageSize = 10
    const dictDatas = ref<DictData[]>([])
    const total = ref<number>(0)
    const name = ref<string>('')
    const dialogVisible = ref<boolean>(false)
    const editDialogVisible = ref<boolean>(false)
    const selectedDictData = ref<DictData | null>(null)

    const fetchDictDatas = async () => {
      const { dictDatas: data, total: count } = await DictDataService.fetchDictDatas(
        currentPage.value,
        pageSize,
        name.value || undefined,
        props.typeId || undefined,
      )

      dictDatas.value = data
      total.value = count
    }

    const handlePageChange = (page: number) => {
      currentPage.value = page
      fetchDictDatas()
    }

    const handleSearch = () => {
      currentPage.value = 1
      fetchDictDatas()
    }

    const handleAdd = async (dictData: DictData) => {
      dictData.typeId = props.typeId
      await DictDataService.addDictData(dictData)
      dialogVisible.value = false
      fetchDictDatas()
    }

    const handleEdit = (dictData: DictData) => {
      dictData.typeId = props.typeId
      selectedDictData.value = dictData
      editDialogVisible.value = true
    }

    const handleUpdate = async (dictData: DictData) => {
      await DictDataService.updateDictData(dictData)
      editDialogVisible.value = false
      fetchDictDatas()
    }

    const handleDelete = async (dictData: DictData) => {
      await DictDataService.deleteDictData(dictData.id)
      fetchDictDatas()
    }

    const handleCancel = () => {
      dialogVisible.value = false
    }

    const handleCancelEdit = () => {
      editDialogVisible.value = false
    }

    onMounted(() => {
      console.log('onMounted')
      fetchDictDatas()
    })

    return {
      currentPage,
      pageSize,
      dictDatas,
      total,
      name,
      dialogVisible,
      editDialogVisible,
      selectedDictData,
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
      <el-tab-pane label="字典管理">
        <el-row type="flex" justify="space-between">
          <el-col :span="12">
            <el-input v-model.trim="name" placeholder="请输入字典名称" @keyup.enter.native="handleSearch" />
          </el-col>
        </el-row>
        <el-row type="flex" justify="end">
          <el-button-group>
            <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">
              添加
            </el-button>
          </el-button-group>
        </el-row>
        <el-table :data="dictDatas" stripe sticky-header border>
          <el-table-column prop="name" label="字典名称" />
          <el-table-column prop="code" label="字典编号" />
          <el-table-column prop="value" label="字典值" />

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
        <el-dialog v-model="dialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="添加字典" destroy-on-close="true">
          <DictDataForm @submit="handleAdd" @cancel="handleCancel" />
        </el-dialog>
        <!-- <el-dialog title="编辑日志" :visible.sync="editDialogVisible" width="50%"> -->

        <el-dialog v-model="editDialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="编辑字典" destroy-on-close="true">
          <DictDataForm :dict-data="selectedDictData" @submit="handleUpdate" @cancel="handleCancelEdit" />
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
