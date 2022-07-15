<template>
    <div class="container">
        <div class="user-info">
            <div>
                <el-icon>
                    <UserFilled />
                </el-icon>
            </div>
            <div>
                {{ userInfo.username }}
            </div>
            <div>
                {{ userInfo.email }}
            </div>
            <div>
                {{ userInfo.phone }}
            </div>
        </div>
        <div class="setting">
            <div class="quick">
                <div class="title">
                    快捷入口
                </div>
                <div class="content">
                    <div class="quick-list" @click="router.push('leave')">
                        <img src="../../assets/images/userCenter/leave.png" />
                        <span>请假</span>
                    </div>
                    <div class="quick-list" @click="router.push('examination')">
                        <img src="../../assets/images/userCenter/exam.png" />
                        <span>我的考试</span>
                    </div>
                    <div class="quick-list" @click="router.push('myTrain')">
                        <img src="../../assets/images/userCenter/train.png" />
                        <span>我的培训</span>
                    </div>
                    <div class="quick-list" @click="router.push('evaluatelist')">
                        <img src="../../assets/images/userCenter/evaluate.png" />
                        <span>我的评价</span>
                    </div>
                    <div class="quick-list" @click="router.push('punishlist')">
                        <img src="../../assets/images/userCenter/violation.png" />
                        <span>违规记录</span>
                    </div>
                </div>
            </div>
            <div class="todo">
                <div class="title">
                    待办事项
                </div>
                <div v-loading="loading">
                    <el-table :data="tableData" border style="width: 100%" header-cell-class-name="normal-table-header">
                        <el-table-column prop="id" label="序号" width="80px">
                            <template #default="scope">
                                {{ scope.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="agentTypeName" label="待办类型" width="180px"></el-table-column>
                        <el-table-column prop="content" label="待办项内容" show-overflow-tooltip>
                            <template #default="scope">
                                <span class="beyond-ellipsis">{{
                                        `${scope.row.title}${scope.row.agentTypeName}，${TodoListType[scope.row.agentType]
                                        }时间${scope.row.timeDuring}`
                                }}</span>
                            </template>
                        </el-table-column>

                        <el-table-column fixed="right" label="操作" width="120">
                            <template #default="scope">
                                <el-button link type="primary" v-if="scope.row.agentType !== 2"
                                    @click="handleShowDetail(scope.row)">
                                    详情
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="table-pagination">
                        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize"
                            :page-sizes="[3, 5, 10]" layout="sizes, prev, pager, next, jumper" :total="total" />
                    </div>
                </div>
            </div>

            <div class="notice">
                <div class="title">
                    <span>消息通知</span>
                    <span class="more" @click="router.push('message')">查看更多</span>
                </div>
                <div v-loading="NoticeLoading">
                    <template v-if="NoticeTableData.length > 0">
                        <div class="content">
                            <div class="notice-list" v-for="item in NoticeTableData" :key="item.messageId">
                                <div class="notice-title">
                                    <span class="notice-title-text">{{ item.sendChannelName }}</span>
                                    <span class="notice-title-date">{{ item.createDate }}</span>
                                </div>
                                <div class="notice-content">
                                    {{ item.messageTitle }}
                                </div>
                            </div>
                        </div>
                        <div class="table-pagination">
                            <el-pagination v-model:current-page="NoticePageNum" v-model:page-size="NoticePageSize"
                                :page-sizes="[3, 5, 10]" layout="sizes, prev, pager, next, jumper"
                                :total="NoticeTotal" />
                        </div>
                    </template>
                    <template v-else>
                        <el-empty description="暂无消息通知" />
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import { useGetList } from "../../hooks/base"
import { selectExpertAgent, messageList } from "../../request/api";
import { UserFilled } from "@element-plus/icons-vue"
import { TodoListType } from "../../enum/index"
import { useRouter } from "vue-router";

const router = useRouter()

type tableDataType = {
    agentTypeName: string,
    title: string,
    agentType: number,
    timeDuring: string,
    businessId: number,
    expertId: number,
    expertTrainStatus: number,
}

type NoticeDataType = {
    createDate: string,
    messageId: string,
    messageTitle: number,
    sendChannel: string,
    sendChannelName: number,
}

// 使用组合式函数封装好的查询
const { tableData, pageNum, pageSize, total, loading } = useGetList({}, reactive<tableDataType[]>([]), selectExpertAgent) // 查询待办事项
const { tableData: NoticeTableData, pageNum: NoticePageNum, pageSize: NoticePageSize, total: NoticeTotal, loading: NoticeLoading } = useGetList({ readStatus: 0 }, reactive<NoticeDataType[]>([]), messageList) // 查询消息通知

const userInfo = ref()
// 从缓存中取出用户信息
const getUserInfo = () => {
    userInfo.value = JSON.parse(localStorage.getItem('userinfo') || '')
}
// 根据待办事项的类型决定跳转到培训还是考试
const handleShowDetail = (row: tableDataType) => {
    const type = row.agentType;
    console.log(type);
    switch (type) {
        case 1:
            router.push({
                path: `/exampaper`,
                query: {
                    id: row.businessId,
                    expertId: row.expertId,
                },
            })
            break;
        case 3:
            router.push({
                path: `/traindetail`,
                query: {
                    id: row.businessId,
                    status: row.expertTrainStatus,
                },
            })
            break;
        case 4:
            router.push({
                path: `/traindetail`,
                query: {
                    id: row.businessId,
                    status: row.expertTrainStatus,
                },
            })
            break;
        default:
            break;
    }
}

getUserInfo()
</script>

<style lang="scss" scoped>
@import "../../assets/css/publicTableStyle.scss";

.container {
    display: flex;
    height: 100%;

    .user-info {
        width: 200px;
        height: 100%;
        text-align: center;
        border-right: 1px solid #e6eaee;

        div {
            margin: 20px;

            &:first-of-type {
                padding-top: 50px;
            }
        }
    }

    .setting {
        flex: 1;

        .title {
            color: var(--el-text-color-primary);
            font-weight: 700;
            margin-bottom: 16px;
        }

        .quick {
            margin: 40px;

            .content {
                display: flex;
            }

            .quick-list {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                margin: 0px 40px;
                cursor: pointer;

                &:first-of-type {
                    margin-left: 0;
                }

                img {
                    width: 48px;
                    height: 48px;
                }

                span {
                    min-width: 56px;
                    text-align: center;
                    margin-top: 12px;
                    font-size: 14px;
                    color: #1f2329;
                    line-height: 19px;
                }
            }
        }

        .todo {
            margin: 40px;
        }

        .notice {
            margin: 40px;

            .title {
                display: flex;
                justify-content: space-between;

                .more {
                    color: #2779ff;
                    font-weight: normal;
                    cursor: pointer;
                }
            }

            .content {
                font-size: 14px;

                .notice-list {
                    margin: 10px 0;
                    padding: 10px 0;
                    border-bottom: 1px solid #e9ecf0;

                    .notice-title {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 20px;
                    }

                    .notice-content {
                        color: #8f959e;
                    }
                }
            }
        }

    }
}
</style>