import axios from 'axios'

export interface Log {
  id: number
  userId: number
  userName: string
  action: string
  module: string
  ip: string
  time: string
  comment: string
  errorMessage: string
}

export class LogService {
  public static async fetchLogs(
    pageNum: number,
    pageSize: number,
    action?: string,
    startTime?: string,
    endTime?: string,
  ): Promise<{ logs: Log[]; total: number }> {
    const token = localStorage.getItem('token') || ''
    const url = new URL(`https://htglxtapi.inscode.cc/sysLog/page?pageNum=${pageNum}&pageSize=${pageSize}`, window.location.href)
    if (action)
      url.searchParams.set('action', action)

    if (startTime)
      url.searchParams.set('startTime', startTime)

    if (endTime)
      url.searchParams.set('endTime', endTime)

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
      const logs: Log[] = records.map((record: any) => ({

        id: record.id,
        userId: record.id,
        userName: record.userName,
        action: record.action,
        module: record.module,
        ip: record.ip,
        time: record.time,
        comment: record.comment,
        errorMessage: record.errorMessage,

      }))

      // 返回包含日志记录和总数的对象
      return { logs, total }
    }
    catch (error) {
      if (error.response.status === 401)
        useUserStore().logout()
      throw new Error(error.response.data.message || 'Fetch logs failed.')
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

  public static async addLog(log: Log): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch('https://htglxtapi.inscode.cc/sysLog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(log),
    })
  }

  public static async updateLog(log: Log): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch('https://htglxtapi.inscode.cc/sysLog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(log),
    })
  }

  public static async deleteLog(id: number): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch(`https://htglxtapi.inscode.cc/sysLog/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    })
  }
}
