<template lang="html">
  <div>
    <span class="radio-tag"
      :class="[{active: item.value == value}, 'id-'+item.value]"
      @click="updateValue(item.value)"
      v-for="item in computedOptions">
      {{item.text}}
    </span>
  </div>

</template>

<script>
import helper from '@/helper'
import {toast} from '@/util'

export default {
  data(){
    return {
      showSelect: false,
    }
  },
  props:{
    title: {

    },
    type: {

    },
    notice: {

    },
    value: {

    },
    text: {

    },
    textKey: {

    },
    required: {

    },
    placeholder: {

    },
    validate: {

    },
    readonly: {

    },
    disabled: {

    },
    options: {
      // [{value:1,text:'text'}...] [1,2,3]
      type: Array
    },

  },
  computed:{
    computedOptions(){
      if(!this.options){
        return [];
      }
      return this.options.map(item=>{
        return (typeof item == 'object') ? item : {value:item,text:item};
      });
    },
    computedValue(){
      let filter = this.computedOptions.filter(item=>{
        return this.value === item.value;
      });
      return filter.length ? filter[0].text : '';
    }
  },
  methods: {
    edit() {

    },
    updateValue(value) {
      this.$emit('input', value)
    }
  },
  watch: {

  }
}
</script>

<style lang="scss" scoped>
.radio-tag{
  display: inline-block;
  vertical-align: middle;
  font-size: $small;
  line-height: px2rem(32px);
  height: px2rem(56px);
  padding: px2rem(10px) px2rem(28px);
  border: 1px solid #E6E6E6;
  border-radius: px2rem(8px);
  + .radio-tag{
    margin-left: px2rem(20px);
  }
  &.active{
    color: $primary;
    border-color: $primary;
    background: #FFF6F1;
  }
}
</style>
