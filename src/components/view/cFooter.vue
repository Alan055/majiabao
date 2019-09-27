<template lang="html">
  	<div class="bottom-info">
		  <img class="c-icon" src="~@/assets/images/publicInfo/ba_cg@2x.png" alt="">
		  极速熊猫智能加密，保障您的信息安全
	</div>
</template>

<script>
export default {
  data(){
      return{}
  },
  mounted() {
    this.setInfoHeight();
  },
  methods: {
    setInfoHeight() {
      //document.getElementsByClassName('c-view')[0].style.height = window.innerHeight + 'px';
    }
  }
}
</script>

<style lang="scss">
.c-view {
  overflow: auto;
}
.bottom-info{
  font-size: 12px;
  color: #666666;
  padding: 16px;
  text-align: center;

  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  .c-icon{
    @include size(16px);
  }
}
</style>
