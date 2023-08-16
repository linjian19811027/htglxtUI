import axios from 'axios'

export interface MaterialInventory {
  id: number

  materialId: string
  materialNo: string
  materialInventory: number
  createName: string
  createTime: string
}

export class MaterialInventoryService {
  public static async fetchMaterialInventorys(
    pageNum: number,
    pageSize: number,
    materialName?: string,
    materialNo?: string,

  ): Promise<{ materialInventorys: MaterialInventory[]; total: number }> {
    const token = localStorage.getItem('token') || ''
    const url = new URL(`https://htglxtapi.inscode.cc/businessMaterialInventory/page?pageNum=${pageNum}&pageSize=${pageSize}`, window.location.href)
    if (materialNo)
      url.searchParams.set('materialNo', materialNo)
    if (materialName)
      url.searchParams.set('materialName', materialName)

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
      const materialInventorys: MaterialInventory[] = records.map((record: any) => ({
        id: record.id,
        materialId: record.materialId,
        materialNo: record.materialNo,

        materialInventory: record.materialInventory,

        createName: record.createName,
        createTime: record.createTime,

      }))

      // 返回包含日志记录和总数的对象
      return { materialInventorys, total }
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

  public static async fetchSysDict(): Promise<{ materialInventorys: MaterialInventory[] }> {
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

  public static async fetchMaterialDict(): Promise<{ materialInventorys: MaterialInventory[]; total: number }> {
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

  public static async addMaterialInventory(materialInventory: MaterialInventory): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch('https://htglxtapi.inscode.cc/businessMaterialInventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(materialInventory),
    })
  }

  public static async updateMaterialInventory(materialInventory: MaterialInventory): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch('https://htglxtapi.inscode.cc/businessMaterialInventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(materialInventory),
    })
  }

  public static async deleteMaterialInventory(id: number): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch(`https://htglxtapi.inscode.cc/businessMaterialInventory/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    })
  }
}
