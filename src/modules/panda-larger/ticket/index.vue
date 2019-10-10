<template lang="html">
<div class="view bankCard">

  <div class="c-view-content">
    <div class="card-noList c-absolute">
      <div class="card-noList-img c-aspectratio w-180-140">
        <div class="c-aspectratio-content">
          <img src="../images/ticket-nodata.png" />
        </div>
      </div>
      <div class="card-noList-text c-tc c-font-l">
        您当前暂无优惠券
      </div>
    </div>
  </div>

</div>
</template>

<script>
import api from '@/services/api'
import helper from '@/utils/helper'
import {Toast} from '@/utils/helper'

export default {
  data() {
    return {
      list: [],
      isNoList: null
    }
  },
  methods: {
    
  },
  beforeRouteEnter (to, from, next) {
   next(vm => {
     
   })
  },
  filters: {
    
  }
}
</script>

<style lang="scss" scoped>
  .h-auto {
    height: initial;
  }
.card-list{
  padding: $gap;
}
.c-aspectratio:before {
    padding-top: 0 !important;
}
.c-aspectratio-content {
    text-align: center;
    position: relative;
}
.card-item{
  background: #FFFFFF;
  box-shadow: 0 0 20px 0 rgba(0,0,0,0.1);
  border-radius: 8px;
  margin-bottom: $gap;
  padding: 12px;
  padding-bottom: 0;
}

.title-row{
  .title{
    font-size: $fontXXL;
    .c-icon{
      top: 0;
      vertical-align: -12px;
    }
  }
}

.number-row{
  font-size: $fontL;
  margin-top: 23px;
  .number{
    margin-left: 8px;
    letter-spacing: 1px;
  }
}

.line{
  @extend %border-b;
  margin-top: 16px;
}

.detail-row{
  font-size: $fontS;
  color: $gray;
  margin-top: 18px;
  padding-bottom: 5px;

  .detail-list{
    height: 28px;
    overflow: hidden;
    &.open{
      height: auto;
    }
    .c-icon{
      line-height: 1em;
      position: static;
      vertical-align: text-top;
    }
  }
  .detail-item{
    width: 33.33%;
    margin-bottom: 12px;
    line-height: 1.6;
  }
}

.card-noList {
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*展示图片样式*/
  .card-noList-img {
    width: 180px;
    img {
      width: 100%;
    }
  }
  /*占位符*/
  .w-180-140 {
    aspect-ratio: '180:140';
  }
  /*展示文字样式*/
  .card-noList-text {
    font-size: 14px;
    color: #999999;
  }
}

</style>
