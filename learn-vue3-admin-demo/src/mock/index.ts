// 保存模拟数据路径
import Mock from 'mockjs'
import user from './user'

// 登录接口
Mock.mock('/user/login','post',user.login)