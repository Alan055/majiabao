<template lang="html">
  <div class="credit-list">
    <p class="c-list-title">在线信用卡
      <span class="c-fr more">{{more || '更多'}}</span>
    </p>
    <ul>
      <li class="c-flex-row" v-for="i in 3">
        <div class="img-wrap">
          <img src="" alt="">
        </div>
        <div class="c-flex-item">
          <p class="title">广发银行荣耀卡</p>
          <p class="tags">
            <span class="red">额度高</span>
            <span class="red">秒开卡</span>
            <span class="gold">获专享荣耀皮肤</span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['more']
}
</script>

<style lang="scss" scoped>

.credit-list{
  padding: 0 $gap;
  background: white;
}
.c-list-title{
  padding-bottom: 0;
}
li{
  padding: 20px 0;
  margin-right: -$gap;
  padding-right: $gap;
  text-align: left;
  @extend %border-b;

  &:last-child{
    border: none;
  }

  img{
    width: 98px;
    height: 66px;
    margin-right: 18px;
  }

  .title{
    font-size: $fontL;
    margin-bottom: 12px;
  }
  .tags{
    @extend %clearfix;
    span{
      display: block;
      float: left;
      padding: 2px 4px;
      font-size: $fontS;
      border: 1px solid #E72427;
      margin-right: 8px;
      border-radius: 4px;
      &.red{
        color: $red;
        border-color: $red;
      }
      &.gold{
        color: #D0A252;
        border-color: #D0A252;
      }
    }
  }
}

</style>
