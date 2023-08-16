<script lang="ts">
import { defineComponent } from 'vue'
import { Search } from '@element-plus/icons-vue'
import pinyin from 'pinyin'

export default defineComponent({
  name: 'ChoseUser',
  components: {
    Search,
  },
  props: {
    value: String,
    disabled: Boolean,
    data: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const data = ref([])
    const dialogVisible = ref(false)
    const value = ref([])
    const selectedValue = ref('')
    const selectedLabel = ref('')

    const showDialog = () => {
      dialogVisible.value = true
      debugger
      data.value = props.data
      // fetchUserDict()
      // value.value = []
    }
    onMounted(() => {

    })
    const handleConfirm = () => {
      const selected1 = data.value.filter(item => value.value.includes(item.id))
      selectedLabel.value = data.value.filter(item => value.value.includes(item.id)).map(item => item.username)

      emit('update:key', selected1.map(item => item.id).join(', '))

      // debugger
      // selectedValue.value = [...value.value] // 创建一个新的变量，并将value的值赋给它
      // emit('update:key', selectedValue.value.join(', ')) // 通过自定义事件将选择的值传递给父组件
      debugger

      dialogVisible.value = false
    }
    const filterMethod = (query: string, option: any): boolean => {
      const optionLabel = option.label
      const pinyinLabel = pinyin(optionLabel, {
        style: pinyin.STYLE_NORMAL,
      }).flat().join('')

      return pinyinLabel.toLowerCase().includes(query.toLowerCase())
    }

    return {
      isEditting: !props.disabled,
      filterMethod,
      data,
      dialogVisible,
      value,
      showDialog,
      handleConfirm,
      selectedLabel,
    }
  },
})
</script>

<template>
  <el-input v-model="selectedLabel" class="m-2 w-50" placeholder="选择参与用户" :disabled="!isEditting">
    <template #append>
      <el-button @click="showDialog">
        <el-icon>
          <Search />
        </el-icon>
      </el-button>
    </template>
  </el-input>
  <el-dialog v-model="dialogVisible">
    <el-transfer
      v-model="value" :filterable="true" :filter-method="filterMethod" :titles="['待选人员', '已选人员']" :data="data"
      :props="{
        key: 'id',
        label: 'username',
      }"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleConfirm">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
