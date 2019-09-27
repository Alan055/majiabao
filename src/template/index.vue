<template lang="html">
<div class="view-template">
  hello world
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
  name: 'template',
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters([]),
  },
  methods: {
    ...mapMutations([]),
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
