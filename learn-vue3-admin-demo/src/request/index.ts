import axios from 'axios'  // 引入axios
import { ElMessage } from 'element-plus'
import qs from 'qs' // 引入qs模块，用来序列化post类型的数据

// axios.defaults.timeout = 5000 // 设置超时时间为5秒

// axios.defaults.headers = {
//     "Content-Type": "application/json;charset=utf-8"
// }

const http = axios.create({
    timeout: 5000,  // 设置超时时间为5秒
    headers: {
        "Content-Type": "application/json;charset=utf-8"
    }
})

// 设置请求拦截
http.interceptors.request.use(
    config => {
        config.headers = config.headers || {} // 避免ts推断类型出错，当headers不存在返回空对象
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.token = token
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 设置响应拦截
http.interceptors.response.use(
    response => {
        const code: string = response.data.code
        if (code === '000000') {
            return Promise.resolve(response)
        } else {
            ElMessage({
                message: response.data.msg,
                type: 'warning',
            })
            return Promise.reject(response)
        }
    }
)

/**
 * 封装post方法，对用post请求
 * @param { String } url [请求的url地址]
 * @param { Object } params [请求时携带的参数]
 */
export function postApi(url: string, params: object, useForm = false) {
    return new Promise((resolve, reject) => {
        http({
            method: 'post',
            url,
            data: useForm ? qs.stringify(params) : params,
        })
            .then(res => {
                console.log("params");
                console.log(params);
                console.log("then----res");
                console.log(res.data);

                resolve(res.data)
            })
            .catch(err => {
                console.log("params");
                console.log(params);
                console.log("catch----err");
                console.log(err);

                reject(err.data)
            })
    })
}