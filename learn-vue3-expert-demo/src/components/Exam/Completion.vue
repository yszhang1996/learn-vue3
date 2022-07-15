<template>
  <div class="Completion">
    <div class="order">
      <span class="order-number">{{ index }}</span>
      <!-- <span class="order-score">3分</span> -->
    </div>
    <div class="question">
      <div class="question-title">
        <span v-html="title" @change="test" class="title-container"></span>
      </div>
      <!-- 当result的状态为3（查看答题结果）并且不是考试的时候，才显示解析 -->
      <div class="question-analysis" v-if="result === 3 && !isExam">
        <span>我的答案：</span>
        <span
            class="question-analysis-content"
            :class="{ 'question-analysis-error': judgeRight }"
        >{{ item.userAnswer }}</span
        >
      </div>
      <div class="question-analysis" v-if="result === 3 && !isExam">
        <span>正确答案：</span>
        <span class="question-analysis-content">{{ item.rightAnswer }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      answer: null,
      questionTitle1: "",
      questionTitle2: "",
      title: null,
      judgeRight: false, // 使用计算属性和函数均不生效，改用watch修改状态
    };
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
    result: {
      default: 1,
      type: Number,
    },
    isExam: {
      default: true,
      type: Boolean,
    },
    isManage: {
      default: false,
      type: Boolean
    }
  },
  watch: {
    item: {
      handler(val) {
        console.log("触发监听")
        console.log(val)
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
  created() {
    console.log(this.item);
    let str = this.item.content;
    if (str) {
      let reg = new RegExp("_{2,}");
      let newStrReg = reg.exec(str);
      console.log(newStrReg);
      console.log(newStrReg.index);
      console.log(newStrReg[0].length);
      this.questionTitle1 = str.slice(0, newStrReg.index);
      this.questionTitle2 = str.slice(newStrReg.index + newStrReg[0].length);
      if(!this.isExam||this.result!=3){
        this.title = `${this.questionTitle1}<input type="text" value="${this.item.answer?this.item.answer:''}" class="question-title-input" style="border: none;
        border-bottom: 1px solid #6ab8ff;
        width: 100px;
        outline: none;
        margin: 0 16px;" />${this.questionTitle2}`;
      }else{
        this.title = `${this.questionTitle1}<input readonly="readonly" type="text" value="${this.item.answer?this.item.answer:''}" class="question-title-input" style="border: none;
        border-bottom: 1px solid #6ab8ff;
        width: 100px;
        outline: none;
        margin: 0 16px;" />${this.questionTitle2}`;
      }
      if(this.isManage) {//管理端分开判断
        this.title = `${this.questionTitle1}<input readonly="readonly" type="text" value="${this.item.answer?this.item.answer:''}" class="question-title-input" style="border: none;
          border-bottom: 1px solid #6ab8ff;
          width: 100px;
          outline: none;
          margin: 0 16px;" />${this.questionTitle2}`;
      }

      console.log(this.title);

    }
  },
  methods: {
    test(event) {
      // 该方法在span标签内所有的DOM元素的change事件都会触发，所以要判断一下我们监听的是不是input输入内容改变的监听
      if (
          event.target.nodeName === "INPUT" &&
          event.target.className === "question-title-input"
      ) {
        // 获取触发事件对象的属性
        console.log("input");
        console.log(event.target.value);
        this.answer = event.target.value;
        console.log(this.answer);
        this.$emit("changeAnswer", this.answer);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.Completion {
  display: flex;
  align-items: flex-start;
  margin-top: 30px;
  .order {
    width: 44px;//修改题目序号框大小
    height: 100%;
    border-right: 1px solid #efefef;
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
    }
    &-score {
      height: 42px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #1890ff;
    }
  }
  .question {
    font-size: 16px;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    &-title {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 10px;
      &-input {
        border: none;
        border-bottom: 1px solid #6ab8ff;
        width: 100px;
        margin: 0 16px;
        &:focus {
          outline: none;
          border-bottom: 1px solid #6ab8ff;
        }
      }
    }

    &-answer {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 10px 0;
      &-icon {
        width: 21px;
        height: 21px;
        border: 1px solid #d5d5d5;
        border-radius: 50%;
        font-size: 14px;
        color: #515151;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &-right {
        background: #6ab8ff;
        border: 1px solid #6ab8ff;
        color: #ffffff;
      }
      &-error {
        background: #ff6969;
        border: 1px solid #ff6969;
        color: #ffffff;
      }
      &-text {
        margin-left: 20px;
      }
    }
    &-analysis {
      margin: 5px 0;
      &-content {
        color: #1890ff;
      }
      &-error {
        color: #ff6969;
      }
    }
  }
}
</style>
