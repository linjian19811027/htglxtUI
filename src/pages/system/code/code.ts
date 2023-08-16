import axios from 'axios'

export interface Code {
  id: number
  prefix: string
  dateFormat: string
  digit: number
  currentCode: number
  nowDate: string
  step: string
  description: string
  createName: string
  createTime: string
}

export class CodeService {
  public static async fetchCodes(
    pageNum: number,
    pageSize: number,
    prefix?: string,

  ): Promise<{ codes: Code[]; total: number }> {
    const token = localStorage.getItem('token') || ''
    const url = new URL(`https://htglxtapi.inscode.cc/sysCode/page?pageNum=${pageNum}&pageSize=${pageSize}`, window.location.href)
    if (prefix)
      url.searchParams.set('prefix', prefix)

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
      const codes: Code[] = records.map((record: any) => ({

        id: record.id,
        prefix: record.prefix,
        dateFormat: record.dateFormat,
        digit: record.digit,
        currentCode: record.currentCode,
        nowDate: record.nowDate,
        step: record.step,
        description: record.description,
        createName: record.createName,
        createTime: record.createTime,

      }))

      // 返回包含日志记录和总数的对象
      return { codes, total }
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

  public static async addCode(code: Code): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch('https://htglxtapi.inscode.cc/sysCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(code),
    })
  }

  public static async updateCode(code: Code): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch('https://htglxtapi.inscode.cc/sysCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(code),
    })
  }

  public static async deleteCode(id: number): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch(`https://htglxtapi.inscode.cc/sysCode/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    })
  }
}
