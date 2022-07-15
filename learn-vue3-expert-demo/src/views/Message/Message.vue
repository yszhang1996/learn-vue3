<template>
    <div class="container">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="未读消息" name="unread"></el-tab-pane>
            <el-tab-pane label="已读消息" name="read"></el-tab-pane>
        </el-tabs>
        <div class="content" v-loading="loading">
            <template v-if="tableData.length > 0">
                <div class="content">
                    <div class="notice-list" v-for="item in tableData" :key="item.messageId">
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
                    <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10]"
                        layout="sizes, prev, pager, next, jumper" :total="total" />
                </div>
            </template>
            <template v-else>
                <el-empty description="暂无消息通知" />
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useGetList } from "../../hooks/base"
import type { TabsPaneContext } from 'element-plus'
import { messageList } from "../../request/api"
let initParams = class {
    constructor() {
        this.readStatus = 0
    }
    readStatus
}

type tableDataType = {
    createDate: string,
    messageId: string,
    messageTitle: number,
    sendChannel: string,
    sendChannelName: number,
}

// 使用组合式函数封装好的查询
const { params, tableData, pageNum, pageSize, total, loading, handleQuery } = useGetList(new initParams(), reactive<tableDataType[]>([]), messageList)

// 定义变量用来储存当前选择的tab，默认展示未读页面
const activeName = ref('unread')

// 切换tab时触发
const handleClick = (tab: TabsPaneContext, event: Event) => {
    if (tab.paneName === activeName.value) return
    console.log(tab, event)
    console.log(tab.paneName);
    if (tab.paneName === 'unread') {
        params.value.readStatus = 0
    } else if (tab.paneName === 'read') {
        params.value.readStatus = 1
    }
    handleQuery()
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/publicTableStyle.scss";

.container {
    margin: 40px;
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
</style>