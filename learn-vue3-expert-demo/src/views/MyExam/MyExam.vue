<template>
    <div>
        <div class="search-wrapper">
            <el-form :inline="true" :model="params" class="demo-form-inline">
                <el-form-item label="考试标题">
                    <el-input v-model="params.title" placeholder="请输入考试标题"></el-input>
                </el-form-item>
                <el-form-item label="考试类型">
                    <el-select class="defalut-input" v-model="params.type" placeholder="请选择考试类型">
                        <template v-for="(item, key) in ExamType" :key="key">
                            <el-option :label="key" v-if="typeof item === `number`" :value="item">
                            </el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select class="defalut-input" v-model="params.status" placeholder="请选择状态">
                        <template v-for="(item, key) in ExamStatus" :key="key">
                            <el-option :label="key" v-if="typeof item === `number`" :value="item">
                            </el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleQuery">查询</el-button>
                    <el-button @click="handleReset(new initParams())">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="options-warpper">
            <el-button type="primary" @click="router.push('/randompractice')">随机练习</el-button>
        </div>
        <div class="table-warpper" v-loading="loading">
            <el-table :data="tableData" border style="width: 100%" header-cell-class-name="normal-table-header">
                <el-table-column prop="title" label="考试标题" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="industry" label="考试行业" show-overflow-tooltip></el-table-column>
                <el-table-column prop="startTime" label="考试时间">
                    <template #default="scope">
                        <span>{{ scope.row.startTime ? useDateFormat(scope.row.startTime, 'YYYY-MM-DD HH:mm:ss').value :
                                '-'
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="place" label="考试地点"></el-table-column>
                <el-table-column prop="type" label="考试类型"> </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template #default="scope">
                        <div class="judge-status">
                            <div class="status-dot"
                                :style="`background:${ExamStatusColor[scope.row.statusCode] || `#ff0000`}`">
                            </div>
                            <span style="margin-left: 10px">{{
                                    scope.row.status
                            }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template #default="scope">
                        <el-button link type="primary" v-if="scope.row.statusCode == 2 && scope.row.typeCode == 0"
                            @click="gotoDetail(scope.row.id, scope.row.expertId, scope.row.statusCode)">
                            进入考试
                        </el-button>
                        <el-button link type="primary" v-else-if="scope.row.statusCode == 3&&scope.row.typeCode==0"
                            @click="gotoDetail(scope.row.id, scope.row.expertId, scope.row.statusCode)">
                            查看结果
                        </el-button>
                        <span v-else>-</span>
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

<script lang="ts" setup>
import { reactive } from "vue";
import { useGetList } from "../../hooks/base"
import { getMyExamList } from "../../request/api";
import { ExamStatus, ExamStatusColor, ExamType } from "../../enum/index"
import { useDateFormat } from "@vueuse/core"
import { useRouter } from "vue-router";

const router = useRouter()

let initParams = class {
    constructor() {
        this.status = null
        this.title = null
        this.type = null
    }
    status: number | null
    title: string | null
    type: number | null
}

type tableDataType = {
    applyId?: number,
    projectName: string,
    remark: string,
    bidStartTime: string,
    bidPlanEndTime: string,
    state: string,
}

// 使用组合式函数封装好的查询
const { params, tableData, pageNum, pageSize, total, loading, handleQuery, handleReset } = useGetList(new initParams(), reactive<tableDataType[]>([]), getMyExamList)

// 跳转到详情
const gotoDetail = (id: number, expertId: number, statusCode: number) => {
    router.push({ path: '/exampaper', query: { id, expertId, status: statusCode } })
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/publicTableStyle.scss";

.judge-status {
    .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        display: inline-block;
        vertical-align: middle;
    }
}
</style>