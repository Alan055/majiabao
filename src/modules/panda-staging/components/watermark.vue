<template lang="html">
    <div class="page-watermark">

        <div class="c-flex-row">
            <div class="c-col-33">
                <div class="el-content">
                    <img src="../assets/images/fbkj.png" />
                    <div class="row-title">方便快捷</div>
                    <div class="row-sub-title">信用申请  极速放款</div>
                </div>
            </div>
            <div class="c-col-33">
                <div class="el-content">
                    <img src="../assets/images/zyfk.png" />
                    <div class="row-title">专业风控</div>
                    <div class="row-sub-title">专业技术  智能风控</div>
                </div>
            </div>
            <div class="c-col-33">
                <div class="el-content">
                    <img src="../assets/images/aqbz.png" />
                    <div class="row-title">安全保障</div>
                    <div class="row-sub-title">信息加密  安全放心</div>
                </div>
            </div>
        </div>
        <div class="title">{{appName2}}</div>
        <div class="sub-title">助力生活  随心分期</div>
    </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mixins: [require("../mixins").default],
  methods: {},
  watch: {}
};
</script>

<style lang="scss" scoped>
.page-watermark {
  padding: 16px 16px 24px 16px;
  text-align: center;
  font-size: 12px;
  color: #bfbfbf;
  letter-spacing: -0.24px;
  .c-flex-row {
    margin-bottom: 30px;

    .el-content {
      background: #f5f5f5;
      border-radius: 8px;
      margin: 0 0 0 6px;
      padding: 12px 4px;

      img {
        width: 23px;
      }
    }
  }
  .row-title {
    font-size: 14px;
    color: #1f2b5a;
  }
  .row-sub-title {
    font-size: 10px;
    color: #66668a;
  }
  .title {
    font-size: 14px;
    color: #66668a;
  }
  .sub-title {
    font-size: 12px;
    color: #d1d1e6;
  }
}
</style>
