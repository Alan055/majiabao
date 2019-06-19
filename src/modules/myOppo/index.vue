<template lang="html">
  <div class="view-my c-bg-gray">
    <div class="cell-list c-section">
      <mt-cell title="我的账单" is-link @click.native="$router.push({name: 'bill'})">
        <span slot="icon"><img class="c-icon icon_a" src="~@/assets/images/my/about/as_aq@2x.png"></span>
      </mt-cell>
    </div>

    <div class="cell-list c-section">
      <mt-cell title="活动中心" is-link @click.native="$router.push({name: 'activity'})">
        <span slot="icon"><img class="c-icon icon_a" src="~@/assets/images/my/about/as_aq@2x.png"></span>
      </mt-cell>
      <mt-cell title="推荐办卡" is-link @click.native="$router.push({name: ''})">
        <span slot="icon"><img class="c-icon icon_a" src="~@/assets/images/my/about/at_aq@2x.png"></span>
      </mt-cell>
      <mt-cell title="邀请返现" is-link @click.native="$router.push({name: ''})">
        <span slot="icon"><img class="c-icon icon_a" src="~@/assets/images/my/about/at_aq@2x.png"></span>
      </mt-cell>
    </div>

    <div class="cell-list c-section">
      <mt-cell title="我的银行卡" is-link @click.native="$router.push({name: 'bankCard'})">
        <span slot="icon"><img class="c-icon icon_a" src="~@/assets/images/my/about/at_aq@2x.png"></span>
      </mt-cell>
      <mt-cell title="安全设置" is-link @click.native="$router.push({name: ''})">
        <span slot="icon"><img class="c-icon icon_a" src="~@/assets/images/my/about/at_aq@2x.png"></span>
      </mt-cell>
      <mt-cell title="帮助中心" is-link @click.native="$router.push({name: 'help'})">
        <span slot="icon"><img class="c-icon icon_a" src="~@/assets/images/my/about/at_aq@2x.png"></span>
      </mt-cell>

      <div class="cell-list c-section">
        <mt-cell title="意见反馈" is-link @click.native="goFeedback">
          <span slot="icon"><img class="c-icon icon_a" src="~@/assets/images/my/about/ar_aq@2x.png"></span>
        </mt-cell>
      </div>

      <mt-cell title="关于我们" is-link @click.native="$router.push({name: 'about'})">
        <span slot="icon"><img class="c-icon icon_a" src="~@/assets/images/my/about/at_aq@2x.png"></span>
      </mt-cell>


    </div>


  </div>
</template>

<script>
  import api from '@/services/api'
  import util from '@/utils'
  import storage from "@/utils/storage"
  import helper from '@/utils/helper'
  import popup from '@/components/view/popup';
  import {Toast} from '@/utils/helper'
  import {mapGetters, mapMutations} from 'vuex'
  import AppBridge from "@/services/AppBridge.js";

  export default {
    name: 'my',
    data() {
      return {}
    },
    computed: {
      ...mapGetters([]),
    },
    methods: {
      ...mapMutations([]),

    },
    components: {
      popup
    },
    watch: {},
    created() {
// DOM ready
      this.$root.loadingClose();

    },
    mounted() {

    },
    beforeRouteEnter(to, from, next) {
      // 导航进入该组件时调用
      // 不！能！获取组件实例 `this`
      // 因为组件实例还没被创建

      next(vm => {
        // 通过 `vm` 访问组件实例
      })
    },
    beforeRouteLeave(to, from, next) {
      // 导航离开该组件时调用
      // 可以访问组件实例 `this`

      // 不要忘了next
      next();
    },

    methods: {
      // 前往意见反馈
      goFeedback() {
        this.sinaAds.click(this.adsInfo.about.index.clickGoFeedback);

        // 判断是否登录
        AppBridge.getUserInfo({}, res => {
          let path = location.href.split("pages")[0];

        /*  alert( path + "/pages/my/#/feedback/")
          return*/

          if (res && res.data && res.data.token) {
            this.$root.openUrl({
              url: path + "/pages/my/#/feedback/",
              title: "意见反馈",
              isFull: false
            });

          } else {
            AppBridge.goNative({
              pkg: "login",
              url: path + "/pages/my#/feedback/"
            });
          }
        });
      },

    }
  }
</script>

<style lang="scss" scoped>
</style>
