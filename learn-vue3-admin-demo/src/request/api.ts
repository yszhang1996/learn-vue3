/**
 * api接口统一管理
 */
import { postApi } from './index.js'
interface UserLoginParams {
    username: string,
    password: string,
}
interface GoodsListParams {
    title: string,
    introduce: string,
    pageSize: number,
    pageNumber: number,
}
export const userLogin = (params: UserLoginParams) => postApi('/user/login', params)
export const getGoodsList = (params: GoodsListParams) => postApi('/goods/list', params)