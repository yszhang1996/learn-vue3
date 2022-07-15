<template>
  <div class="ChoiceQuestion">
    <div class="order">
      <span class="order-number">{{ index }}</span>
    </div>
    <div class="question">
   <!--   选项与题目之间的间距 18px  -->
   <!--   题目字体大小 颜色   -->
      <div class="question-title">
        <span v-html="item.content"></span>
   <!--    只有随机练习添加    -->
    <!--   添加题目后边的 √ ×     -->
    <!--   result（随机练习只有1和3)  当为3答题结束查看结果时显示题目对错标识 -->
        <span v-if="result === 3 && !isExam">
    <!--   judgeRight判断题目对错 判断显示哪个标识       -->
          <i v-if="!judgeRight" class="el-icon-check icon"></i>
          <i v-else class="el-icon-close icon"></i>
        </span>
      </div>
      <div
          class="question-answer"
          v-for="(item2, index) in item.options"
          :key="index"
          @click="selectAnswer(item2.option, index)"
      >
        <div
            style="color: #fff"
            class="question-answer-icon"
            :class="{
            'question-answer-right':
              answer === item2.option ||
              multipleAnswer.indexOf(item2.option) !== -1,
            'question-answer-error':
              (answer === item2.option ||
                multipleAnswer.indexOf(item2.option) !== -1) &&
              judgeRight &&
              result === 3 && !isExam,//
               'hover-border': isHover === index,//当isHover === index设置鼠标悬浮时的样式
               'radio-icon': !multiple,//设置单选题图标样式
               'radio-selected': (answer === item2.option ||
               multipleAnswer.indexOf(item2.option) !== -1) && !multiple,//单选被选中时样式
               'radio-selected-error': (answer === item2.option ||
                multipleAnswer.indexOf(item2.option) !== -1) &&
              judgeRight &&
              result === 3 && !isExam}">
          <!--   radio-selected-error设置单选选中错误选项的样式       -->
          <!-- 当result的状态为3（查看答题结果）并且不是考试的时候，才显示这道题有没有做错 -->
              <el-icon style="font-weight: 600" v-if="(answer === item2.option ||
              multipleAnswer.indexOf(item2.option) !== -1) && multiple" ><Check /></el-icon>
        </div>
        <!--  设置鼠标悬浮在哪个选项上， 就将当前选项下标赋值给isHover     -->
        <!--  鼠标离开时将isHover值赋值-1      -->
        <div
            @mouseover="isHover = index"
            @mouseout="isHover = -1"
            class="question-answer-text">
        <!--   显示形式设置行内块  设置边距       -->
          <span style="width: 15px; color: #1F2329;display: inline-block;margin-right: 8px">{{item2.option}}</span>
          <span style="color: #1F2329">{{item2.content }}</span>
        </div>
      </div>
      <div style="line-height: 19px" v-if="result === 3 && !isExam">
        <div class="question-analysis">
          <span >正确答案：</span>
          <span class="question-analysis-content">{{ item.rightAnswer }}</span>
        </div>
    <!--   将我的答案改为答案解析  如果答案解析为空就显示 暂无  -->
    <!--   这块字段不用跟着对错变色     -->
    <!--   删除 class="question-analysis"类名 -->
        <div>
          <span>答案解析：</span>
          <span class="question-analysis-content"
          >{{item.questionAnalysis ? item.questionAnalysis : '暂无'}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Check } from '@element-plus/icons-vue';
export default {
  data() {
    return {
      isHover: -1,//设置鼠标经过选项时的判断
      answer: null,
      multipleAnswer: [],
      judgeRight: false, // 使用计算属性和函数均不生效，改用watch修改状态
    };
  },
  components: {
    Check
  },
  props: {
    index: {
      default: null,
      type: Number,
    },
    item: {
      default: null,
      type: Object,
    },
    multiple: {
      default: false,
      type: Boolean,
    },
    result: {
      default: 1,
      type: Number,
    },
    isExam: {
      default: true,
      type: Boolean,
    },
  },
  methods: {
    selectAnswer(option, index) {
      console.log(option);
      if (this.result !== 1) return;
      if (this.multiple) {
        if (this.multipleAnswer.indexOf(option) === -1) {
          this.multipleAnswer.push(option);
          this.multipleAnswer.sort();
        } else {
          this.multipleAnswer.splice(this.multipleAnswer.indexOf(option), 1);
        }
        this.$emit("changeAnswer", this.multipleAnswer.join());
      } else {
        console.log(this.multiple);
        this.answer = option;
        this.$emit("changeAnswer", this.answer);
      }
    },
  },
  watch: {
    item: {
      handler(val) {
        console.log("触发监听")
        if (val.answer) {
          if (this.multiple) {
            this.multipleAnswer = val.answer.split(',');
            console.log(this.multipleAnswer[0]);
          } else {
            console.log("监听到有答案");
            this.answer = val.answer;
          }
        }
        /* ... */
        if (val.userAnswer === undefined) {
          this.judgeRight = true;
          return;
        }
        if (val.rightAnswer === undefined) {
          this.judgeRight = true;
          return;
        }
        let userAnswer = val.userAnswer;
        if (typeof val.userAnswer === "object") {
          userAnswer = val.userAnswer.join();
        }
        this.judgeRight = userAnswer !== val.rightAnswer;
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.ChoiceQuestion {
  display: flex;
  align-items: flex-start;
  margin-top: 30px;
  &:first-of-type{
    margin-top: 0;
  }
  .order {
    width: 44px;//修改题目序号框大小
    height: 100%;
    display: flex;
    flex-direction: column;
    &-number {
      height: 32px;//修改题目序号框大小
      width: 44px;//修改题目序号框大小
      background: #F5F7FA;//修改题目序号框背景色
      opacity: 1;
      border-radius: 6px  1px  1px  6px;//修改题目序号框圆角
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;//修改题目序号字体大小
      color: #1F2329;//修改题目序号框大小;
    }
    &-score {
      height: 42px;//修改题目序号框大小
      display: flex;
      justify-content: center;
      align-items: center;
      color: #1890ff;
    }
  }
  .question {
    font-size: 14px;//修改选项字体大小
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    user-select: none;
    border-left: 1px solid #f5f7fa;
    &-answer {
      cursor: pointer;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 10px 0;
      &:last-child {//线与最后一个选项对齐
        margin-bottom: 0;
      }
      &-icon {
        box-sizing: border-box;
        width: 14px;
        height: 14px;
        border: 1px solid #dcdfe6;
        font-size: 14px;
        color: #515151;
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover {
          border: 1px solid #007AFF;
        }
      }
      &-right {
        background: #2779FF;
        border: 1px solid #2779FF;
        color: #ffffff;
      }
      &-error {
        background: #ff6969;
        border: 1px solid #ff6969;
        color: #ffffff;
      }
      &-text {
        margin-left: 8px;
        line-height: 14px;
      }
      //单选框样式
      .radio-icon {
        box-sizing: border-box;
        width: 14px;
        height: 14px;
        border-radius: 50%;
      }
      .radio-selected { //单选框选中样式   使用盒子模型+边框实现
        border: 5px solid #2779FF;
        background-color: white;
        &-error {//单选框选中样式
          border: 5px solid #ff6969;
        }
      }
    }
    &-analysis {
      margin: 7px 0 5px 0;
      color: #2779FF;
    }
  }
  .hover-border {
    border: 1px solid #007AFF;
  }
}

.question-title {
  position: relative;
  margin-bottom: 8px;
  margin-top: 6px;
  font-size: 14px;
  line-height: 19px;
  color: #1F2329;
  img {
    width: 300px;
    margin: 20px 0;
  }
  .el-icon-check {//正确
    color: #007AFF;
  }
  .el-icon-close {//错误
    color: #ff6969;
  }
  .icon {//题目对错标识样式
    position: absolute;
    right: -30px;
    top: 0;
    font-size: 20px;
    font-weight: 600;
  }
}
</style>