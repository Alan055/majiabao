<template>
  <div class="form-card v-form-card">
    <div class="c-grid-item" v-for="(item,index) in list" :key="index" @click="openView(item)"
    v-sina-ads='{
        currEvent: buriedpoint,
        currEventParams: {
            index:index,
            stepname:item.stepname,
            stepurl:item.stepurl,
            status: item.status
        }
    }'>
      <dl>
        <dt><img class="c-icon icon-24" :src="item.iconurl"></dt>
        <dd>
          <p class="title">{{item.stepname}}</p>
          <p class="error" v-if="item.status == 0">{{item.returnreason}}</p>
        </dd>
        <dt>          
          <span v-if="item.status == 1">
            <img class="c-icon icon_c" src="~@/assets/images/publicInfo/be_ch@2x.png" alt="">
          </span>
          <span class="c-blue" v-else>{{item.statusname}}</span>
        </dt>
        <dt>
          <c-icon class="arrow" type="arrowRight" v-if="item.status != 1"></c-icon>
        </dt>
      </dl>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    'list':{
       // type:Array
    },
    'buriedpoint':{
        type:String,
        default:''
    }
  },
  methods: {
    openView(item) {
      let url = item.stepurl
      let title = item.stepname;
      //修改原因，如果URL为空，那么不让他点击进去。
      if(url != ''){
          this.$root.openUrl({url, title})      
      };
    }
  }  
}
</script>

<style lang="scss" scoped>
.v-form-card {
  margin: $gap;
  background: #FFFFFF;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.10);
  border-radius: 4px;
  padding: 4px 0;

  .c-grid-item {
    margin: 0 12px;
    dl {
      align-items: flex-start;
      padding: 10px 0;
      height: auto;
      min-height: 48px;
    }
    dt{
      // padding: 0;
      line-height: 24px;
    }
    dd {
      text-align: left;
      line-height: 24px;
      padding-top: 1px;
      padding-bottom: 1px;
    }    
    .arrow {
      @include size(16px);
    }
    .error {
      color: $red;
      font-size: 12px;
      line-height: 16px;
    }
  }

  &.v-form-list{
    box-shadow: none;
    padding: 0;
    margin: 0;
    @extend %border-b;

    .c-grid-item{
      margin: 0;
      padding: 0 $gap;
    }
  }
}
</style>
