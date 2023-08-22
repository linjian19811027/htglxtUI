import axios from 'axios'

export interface User {
  id: string
  username: string
  password: string
  confirmPassword: string
  email: string
  mobile: string
  openid: string
  unionid: string
  sex_txt: string
  isAdmin: boolean
  roleId: string
  roleId_txt: string
  sex: 0 | 1
  permissions: string[] // 权限
  users: string[] // 角色
  userList: string[]
}
export class UserService {
  public static async fetchUsers(
    pageNum: number,
    pageSize: number,
    username?: string,

  ): Promise<{ users: User[]; total: number }> {
    const token = localStorage.getItem('token') || ''
    const url = new URL(`https://htglxtapi.inscode.cc/sysUser/page?pageNum=${pageNum}&pageSize=${pageSize}`, window.location.href)
    if (username)
      url.searchParams.set('username', username)

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
      const users: User[] = records.map((record: any) => ({

        id: record.id,
        username: record.username,
        email: record.email,
        mobile: record.mobile,
        sex: record.sex,
        sex_txt: record.sex_txt,
        roleId_txt: record.roleId_txt,
      }))

      // 返回包含日志记录和总数的对象
      return { users, total }
    }
    catch (error) {
      if (error.response.status === 401)
        useUserStore().logout()
    }
  }

  public static async addUser(user: User): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch('https://htglxtapi.inscode.cc/sysUser/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(user),
    })
  }

  public static async updateUser(user: User): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch('https://htglxtapi.inscode.cc/sysUser/edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(user),
    })
  }

  // public static async editPassWord(user: User): Promise<any> {
  //   const token = localStorage.getItem('token') || ''
  //   await fetch('https://htglxtapi.inscode.cc/sysUser/editPassWord', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': token,
  //     },
  //     body: JSON.stringify(user),
  //   })
  // }
  // public static async editPassWord(user: User): Promise<any> {
  //   const token = localStorage.getItem('token') || ''
  //   return await fetch('https://htglxtapi.inscode.cc/sysUser/editPassWord', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': token,
  //     },
  //     body: JSON.stringify(user),
  //   }).then((res) => {
  //       return res // 修改成功，返回 true
  //   }).catch(error => {
  //     console.log(error)
  //     return "123" // 抛出错误，返回 false
  //   })
  // }
  public static async editPassWord(user: User): Promise<any> {
    const token = localStorage.getItem('token') || '';
    try {
      const response = await axios.post('https://htglxtapi.inscode.cc/sysUser/editPassWord', user, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        }
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return "123";
    }
  }
  
  public static async deleteUser(id: number): Promise<void> {
    const token = localStorage.getItem('token') || ''
    await fetch(`https://htglxtapi.inscode.cc/sysUser/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    })
  }

  public static async fetchRole(): Promise<{ roles: any[] }> {
    const token = localStorage.getItem('token') || ''
    const url = new URL('https://htglxtapi.inscode.cc/sysRole', window.location.href)

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
}
// export function getUserList(params: object) {
//   return request<User[]>('/users', {
//     params: { status: true, ...params },
//   })
// }

// export function getUser(id: User['id']) {
//   return request<User>(`/users/${id}`)
// }

// export function put({ id, ...body }: Partial<User>) {
//   return request(`/users/${id}`, {
//     method: 'put',
//     body,
//   })
// }

// export function post(body: User) {
//   return request('/users', {
//     method: 'post',
//     body,
//   })
// }

// export function drop(id: User['id']) {
//   return request(`/users/${id}`, {
//     method: 'delete',
//     params: { noMessage: true },
//   })
// }

// export function login(body: any) {
//   return request<string>('/login', {
//     method: 'post',
//     body,
//   })
// }

// export function getPermission() {
//   const token = localStorage.getItem('token') || ''
//   return axios.get('https://htglxtapi.inscode.cc/sysPermission', {
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': token,
//     },
//   })
// }
