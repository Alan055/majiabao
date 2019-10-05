<template>
  <scroller :init="init" title="哈哈哈哈">
    <div slot="content">
      <h1>框架开发</h1>
      <h1>框架开发</h1>
      <h1>框架开发</h1>
      <h1>框架开发</h1>
      <h1>框架开发</h1>
      <h1>框架开发</h1>
      <h1>框架开发</h1>
      <h1>框架开发</h1>
      <h1>框架开发</h1>
      <h1>框架开发</h1>
      <h1>框架开发</h1>
      <h1>框架开发</h1>
      <h1>框架开发</h1>
      <h1>框架开发</h1>
      <h1>框架开发</h1>
      <h1>框架开发</h1>
      <h1>框架开发</h1>
      <h1>框架开发</h1>
      <h1 @click.native="$root.closeWindow()">框架开发</h1>
    </div>
  </scroller>
</template>

<script>
  import scroller from "@/components/view/view1_4.vue";
  export default {
    name: "index",
    components:{scroller},
    methods:{
      init(){

      }
    }
  }
</script>

<style scoped lang="scss">

</style>
