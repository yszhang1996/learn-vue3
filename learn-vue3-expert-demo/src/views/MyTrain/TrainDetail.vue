<template>
    <div class="train-info">
        <el-descriptions class="margin-top" title="培训信息" :column="3" border>
            <el-descriptions-item label="培训名称">
                {{ trainInfo.title }}
            </el-descriptions-item>
            <el-descriptions-item label="培训行业">
                {{ trainInfo.industry }}
            </el-descriptions-item>
            <el-descriptions-item label="培训类型">
                {{ trainInfo.typeName }}
            </el-descriptions-item>
            <el-descriptions-item label="培训开始时间">
                {{ trainInfo.startTime }}
            </el-descriptions-item>
            <el-descriptions-item label="培训结束时间">
                {{ trainInfo.endTime }}
            </el-descriptions-item>
            <el-descriptions-item label="状态">
                {{ trainInfo.expertTrainStatusName }}
            </el-descriptions-item>
            <el-descriptions-item label="培训地点">
                {{ trainInfo.place }}
            </el-descriptions-item>
        </el-descriptions>
    </div>
    <div class="course-warpper">
        <div class="title">
            课程内容
        </div>
        <template v-for="(item) in trainInfo.courseScheduleVOS" :key="item.courseId">
            <div class="course-list" @click="gotoCourseDetail(item.courseId, item.schedule, item.title)">
                <span>{{ trainInfo.title }}</span><span>{{ item.title }}</span>
                <div class="progress">
                    <span>课程进度：</span>
                    <div>
                        <el-progress :percentage="Number(item.schedule)"></el-progress>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { joinTrainDetails } from "../../request/api"
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue"

// 定义返回数据类型
interface TrainInfo {
    id?: number;
    trainId?: number;
    title?: string;
    industry?: string;
    trainHours?: number;
    startTime?: string;
    endTime?: string;
    type?: number;
    typeName?: string;
    place?: string;
    expertTrainStatus?: number;
    expertTrainStatusName?: string;
    courseScheduleVOS?: CourseScheduleVO[];
}

interface CourseScheduleVO {
    courseId: number;
    title: string;
    schedule: string;
}

const { query } = useRoute()

const router = useRouter()

const trainInfo = ref<TrainInfo>({})

const getTrainDetail = () => {
    joinTrainDetails({
        trainId: query.id as string,
        expertTrainStatus: query.status as string,
    }).then((res) => {
        console.log(res);
        trainInfo.value = res.data
    })
}

const gotoCourseDetail = (courseId:string, schedule:string, courseTitle:string) => {
    router.push({ path: `/coursedetail`, query:{
        courseId,
        schedule,
        courseTitle: escape(courseTitle),
        trainId: query.id,
        title: escape(trainInfo.value.title as string),
    }})
}

getTrainDetail()
</script>

<style lang="scss">
.train-info,
.course-warpper {
    margin: 40px;
}

.course-warpper {
    .title {
        color: var(--el-text-color-primary);
        font-weight: 700;
        margin-bottom: 16px;
    }

    .course-list {
        width: 350px;
        height: 200px;
        background-color: #f5f7fa;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        cursor: pointer;
        position: relative;

        .progress {
            position: absolute;
            left: 0;
            bottom: -30px;
            width: 320px;
            padding-right: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            div {
                width: 230px;
                padding-top: 1px;
            }
        }

        &:hover {
            background-color: #eaecee;
        }
    }
}
</style>