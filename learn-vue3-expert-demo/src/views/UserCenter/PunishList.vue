<template>
    <div>
        <div class="table-warpper" v-loading="loading">
            <el-table :data="tableData" border style="width: 100%" header-cell-class-name="normal-table-header">
                <el-table-column prop="violationName" label="违规事项名称"></el-table-column>
                <el-table-column prop="violationProjectName" label="关联项目名称"></el-table-column>
                <el-table-column prop="dealMeasures" label="处理措施"></el-table-column>
                <el-table-column prop="createDate" label="记录时间"></el-table-column>
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
import { violationRecords } from "../../request/api";

type tableDataType = {
    violationName: string,
    violationProjectName: string,
    dealMeasures: string,
    createDate: string,
}

// 使用组合式函数封装好的查询
const { tableData, pageNum, pageSize, total, loading } = useGetList({}, reactive<tableDataType[]>([]), violationRecords)

</script>

<style lang="scss">
@import "../../assets/css/publicTableStyle.scss";
</style>