<template>
    <div class="course">
        <div class="course-title" v-if="currentView">
            <span>{{ title }}(已进行{{
                    ((progress / courseData.length) * 100).toFixed(0)
            }}% 剩余{{
        currentView.fileScheduleName === `完成`
            ? `0秒`
            : countdown === 0
                ? `0秒`
                : `${countdown}秒`
}})</span>

        </div>
        <div class="course-content">
            <div class="course-view" ref="test">
                <video style="width: 100%; height: 100%" controls="true" @playing="playing" @pause="pause"
                    ref="courseVideo">
                    <source src="http://localhost:3000/test.mp4" type="video/mp4" />
                </video>
            </div>
            <div class="course-list">
                <div v-for="(item, index) in courseData" :key="index">
                    <div class="course-list-item" :class="{ active: item.scheduleId === currentView.scheduleId }"
                        @click="changeView(item)">
                        <!-- <span class="iconfont item-icon" :class="el-icon-video-play"></span> -->
                        <span class="item-icon">
                            <el-icon :size="22">
                                <VideoPlay />
                            </el-icon>
                        </span>
                        <span class="ellipsis item-text" :title="item.fileName">
                            {{ item.fileName }} </span><span class="list-right" v-if="item.fileType === 1">
                            {{
                                    item.fileScheduleName === `完成`
                                        ? `100%`
                                        : item.videoAllTime
                                            ? `${(
                                                (item.videoSchedule ?? 0 / item.videoAllTime) *
                                                100
                                            ).toFixed(0)}%`
                                            : `0%`
                            }}
                        </span>
                        <span class="item-progress" v-else>
                            {{
                                    item.fileScheduleName === `完成`
                                        ? `100%`
                                        : item.fileReadTime
                                            ? `${(
                                                (item.videoSchedule ?? 0 / item.fileReadTime) *
                                                100
                                            ).toFixed(0)}%`
                                            : `0%`
                            }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router";
import { courseDetails, addAllPlayTime, updateAttachmentStatus, checkTrainOver, addPlayTime } from "../../request/api"
import { VideoPlay } from '@element-plus/icons-vue';
import { ElMessage } from "element-plus"

const courseVideo = ref<Element | null>(null)

onMounted(() => {
    console.log(courseVideo.value);
})

interface currentView {
    scheduleId?: number;
    fileUrl?: string;
    trueFileUrl?: string;
    fileName?: string;
    fileSchedule?: number;
    fileScheduleName?: string;
    fileReadTime?: number;
    videoSchedule?: number;
    fileType?: number;
    videoAllTime?: any;
}

const { query } = useRoute()

// 当前课程的标题
const title = unescape(query.title as string)

// 所有的章节
const courseData = ref<currentView[]>([])

// 当前播放/显示的章节
const currentView = ref<currentView>({})

// 课程总进度
const progress = ref(0)

// 当前章节剩余需要看的时间
const countdown = ref(0)

// 当前视频是否在播放，默认未播放
const isPlay = ref(false)

// 从后端获取当前课程数据
const getCourseDetail = (courseId: string, trainId: string) => {
    courseDetails({
        courseId: Number(courseId),
        trainId: Number(trainId),
    }).then((res) => {
        courseData.value = res.data;
        courseData.value.forEach((item) => {
            if (item.fileSchedule === 1) {
                progress.value++;
            }
        });
        handleData(res.data[0]);
    });
}

// 处理需要播放/显示的章节
const handleData = (item: currentView) => {
    let fileName = item.fileUrl as string;
    //获取后缀
    let type = fileName.substring(fileName.lastIndexOf(".") + 1);
    // fileType字典，1为视频，2为word,3为pdf，4为Excel,5为图片
    // 赋予当前显示的视频/文档的对象一个新的属性，fileType，文件类型，该函数每次进入页面/用户点击列表都会调用
    switch (type) {
        case `avi`:
            item.fileType = 1;
            break;
        case `mp4`:
            item.fileType = 1;
            break;
        case `mov`:
            item.fileType = 1;
            break;
        case `flv`:
            item.fileType = 1;
            break;
        case `pdf`:
            item.fileType = 3;
            break;
        case `jpg`:
            item.fileType = 5;
            break;
        case `png`:
            item.fileType = 5;
            break;
        case `jpeg`:
            item.fileType = 5;
            break;
        default:
            break;
    }
    // 获取文件地址中，第一个/，截取/之后的地址，和环境变量中的文件服务地址拼接
    // let index = item.fileUrl.indexOf("/");
    // item.trueFileUrl = `${
    //   process.env.VUE_APP_URL_ORIGIN
    // }${item.fileUrl.substring(index + 1, item.fileUrl.length)}`;
    item.trueFileUrl = `http://localhost:3000/test.mp4`;
    currentView.value = item;
    listens();
}

let timer: number

const listens = () => {
    clearInterval(timer);
    if (currentView.value.fileSchedule === 1) return;
    if (currentView.value.fileType === 1) {
        //  当前观看的是视频时执行的逻辑
        let interval = 1;
        let seconds = 0;
        setTimeout(() => {
            const courseVideo = ref<HTMLVideoElement | null>(null)

            courseVideo.value?.addEventListener("loadedmetadata", () => {
                let duration = Number(courseVideo.value?.duration.toFixed(0));
                console.log(duration);
                currentView.value.videoAllTime = duration - 1;
                countdown.value = currentView.value.videoAllTime - (currentView.value.videoSchedule ?? 0)
                addAllPlayTime({
                    scheduleId: currentView.value.scheduleId ?? 0,
                    videoAllPlayTime: currentView.value.videoAllTime ?? 0,
                });
                timer = setInterval(() => {
                    // 判断fileSchedule是否为0，0是未完成才可执行循环定时器中的代码
                    if (isPlay && currentView.value.fileSchedule === 0) {
                        seconds += interval;
                        currentView.value.videoSchedule = currentView.value.videoSchedule ?? 0 + 1;
                        countdown.value = currentView.value.videoAllTime - (currentView.value.videoSchedule ?? 0)
                        if (
                            currentView.value.videoSchedule >=
                            currentView.value.videoAllTime
                        ) {
                            // 如果将fileSchedule改变状态放到请求的then中可能会出现网速过慢导致循环定时器再次触发的情况，所以在不知道完成观看的请求是否调用成功之前先将fileSchedule的状态改为1（完成），回调过来之后走then状态改为1，走catch状态改为0（未完成）
                            currentView.value.fileSchedule = 1;
                            addAllPlayTime({
                                scheduleId: currentView.value.scheduleId as number,
                                videoAllPlayTime: currentView.value.videoAllTime,
                            });
                            updateAttachmentStatus({
                                scheduleId: currentView.value.scheduleId as number,
                                completeStatus: 1,
                            })
                                .then((res) => {
                                    currentView.value.fileSchedule = 1;
                                    ElMessage.success("已完成观看要求！");
                                    clearInterval(timer);
                                    judgeSend();
                                })
                                .catch((err) => {
                                    currentView.value.fileSchedule = 0;
                                });
                        } else {
                            if (seconds % 10 === 0) {
                                addPlayTime({
                                    scheduleId: currentView.value.scheduleId as number,
                                    videoSchedule: 10,
                                });
                            }
                        }
                    }
                }, interval * 1000);
            });
        }, 0);
    }
}

//playing属性开始播放视频。
const playing = () => {
    console.log("playing");
    isPlay.value = true;
}
//pause属性返回视频是否暂停
const pause = () => {
    console.log("pause");
    isPlay.value = false;
}

const changeView = (item: currentView) => {
    console.log(item);

}

const judgeSend = () => {
    progress.value++; //调用该函数时，说明必有一项课程被完成，所以进度条+1
    if (progress.value === courseData.value.length) {
        //判断是否完成所有课程项
        checkTrainOver({
            trainId: Number(query.trainId),
        });
    }
}

getCourseDetail(query.courseId as string, query.trainId as string)
</script>

<style lang="scss" scoped>
.course {
    margin: 50px;

    .course-title {
        background-color: #1f2329;
        color: #d0d0d0;
        padding: 14px 20px;
    }

    .course-content {
        height: 714px;
        background-color: #000000;
        display: flex;

        .course-view {
            width: 100%;
            height: 714px;
        }

        .course-list {
            background-color: #303137;
            width: 300px;
            height: 714px;
            color: #ffffff;

            .active {
                background-color: rgb(32, 32, 32);
            }

            .course-list-item {
                padding: 10px 20px;
                font-size: 14px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;

                &:hover {
                    background-color: rgb(32, 32, 32);
                }

                .item-icon {
                    font-size: 16px;
                    margin-right: 10px;
                    padding-top: 5px;
                }

                .item-text {
                    flex: 1;
                }

                .item-progress {
                    width: 50px;
                    text-align: right;
                }
            }
        }
    }
}

.ellipsis {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
}
</style>