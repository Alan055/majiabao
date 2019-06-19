<template lang="html">
<div class="view-template">
  <c-header title="Close Window Test"></c-header>
  <br>
  <mt-button @click.native="$root.closeWindow({refresh: true})">返回后刷新前一个页面</mt-button>
  <br>
  <mt-button @click.native="$root.closeWindow({asynRefresh: true})">返回后通知刷新数据</mt-button>
</div>
</template>

<script>
import api from '@/services/api'
import util from '@/utils'
import storage from "@/utils/storage"
import helper from '@/utils/helper'
import {Toast} from '@/utils/helper'
import AppBridge from '@/services/AppBridge'

export default {
  name: 'testCloseWindow',
  data () {
    return {
      
    }
  },
  computed: {

  },
  methods: {
    
  },
  components: {

  },
  watch: {

  },
  created() {
    this.$root.loadingClose()


    // AppBridge.notify()
  }

}
</script>

<style lang="scss" scoped>
</style>
