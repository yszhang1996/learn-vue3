<template>
    <div>
        <div class="search-warpper">
            <el-form :inline="true" :model="params" class="demo-form-inline">
                <el-form-item label="用户名">
                    <el-input v-model="params.username" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="params.email" placeholder="请输入邮箱" />
                </el-form-item>
                <el-form-item label="角色">
                    <el-select v-model="params.type" placeholder="请选择角色" style="width:100%">
                        <el-option label="管理员" value="管理员" />
                        <el-option label="普通用户" value="普通用户" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleQuery">查询</el-button>
                    <el-button @click="handleReset(new initParams())">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="options-warpper">
            <el-button type="primary" @click="handleAdd">新增</el-button>
        </div>
        <div class="table-warpper" v-loading="loading">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="id" label="ID" width="180" />
                <el-table-column prop="username" label="用户名" />
                <el-table-column prop="email" label="邮箱" />
                <el-table-column prop="type" label="角色" />
                <el-table-column prop="remark" label="备注" />
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
        <AddUser :showAddFlag="showAddFlag" :title="addTitle" @handleCancel="handleCancel" @submit="submit"
            :formData="formData" />
    </div>
</template>

<script lang="ts" setup >
import { ElMessage } from "element-plus";
import { reactive, ref, watch, toRaw } from "vue";
import { useRouter } from "vue-router";
import { getUserList, userDelete } from "../../request/api";
import { useGetList,useDeleteList } from "../../hooks/base"
import AddUser from "./AddUser.vue";

const router = useRouter()

let initParams = class {
    constructor() {
        this.username = ''
        this.email = ''
        this.type = ''
    }
    username
    email
    type
}

type tableDataType = {
    id?: number,
    type: string,
    username: string,
    email: string,
    remark: string,
}

// 使用组合式函数封装好的查询
const { params, tableData, pageNumber, pageSize, total, loading, handleQuery, handleReset } = useGetList(new initParams(), reactive<tableDataType[]>([]), getUserList)
// 使用组合式函数封装好的删除
const { handleDelete } = useDeleteList(userDelete,handleQuery)

let initFormData = class {
    constructor() {
        this.type = ''
        this.username = ''
        this.email = ''
        this.remark = ''
    }
    type
    username
    email
    remark
}

const showAddFlag = ref(false)

// 新增/编辑弹窗的标题
const addTitle = ref('新增用户')

// 新增/编辑时的默认值
const formData = ref<tableDataType>(new initFormData())

// 手动点击编辑按钮
const handleEdit = (row: tableDataType) => {
    console.log('handleEdit');
    addTitle.value = `编辑用户`
    formData.value = row
    showAddFlag.value = true
}

// 手动点击新增
const handleAdd = () => {
    addTitle.value = `新增用户`
    formData.value = new initFormData()
    showAddFlag.value = true
}

// 取消新增/编辑
const handleCancel = () => {
    showAddFlag.value = false
}

// 接收到子组件传来的自定义事件，操作成功，此时应关闭弹窗，刷新列表
const submit = () => {
    showAddFlag.value = false
    handleQuery()
}

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