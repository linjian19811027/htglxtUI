import axios from 'axios'

export interface MaterialLog {
  id: number
  materialId: string
  materialId_txt: string
  materialNo: string
  taskId: number
  materialAmount: string
  flow: number
  description: string
  createName: string
  createTime: string
}

export class MaterialLogService {
  public static async fetchMaterialLogs(
    pageNum: number,
    pageSize: number,
    materialName?: string,
    materialNo?: string,
    createTimeStart?: string,
    createTimeEnd?: string,
    flow?: number,
  ): Promise<{ materialLogs: MaterialLog[]; total: number }> {
    const token = localStorage.getItem('token') || ''
    const url = new URL(`https://htglxtapi.inscode.cc/businessMaterialLog/page?pageNum=${pageNum}&pageSize=${pageSize}`, window.location.href)
    if (materialNo)
      url.searchParams.set('materialNo', materialNo)
    if (materialName)
      url.searchParams.set('materialName', materialName)
    if (createTimeStart)
      url.searchParams.set('createTimeStart', `${createTimeStart} 0:0:0`)
    if (createTimeEnd)
      url.searchParams.set('createTimeEnd', `${createTimeEnd} 23:59:59`)
    if (flow)
      url.searchParams.set('flow', flow)

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
      const materialLogs: MaterialLog[] = records.map((record: any) => ({
        id: record.id,
        materialId: record.materialId,
        materialId_txt: record.materialId_txt,
        materialNo: record.materialNo,
        taskId: record.taskId,
        materialAmount: record.materialAmount,
        flow: record.flow,
        description: record.description,
        createName: record.createName,
        createTime: record.createTime,
        flow_txt: record.flow_txt,
      }))

      // 返回包含日志记录和总数的对象
      return { materialLogs, total }
    }
    catch (error) {
      if (error.response.status === 401)
        useUserStore().logout()
      // await this.router.push({ name: 'login', query: { redirect: this.route.query.redirect || this.route.fullPath } })

      // throw new Error(error.message || 'Fetch logs failed.')
    }
    // try {
    //   const response = await axios.get(url.href, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': token
    //     }
    //   });

    //   return response.data.data;
    // } catch (error) {
    //   throw new Error(error.response.data.message || 'Fetch logs failed.');
    // }
  }

  public static async fetchSysDict(): Promise<{ materialLogs: MaterialLog[] }> {
    const token = localStorage.getItem('token') || ''
    const url = new URL('https://htglxtapi.inscode.cc/sysDictData?typeId=4', window.location.href)

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

  public static async fetchMaterialDict(): Promise<{ materialLogs: MaterialLog[]; total: number }> {
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

  public static async addMaterialLog(materialLog: MaterialLog): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch('https://htglxtapi.inscode.cc/businessMaterialLog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(materialLog),
    })
  }

  public static async updateMaterialLog(materialLog: MaterialLog): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch('https://htglxtapi.inscode.cc/businessMaterialLog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(materialLog),
    })
  }

  public static async deleteMaterialLog(id: number): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch(`https://htglxtapi.inscode.cc/businessMaterialLog/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    })
  }
}
