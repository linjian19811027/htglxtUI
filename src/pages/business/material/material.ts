import axios from 'axios'

export interface Material {
  id: number

  materialNo: string
  materialName: string
  materialPrice: number

  description: string

  createName: string
  createTime: string
}

export class MaterialService {
  public static async fetchMaterials(
    pageNum: number,
    pageSize: number,
    materialName?: string,
    materialNo?: string,
  ): Promise<{ materials: Material[]; total: number }> {
    const token = localStorage.getItem('token') || ''
    const url = new URL(`https://htglxtapi.inscode.cc/businessMaterial/page?pageNum=${pageNum}&pageSize=${pageSize}`, window.location.href)
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
      const materials: Material[] = records.map((record: any) => ({

        id: record.id,

        materialNo: record.materialNo,
        materialName: record.materialName,
        materialPrice: record.materialPrice,

        description: record.description,
        createName: record.createName,
        createTime: record.createTime,

      }))

      // 返回包含日志记录和总数的对象
      return { materials, total }
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

  public static async addMaterial(material: Material): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch('https://htglxtapi.inscode.cc/businessMaterial', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(material),
    })
  }

  public static async updateMaterial(material: Material): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch('https://htglxtapi.inscode.cc/businessMaterial', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(material),
    })
  }

  public static async deleteMaterial(id: number): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch(`https://htglxtapi.inscode.cc/businessMaterial/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    })
  }
}
