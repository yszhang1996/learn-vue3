// 保存模拟数据路径
import Mock from 'mockjs'
import user from './user'
import goods from './goods'

Mock.setup({
    timeout: '800' //设置延迟为800毫秒
})

// 登录接口
Mock.mock('/user/login', 'post', user.login)

// 获取商品列表接口
Mock.mock('/goods/list', 'post', goods.list)
// 编辑商品信息接口
Mock.mock('/goods/edit', 'post', goods.edit)
// 删除某条商品信息接口
Mock.mock('/goods/delete', 'post', goods.delete)

// 获取用户列表接口
Mock.mock('/user/list', 'post', user.list)
// 编辑用户信息接口
Mock.mock('/user/edit', 'post', user.edit)
// 删除某条用户信息接口
Mock.mock('/user/delete', 'post', user.delete)