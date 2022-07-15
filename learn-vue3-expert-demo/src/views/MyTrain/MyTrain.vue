<template>
    <div>
        <div class="search-wrapper">
            <el-form :inline="true" :model="params" class="demo-form-inline">
                <el-form-item label="培训名称">
                    <el-input v-model="params.trainName" placeholder="请输入培训名称"></el-input>
                </el-form-item>
                <el-form-item label="培训类型">
                    <el-select class="defalut-input" v-model="params.trainType" placeholder="请选择培训类型">
                        <template v-for="(item, key) in TrainType" :key="key">
                            <el-option :label="key" v-if="typeof item === `number`" :value="item">
                            </el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="培训状态">
                    <el-select class="defalut-input" v-model="params.trainStatus" placeholder="请选择培训状态">
                        <template v-for="(item, key) in TrainStatus" :key="key">
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
        <div class="table-warpper" v-loading="loading">
            <el-table :data="tableData" border style="width: 100%" header-cell-class-name="normal-table-header">
                <el-table-column prop="title" label="培训名称" show-overflow-tooltip min-width="180">
                </el-table-column>
                <el-table-column prop="industry" label="行业名称" show-overflow-tooltip min-width="180"></el-table-column>
                <el-table-column prop="trainHours" label="培训课时" min-width="100"></el-table-column>
                <el-table-column prop="startTime" label="培训时间" min-width="360">
                    <template #default="scope">
                        <span>{{ scope.row.startTime }}~{{ scope.row.endTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="typeName" label="培训类型" min-width="100"> </el-table-column>
                <el-table-column prop="place" label="培训地点" show-overflow-tooltip min-width="180"></el-table-column>
                <el-table-column prop="expertTrainStatusName" label="状态" min-width="100">
                    <template #default="scope">
                        <div class="judge-status">
                            <div class="status-dot"
                                :style="`background:${TrainStatusColor[scope.row.expertTrainStatus] || `#ff0000`}`">
                            </div>
                            <span style="margin-left: 10px">{{
                                    scope.row.expertTrainStatusName
                            }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template #default="scope">
                        <el-button link type="primary" @click="gotoDetail(scope.row.trainId,scope.row.expertTrainStatus)">详情
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
import { reactive } from "vue";
import { useGetList } from "../../hooks/base"
import { getMyTrainList } from "../../request/api";
import { TrainStatus, TrainStatusColor, TrainType } from "../../enum/index"
import { useRouter } from "vue-router";

const router = useRouter()

let initParams = class {
    constructor() {
        this.trainName = ''
        this.trainStatus = null
        this.trainType = null
    }
    trainName
    trainStatus: number | null
    trainType: number | null
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
const { params, tableData, pageNum, pageSize, total, loading, handleQuery, handleReset } = useGetList(new initParams(), reactive<tableDataType[]>([]), getMyTrainList)

// 跳转到详情
const gotoDetail = (id:number,status:number)=>{
    router.push({path: '/traindetail',query: {id,status}})
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