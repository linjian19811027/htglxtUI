import axios from 'axios'

export interface Task {
  id: number
  parentTaskId: number
  taskTitle: string
  taskNo: string
  taskType: string
  taskCompany: string
  taskContacts: string
  taskTel: string
  taskMaterial: string
  taskContent: string
  taskFactEndTime: string
  taskFactContent: string
  taskFactAddress: string
  taskEndTime: string
  taskCreateUser: string
  taskCreateUserId: string
  taskCreateTime: string
  participantsIds: string
  participantsNames: string
  taskReceiver: string
  taskReceiverId: string
  taskState: string
  contentUpload1: string
  contentUpload2: string
  yaoQiuUpload1: string
  yaoQiuUpload2: string
  wanChengUpload1: string
  wanChengUpload2: string
  nextTaskType: string
  mainId: string
  nextTaskEndTime: string
  state: number
  taskType_txt: string
  nextTaskType_txt: string
  state_txt: string
  taskMaterials: []
}

export class TaskService {
  // 查询
  public static async fetchTasks(
    pageNum: number,
    pageSize: number,
    taskTitle?: string,
    taskCompany?: string,
    taskType?: string,

    taskCreateTimeStart?: string,
    taskCreateTimeEnd?: string,

    taskEndTimeStart?: string,
    taskEndTimeEnd?: string,

  ): Promise<{ tasks: Task[]; total: number }> {
    const token = localStorage.getItem('token') || ''
    const url = new URL(`https://htglxtapi.inscode.cc/businessTask/page?pageNum=${pageNum}&pageSize=${pageSize}`, window.location.href)
    if (taskTitle)
      url.searchParams.set('taskTitle', taskTitle)
    if (taskCompany)
      url.searchParams.set('taskCompany', taskCompany)
    if (taskType)
      url.searchParams.set('taskType', taskType)
    if (taskCreateTimeStart)
      url.searchParams.set('taskCreateTimeStart', `${taskCreateTimeStart} 0:0:0`)
    if (taskCreateTimeEnd)
      url.searchParams.set('taskCreateTimeEnd', `${taskCreateTimeEnd} 23:59:59`)

    if (taskEndTimeStart)
      url.searchParams.set('taskEndTimeStart', `${taskEndTimeStart} 0:0:0`)
    if (taskEndTimeEnd)
      url.searchParams.set('taskEndTimeEnd', `${taskEndTimeEnd} 23:59:59`)

    try {
      const response = await axios.get(url.href, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      })

      // 对返回结果进行解构赋值
      const { records, total } = response.data.data

      // 将返回的记录列表转换成 Log 类型数组
      const tasks: Task[] = records.map((record: any) => ({
        id: record.id,
        parentTaskId: record.parentTaskId,
        taskTitle: record.taskTitle,
        taskType: record.taskType,
        taskNo: record.taskNo,
        taskCompany: record.taskCompany,
        taskContacts: record.taskContacts,
        taskTel: record.taskTel,
        taskMaterial: record.taskMaterial,
        taskContent: record.taskContent,
        taskFactEndTime: record.taskFactEndTime,
        taskFactContent: record.taskFactContent,
        taskFactAddress: record.taskFactAddress,
        taskEndTime: record.taskEndTime,
        taskCreateUser: record.taskCreateUser,
        taskCreateUserId: record.taskCreateUserId,
        taskCreateTime: record.taskCreateTime,
        participantsIds: record.participantsIds,
        participantsNames: record.participantsNames,
        taskReceiver: record.taskReceiver,
        taskReceiverId: record.taskReceiverId,
        taskState: record.taskState,
        contentUpload1: record.contentUpload1,
        contentUpload2: record.contentUpload2,
        yaoQiuUpload1: record.yaoQiuUpload1,
        yaoQiuUpload2: record.yaoQiuUpload2,
        wanChengUpload1: record.wanChengUpload1,
        wanChengUpload2: record.wanChengUpload2,
        nextTaskType: record.nextTaskType,
        mainId: record.mainId,
        nextTaskEndTime: record.nextTaskEndTime,
        state: record.state,
        taskType_txt: record.taskType_txt,
        nextTaskType_txt: record.nextTaskType_txt,
        state_txt: record.state_txt,
        taskMaterials: record.taskMaterials,
      }))

      // 返回包含日志记录和总数的对象
      return { tasks, total }
    }
    catch (error) {
      if (error.response.status === 401)
        useUserStore().logout()
    }
  }

  // 返回文件列表
  public static async fetchSysFile(folder): Promise<any[]> {
    const token = localStorage.getItem('token') || ''
    const url = new URL(`https://htglxtapi.inscode.cc/sysFile?folder=${folder}`, window.location.href)
    try {
      const response = await axios.get(url.href, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      })
      if (response.data.data) { // 判断 data 是否有值
        const files = response.data.data
          .map((file: any) => ({ // 遍历 data，并将每个 file 转换成一个新对象
            url: `https://htglxtapi.inscode.cc/sysFile/download/${file.id}`,
            id: file.id,
            name: file.originalFilename,
          }))
        return files
      }
      else { // 如果 data 值不存在，返回一个空数组
        return []
      }
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  // 返回物料
  public static async fetchTaskMaterial(taskId): Promise<any[]> {
    const token = localStorage.getItem('token') || ''
    const url = new URL(`https://htglxtapi.inscode.cc/businessTaskMaterial?taskId=${taskId}`, window.location.href)
    try {
      const response = await axios.get(url.href, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      })
      // 对返回结果进行解构赋值
      const records = response.data.data
      // 返回包含日志记录和总数的对象
      return records
    }
    catch (error) {

    }
  }

  // 返回用户
  public static async fetchTaskUser(taskId): Promise<any[]> {
    const token = localStorage.getItem('token') || ''
    const url = new URL(`https://htglxtapi.inscode.cc/businessTaskUser?taskId=${taskId}`, window.location.href)
    try {
      const response = await axios.get(url.href, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      })
      // 对返回结果进行解构赋值
      const records = response.data.data
      // 返回包含日志记录和总数的对象
      return records
    }
    catch (error) {

    }
  }

  // 类型字典
  public static async fetchSysDict2(): Promise<{ tasks: Task[] }> {
    const token = localStorage.getItem('token') || ''
    const url = new URL('https://htglxtapi.inscode.cc/sysDictData?typeId=2', window.location.href)
    try {
      const response = await axios.get(url.href, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      })

      // 对返回结果进行解构赋值
      const records = response.data.data

      // 返回包含日志记录和总数的对象
      return records
    }
    catch (error) {

    }
  }

  // 状态字典
  public static async fetchSysDict5(): Promise<{ tasks: Task[] }> {
    const token = localStorage.getItem('token') || ''
    const url = new URL('https://htglxtapi.inscode.cc/sysDictData?typeId=5', window.location.href)
    try {
      const response = await axios.get(url.href, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      })

      // 对返回结果进行解构赋值
      const records = response.data.data

      // 返回包含日志记录和总数的对象
      return records
    }
    catch (error) {

    }
  }

  // 获取系统用户
  public static async fetchUserDict(): Promise<{ tasks: Task[]; total: number }> {
    const token = localStorage.getItem('token') || ''
    const url = new URL('https://htglxtapi.inscode.cc/sysUser/dict', window.location.href)

    try {
      const response = await axios.get(url.href, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      })

      // 对返回结果进行解构赋值
      const records = response.data.data

      // 返回包含日志记录和总数的对象
      return records
    }
    catch (error) {

    }
  }

  // 获取物料
  public static async fetchMaterialDict(): Promise<{ tasks: Task[]; total: number }> {
    const token = localStorage.getItem('token') || ''
    const url = new URL('https://htglxtapi.inscode.cc/businessMaterial/dict', window.location.href)

    try {
      const response = await axios.get(url.href, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      })

      // 对返回结果进行解构赋值
      const records = response.data.data

      // 返回包含日志记录和总数的对象
      return records
    }
    catch (error) {

    }
  }

  public static async submitTaskUserScore(data: any): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch('https://htglxtapi.inscode.cc/businessTaskUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(data),
    })
  }

  // 添加任务
  public static async addTask(task: Task): Promise<void> {
    const token = localStorage.getItem('token') || ''
    if (task.participantsIds)
      task.participantsIds = task.participantsIds.join(', ')
    await fetch('https://htglxtapi.inscode.cc/businessTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(task),
    })
  }

  public static async uploadFile(file: File): Promise<{ id: string }> {
    const token = localStorage.getItem('token') || ''
    const formData = new FormData()
    formData.append('file', file)

    const response = await axios.post('https://htglxtapi.inscode.cc/sysFile/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token,
      },
    })

    return { id: response.message }
  }

  public static async addFile(task: Task): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch('https://htglxtapi.inscode.cc/businessTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(task),
    })
  }

  // 更新任务
  public static async updateTask(task: Task): Promise<void> {
    const token = localStorage.getItem('token') || ''
    if (task.participantsIds)
      task.participantsIds = task.participantsIds.join(', ')
    await fetch('https://htglxtapi.inscode.cc/businessTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(task),
    })
  }

  // /删除任务
  public static async deleteTask(id: number): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch(`https://htglxtapi.inscode.cc/businessTask/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    })
  }
}
