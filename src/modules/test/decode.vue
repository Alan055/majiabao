<template>
<div class="wrap c-px">
  <h3 class="c-tc">参数转义</h3>
  <textarea name="" id="" cols="30" rows="10" v-model="data"></textarea>
  <mt-button @click.native="decode" class="btn-primary btn-lg btn-round" type="primary" size="large">转换</mt-button>
  <div class="result" v-if="result">{{result}}</div>
</div>
</template>
<script>
export default {
  data() {
    return {
      data: '',
      result: ''
    }
  },
  methods: {
    decode() {
      this.result = this.data.replace(/\$5C/g, '\\').replace(/\$22/g, '"').replace(/\$27/g, '\'').replace(/\$25/g, '$')
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap.c-px{
  padding: $gap;  /*no*/
  max-width: 600px;   /*no*/
  margin: 0 auto;
  font-size: 14px;   /*no*/
  h3{
    margin-top: 50px;  /*no*/
    font-size: 16px;  /*no*/
  }
  textarea{
    border: 1px solid #efefef;  /*no*/
    border-radius: 4px;  /*no*/
    margin: 20px 0;  /*no*/
    padding: 5px;  /*no*/
    font-size: inherit;
  }
  .btn-lg{
    font-size: 16px;  /*no*/
    height: 48px;  /*no*/
    box-shadow: 0 2px 10px 0 rgba(236,44,42,0.30);  /*no*/
  }
  .result{
    margin-top: 20px;  /*no*/
    background: rgba(0,0,0,0.05);
    border: 1px solid #efefef;  /*no*/
    border-radius: 4px;  /*no*/
    padding: 5px;  /*no*/
    user-select: all;
  }
}

</style>

