<template>
    <div v-loading="loading">
        <div class="search-wrapper">
            <div class="list">
                <span class="label">试题类型</span>
                <!--  使用单选框 循环展示数据 questionTypes: ['随机选题', '单选题', '多选题', '判断题', '填空题'], 存放题型数组  -->
                <el-radio v-for="(item, index) in questionTypes" v-model="questionType" :key="index" :label="index">{{
                        item
                }}
                </el-radio>
            </div>
            <div class="list">
                <span class="label">题库</span>
                <el-select v-model="questionBank" placeholder="请选择">
                    <el-option v-for="item in bankList" :key="item.id" :label="item.title" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="list">
                <el-button type="primary" @click="getQuestionData">开始练习</el-button>
                <el-button @click="getQuestionData">重置</el-button>
            </div>
        </div>
        <div class="content">
            <el-scrollbar ref="scrollbarRef">
                <div v-if="randomQuestionData.length">
                    <template v-for="(item, index) in randomQuestionData" :key="index">
                        <ChoiceQuestion v-if="item.type === 1 || item.type === 2" :index="index + 1" :item="item"
                            :multiple="item.type === 1 ? false : true" :result="result" :isExam="false" @changeAnswer="
                                (userAnswer) => {
                                    changeAnswer(userAnswer, index);
                                }
                            " />
                        <ChoiceQuestion v-else-if="item.type === 3" :index="index + 1" :item="item" :multiple="false"
                            :result="result" :isExam="false" @changeAnswer="
                                (userAnswer) => {
                                    changeAnswer(userAnswer, index);
                                }
                            " />
                        <Completion v-else-if="item.type === 4" :index="index + 1" :item="item" :result="result"
                            :isExam="false" @changeAnswer="
                                (userAnswer) => {
                                    changeAnswer(userAnswer, index);
                                }
                            " />
                    </template>
                    <div class="submit-button">
                        <el-button type="primary" @click="submitRandomConfirm" v-if="result == 1"
                            :disabled="result !== 1">提交</el-button>
                    </div>
                </div>
                <div v-else>
                    <el-empty description="请选择试题类型和题库后点击开始练习" />
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox, ElScrollbar } from "element-plus";
import { nextTick, ref } from "vue";
import { useDebounceFn } from '@vueuse/core'
import { expertexamList, randomPractice, submitRandom } from "../../request/api"
import ChoiceQuestion from "../../components/Exam/ChoiceQuestion.vue"
import Completion from "../../components/Exam/Completion.vue"
type BankList = {
    title: string,
    id: string,
}

interface RandomQuestionData {
    id: number;
    content: string;
    type: number;
    userAnswer?: string,
    rightAnswer?: string,
    options: (Option | Options2)[];
    questionAnalysis?: any;
}

interface Options2 {
    fileUrl: string;
    content: string;
    option: string;
}

interface Option {
    content: string;
    option: string;
}
// 题库列表
const bankList = ref<BankList[]>([])
// 下拉框当前选择的题库
const questionBank = ref<string>()
// 可选题型列表
const questionTypes = ['随机选题', '单选题', '多选题', '判断题', '填空题']
// 单选框当前选择的题型，默认选中第0项
const questionType = ref(0)
// 随机练习答题数据
const randomQuestionData = ref<RandomQuestionData[]>([])
// 当前是做题还是解析的标识符，1表示答题中，2表示已交卷，3表示答题结束查看结果，4表示缺考（随机练习只有1和3）
const result = ref(1)
// 当前页面加载中标识符
const loading = ref(true)
// 当前页面答题部分滚动条dom元素
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

expertexamList().then(res => {
    bankList.value = res.data.records
    questionBank.value = res.data.records[0].id
    loading.value = false
})

// 获取随机练练习题的函数，使用防抖避免多次重复请求
const getQuestionData = useDebounceFn(() => {
    console.log('getQuestionData')
    result.value = 1;
    loading.value = true;
    randomQuestionData.value = [];
    console.log(questionType.value);
    console.log(questionBank.value);
    if (questionType.value === null || !questionBank.value === null) {
        ElMessage.error("请先选择要练习的试题类型和题库");
        loading.value = false;
        return false;
    } else {
        randomPractice({
            questionBankId: questionBank.value as string,
            questionType: questionType.value,
        }).then((res) => {
            let data = res.data;
            data.forEach((element: RandomQuestionData) => {
                element.userAnswer = "";
                element.rightAnswer = "";
            });
            randomQuestionData.value = data;
        })
            .finally(() => {
                loading.value = false;
            });
    }
},300)

// 用户填写/选择答案时执行的函数
const changeAnswer = (userAnswer: string, index: number) => {
    console.log(userAnswer, index);
    randomQuestionData.value[index].userAnswer = userAnswer;
}
// 用户点击提交时执行的函数
const submitRandomConfirm = () => {
    for (let i = 0; i < randomQuestionData.value.length; i++) {
        const element = randomQuestionData.value[i];
        if (element.userAnswer === undefined || !element.userAnswer) {
            ElMessageBox.confirm(
                '您有未答完的试题，是否确认提交？',
                '警告',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
                .then(() => {
                    submitRandom1(true);
                    return;
                })
                .catch(() => {
                    return;
                })
            return;
        }
    }
    submitRandom1(false);
}
// 因为如果有未填写的题目，会在submitRandomConfirm里弹出提示框，所以在此就没必要再次弹出确认框，通过参数flag控制
const submitRandom1 = (flag: boolean) => {
    if (flag) {
        // 弹出确认框flag，已经弹出，直接请求后台，提交数据
        sendForm();
    } else {
        // 未弹出确认框，弹出
        ElMessageBox.confirm(
            '是否确认提交？',
            '',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(() => {
                sendForm();
            })
            .catch(() => {
                return;
            })
    }
}
// 真正的提交数据到后台
const sendForm = () => {
    submitRandom().then((res) => {
        console.log(res);
        let answer = res.data;
        for (let i = 0; i < randomQuestionData.value.length; i++) {
            const element = randomQuestionData.value[i];
            if (answer[element.id]) {
                randomQuestionData.value[i].rightAnswer = answer[element.id];
            }
        }
        result.value = 3;
        nextTick(()=>{
            scrollbarRef.value!.setScrollTop(0)
        })
        ElMessage.success('提交成功！')
    });
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/publicTableStyle.scss";

.list {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 20px;
}

.label {
    display: inline-block;
    width: 70px;
    height: 22px;
    margin-top: -1px;
    text-align: justify;
    text-align-last: justify;
    margin-right: 12px;
}

.content {
    margin: 20px;
    margin-bottom: 0;
    padding: 0;
    width: calc(100% - 40px);
    // 100vh视窗高度 - 60px的header高度 - 30px的footer高度 - 218px的搜索栏高度 - 40px的搜索栏margin高度
    height: calc(100vh - 60px - 30px - 218px - 40px);
    overflow: hidden;
    box-sizing: border-box;
}

.submit-button {
    padding: 50px;
    padding-left: 65px;
}
</style>