<template>
    <div>
        <div class="search-wrapper">
            <el-form :inline="true" :model="params" class="demo-form-inline">
                <el-form-item label="评标时间">
                    <el-date-picker v-model="dataPickerValue" value-format="YYYY-MM-DD HH:mm:ss"
                        :default-time="defaultTime" type="daterange" range-separator="至" start-placeholder="开始时间"
                        end-placeholder="结束时间" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleQuery">查询</el-button>
                    <el-button @click="handleReset(new initParams(), () => { dataPickerValue = [] })">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-warpper" v-loading="loading">
            <el-table :data="tableData" border style="width: 100%" header-cell-class-name="normal-table-header">
                <el-table-column prop="projectName" label="项目名称" fixed show-overflow-tooltip min-width="180">
                </el-table-column>
                <el-table-column prop="remark" label="集合地点" show-overflow-tooltip min-width="180">
                </el-table-column>
                <el-table-column prop="bidStartTime" label="评标时间" min-width="200"></el-table-column>
                <el-table-column prop="bidPlanEndTime" label="预计评标结束时间" min-width="200">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template #default="scope">
                        <el-button link type="primary" @click="sendMsg(scope.row.applyId)">发送到手机
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="table-pagination">
                <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10]"
                    layout="sizes, prev, pager, next, jumper" :total="total" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup >
import { ElMessage } from "element-plus";
import { reactive, ref, watch } from "vue";
import { useGetList } from "../../hooks/base"
import { getProjectInfoList } from "../../request/api";
let initParams = class {
    constructor() {
        this.startTime = ''
        this.endTime = ''
    }
    startTime
    endTime
}

// :default-time="['00:00:00', '23:59:59']"

type tableDataType = {
    applyId?: number,
    projectName: string,
    remark: string,
    bidStartTime: string,
    bidPlanEndTime: string,
    state: string,
}

// 使用组合式函数封装好的查询
const { params, tableData, pageNum, pageSize, total, loading, handleQuery, handleReset } = useGetList(new initParams(), reactive<tableDataType[]>([]), getProjectInfoList)

// 对日期选择器做特殊处理
const dataPickerValue = ref([])

// 指定默认时间选择到当天的23:59:59
const defaultTime = ref([
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59),
])

const sendMsg = (id: number) => {
    // 发送短信到手机过于敏感，用定时器模拟请求
    console.log(id);
    setTimeout(() => {
        ElMessage.success('发送成功')
    }, 500);
}

//监听
watch(
    dataPickerValue,
    (val) => {
        params.value.startTime = val[0]
        params.value.endTime = val[1]
    }
)
</script>

<style lang="scss">
@import "../../assets/css/publicTableStyle.scss";
</style>