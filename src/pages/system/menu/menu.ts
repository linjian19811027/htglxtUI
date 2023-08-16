import axios from 'axios'

export interface Menu {
  id: number
  name: string
  icon: string
  url: string
  orderNum: number

}

export class MenuService {
  public static async fetchMenus(
    pageNum: number,
    pageSize: number,
    name?: string,

  ): Promise<{ menus: Menu[]; total: number }> {
    const token = localStorage.getItem('token') || ''
    const url = new URL(`https://htglxtapi.inscode.cc/sysMenu/page?pageNum=${pageNum}&pageSize=${pageSize}`, window.location.href)
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
      const menus: Menu[] = records.map((record: any) => ({

        id: record.id,
        name: record.name,
        url: record.url,
        icon: record.icon,
        orderNum: record.orderNum,

      }))

      // 返回包含日志记录和总数的对象
      return { menus, total }
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

  public static async addMenu(menu: Menu): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch('https://htglxtapi.inscode.cc/sysMenu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(menu),
    })
  }

  public static async updateMenu(menu: Menu): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch('https://htglxtapi.inscode.cc/sysMenu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(menu),
    })
  }

  public static async deleteMenu(id: number): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch(`https://htglxtapi.inscode.cc/sysMenu/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    })
  }
}
