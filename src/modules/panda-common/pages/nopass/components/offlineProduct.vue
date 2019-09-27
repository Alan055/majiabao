<template lang="html">
    <!-- 三级商户，线下大额贷款 -->
    <div class="model offline-wrap" v-if="data">
        <div class="title">大额线下贷</div>
        <div class="offline-content">
            <div class="c-flex-row">
                <div class="c-col-60">
                    <div class="moeny">200,000</div>
                    <div class="desc">最高可借额度（元）</div>
                </div>
                <div class="c-col-40 el-btn">
                    <mt-button class="btn-round handle-button" size="normal" type="primary" @click.native="$root.openUrl({url: data.nextpage.url, isFull: false}, resdata)">去申请</mt-button>
                </div>
            </div>
            <div class="c-flex-row c-v-center step3">
                <div class="c-col-33">
                    <img src="../../../assets/images/edg.png"/> 额度高
                </div>
                <div class="c-col-33">
                    <img src="../../../assets/images/xxmq.png"/> 线下面签
                </div>
                <div class="c-col-33">
                    <img src="../../../assets/images/hgjg.png"/> 合规机构
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: ["resdata"],
  data() {
    return {};
  },
  computed: {
    data() {
      return this.resdata.thirdproducts;
    }
  }
};
</script>

<style lang="scss" scoped>
.offline-wrap {
  background: #ffffff;
  //box-shadow: 0 -6px 10px 0 rgba(0, 0, 0, 0.05);
  //border-radius: 8px;
  padding: 10px 16px;
  padding-bottom: 30px;
}
.title {
  font-size: 20px;
  color: #333333;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  margin-top: 10px;
}

.offline-content {
  box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 10px 12px;
  background: #ffffff;

  .el-btn {
    text-align: right;
  }
  .moeny {
    font-size: 40px;
    color: #333;
    letter-spacing: 1px;
    text-align: left;
    margin-top: 10px;
    margin-bottom: 4px;
    margin-left: -4px;
  }

  .desc {
    font-size: 14px;
    color: #999;
    letter-spacing: 0.78px;
    text-align: left;
  }

  .step3 {
    margin-top: 17px;
    border-top: 1px dashed #ededed;
    border-radius: 4px;
    height: 40px;
    text-align: justify;

    img {
      height: 18px;
      width: 18px;
      display: inline-block;
      vertical-align: text-bottom;
    }
  }

  .mint-button--primary {
    background: #eb242a;
    border-radius: 16px;
    color: #fff;
    height: 32px;
    width: 72px;
    font-size: 14px;
    letter-spacing: 0.78px;
    margin-top: 24px;
  }
}

.model {
  img {
    width: 100%;
    display: block;
    margin: 0 auto;
  }
}
</style>
