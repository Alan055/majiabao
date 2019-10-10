<template>
  <div class="creditStaging">
    <div class="top">
      <span class="left">信用分期</span>
      <span class="right" ><a :href="url" target="_blank"></a></span>
    </div>
    <div class="content">
      <van-swipe >
        <div v-for="(v,i) in list" :key="i">

        </div>
      </van-swipe>

    </div>
  </div>
</template>

<script>


  export default {
    props: ['obj'],
    data() {
      return {
        list: [
          {}
        ]
      }
    },
    computed: {
      url(){
        return this.obj.loanPageCredit.pagedata[0].jumplink
      }
    },
    watch: {},
    methods: {},
    created() {
      console.log("8888")
      console.log(obj)
    },
    mounted() {
    },
  }
</script>

<style lang='scss' scoped>
  .creditStaging{

  }
</style>
