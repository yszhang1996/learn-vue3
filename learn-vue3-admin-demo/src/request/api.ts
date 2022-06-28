/**
 * api接口统一管理
 */
import axios from './'

interface UserLoginParams {
    username: string,
    password: string,
}
interface UserListParams{
    username: string,
    email: string,
    type: string,
    pageSize: number,
    pageNumber: number,
}
interface UserEditParams{
    id?: number,
    username: string,
    email: string,
    type: string,
}

interface GoodsListParams {
    title: string,
    introduce: string,
    pageSize: number,
    pageNumber: number,
}
interface GoodsEditParams{
    id?: number,
    type: string,
    title: string,
    introduce: string,
}
interface GoodsDeleteParams{
    id: number
}
// 用户登录
export const userLogin = (params: UserLoginParams) => axios.post('/user/login', params)
// 获取用户列表
export const getUserList = (params: UserListParams) => axios.post('/user/list', params)
// 新增/编辑用户
export const userEdit = (params: UserEditParams) => axios.post('/user/edit', params)
// 删除用户
export const userDelete = (params: GoodsDeleteParams) => axios.post('/user/delete', params)

// 获取商品列表
export const getGoodsList = (params: GoodsListParams) => axios.post('/goods/list', params)
// 新增/编辑商品
export const goodsEdit = (params: GoodsEditParams) => axios.post('/goods/edit', params)
// 删除商品
export const goodsDelete = (params: GoodsDeleteParams) => axios.post('/goods/delete', params)
