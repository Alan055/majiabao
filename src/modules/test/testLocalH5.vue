<template lang="html">
<div class="view-template">
  <c-header title="调试入口"></c-header>
  <br>
  <textarea v-model="url"></textarea>
  <mt-button class="btn" size="normal" type="primary" @click="url&&$root.openUrl(url)">跳转</mt-button>
  <mt-button class="btn" size="normal" type="danger" @click="url=''" style="margin-top: 10px">清空</mt-button>
</div>
</template>

<script>

import Vue from "vue";


import { Button } from 'mint-ui';
Vue.component(Button.name, Button);



export default {
  name: 'testDialog',
  data () {
    return {
	    url: '',
    }
  },
  computed: {

  },
  methods: {
  },
  components: {

  },
  watch: {

  },
  created() {

  }

}
</script>

<style lang="scss" scoped>
  textarea{
    width: 80%;
    height: 100px;
    margin: 10px 10%;
    border-radius: 4px;
    padding: 8px;
  }
  .btn{
    width: 50%;
    margin: 0 25%;
  }
</style>
