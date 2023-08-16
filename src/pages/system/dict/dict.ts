import axios from 'axios'

export interface Dict {
  id: number
  name: string
  code: string
  description: string
  createTime: string

}

export class DictService {
  public static async fetchDicts(
    pageNum: number,
    pageSize: number,
    name?: string,

  ): Promise<{ dicts: Dict[]; total: number }> {
    const token = localStorage.getItem('token') || ''
    const url = new URL(`https://htglxtapi.inscode.cc/sysDictType/page?pageNum=${pageNum}&pageSize=${pageSize}`, window.location.href)
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
      const dicts: Dict[] = records.map((record: any) => ({

        id: record.id,
        name: record.name,
        code: record.code,
        description: record.description,
        createTime: record.createTime,

      }))

      // 返回包含日志记录和总数的对象
      return { dicts, total }
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

  public static async addDict(dict: Dict): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch('https://htglxtapi.inscode.cc/sysDictType', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(dict),
    })
  }

  public static async updateDict(dict: Dict): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch('https://htglxtapi.inscode.cc/sysDictType', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(dict),
    })
  }

  public static async deleteDict(id: number): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch(`https://htglxtapi.inscode.cc/sysDictType/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    })
  }
}
