<template>
  <div class="banner-wrap" v-if="isShow">
   <mt-swipe :auto="5000" :showIndicators="false">
      <mt-swipe-item v-for="item in list" :key="item.id"  @click.native="clickAd(item)"><img :src="item.thumbnailurl"  v-sina-ads="stat.recommend.refuse.clickBanner"/></mt-swipe-item>
    </mt-swipe>
  </div>
</template>
<script>


import { Swipe, SwipeItem } from 'mint-ui';
export default {
  name:'bannerCard',
  props:['list','isShow'],
  data(){
    return{

    }
  },
  methods:{
    
    clickAd(item){
      if(item.jumplink){
        this.$root.openUrl(item.jumplink);
      }
    }
  },
  created(){
    console.log(this.list);
  }
}
</script>
<style lang="scss" scoped>
.banner-wrap {
	background: white;
	height: 100px;
	img {
		display: block;
		width: 100%;
		height: 100%;
	}
}
</style>
