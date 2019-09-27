<template>
  <div class="redCashBack" v-if="item">
    <img :src="item.icon" alt="">
    <span v-html="item.productlistdesc"></span>
  </div>
</template>

<script>
	export default {
	  props: ['item'],
		data() {
			return {}
		},
		computed: {},
		watch: {
	    item(cur){
        cur && this.sinaAds.display({
          currEvent: this.stat.redEnvelope.records.showRedBagBottom,
          currEventParams:{productid: cur.productid}}, () => {}
        );
      }
    },
		methods: {

    },
		created() {
		},
		mounted() {
		},
	}
</script>

<style lang='scss' scoped>
  .redCashBack {
    margin-top: 5px;
    height: 40px;
    display: flex;
    justify-content: left;
    align-items: center;
    @extend %border-t;
    img {
      width: 14px;
      height: 16px;
      margin-right: 5px;
    }
    span {
      font-size: 12px;
    }
  }
</style>
