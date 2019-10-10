<template lang="html">
<div class="view-template">
  <c-header title="Open Window Test"></c-header>
  <br>
  <mt-button @click.native="locationJump">location跳转</mt-button>
  <br>
  <mt-button @click.native="locationReload">location reload</mt-button>
  <br>
  <mt-button @click.native="$root.pushRoute({name: 'testCloseWindow'})">路由跳转</mt-button>
  <br>
  <mt-button @click.native="$root.pushRoute({name: 'testCloseWindow', title: 'test title'})">路由跳转(显示自定义title)</mt-button>
  <br>
  <mt-button @click.native="$root.replaceRoute({name: 'testCloseWindow'})">路由替换</mt-button>
  <br>
  <mt-button @click.native="$root.replaceRoute({name: 'testCloseWindow'}, true)">路由替换(APP)</mt-button>
  <br>
  <mt-button @click.native="$root.openUrl({url})">App跳转</mt-button>
  <br>
  <mt-button @click.native="$root.replaceUrl({url})">打开后关闭本页面</mt-button>
  <br>
  <p>{{time}}</p>
</div>
</template>

<script>
import api from '@/services/api'
import util from '@/utils'
import storage from "@/utils/storage"
import helper from '@/utils/helper'
import {Toast} from '@/utils/helper'
import EventBus from '@/services/EventBus'

export default {
  name: 'testOpenWindow',
  data () {
    return {
      time: '',
      url: window.location.origin + '/pages/test#/testCloseWindow'
    }
  },
  computed: {

  },
  methods: {
    locationJump() {
      window.location = this.url
    },
    locationReload() {
      window.location.reload()
    }
  },
  components: {

  },
  watch: {

  },
  created() {
    this.time = new Date().toString()
    this.$root.loadingClose()
  },
  onRefresh(tag, data) {
    console.log('refresh catched', tag, data)
    this.time = new Date().toString() + '数据已刷新'
  },
  onBack() {
    alert('back')
    this.$root.closeWindow()
  },
  beforeRouteEnter(to, from, next) {
    console.log('ok')
    next()
  },

}
</script>

<style lang="scss" scoped>
</style>
