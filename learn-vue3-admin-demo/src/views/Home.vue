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
        <div class="options-warpper">
            <el-button type="primary" @click="handleAdd">新增</el-button>
        </div>
        <div class="table-warpper" v-loading="loading">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="id" label="ID" width="180" />
                <el-table-column prop="type" label="类型" />
                <el-table-column prop="title" label="标题" />
                <el-table-column prop="introduce" label="详情" />
                <el-table-column fixed="right" label="操作" width="120">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-popconfirm title="是否确认删除该条数据？" confirmButtonText="确定" cancelButtonText="取消"
                            @confirm="handleDelete(scope.row.id)">
                            <template #reference>
                                <el-button link type="primary" size="small">删除
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <div class="table-pagination">
                <el-pagination v-model:currentPage="pageNumber" v-model:pageSize="pageSize" :page-sizes="[10, 15, 20]"
                    layout="sizes, prev, pager, next, jumper" :total="total" />
            </div>
        </div>
        <AddGoods :showAddGoodsFlag="showAddGoodsFlag" :title="addGoodsTitle" @handleCancel="handleCancel"
            @submit="submit" :formData="formData" />
    </div>
</template>

<script lang="ts" setup >
import { ElMessage } from "element-plus";
import { reactive, ref, watch, toRaw } from "vue";
import { useRouter } from "vue-router";
import { useDebounceFn } from '@vueuse/core'
import { getGoodsList, goodsDelete } from "../request/api";
import AddGoods from "./goods/AddGoods.vue";

const router = useRouter()

let initParams = class {
    constructor() {
        this.title = ''
        this.introduce = ''
    }
    title
    introduce
}

let initFormData = class {
    constructor() {
        this.type = ''
        this.title = ''
        this.introduce = ''
    }
    type
    title
    introduce
}

type tableDataType = {
    id?: number,
    type: string,
    title: string,
    introduce: string,
}
// 设置加载中loading标识符，默认为true
const loading = ref(true)
// 是否显示新增/编辑弹窗的标识符
const showAddGoodsFlag = ref(false)

// 新增/编辑弹窗的标题
const addGoodsTitle = ref('新增商品')

// 新增/编辑时的默认值
const formData = ref<tableDataType>(new initFormData())

// 创建分页时记录当前页码数据
const pageNumber = ref(1)

// 创建分页时记录当前每页显示多少条数据
const pageSize = ref(15)

// 创建查询列表的双向绑定数据
const params = ref(new initParams())

// 创建表格数据
const tableData = reactive<tableDataType[]>([])

// const dataSouce = reactive<dataSouce[]>([])

// 记录当前列表数据总条数
const total = ref(0)

// 点击搜索按钮时执行的函数
const handleQuery = () => {
    pageNumber.value = 1 // 手动点击查询，要重置页码为1
    query()
}

// 查询函数，请求后端获取tableData数据
const query =
    useDebounceFn(  // 给查询增加防抖
        () => {
            loading.value = true
            getGoodsList({
                ...params.value,
                pageNumber: pageNumber.value,
                pageSize: pageSize.value,
            }).then((res) => {
                tableData.splice(0, tableData.length, ...res.data.content)
                total.value = res.data.total
            }).finally(() => {
                loading.value = false
            })
        }
        , 1000)

// 手动点击重置按钮时执行该函数
const handleReset = () => {
    params.value = new initParams()
    pageNumber.value = 1
    pageSize.value = 10
    query()
}

// 手动点击编辑按钮
const handleEdit = (row: tableDataType) => {
    console.log('handleEdit');
    console.log(row);

    addGoodsTitle.value = `编辑商品`
    formData.value = row
    showAddGoodsFlag.value = true
}

// 手动点击删除按钮
const handleDelete = (id: number) => {
    console.log('handleEdit' + id);
    goodsDelete({
        id
    }).then(res => {
        ElMessage.success(res.msg)
        query()
    })
}

// 手动点击新增
const handleAdd = () => {
    addGoodsTitle.value = `新增商品`
    formData.value = new initFormData()
    showAddGoodsFlag.value = true
}

// 取消新增/编辑
const handleCancel = () => {
    showAddGoodsFlag.value = false
}

// 接收到子组件传来的自定义事件，操作成功，此时应关闭弹窗，刷新列表
const submit = () => {
    showAddGoodsFlag.value = false
    handleQuery()
}

//监听
watch(
    [pageNumber, pageSize],
    () => {
        // 监听到pageNumber或者pageSize变化，重新获取数据
        query()
    }
)

// 初始化页面时调用查询，相当于vue2的created
query()

</script>

<style lang="scss">
.search-warpper {
    border: 1px solid #e6eaee;
    margin: 20px;
    padding: 20px;
    box-sizing: border-box;
}

.options-warpper {
    margin: 20px;
}

.table-warpper {
    margin: 20px;
    box-sizing: border-box;
}

.table-pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px 0;
}
</style>