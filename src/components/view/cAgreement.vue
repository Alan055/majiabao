<!--协议链接-->
<template lang="html">
    <iframe 
      :src="iframeUrlWithToken" 
      width='100%' 
      frameborder='0' 
      name="_blank" 
      id="cjc-iframe" 
    ></iframe>
</template>

<script>
import util from '@/utils/index.js';
export default {
  data () {
    return {
    }
  },
  props: ['iframeUrl'],
  computed:{
      iframeUrlWithToken(){
          let token = util.getParams()['token'];
          return this.iframeUrl + '&token=' + token;
      }
  },
  methods: {
  },
  mounted(){

  }
}
</script>

<style lang="scss" scoped>
#cjc-iframe {
  height: 100%;
  width: 100%;
  overflow: auto;
}
</style>
