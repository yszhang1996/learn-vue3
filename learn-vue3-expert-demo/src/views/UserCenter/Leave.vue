<template>
    <div class="container">
        <div>
            <el-form class="form" ref="ruleFormRef" :model="formData" :rules="rules" label-suffix="："
                label-width="100px">
                <el-form-item label="请假时间" prop="startDate">
                    <el-date-picker v-model="leaveDate" value-format="YYYY-MM-DD hh:mm:ss" type="datetimerange"
                        range-separator="到" start-placeholder="起始时间" end-placeholder="结束时间" />
                </el-form-item>
                <el-form-item label="请假事由" prop="reason">
                    <el-input type="textarea" placeholder="请填写请假事由" v-model="formData.reason" />
                </el-form-item>
            </el-form>
            <div class="submit" v-loading="balanceLoading">
                <div>
                    本年度已请假天数：{{ leaveBalanceData.currentDays.toFixed(2) }}天
                </div>
                <div>
                    下年度已请假天数：{{ leaveBalanceData.nextDays.toFixed(2) }}天
                </div>
            </div>
            <div class="submit">
                <el-button type="primary" @click="handleSubmit(ruleFormRef)" :loading="buttonLoading">提交</el-button>
                <el-button @click="handleReset">重置</el-button>
            </div>
        </div>
        <div class="table-warpper" v-loading="loading">
            <el-table :data="tableData" border style="width: 100%" header-cell-class-name="normal-table-header">
                <el-table-column prop="id" label="序号" width="80px">
                    <template #default="scope">
                        {{ scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="请假时间">
                    <template #default="scope">
                        {{ scope.row.startDate }}~{{ scope.row.endDate }}
                    </template>
                </el-table-column>
                <el-table-column prop="reason" label="请假事由" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="statusName" label="状态" show-overflow-tooltip>
                </el-table-column>

                <el-table-column fixed="right" label="操作" width="120">
                    <template #default="scope">
                        <el-button link type="primary" v-if="scope.row.status === 1"
                            @click="handleCancelLeave(scope.row)">取消请假
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

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { leaveBalance, leaveList, leave, cancelLeave } from "../../request/api"
import { useGetList } from "../../hooks/base"
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';
import { useDebounceFn } from '@vueuse/core'

type tableDataType = {
    id: number;
    reason: string;
    status: number;
    statusName: string;
    startDate: string;
    endDate: string;
    leaveDate: string;
    cycle: number;
}

// 使用组合式函数封装好的查询
const { tableData, pageNum, pageSize, total, loading, handleQuery } = useGetList({}, reactive<tableDataType[]>([]), leaveList)

// 储存请假范围
const leaveDate = ref('')
// 储存表单数据
const formData = ref({
    startDate: '',
    endDate: '',
    reason: '',
})
// 储存表单校验规则
const rules = ref({
    startDate: [
        {
            required: true,
            message: '请选择请假时间',
            trigger: 'blur',
        },
    ],
    reason: [
        {
            required: true,
            message: '请填写请假事由',
            trigger: 'blur',
        },
    ],
})
// 储存请假余额数据
const leaveBalanceData = ref({
    currentDays: 0,
    nextDays: 0
})
// 储存获取余额时加载状态
const balanceLoading = ref(false)
// 储存提交按钮加载状态
const buttonLoading = ref(false)

const ruleFormRef = ref<FormInstance>() //ref()不是创建双向数据绑定，而是获取template里的同名DOM元素，等同于vue2的$refs.xxx

// 监听请假时间的变动，有变化时，将变化后的数据赋值给formData
watch(
    leaveDate,
    (val) => {
        if (Array.isArray(val)) {
            formData.value.startDate = val[0]
            formData.value.endDate = val[1]
        }
    }
)

const handleSubmit = useDebounceFn((formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (!valid) return;
        console.log('校验通过');
        buttonLoading.value = true
        leave(formData.value).then(res => {
            ElMessage.success('请假成功')
            // 请假成功，清空表单数据
            setTimeout(() => {
                handleReset()
            }, 100);
            // 重新获取余额和请假记录列表
            getLeaveBalance()
            handleQuery()
        }).finally(() => {
            buttonLoading.value = false
        })
    })
}, 300)

// 清空表单数据和借用的leaveDate
const handleReset = () => {
    formData.value.reason = ""
    leaveDate.value = ''
}

const handleCancelLeave = useDebounceFn(
    (row: tableDataType) => {
        ElMessageBox.confirm(
            '是否确定取消该次请假？',
            '警告',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(() => {
                cancelLeave({
                    leaveId: row.id,
                    cycle: row.cycle,
                }).then((res) => {
                    ElMessage.success("取消请假成功！");
                    // 获取请假列表数据
                    handleQuery();
                    // 获取剩余假期天数
                    getLeaveBalance();
                });
                return;
            })
            .catch(() => {
                return;
            })
    }, 300)

// 获取请假余额数据
const getLeaveBalance = () => {
    balanceLoading.value = true
    leaveBalance().then(res => {
        leaveBalanceData.value = res.data
    }).finally(() => {
        balanceLoading.value = false
    })
}

getLeaveBalance()
</script>

<style lang="scss" scoped>
@import "../../assets/css/publicTableStyle.scss";

.container {
    margin: 40px;

    .form {
        width: 400px;
    }

    .submit {
        width: 400px;
        text-align: right;
        margin-bottom: 20px;
        font-size: 14px;
        color: #8f959e;
    }
}
</style>