<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElLoading, ElMessage } from 'element-plus'
import axios from 'axios'

const settings = useSettingsStore()
const router = useRouter()
const username = $ref('admin1')
const password = $ref('123456')
const kaptcha = $ref<string>('')
let random = ''
let codeUrl = $ref<string>('')
const formRef = $shallowRef<FormInstance>()
async function submit() {
  // await formRef.validate()
  const loading = ElLoading.service({ fullscreen: true })

  axios.post('https://htglxtapi.inscode.cc/sysUser/login', { username, password, kaptcha, random })
    .then((res) => {
      // console.log(res);
      if (res.data.resultCode === 200) {
        localStorage.setItem('token', `Bearer ${res.data.message}`)
        user.generateRoutes()
        ElMessage.success('登录成功')
        router.push('/')
      }
      else {
        ElMessage.error(`登录失败：${res.data.message}`)
        refreshCode()
      }
    })
    .finally(() => loading.close())
}

async function refreshCode() {
  const res = await axios.get('https://htglxtapi.inscode.cc/sysUser/captchaImage')
  console.log(res)
  if (res.data.resultCode === 200) {
    codeUrl = `data:image/jpeg;base64,${res.data.data.image}`
    random = res.data.data.kaptcha
  }
}
const autocomplete = useLocalStorage('autocomplete', 'new-password')
function reload() {
  if (!password)
    location.reload()
}
function init() {
  refreshCode()
}

init()
</script>

<template>
  <div flex="~ col" h-screen w-screen bg="zinc-50 dark:zinc-900">
    <!-- <LoginLayout />
    <Palette absolute right-5 top-5 text-base /> -->
    <el-form
      ref="formRef" size="large" :model="{ username, password, kaptcha }"
      bg="white dark:zinc-800" flex="~ col" z-1 m-auto box-content min-w-sm rounded-lg p-10 shadow-lg @submit.prevent="submit"
    >
      <div flex items-center gap-3>
        <div>
          <div whitespace-nowrap font-extrabold tracking-widest text="4xl gray-700 dark:gray-100">
            {{ settings.name }}
          </div>
          <p text="sm gray-400">
            {{ settings.description }}
          </p>
        </div>
      </div>
      <div text="center sm gray-400" mb-7 mt-3>
        —— 登陆界面 ——
      </div>

      <el-form-item :rules="{ required: true, message: '不能为空' }" prop="username">
        <el-input v-model="username" placeholder="用户名:">
          <template #prefix>
            <i i-ep:user />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item :rules="{ required: true, message: '不能为空' }" prop="password">
        <el-input v-model="password" type="password" :autocomplete="autocomplete" show-password placeholder="密码:">
          <template #prefix>
            <i i-ep:lock />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item :rules="{ required: true, message: '不能为空' }" prop="kaptcha">
        <div class="code-container">
          <el-input v-model="kaptcha" placeholder="验证码:">
            <template #prefix>
              <i i-ep:lock />
            </template>
          </el-input>
          <div class="image-code">
            <img :src="codeUrl" @click="refreshCode">
          </div>
        </div>
      </el-form-item>
      <el-checkbox
        v-model="autocomplete" mr="!auto" mt="-3" true-label="on" false-label="new-password" label="记住密码"
        @click="reload"
      />
      <el-button type="primary" z-1 bg-primary native-type="submit">
        登录
      </el-button>
    </el-form>

    <div class="mx-auto my-10 text-sm font-medium tracking-widest text-gray-400">
      CopyRight © 2022-present zhiyuanzmj
    </div>
  </div>
</template>

<style scoped>
.code-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.image-code>img {
  cursor: pointer;
  width: 120px;
  height: 40px;
}
</style>

<route lang="yaml">
meta:
  title: 登陆
  layout: empty
  permission: false
  hidden: true
</route>
