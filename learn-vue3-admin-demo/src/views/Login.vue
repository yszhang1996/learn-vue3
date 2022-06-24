<template>
    <div class="login-container">
        <div class="form-container">
            <el-form class="el-form-login" ref="ruleFormRef" label-suffix="：" :model="ruleForm" status-icon
                :rules="rules" label-width="70px">
                <div class="title">
                    <span>登录</span>
                </div>
                <el-form-item label="账号" prop="username">
                    <el-input v-model="ruleForm.username" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="ruleForm.password" type="password" />
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

// 定义表单数据类型
type ruleForm = {
    username: string,
    password: string,
}

const router = useRouter()// 使用router

// 表单数据
const ruleForm = reactive<ruleForm>({
    username: '',
    password: '',
})

// 表单校验规则
const rules = reactive<FormRules>({
    username: [
        {
            required: true,
            message: '请输入账号',
            trigger: 'blur',
        },
        {
            min: 4,
            max: 10,
            message: '账号长度在4-10之间',
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
            max: 10,
            message: '密码长度在4-10之间',
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
        userLogin(ruleForm).then((res: any) => {
            if (res.data.token) {
                console.log(res);
                localStorage.setItem("token", res.data.token)
                localStorage.setItem("userinfo", JSON.stringify(res.data.userinfo))
                router.replace({ path: '/home' })
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