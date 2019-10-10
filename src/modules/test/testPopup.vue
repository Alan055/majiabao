<template>
  <div>

    <!-- props: -->
    <!-- option   必传  弹框显示时发送的埋点数据 -->

    <!-- isCenter 选传  是否采用居中方案 -->
    <!-- 0: 为不居中 -->
    <!-- 1: 为居中方案1 -->
    <!-- 2: 位居中方案2 -->
    <!-- 默认为 1-->

    <!-- v-model -->
    <!-- content  必传  弹框内容-->
    <popup v-model="isPopupShow" :option="{currEvent: 'hahha'}">
      <div slot="content" @click="isPopupShow=false"  style="width: 100px;height:100px;background: white;">
        <div> 点我消失 </div>
      </div>
    </popup>

    <!--测试用-->
    <mt-cell title="弹框test" is-link @click.native="isPopupShow=true">
      <span slot="icon"><img class="c-icon icon_a" src="~@/assets/images/my/about/at_aq@2x.png" ></span>
    </mt-cell>


  </div>
</template>

<script>
  import popup from '@/components/view/popup';
  export default {
    name: "test-popup",
    data () {
      return {
        isPopupShow: true
      }
    },
    components: {
      popup
    }

  }
</script>

<style scoped>

</style>
