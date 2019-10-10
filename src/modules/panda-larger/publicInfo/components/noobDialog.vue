<template>
  <!--新手红包，挽留弹窗--->
  <Popup :value="isShow">
    <div class="questionnaireDialog" slot="content">
      <div class="noticeTitle" v-html="data.title"></div>

      <div style="margin-top: 14px;">
        <div class="titleBar">
          <p>奖励流程</p>
          <p>累计红包</p>
        </div>

        <ul class="award" v-if="data.list">
          <li v-for="(item,index) in data.list"
              :class="{ 'currentStep':  data.current==index+1, 'un': data.current<index+1}">

            <p>
              <i :class=" data.current<index+1 ? 'unfinished' : 'finish' ">{{index+1}}</i>{{item.title}}
              <span v-if="data.current==index+1" class="current">当前环节</span>
            </p>
            <p v-html="item.money"></p>
          </li>
        </ul>

        <div v-if="data.desc" class="desc" v-html="data.desc"></div>

        <div class="flex BtnGroup" v-if="data.button.length">
          <mt-button type="primary" size="large" class="btn-lg btn-round btnStyle btn-empty" @click="close(false)">
            {{data.button[0]}}
          </mt-button>
          <mt-button type="primary" size="large" class="btn-lg btn-red btn-round btnStyle linear" @click="close(true)">
            {{data.button[1]}}
          </mt-button>
        </div>
      </div>
    </div>
  </Popup>
</template>
<script>

  import Popup from '@/components/view/popup';
  import {Toast, Indicator, MessageBox} from '@/utils/helper';
  import api from '@/services/api.js';

  export default {

    name: "questionnaireDialog",
    components: {
      Popup,
    },

    computed: {

      finished() {
        if (this.selectedValue) {
          return true
        }

        if (this.area != null && this.area.text.trim() != '') {
          return true
        }
        return false
      },
    },

    props: {
      data: {
        type: Object,
        required: true
      },
      visibility: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {

        area: null,

        isShow: false,

        options: [],

        //选中的option
        selectedValue: '',

        //提交的表单数据
        formData: {
          fundproductid: '',
          servicetype: '',
          questionnaireid: '',
          answers: [],
        },
        questionid: '',

        questioncontent: '',

        //用于临时存储答案
        tempAnswers: new Map(),

      }
    },
    watch: {},

    mounted() {
      this.isShow = this.visibility
    },

    methods: {

      close(flag) {
        this.$emit('close', flag);
      },

      replaceTrim(str) {
        return str.replace(/^\s+|\s+$/g, '')
      },
    }

  }
</script>


<style lang="scss">

  .flex {
    display: flex;
  }

  .questionnaireDialog {
    width: 275px;
    padding-bottom: 20px;
    background: #FFF;
    border-radius: 8px;

    .pub {
      width: 95%;
      margin: 0 auto;
      padding-left: 15px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .questionDesc {
      @extend .pub;
      margin-top: 3px;
      color: #666666;
      font-size: 12px;
    }
    .quest {
      @extend .pub;
      color: #333333;
      font-size: 14px;
    }

    div.noticeTitle {
      padding: 0 5px;
      height: 55px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #fff;
      letter-spacing: 0.08px;
      text-align: center;
      line-height: 58px;
      margin-bottom: 5px;
      opacity: 0.8;
      background: #E72427;
      border-radius: 8px 8px 0 0;

      span {
        font-size: 20px;
        color: #f8e71c;
        font-weight: bold;
        margin: 0 2px;
      }
    }

    .highlight {
      color: #e72427;
      margin: 0 2px;
    }

    .flexCenter {
      flex: 1;
      text-align: center;
    }

    div.titleBar {
      color: #666666;
      @extend .flex;
      p {
        @extend .flexCenter;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
      }
    }

    div.desc {
      text-align: center;
      color: #a9a9a9;
      font-size: 11px;
      span {
        @extend .highlight;
      }
    }

    .flag {
      position: absolute;
      content: " ";
      width: 20px;
      height: 40px;
      left: 0;
      top: 0;

    }

    .ov {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    ul.award {
      padding: 15px 0 0 8px;
      pointer-events: none;

      li {
        display: flex;
        height: 52px;
        line-height: 28px;

        &.currentStep {
          line-height: 20px;
        }

        &.currentStep p:nth-child(2) {
          line-height: 38px;
        }

        &.un p:nth-child(1) {
          color: #999999;
        }

        &.un p:nth-child(2) {
          color: #424242;
        }

        p {
          @extend .flexCenter;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #333333;
          letter-spacing: 0;
          text-align: left;
          position: relative;
          @extend .ov;

          &:nth-child(2) {
            @extend .highlight;
            line-height: 32px;
            text-align: center;
            span {
              font-size: 20px;
              vertical-align: center;
            }
          }

          span.current {
            display: block;
            position: absolute;
            top: 22px;
            left: 32px;
            @extend .highlight;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            letter-spacing: 0;
          }
          i {
            display: inline-block;
            width: 20px;
            height: 35px;
            margin: 5px 15px 0 0;
            text-align: center;
            color: #FFF;
            font-size: 12px;

            &.finish {
              background: url("~@/assets/images/home/arrows@2x.png") no-repeat top center;
              background-size: 68%;
            }

            &.unfinished {
              background: url("~@/assets/images/home/arrows@3x.png") no-repeat top center;
              background-size: 68%;
            }

          }

        }

      }
    }

    div.mint-radiolist {
      .mint-cell {
        min-height: 36px;
      }
      .mint-cell-wrapper {
        border: none;
        font-size: 14px;
      }
    }

    div.BtnGroup {
      margin-top: 12px;
      padding: 0px 10px;
    }

    .btnStyle {
      margin: 8px auto;
      height: 37px;
      font-size: 13px;
      width: 37%;
      &:nth-child(1) {
        margin-right: 10px;
      }
      &:nth-child(2) {
        background-image: linear-gradient(90deg, #E72427 0%, #FE4C35 100%);
      }
    }
    .textArea {
      border-radius: 4px;
      width: 228px;
      height: 63px;
      display: block;
      overflow: hidden;
      margin: 8px auto;

      .mint-cell-value {
        margin: 0;
        padding: 0;
      }
      .mint-cell-wrapper {
        margin: 0;
        width: 100%;
        padding: 0;
      }
      textarea.mint-field-core {
        text-align: left;
        padding: 4px;
        background: #F4F4F4;
      }
    }
  }
</style>
