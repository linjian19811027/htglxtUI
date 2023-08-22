import axios from 'axios'

export interface Role {
  id: number
  name: string
  description: string
  status: number
  createTime: string

}

export class RoleService {
  public static async fetchRoles(
    pageNum: number,
    pageSize: number,
    name?: string,

  ): Promise<{ roles: Role[]; total: number }> {
    const token = localStorage.getItem('token') || ''
    const url = new URL(`https://htglxtapi.inscode.cc/sysRole/page?pageNum=${pageNum}&pageSize=${pageSize}`, window.location.href)
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
      const roles: Role[] = records.map((record: any) => ({

        id: record.id,
        name: record.name,
        description: record.description,
        status: record.status,
        createTime: record.createTime,

      }))

      // 返回包含日志记录和总数的对象
      return { roles, total }
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

  public static async addRole(role: Role): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch('https://htglxtapi.inscode.cc/sysRole', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(role),
    })
  }

  public static async updateRole(role: Role): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch('https://htglxtapi.inscode.cc/sysRole', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(role),
    })
  }

  public static async deleteRole(id: number): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch(`https://htglxtapi.inscode.cc/sysRole/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    })
  }

  public static async fetchPermission(): Promise<{ permissions: any[] }> {
    const token = localStorage.getItem('token') || ''
    const url = new URL('https://htglxtapi.inscode.cc/sysPermission', window.location.href)

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

  public static async fetchPermissionByRole(roleId): Promise<{ permissions: any[] }> {
    const token = localStorage.getItem('token') || ''
    const url = new URL('https://htglxtapi.inscode.cc/sysRolePermission', window.location.href)
    url.searchParams.set('roleId', roleId)
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

  public static async submitRp(rp: any[]): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch('https://htglxtapi.inscode.cc/sysRolePermission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(rp),
    })
  }
}
