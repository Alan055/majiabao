<template lang="html">
<div class="view-template">
  <c-header title="getStorage test"></c-header>
  <mt-button @click.native="test(0)">test number</mt-button>
  <mt-button @click.native="test('abc')">test string</mt-button>
  <mt-button @click.native="test({a:1})">test object</mt-button>
  <mt-button @click.native="test([1,{b:2}])">test array</mt-button>
  <mt-button @click.native="test(null)">test null</mt-button>
  <mt-button @click.native="test(undefined)">test undefined</mt-button>
  <mt-button @click.native="testUnknownKey()">test unknown key</mt-button>
</div>
</template>

<script>
import api from '@/services/api'
import util from '@/utils'
import storage from "@/utils/storage"
import helper from '@/utils/helper'
import {Toast} from '@/utils/helper'
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: 'testGetStorage',
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters([]),
  },
  methods: {
    ...mapMutations([]),
    test(value) {
      helper.set('test', value)
      helper.get('test').then(res => {
        let type = typeof res
        let value = type == 'object' ? JSON.stringify(res) : res
        alert(type + ' : ' + value)
      })
    },
    testUnknownKey() {
      helper.get('unknownKey').then(res => {
        let type = typeof res
        let value = type == 'object' ? JSON.stringify(res) : res
        alert(type + ' : ' + value)
      })
    }
  },
  components: {

  },
  watch: {

  },
  created() {

  },
  mounted() {
   // DOM ready
  },
  beforeRouteEnter (to, from, next) {
   // 导航进入该组件时调用
   // 不！能！获取组件实例 `this`
   // 因为组件实例还没被创建

   next(vm => {
     // 通过 `vm` 访问组件实例
   })
  },
  beforeRouteLeave (to, from, next) {
   // 导航离开该组件时调用
   // 可以访问组件实例 `this`

   // 不要忘了next
   next();
  }
}
</script>

<style lang="scss" scoped>
</style>
