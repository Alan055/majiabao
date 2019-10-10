<template lang="html">
  <div class="view">
    <div class="el-introduce van-hairline--bottom">
        <div class="el-logo c-bg-gray">
            <img src="../../assets/images/logo_prod-new@2x.png">
            <p>{{appName2}}</p>
        </div>

        <div class="el-detail c-bg-gray">
            <p>APP产品结合普惠金融发展和互联网技术创新，致力于面向大众提供专业、快捷的服务，帮助客户解决资金难的问题。未来，{{appName2}}将秉承谷誉“普惠金融，服务人人” 的服务宗旨，以方便快捷，健康诚信为本，通过持续不断的产品创新，为客户提供安全可靠的服务，持续为客户创造价值。</p>
        </div>
    </div>
    <aboutCell :showPrivacy="false" :showVersion="true"></aboutCell>
  </div>
</template>

<script>
import util from "@/utils";
import helper from "@/utils/helper";
import aboutCell from "@/components/common/aboutCell.vue";

export default {
  data() {
    return {
      iosPass: util.getParams()["sinaifiosauditing"],
      channel: util.getParams()["channel"] //渠道  akingloan: 普金贷款
    };
  },
  computed: {},
  components: { aboutCell },
  mixins: [require("../../mixins").default],
  methods: {},
  created() {},
  mounted() {
    this.$root.loadingClose();
  }
};
</script>

<style lang="scss" scoped>
  .view{
    overflow: auto;
  }
.copy {
  position: fixed;
  bottom: 10px;
  padding: 5px 0;
  width: 100%;
  p {
    text-align: center;
    font-size: 18px;
    color: #333333;
  }
}

.el-introduce {
  .el-logo {
    display: block;
    margin: 0 auto;
    padding: 30px 0 22px 0;
    text-align: center;
    img {
      width: 88px;
    }
    p {
      font-size: 16px;
      color: #1f2b5a;
      margin-top: 10px;
    }
  }
  .el-detail {
    text-align: left;
    p {
      box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.06);
      border-radius: 20px 20px 0 0;
      padding: 20px;
      background-color: #fff;
      text-indent: 24px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #666666;
      letter-spacing: 0.42px;
      line-height: 24px;
    }
  }
}

.blue {
  color: #5490cc;
}
</style>
