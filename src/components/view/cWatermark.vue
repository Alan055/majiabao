<template lang="html">
  	<div class="bottom-info water-left">
		  <slot></slot>
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
    color: #333333;
    padding: 16px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    line-height: 20px;
    .c-icon{
        @include size(16px);
    }
}
.water-left{
    text-align: left;
}
</style>
