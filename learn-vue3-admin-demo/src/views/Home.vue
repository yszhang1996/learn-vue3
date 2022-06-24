<template>
    <div>
        <div class="search-warpper">
            <el-form :inline="true" :model="params" class="demo-form-inline">
                <el-form-item label="商品名">
                    <el-input v-model="params.title" placeholder="请输入商品名" />
                </el-form-item>
                <el-form-item label="详情">
                    <el-input v-model="params.introduce" placeholder="请输入详情" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleQuery">查询</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts" setup >
import { reactive } from "vue";
import { getGoodsList } from "../request/api";
const initParams = {
    pageNumber: 1,
    pageSize: 10,
    title: '',
    introduce: ''
}

// 创建查询列表的双向绑定数据
const params = reactive(initParams)

// 点击搜索按钮时执行的函数
const handleQuery = () => {
    getGoodsList(params).then(res => {
        // console.log(res);
    })
}

const handleReset = () => {
    console.log("handleReset");
    console.log(initParams);
    
    // params = initParams

    console.log(params);
    
}

</script>

<style lang="scss">
.search-warpper {
    border: 1px solid #e6eaee;
    margin: 20px;
    padding: 20px;
    box-sizing: border-box;
}
</style>