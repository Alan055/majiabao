<template>

  <!--客服入口-->
  <div class="serviceModel">
    <p v-if="link">遇到问题，点击咨询<span @click="open">在线客服</span></p>
  </div>
</template>

<script>
    export default {
        name: "serviceLink",
        props:{
          link:{
            type:String,
            default:''
          }
        },
       methods:{
          open(){
            this.$root.openUrl({
              url: `${this.link}`,
              title: '在线客服'
            });
          }
       }
    }
</script>

<style lang="scss" scoped>
    .serviceModel{
      text-align: center;
      margin:0 auto;
      font-size: 12px; color: #666;padding-bottom: 8px;
      span{
        color: $blue; margin-left:3px;
      }

    }
</style>
