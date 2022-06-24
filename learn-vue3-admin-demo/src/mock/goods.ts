import Mock, { Random } from 'mockjs'

export default {
    list: (request: any) => {
        const params = JSON.parse(request.body)// 拿到传递过来的参数
        let data = Mock.mock({ // 生成数据
            "content|15": [
                {
                    "id": '@id',
                    "type|1": [`零食`, `家电`, `服装`],
                    "title": "商品@cword('一二三四五六七八九十')",
                    "introduce": '@cparagraph(1,4)'
                }
            ]
        })
        // 将模拟请求数据返回给前端
        return {
            code: "000000",
            data: data,
            msg: "登录成功"
        }
    }
}