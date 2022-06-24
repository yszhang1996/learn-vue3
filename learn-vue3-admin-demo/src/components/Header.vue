<template>
    <div class="container-header">
        <div class="header-logo">后台管理系统</div>
        <div class="header-center"></div>
        <div class="header-options">
            <span>你好，{{userinfo.name}}</span>
            <span class="logout" @click="logout">退出</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter()

const userinfo = ref(JSON.parse(localStorage.getItem('userinfo') as string))

// 获取localstorage数据并不需要放在生命周期中，在setup中直接写就可以读取到，个人理解，setup中写的代码相当于vue2的created
// onMounted(()=>{
//     console.log("onMounted");
//     console.log(userinfo);
    
// })


// 退出登录
const logout = ()=>{
    console.log("logout");
    localStorage.clear()
    router.push('/login')
}

</script>

<style lang="scss">
.container-header {
    width: 100%;
    height: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    background-color: #286fcd;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    color: aliceblue;
    line-height: 60px;
    .header-logo {
        width: 300px;
        font-size: 28px;
    }

    .header-center {
        flex: 1;
    }

    .header-options {
        .logout{
            margin-left: 20px;
            cursor: pointer;
        }
    }
}
</style>