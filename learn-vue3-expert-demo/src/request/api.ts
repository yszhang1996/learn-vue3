/**
 * api接口统一管理
 */
import axios from './'

interface basePage {
    pageSize: number,
    pageNumber: number,
}

namespace User {
    export interface UserLoginParams {
        userName: string,
        password: string,
        code: string,
        loginType: number,
        userType: number,
    }
}

namespace ProjectInfo {
    export interface ListParams extends basePage {
        startTime: string,
        endTime: string,
    }
}

namespace MyTrain {
    export interface ListParams extends basePage {
        trainName: string,
        trainStatus: number,
        trainType: number,
    }
    export interface DetailParams {
        trainId: string,
        expertTrainStatus: string,
    }
    export interface CourseDetailParams {
        trainId: number,
        courseId: number,
    }
    export interface addAllPlayTime {
        scheduleId: number,
        videoAllPlayTime: number,
    }
    export interface updateAttachmentStatus {
        scheduleId: number,
        completeStatus: number,
    }
    export interface checkTrainOver {
        trainId: number,
    }
    export interface addPlayTime {
        scheduleId: number,
        videoSchedule: number,
    }
    export interface CourseDetailData {
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
}

namespace MyExam {
    export interface ListParams extends basePage {
        status: number,
        title: string,
        type: number,
    }
    export interface randomPractice {
        questionBankId: string,
        questionType: number,
    }
    export interface getExam {
        examId: string
    }
}

namespace UserCenter {
    export interface messageList extends basePage {
        readStatus: number
    }
    export interface leave {
        startDate: string,
        endDate: string,
        reason: string,
    }
    export interface cancelLeave {
        leaveId: number,
        cycle: number,
    }
    export interface evaluationList extends basePage {
        evaluationGrade: number,
        projectName: string,
    }
}
// 用户登录
export const userLogin = (params: User.UserLoginParams) => axios.post('/user/login', params)

// 获取评标项目信息列表
export const getProjectInfoList = (params: ProjectInfo.ListParams) => axios.post('/v1/expertuser/bidProjectListV2', params)

// 获取我的培训列表
export const getMyTrainList = (params: MyTrain.ListParams) => axios.post('/v1/expertuser/expertTrainList', params)
// 获取培训详情
export const joinTrainDetails = (params: MyTrain.DetailParams) => axios.get('/v1/expertuser/joinTrainDetails', params)

// 该处注释的代码相较于别的API增加了axios.post<MyTrain.CourseDetailData[]>，即，定义了返回数据的格式，这里自己写项目嫌麻烦就没用，
// 如果要约束返回数据的格式，需要在方法后指明反参格式，同时在/request/index.ts中将代码12-13行注释解开，注释掉14-15行
// 在123-134行封装好的四个请求get、post、put、delete，修改其格式约束，参考111-122行
// export const courseDetails = (params: MyTrain.CourseDetailParams) => axios.post<MyTrain.CourseDetailData[]>(`/v1/expertuser/courseDetails?trainId=${params.trainId}&courseId=${params.courseId}`)

// 获取培训详情
export const courseDetails = (params: MyTrain.CourseDetailParams) => axios.post(`/v1/expertuser/courseDetails?trainId=${params.trainId}&courseId=${params.courseId}`)

// 我的培训-检查是否可进入培训
export const addAllPlayTime = (params: MyTrain.addAllPlayTime) => axios.post(`v1/expertuser/addAllPlayTime?scheduleId=${params.scheduleId}&videoAllPlayTime=${params.videoAllPlayTime}`)
// 我的培训-培训管理-课程详情-修改完成状态
export const updateAttachmentStatus = (params: MyTrain.updateAttachmentStatus) => axios.post(`v1/expertuser/updateAttachmentStatus?scheduleId=${params.scheduleId}&completeStatus=${params.completeStatus}`)
// 我的培训-异步检查培训是否结束
export const checkTrainOver = (params: MyTrain.checkTrainOver) => axios.post(`v1/expertuser/checkTrainOver?trainId=${params.trainId}`)
// 我的培训-培训管理-课程详情-修改视频已看时长
export const addPlayTime = (params: MyTrain.addPlayTime) => axios.post(`v1/expertuser/addPlayTime?scheduleId=${params.scheduleId}&videoSchedule=${params.videoSchedule}`)

// 获取我的考试列表
export const getMyExamList = (params: MyExam.ListParams) => axios.post('/v1/expertexam/queryExpertExam', params)
// 获取随机练习题库列表
export const expertexamList = () => axios.get('/v1/expertexam/list')
// 获取随机练习练习题列表
export const randomPractice = (params: MyExam.randomPractice) => axios.post('/v1/expertexam/randomPractice', params)
// 我的考试-考试页面-获取考试信息
export const getExam = (params: MyExam.getExam) => axios.get('/v1/expertexam/expert/answer', params)
// 我的考试-随机练习-提交练习题
export const submitRandom = () => axios.post('v1/expertexam/submitRandom')

// 个人中心-获取待办事项列表
export const selectExpertAgent = (params: basePage) => axios.post('/v1/expertuser/selectExpertAgent', params)
// 个人中心-获取消息通知列表
export const messageList = (params: UserCenter.messageList) => axios.post('/message/messageList', params)
// 个人中心-获取请假剩余时长
export const leaveBalance = () => axios.get('/v1/expertuser/leaveBalance')
// 个人中心-获取请假记录列表
export const leaveList = (params: basePage) => axios.post('/v1/expertuser/leaveList', params)
// 个人中心-请假-提交请假申请
export const leave = (params: UserCenter.leave) => axios.post('/v1/expertuser/leave', params)
// 个人中心-请假-提交请假申请
export const cancelLeave = (params: UserCenter.cancelLeave) => axios.get('/v1/expertuser/cancelLeave', params)
// 个人中心-获取我的评价数据列表
export const evaluationList = (params: UserCenter.evaluationList) => axios.post('/v1/expertuser/evaluationList', params)
// 个人中心-获取我的评价数据列表
export const violationRecords = (params: basePage) => axios.post('/v1/expertuser/violationRecords', params)




