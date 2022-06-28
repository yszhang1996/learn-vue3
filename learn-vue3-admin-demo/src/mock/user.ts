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
    },
    list: (request: any) => {
        const params = JSON.parse(request.body)// 拿到传递过来的参数
        console.log(params);
        let data = Mock.mock({ // 生成数据
            "content|15": [
                {
                    "id": '@id',
                    "username": params.username ? params.username : '@cname',
                    "email": params.email ? params.email : '@email',
                    "type|1": params.type ? params.type : [`管理员`, `普通用户`],
                    "remark": '@cparagraph(1)'
                }
            ],
            "total|100-300": 300
        })
        // 将模拟请求数据返回给前端
        return {
            code: "000000",
            data: data,
            msg: "操作成功"
        }
    },
    edit: (request: any) => {
        const params = JSON.parse(request.body)// 拿到传递过来的参数
        console.log(params);
        // 将模拟请求数据返回给前端
        return {
            code: "000000",
            data: null,
            msg: "操作成功"
        }
    },
    delete: (request: any) => {
        const params = JSON.parse(request.body)// 拿到传递过来的参数
        console.log(params);
        // 将模拟请求数据返回给前端
        return {
            code: "000000",
            data: null,
            msg: "删除成功"
        }
    },
}