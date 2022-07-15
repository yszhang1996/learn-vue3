<template>
    <div class="login-container">
        <div class="form-container">
            <el-form class="el-form-login" ref="ruleFormRef" label-suffix="：" :model="loginData" status-icon
                :rules="rules" label-width="70px">
                <div class="title">
                    <span>登录</span>
                </div>
                <el-form-item label="账号" prop="userName">
                    <el-input v-model="loginData.userName" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginData.password" type="password" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
                    <el-button>注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue"
import type { FormRules, FormInstance } from 'element-plus'
import { userLogin } from "../request/api";
import { useRouter } from "vue-router";
import md5 from "js-md5";

// 定义表单数据类型
type loginData = {
    userName: string,
    password: string,
}

const router = useRouter()// 使用router

// 表单数据
const loginData = reactive<loginData>({
    userName: '',
    password: '',
})

// 表单校验规则
const rules = reactive<FormRules>({
    userName: [
        {
            required: true,
            message: '请输入账号',
            trigger: 'blur',
        },
        {
            min: 4,
            max: 18,
            message: '账号长度在4-18之间',
            trigger: 'blur',
        }
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
        },
        {
            min: 4,
            max: 12,
            message: '密码长度在4-12之间',
            trigger: 'blur',
        }
    ],
})

const ruleFormRef = ref<FormInstance>() //ref()不是创建双向数据绑定，而是获取template里的同名DOM元素，等同于vue2的$refs.xxx

// 点击登录按钮触发
const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (!valid) return;
        console.log('校验通过');
        userLogin({
            userName: loginData.userName,
            password: md5(loginData.password),
            code: '',
            loginType: 4,
            userType: 1,
        }).then(res => {
            if (res.data.token) {
                // 登录成功，储存用户toekn到localstorage
                localStorage.setItem("token", res.data.token)
                // 储存用户基本信息到localstorage
                const { username, email, phone, havePassword } = res.data;
                localStorage.setItem("userinfo", JSON.stringify({ username, email, phone, havePassword }))
                // 储存用户权限路由到localstorage
                localStorage.setItem("pagePermissionList", JSON.stringify(res.data.pagePermissionList))
                // 跳转到首页
                router.replace({ path: '/projectinfo' })
            }
        })
    })
}

</script>

<style lang="scss">
.login-container {
    width: 100vw;
    height: 100vh;
    background-image: url(../assets/images/bgc.png);
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;

    .form-container {
        position: absolute;
        right: 0;
        background-color: white;
        height: 100vh;
        width: 400px;

        .el-form-login {
            width: 100%;
            position: absolute;
            top: 30%;
            // transform: translateY(-50%);
            padding: 30px;
            box-sizing: border-box;

            .title {
                text-align: center;
                margin: 40px;
                font-size: 30px;
            }
        }
    }
}
</style>