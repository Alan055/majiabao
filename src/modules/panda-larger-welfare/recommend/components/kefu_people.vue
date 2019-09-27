<template>
  <div class="kefu_people">
    <span v-if="!isWelfare">已成功服务<em>{{serverNum}}</em>位借款用户</span>
    <span v-if="!isWelfare">平均到账速度3分钟</span>
    <span class="gray" v-if="isWelfare">极速熊猫</span>
    <span class="gray" v-if="isWelfare">助力生活 随心分期</span>
    <span @click="$root.openUrl({url: onlineServiceUrl, title: '在线客服'})"><img src="./../../images/kefu@2x.png" alt="">在线客服</span>
  </div>
</template>

<script>
  export default {
    props: ['onlineServiceUrl','serverNum','isWelfare'],
    data() {
      return {}
    },
    computed: {},
    watch: {},
    methods: {},
    created() {
    },
    mounted() {
    },
  }
</script>

<style lang='scss' scoped>
  .kefu_people{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #fff;
    padding: 15px 0 30px;
    span{
      line-height: 24px;
      margin-top: 8px;
      img{
        height: 21px;
      }
      em{
        font-size: 20px;
        color: #e72427;
      }
      &:last-child{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 32px;
        border-radius: 16px;
        border: 1px solid #ccc;
        font-size: 14px;
        color: #666;
        text-align: center;
        padding: 0 14px;
      }
      &.gray{
        color: #66668a;
      }
    }
  }
</style>
