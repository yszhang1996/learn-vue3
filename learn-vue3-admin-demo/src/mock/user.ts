import Mock from 'mockjs'
// let params =  Mock.mock({ // 数据池
//     'userTableData|10': [{ // 图表过滤所需数据
//         'name': '@cname',
//         'token': '@date',
//         'province': '@province',
//         'city': '@city',
//         'address': '@county(true) @ctitle() @natural(1000,9999) 号',
//         'zip': '@zip'
//     }]
// })


export default {
    login: (request: any) => {
        const params = JSON.parse(request.body)// 拿到传递过来的参数
        let data = Mock.mock({ // 生成数据
            "token": "@string('lower',100)",
            "userinfo": {
                "name": params.username,
                "avator": "@image('100x100','#50B347', '#FFF', '"+params.username+"')"
            }
        })
        // 将模拟请求数据返回给前端
        return {
            code: "000000",
            data: data,
            msg: "登录成功"
        }
    }
}