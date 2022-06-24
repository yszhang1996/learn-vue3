// 保存模拟数据路径
import Mock from 'mockjs'
import user from './user'
import goods from './goods'

// 登录接口
Mock.mock('/user/login','post',user.login)

// 获取商品列表接口
Mock.mock('/goods/list','post',goods.list)