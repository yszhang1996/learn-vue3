<template>
    <div class="exam-info">
        <el-descriptions v-if="examPaperData" class="margin-top" title="基本信息" :column="3" border>
            <el-descriptions-item label="考试标题" :span="3">
                {{ examPaperData.examTitle }}
            </el-descriptions-item>
            <el-descriptions-item label="考试行业">
                {{ examPaperData.industryName }}
            </el-descriptions-item>
            <el-descriptions-item label="考试开始时间">
                {{ examPaperData.startTime }}
            </el-descriptions-item>
            <el-descriptions-item label="考试时长">
                {{ examPaperData.examDuration }}分钟
            </el-descriptions-item>
            <el-descriptions-item label="考试类型">
                {{ examPaperData.examTypeDesc }}
            </el-descriptions-item>
            <el-descriptions-item label="考试地点">
                {{ examPaperData.place }}
            </el-descriptions-item>
            <el-descriptions-item label="考试试卷">
                {{ examPaperData.title }}
            </el-descriptions-item>
            <el-descriptions-item label="考试内容描述">
                {{ examPaperData.describe }}
            </el-descriptions-item>
        </el-descriptions>
    </div>
    <div class="question-warpper">
        <div class="title">
            试题信息
        </div>
        <div v-if="examPaperData">
            <div>{{ examPaperData.examTitle }}</div>
            <div>
                <div>共{{ examPaperData.examQuestionVOS.length }}道题</div>
                <div>总分{{ totalScore(examPaperData.examQuestionVOS) }}分</div>
            </div>
            <div class="tip">
                <!--  答题中isResult === 1  -->
                <span class="examing" v-if="isResult === 1">答题中</span>
                <span class="result" v-if="examPaperData && isResult === 3">
                    <!--   将用户分数与及格线比较       -->
                    <!--    过及格线     -->
                    <span v-if="examPaperData.examScore >= examPaperData.passScore">及格</span>
                    <!--   没过及格线      -->
                    <span v-else-if="examPaperData.examScore < examPaperData.passScore">不及格</span>
                    <!--   缺考      -->
                    <span v-else-if="examPaperData.answerStatus === 3">缺考</span>
                </span>
            </div>
            <el-tabs v-model="activeName">
                <el-tab-pane :label="item.name" :name="`${index}`" v-for="(item, index) in paperTypeData" :key="index">
                    <div style="margin-top: 14px" class="question-classification">
                        <span class="question-classification-text">{{ numbers[index + 1] }}、{{ item.name
                        }}</span><span class="question-classification-total">共{{ item.question.length }}题，{{
        totalScore(item.question)
}}分</span>
                    </div>
                    <div v-if="item.name === '单选题'">
                        <choice-question v-for="(item2, index2) in item.question" :key="index2" :index="index2 + 1"
                            :item="item2" :multiple="false" :result="isResult" :isExam="true" @changeAnswer="
                            (userAnswer) => {
                                changeAnswer(userAnswer, index2, 0);
                            }" />
                    </div>
                    <div v-else-if="item.name === '多选题'">
                        <choice-question v-for="(item2, index2) in item.question" :key="index2" :index="index2 + 1"
                            :item="item2" :multiple="true" :result="isResult" :isExam="true" @changeAnswer="
                                (userAnswer) => {
                                    changeAnswer(userAnswer, index2, 1);
                                }
                            " />
                        <!-- changeAnswer函数的第三个参数，为数组中的第几项，0项为单选，1项为多选 -->
                    </div>
                    <div v-else-if="item.name === '判断题'">
                        <choice-question v-for="(item2, index2) in item.question" :key="index2" :index="index2 + 1"
                            :item="item2" :multiple="false" :result="isResult" :isExam="true" @changeAnswer="
                                (userAnswer) => {
                                    changeAnswer(userAnswer, index2, 2);
                                }
                            " />
                    </div>
                    <div v-else-if="item.name === '填空题'">
                        <Completion v-for="(item2, index2) in item.question" :key="index2" :index="index2 + 1"
                            :item="item2" :result="isResult" :isExam="true" @changeAnswer="
                                (userAnswer) => {
                                    changeAnswer(userAnswer, index2, 3);
                                }
                            " />
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getExam } from "../../request/api";
import { useRoute } from 'vue-router';
import { ref } from 'vue'
import { numbers } from '../../enum/index'
import ChoiceQuestion from "../../components/Exam/ChoiceQuestion.vue"
import Completion from "../../components/Exam/Completion.vue"

// 定义后端接口返回数据格式
interface examPaperData {
    id: number;
    title: string;
    examTitle: string;
    describe: string;
    examType: number;
    examTypeDesc: string;
    place: string;
    startTime: number;
    industry: string;
    industryName: string;
    passScore: number;
    type: number;
    generateMode: number;
    examDuration: number;
    status: number;
    answerStatus: number;
    examStatus: number;
    examScore: number;
    examQuestionVOS: ExamQuestionVO[];
    questMessages?: any;
    questionBankAutoVelumForms?: any;
}

interface ExamQuestionVO {
    id: number;
    type: number;
    typeName?: any;
    industry?: any;
    industryName?: any;
    source?: any;
    examPoint?: any;
    content: string;
    options?: OptionArray[];
    answer: string;
    rightAnswer?: any;
    questionAnalysis?: any;
    questionAnalysisFile?: any;
    status?: any;
    createId?: any;
    createDate?: any;
    updateId?: any;
    updateDate?: any;
    questionBankId?: any;
    questionBankTitle?: any;
    score: number;
    optionArray: OptionArray[];
    questionId: number;
}

interface OptionArray {
    content: string;
    option: string;
}

// 定义分类后的试题数据格式
interface paperTypeData {
    name: string;
    question: ExamQuestionVO[];
}
// 获取从上个页面传递过来的参数
const { query } = useRoute()
// 定义变量来接收后端返回的数据
const examPaperData = ref<examPaperData | undefined>()
// 对后端返回的数据进行分类处理
const paperTypeData = ref<paperTypeData[]>([
    {
        name: "单选题",
        question: [],
    },
    {
        name: "多选题",
        question: [],
    },
    {
        name: "判断题",
        question: [],
    },
    {
        name: "填空题",
        question: [],
    },
])
// 定义当前试卷状态，默认为1
// 1=答题中，2=已交卷，3=答题结束查看结果，4=缺考
const isResult = ref(1)

// 定义变量储存当前tab的值
const activeName = ref("0")

// 获取试卷信息函数
const getExamPaperData = () => {
    getExam({
        examId: query.id as string
    }).then(res => {
        examPaperData.value = res.data
        let data = res.data.examQuestionVOS;
        console.log(data);

        data.forEach((element: ExamQuestionVO) => {
            element.options = element.optionArray;
            if (element.type) {
                switch (element.type) {
                    case 1:
                        paperTypeData.value[0].question.push(element);
                        break;
                    case 2:
                        paperTypeData.value[1].question.push(element);
                        break;
                    case 3:
                        paperTypeData.value[2].question.push(element);
                        break;
                    case 4:
                        paperTypeData.value[3].question.push(element);
                        break;
                    default:
                        break;
                }
            }
        });
        console.log(paperTypeData.value);
        if (res.data.examStatus === 2 && res.data.answerStatus === 2) {
              isResult.value = 2;
              // 已交卷
            } else if (res.data.examStatus === 3) {
              isResult.value = 3;
              // 答题结束查看结果
            } else if (res.data.answerStatus === 3) {
              isResult.value = 4;
              // 缺考
            } else {
              isResult.value = 1;
              // 答题中
            }

    })
}

// 定义一个函数，计算从后端获取到的试题总共有多少分值，不用计算属性是因为该函数需要传参
const totalScore = (arr: ExamQuestionVO[]) => {
    let score = 0;
    arr.forEach((element: ExamQuestionVO) => {
        if (element.score) {
            score += element.score;
        }
    });
    return score
}

// 做题时选择/填写答案调用的函数
const changeAnswer = (userAnswer: string, index: number, arrIndex: number) => {
    console.log(userAnswer, index);
    paperTypeData.value[arrIndex].question[index].answer = userAnswer;
}

getExamPaperData()

</script>

<style lang="scss" scoped>
.exam-info {
    margin: 40px;
}

.question-warpper {
    margin: 40px;
}

.question-warpper {
    .title {
        color: var(--el-text-color-primary);
        font-weight: 700;
        margin-bottom: 16px;
    }
}
.question-classification{
    margin: 20px 0;
}
</style>