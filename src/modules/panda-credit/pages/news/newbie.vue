<template>
  <div class="view">
    <div class="c-view-content">
      <img class="he-auto-img" src="../../assets/images/newbie.png">
      <!--这个按钮的逻辑说明一下：未登录点击跳转登录页面 未分流点击跳到三步资料 已分流隐藏按钮-->
      <mt-button
        class="btn-round handle-button"
        size="normal"
        type="primary"
        v-if="!(this.$root.isLogin || this.isLogin)||!isFinshStep"
        @click.native="handleBtnClick"
      >一键拿钱
      </mt-button>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import api from "@/services/api";
  import util from "@/utils";
  import helper from "@/utils/helper";

  export default {
    name: "newbie",
    data() {
      return {
        isLogin: false,
        isFinshStep: false, // 是否完后了三步资料 完成三步资料就隐藏
        stepUrl: process.env.staticPath + "/panda-credit/#/publicInfo/step3", //三步资料第一步
      };
    },
    computed: {},
    methods: {
      handleBtnClick() {

        if (this.$root.isLogin || this.isLogin) { // 登录了 未分流 进入三步资料
          this.$root.openUrl(this.stepUrl);
        } else {
          this.$AppBridge.goNative({
            pkg: "login"
          });
        }
      },
      getValidateUserInfo() {
        if (!(this.$root.isLogin || this.isLogin)) return // 这个页面不需要登录也可以进来 不登录的时候不请求数据
        api.getTrust.validateUserInfo({type: "3"}).then(res => { // 这个接口是登录了才能请求的
          console.log(res)
          if (!helper.isSuccess(res)) return;
          if (res.data.status == 1) { // 0是未认证 1是已认证
            this.isFinshStep = true;
            console.log("this.isFinshStep", this.isFinshStep);
          }
        });
      }
    },
    created() {
      this.getValidateUserInfo();
      console.log("this.stepUrl", this.stepUrl);
    },
    mounted() {
      this.$root.loadingClose();
      this.$root.setWebAttribute({
        title: "新手指南"
      });
    },
    onRefresh(tag, data) {
      if (tag == "login") { // 坑爹 熊猫信用ios这里没有传值！！！ tag=''
        if (data) {
          this.isLogin = true;
          console.log("登录成功", data);
          console.log("this.isLogin", this.isLogin);
          this.getValidateUserInfo()
        }
      }
    },
  };
</script>

<style lang="scss" scoped>
  .c-view-content {
    position: relative;
    padding-bottom: 50px;
    background-color: #3e8cdc;
    text-align: center;

    .handle-button {
      z-index: 99;
      position: relative;
      top: -60px;
      width: 255px;
      height: 48px;
      background-color: #ffab00;
      border-radius: 24px;
      font-size: 18px;
      color: #7a251c;
    }
  }
</style>
