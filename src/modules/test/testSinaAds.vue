<template>
  <div>




    <div class="cell-list c-section">

      <!--click 埋点-->
      <!--sinaAds.click('H00001')-->
      <mt-cell title="click测试(currEvent = H00001)" is-link @click.native="sinaAds.click('H00001')">
        <span slot="icon"><img class="c-icon icon_a" src="~@/assets/images/my/about/at_aq@2x.png" ></span>
      </mt-cell>

      <!--sinaAds.click({'currEvent': 'H00001','currEventParams': {'test': 'currEventParams'}})-->
      <mt-cell title="click测试(currEvent,currEventParams)" is-link @click.native="sinaAds.click({'currEvent': 'H00001','currEventParams': {'test': 'currEventParams'}})">
        <span slot="icon"><img class="c-icon icon_a" src="~@/assets/images/my/about/at_aq@2x.png" ></span>
      </mt-cell>

      <!--sinaAds.click({'currEvent': 'H00001','currPageParams': {'test': 'currPageParams'}})-->
      <mt-cell title="click测试(currEvent,currPageParams)" is-link @click.native="sinaAds.click({'currEvent': 'H00001','currPageParams': {'test': 'currPageParams'}})">
        <span slot="icon"><img class="c-icon icon_a" src="~@/assets/images/my/about/at_aq@2x.png" ></span>
      </mt-cell>

      <!--sinaAds.click({'currEvent': 'H00001','currPageParams': {'test': 'ext'}})-->
      <mt-cell title="click测试(currEvent,ext)" is-link @click.native="sinaAds.click({'currEvent': 'H00001','dedicated': {'test': 'ext'}})">
        <span slot="icon"><img class="c-icon icon_a" src="~@/assets/images/my/about/at_aq@2x.png" ></span>
      </mt-cell>

      <!--sinaAds.click({'currEvent': 'H00001','dedicated': {'test': 'dedicated'}})-->
      <mt-cell title="click测试(currEvent,dedicated)" is-link @click.native="sinaAds.click({'currEvent': 'H00001','dedicated': {'test': 'dedicated'}})">
        <span slot="icon"><img class="c-icon icon_a" src="~@/assets/images/my/about/at_aq@2x.png" ></span>
      </mt-cell>

      <!--sinaAds.click({'currEvent': 'H00001','dedicated': {'test': 'dedicated,ext'}'})-->
      <mt-cell title="click测试(currEvent,dedicated,ext)" is-link @click.native="sinaAds.click({'currEvent': 'H00001','dedicated': {'test': 'dedicated,ext'},'ext': {'test': 1}})">
        <span slot="icon"><img class="c-icon icon_a" src="~@/assets/images/my/about/at_aq@2x.png" ></span>
      </mt-cell>


      <!-- v-sinaAds  -->
      <!-- v-sinaAds.click 直接指定埋点类型 并在后面跟参数 参数类型与 @click="sinaAds.click(arg)" 的参数一致 -->
      <!-- v-sinaAds.click.hover 也可以这么用 但这样就会 同时监听focus click 并发送对应的埋点事件 -->
      <!-- v-sinaAds  默认为  v-sinaAds.click (可以不带.click) -->
      <mt-cell title="v-sinaAds测试(currEvent,dedicated,ext)" is-link
               v-sinaAds.click.hover="{'currEvent': 'H00001','dedicated': {'test': 'dedicated,ext'},'ext': {'test': 1}}"
               @click.native="testAlert"
      >
        <span slot="icon"><img class="c-icon icon_a" src="~@/assets/images/my/about/at_aq@2x.png" ></span>
      </mt-cell>


      <!--hover 埋点-->
      <!--sinaAds.hover('H00001')-->
      <mt-field label="hover测试(currEvent = H00002)" type="tel" placeholder="输入真实姓名" v-model="inputTest" @click.native="sinaAds.hover('H00002')"></mt-field>

      <!--popover 测试-->
      <mt-cell title="弹框埋点test" is-link @click.native="isPopupShow=true">
        <span slot="icon"><img class="c-icon icon_a" src="~@/assets/images/my/about/at_aq@2x.png" ></span>
      </mt-cell>

    </div>

    <!--popover 测试-->
    <!--sinaAds.popover(''H00003')-->
    <popup v-model="isPopupShow" :option="{currEvent: 'H00003'}">
      <div slot="content" @click="isPopupShow=false"  style="width: 100px;height:100px;background: white;">
        <div> 点我消失 </div>
      </div>
    </popup>


  </div>
</template>

<script>
  import popup from '@/components/view/popup';
  export default {
    name: "test-sina-ads",
    data () {
      return {
        isPopupShow: false,
        inputTest: '',
      }
    },
    components: {
      popup
    },
    mounted() {
      this.$root.loadingClose();
    },
    methods : {
      testAlert() {
        alert('true');
      }
    }
  }
</script>

<style scoped>

</style>
