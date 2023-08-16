<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent, ref } from 'vue'
import { ElDialog, ElInput, ElTransfer } from 'element-plus'
import type { TransferData } from 'element-plus/lib/el-transfer'

export default defineComponent({
  name: 'TransferInput',
  components: { ElInput, ElTransfer, ElDialog },
  props: {
    value: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    data: {
      type: Array as PropType<TransferData[]>,
      required: true,
    },
    idKey: {
      type: String,
      default: 'id',
    },
    nameKey: {
      type: String,
      default: 'name',
    },
    fromTitle: {
      type: String,
      default: '可选列表',
    },
    toTitle: {
      type: String,
      default: '已选列表',
    },
    filterable: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
 
    footerFormat: {
      type: Function as PropType<(props: { total: number; selected: number }) => string>,
      default: (props: { total: number; selected: number }) => `共 ${props.total} 条，已选择 ${props.selected} 条`,
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const keyword = ref(' ')
    const selected = ref<string[]>(props.value)
    const dialogVisible = ref(false)

    const selectedNames = computed(() => {
      const { data, idKey, nameKey } = props
      return selected.value
        .map((item: string) => data.find((d: TransferData) => String(d[idKey]) === item)?.[nameKey])
        .filter((item: string | undefined) => item !== undefined)
        .join(', ')
    })

    const showTransfer = () => {
      dialogVisible.value = true
    }

    const handleChange = () => {
      emit('change', selected.value)
    }

    const handleClose = (done: any) => {
      dialogVisible.value = false
      done()
    }

    const handleConfirm = () => {
      emit('change', selected.value)
      dialogVisible.value = false
    }

    const filteredData = computed(() => {
        debugger
      const { data, idKey, nameKey } = props
      return data.filter((item: TransferData) => item[nameKey].toLowerCase().includes(keyword.value.toLowerCase()))
        .map((item: TransferData) => ({ ...item, key: item[idKey], label: item[nameKey] }))
    })

    return { keyword, selected, dialogVisible, showTransfer, handleChange, handleClose, handleConfirm, filteredData, selectedNames }
  },
})
</script>

<template>
  <div class="transfer-input-wrapper">
    <ElInput v-model="keyword" class="m-2 w-50" placeholder="选择参与用户" :disabled="!isEditting" readonly>
      <template #append>
        <el-button @click="showTransfer">
          <el-icon>
            <Search />
          </el-icon>
        </el-button>
      </template>
    </ElInput>

    <ElDialog v-model="dialogVisible" title="选择" :before-close="handleClose" width="50%">
      <ElTransfer
        v-model="selected" :data="filteredData" :titles="[fromTitle, toTitle]"  
        :props="{ key: idKey, label: nameKey }"     @change="handleChange"
      >
 
      </ElTransfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleConfirm">
          确定
        </el-button>
      </div>
    </ElDialog>

    <p v-if="selectedNames">
      {{ selectedNames }}
    </p>
  </div>
</template>

  <style scoped>
  .transfer-input-wrapper {
    display: inline-block;
  }

  .el-dialog__wrapper {
    z-index: 9999;
  }
  </style>
