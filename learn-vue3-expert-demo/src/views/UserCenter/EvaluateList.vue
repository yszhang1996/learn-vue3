<template>
    <div>
        <div class="search-wrapper">
            <el-form :inline="true" :model="params" class="demo-form-inline">
                <el-form-item label="项目名称">
                    <el-input placeholder="请填写项目名称" v-model="params.projectName" />
                </el-form-item>
                <el-form-item label="评标等级">
                    <el-select class="defalut-input" v-model="params.evaluationGrade" placeholder="请选择评标等级">
                        <template v-for="(item, key) in EvaluationGradeType" :key="key">
                            <el-option :label="key" v-if="typeof item === `number`" :value="item">
                            </el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleQuery">查询</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-warpper" v-loading="loading">
            <el-table :data="tableData" border style="width: 100%" header-cell-class-name="normal-table-header">
                <el-table-column prop="projectName" label="项目名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="evaluateBidStartTime" label="评标时间"></el-table-column>
                <el-table-column prop="evaluationGradeName" label="评价等级"></el-table-column>
                <el-table-column prop="evaluationUnit" label="评价单位"></el-table-column>
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
import { evaluationList } from "../../request/api";
import { EvaluationGradeType } from "../../enum/index"
let initParams = class {
    constructor() {
        this.projectName = ''
        this.evaluationGrade = null
    }
    projectName
    evaluationGrade: number | null
}

type tableDataType = {
    projectName: string,
    evaluateBidStartTime: string,
    evaluationGradeName: string,
    evaluationUnit: string,
}

// 使用组合式函数封装好的查询
const { params, tableData, pageNum, pageSize, total, loading, handleQuery, handleReset } = useGetList(new initParams(), reactive<tableDataType[]>([]), evaluationList)

</script>

<style lang="scss">
@import "../../assets/css/publicTableStyle.scss";
</style>