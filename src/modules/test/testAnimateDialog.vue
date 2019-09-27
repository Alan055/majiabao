<template lang="html">
    <div class="view c-bg-gray">
        <div class="c-view-content">
            <c-dialog :isShow="isShow" :opacity="0.67">
                <!-- bounceInDown 弹窗动效参考animate.css -->
                <div class="m-content animated bounceInDown" slot="content">
                    测试弹窗

                    <div class="el-colse" @click="isShow = false">x</div>
                </div>
            </c-dialog>
        </div>
    </div>
</template>

<script>
import util from "@/utils";
import cDialog from "@/components/view/dialog";

export default {
  data() {
    return {
      isShow: false
    };
  },
  components: {
    cDialog
  },
  computed: {},
  methods: {},
  created() {
    setTimeout(() => {
      this.isShow = true;
    }, 2000);
  },
  mounted() {
    this.$root.loadingClose();
  }
};
</script>

<style lang="scss" scoped>
.m-content {
  background-color: #fff;
  width: 80%;
  height: 200px;
  border-radius: 4px;
  position: absolute;
  //top: 20%; 高度自定义

  .el-colse {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
</style>
