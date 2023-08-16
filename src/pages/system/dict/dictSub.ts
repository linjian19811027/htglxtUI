import axios from 'axios'

export interface DictData {
  id: number
  typeId: number
  code: string
  name: string
  value: string
  orderNum: number
  createTime: string

}

export class DictDataService {
  public static async fetchDictDatas(
    pageNum: number,
    pageSize: number,
    name?: string,
    typeId?: number,
  ): Promise<{ dictDatas: DictData[]; total: number }> {
    const token = localStorage.getItem('token') || ''
    const url = new URL(`https://htglxtapi.inscode.cc/sysDictData/page?pageNum=${pageNum}&pageSize=${pageSize}`, window.location.href)

    if (typeId)
      url.searchParams.set('typeId', typeId)
    if (name)
      url.searchParams.set('name', name)

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
      const dictDatas: DictData[] = records.map((record: any) => ({

        id: record.id,
        typeId: record.id,
        code: record.code,
        name: record.name,
        value: record.value,
        orderNum: record.orderNum,
        createTime: record.createTime,

      }))

      // 返回包含日志记录和总数的对象
      return { dictDatas, total }
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

  public static async addDictData(dictData: DictData): Promise<void> {
    dictData
    const token = localStorage.getItem('token') || ''
    await fetch('https://htglxtapi.inscode.cc/sysDictData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(dictData),
    })
  }

  public static async updateDictData(dictData: DictData): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch('https://htglxtapi.inscode.cc/sysDictData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(dictData),
    })
  }

  public static async deleteDictData(id: number): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch(`https://htglxtapi.inscode.cc/sysDictData/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    })
  }
}
