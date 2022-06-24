/**
 * api接口统一管理
 */
import { postApi } from './index.js'
interface UserLoginParams {
    username: string,
    password: string,
}
export const userLogin = (params: UserLoginParams) => postApi('/user/login', params)