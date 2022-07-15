// 培训状态
export enum TrainStatus {
    '未参加' = 0,
    '进行中' = 1,
    '已完成' = 2,
    '已过期' = 3,
    '缺席' = 4,
}
// 培训状态对应的颜色
export enum TrainStatusColor {
    "#4dd804" = 2,
    "#bfbfbf" = 0,
    "#01d6d6" = 1,
    "#ffb100" = 4,
    "#ff0000" = 3,
}
// 培训类型
export enum TrainType {
    '线上' = 0,
    '线下' = 1,
}

// 考试类型
export enum ExamType  {
    '线上' = 0,
    '线下' = 1,
}
// 考试状态
export enum ExamStatus {
    '未发布' = 0,
    '已发布' = 1,
    '进行中' = 2,
    '已完成' = 3,
}
// 考试状态对应颜色
export enum ExamStatusColor{
    "#ff0000" = 2,
    "#bfbfbf" = 0,
    "#01d6d6" = 1,
    "#4dd804" = 3,
}
// 阿拉伯数字和中文数字转换
export enum numbers{
    "零" = 0,
    "一" = 1,
    "二" = 2,
    "三" = 3,
    "四" = 4,
    "五" = 5,
    "六" = 6,
    "七" = 7,
    "八" = 8,
    "九" = 9,
}

// 待办事项类型
export enum TodoListType{
    "考试" = 1,
    "项目评标" = 2,
    "培训" = 3,
    "培训 " = 4,
}

// 评标等级类型
export enum EvaluationGradeType{
    "优秀" = 1,
    "良好" = 2,
}