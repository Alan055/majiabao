<template lang="html">
  <div class="other-recommend-wrap" v-if="data && data.length">
    <p class="c-list-title">
      优质贷款推荐
      <span class="more">更多</span>
    </p>
    <ul>
      <li v-for="item in data">
        <p class="title"><img class="c-icon product-icon" :src="item.iconurl" alt="">{{item.name}}</p>
        <dl class="c-flex-row detail">
          <dd class="left">
            <p><span class="number">{{item.maxamount}}</span></p>
            <p class="line-2 c-light">额度范围(元)</p>
          </dd>
          <dd class="right">
            <p>参考利息 <span class="number">0.02%</span></p>
            <p class="line-2">
              {{item.desc}}
            </p>
          </dd>
        </dl>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['resdata'],
  computed: {
    data() {
      return this.resdata.productlist
    }
  },
}
</script>

<style lang="scss" scoped>
.other-recommend-wrap{
  padding: 0 $gap;
  padding-bottom: 14px;
  background: white;
}
li{
  background: #FFFFFF;
  box-shadow: 0 0 20px 0 rgba(0,0,0,0.10);
  border-radius: 4px;
  margin-bottom: 16px;
  padding: 20px 12px;
  .title{
    margin-bottom: 17px;
  }
}
.detail{
  font-size: 12px;
  color: $gray;
}
.number{
  font-size: 20px;
  color: #E72427;
}
.line-2{
  margin-top: 8px;
}
.left, .right{
  text-align: left;
}
.right{
  padding-left: 10px;
}

</style>
