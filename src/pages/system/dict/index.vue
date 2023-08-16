<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import type { Dict } from './dict'
import { DictService } from './dict'
import DictForm from './components/form.vue'
import SubIndex from './components/subIndex.vue'

export default defineComponent({

  components: {
    DictForm, SubIndex,
  },
  setup() {
    const currentPage = ref<number>(1)
    const pageSize = 10
    const dicts = ref<Dict[]>([])
    const total = ref<number>(0)
    const name = ref<string>('')
    const dialogVisible = ref<boolean>(false)
    const editDialogVisible = ref<boolean>(false)
    const selectedDict = ref<Dict | null>(null)
    const subListDialogVisible = ref<boolean>(false)
    const fetchDicts = async () => {
      const { dicts: data, total: count } = await DictService.fetchDicts(
        currentPage.value,
        pageSize,
        name.value || undefined,
      )

      dicts.value = data
      total.value = count
    }

    const handlePageChange = (page: number) => {
      currentPage.value = page
      fetchDicts()
    }

    const handleSearch = () => {
      currentPage.value = 1
      fetchDicts()
    }

    const handleAdd = async (dict: Dict) => {
      await DictService.addDict(dict)
      dialogVisible.value = false
      fetchDicts()
    }

    const handleEdit = (dict: Dict) => {
      selectedDict.value = dict
      editDialogVisible.value = true
    }

    const handleUpdate = async (dict: Dict) => {
      await DictService.updateDict(dict)
      editDialogVisible.value = false
      fetchDicts()
    }

    const handleDelete = async (dict: Dict) => {
      await DictService.deleteDict(dict.id)
      fetchDicts()
    }

    // 弹出子页面
    const handleList = async (dict: Dict) => {
      selectedDict.value = dict
      subListDialogVisible.value = true
    }

    const handleListCancel = () => {
      subListDialogVisible.value = false
    }

    const handleCancel = () => {
      dialogVisible.value = false
    }

    const handleCancelEdit = () => {
      editDialogVisible.value = false
    }

    onMounted(() => {
      fetchDicts()
    })

    return {
      currentPage,
      pageSize,
      dicts,
      total,
      name,
      dialogVisible,
      editDialogVisible,
      subListDialogVisible,
      selectedDict,
      handlePageChange,
      handleSearch,
      handleAdd,
      handleEdit,
      handleUpdate,
      handleDelete,
      handleCancel,
      handleCancelEdit,
      handleList,
      handleListCancel,
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
        <el-table :data="dicts" stripe sticky-header border>
          <el-table-column prop="name" label="字典名称" />
          <el-table-column prop="code" label="字典编号" />
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
                <el-button type="danger" size="small" @click="handleList(row)">
                  值
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
        <el-dialog v-model="dialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="添加字典">
          <DictForm @submit="handleAdd" @cancel="handleCancel" />
        </el-dialog>
        <!-- <el-dialog title="编辑日志" :visible.sync="editDialogVisible" width="50%"> -->

        <el-dialog v-model="editDialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="编辑字典">
          <DictForm :dict="selectedDict" @submit="handleUpdate" @cancel="handleCancelEdit" />
        </el-dialog>

        <el-dialog v-model="subListDialogVisible" :close-on-click-modal="false" class="!w-2xl" draggable title="值" destroy-on-close="true">
          <SubIndex :type-id="selectedDict.id" @cancel="handleListCancel" />
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
  title: 字典管理
  icon: i-icon-park:book
</route>
