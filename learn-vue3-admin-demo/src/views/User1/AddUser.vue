<template>
    <div>
        <el-dialog v-model="showAddFlag" :title="title" :before-close="beforeClose" width="400px">
            <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-suffix="：" label-width="70px">
            <el-form-item label="用户名" prop="username">
                    <el-input v-model="formData.username" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="formData.email" placeholder="请输入邮箱" />
                </el-form-item>
                <el-form-item label="角色" prop="type">
                    <el-select v-model="formData.type" placeholder="请选择角色" style="width:100%">
                        <el-option label="管理员" value="管理员" />
                        <el-option label="普通用户" value="普通用户" />
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="formData.remark" placeholder="请输入备注" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="closeDialog">取 消</el-button>
                    <el-button type="primary" @click="submit(ruleFormRef)" :loading="loading">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ElMessage, FormInstance } from 'element-plus';
import { ref } from 'vue';
import { userEdit } from "../../request/api";

type Props = {
    showAddFlag: boolean,
    title: string,
    formData: {
        id?: number,
        type: string,
        username: string,
        remark: string,
        email: string,
    }
}

const props = defineProps<Props>()

// 加载中标识符
const loading = ref(false)

const rules = ref({
    type: [
        {
            required: true,
            message: '请选择类型',
            trigger: 'blur',
        },
    ],
    username: [
        {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
        },
    ],
    email: [
        {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur',
        },
    ],
})

// 注册自定义事件
const emit = defineEmits(['handleCancel', 'submit'])

// 该事件会在用户点击叉号或者遮罩层时触发，正常点击按钮取消不会触发
const beforeClose = () => {
    closeDialog()
}

const closeDialog = () => {
    emit('handleCancel')
}

const ruleFormRef = ref<FormInstance>() //ref()不是创建双向数据绑定，而是获取template里的同名DOM元素，等同于vue2的$refs.xxx

// 提交表单
const submit = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (!valid) return;
        console.log('校验通过');
        loading.value = true
        userEdit(props.formData).then(res => {
            if (props.formData.id) {
                // 判断id是否存在，存在id，是编辑
                ElMessage.success('编辑成功')
            } else {
                // 不存在，是新增
                ElMessage.success('新增成功')
            }
            // 告诉父组件，操作成功
            emit('submit')
        }).finally(() => {
            loading.value = false
        })
    })
}
</script>

<style lang="scss" scoped>
.addgoods-container {
    width: 350px;
    height: calc(100% - 40px);
    margin: 20px auto;
    padding: 20px 0;
    box-sizing: border-box;
    // border: 1px solid red;
}

.options-warpper {
    margin: 20px;
    display: flex;
    justify-content: center;
}
</style>