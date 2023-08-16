import axios from 'axios'

export interface Permission {
  id: number
  name: string
  description: string
  url: string
  type: number
  parentId: number
  createTime: string
}

export class PermissionService {
  public static async fetchPermissions(
    pageNum: number,
    pageSize: number,
    name?: string,

  ): Promise<{ permissions: Permission[]; total: number }> {
    const token = localStorage.getItem('token') || ''
    const url = new URL(`https://htglxtapi.inscode.cc/sysPermission/page?pageNum=${pageNum}&pageSize=${pageSize}`, window.location.href)
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
      const permissions: Permission[] = records.map((record: any) => ({

        id: record.id,
        name: record.name,
        description: record.description,
        url: record.url,
        type: record.type,
        parentId: record.parentId,
        createTime: record.createTime,

      }))

      // 返回包含日志记录和总数的对象
      return { permissions, total }
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

  public static async addPermission(permission: Permission): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch('https://htglxtapi.inscode.cc/sysPermission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(permission),
    })
  }

  public static async updatePermission(permission: Permission): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch('https://htglxtapi.inscode.cc/sysPermission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(permission),
    })
  }

  public static async deletePermission(id: number): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch(`https://htglxtapi.inscode.cc/sysPermission/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    })
  }
}
