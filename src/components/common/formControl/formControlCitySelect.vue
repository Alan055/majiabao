<template lang="html">
  <div class="wrap">
    <span v-if="computedValue || readonly">{{computedValue}}</span>
    <span v-else class="c-light">{{placeholder}}</span>

  </div>

</template>

<script>
import appBridge from '@/services/AppBridge'

export default {
  data(){
    return {
      showSelect: false
    }
  },
  props:{
    title: {

    },
    value: {

    },
    placeholder: {
      default: '选择'
    },
    readonly: {

    },
    disabled: {

    }

  },
  computed:{
    computedValue(){
      if(! this.value) {
        return ''
      };
      let _this = this;
      let {provinceCode, provinceName, cityCode, cityName, } = this.value;
        return `${provinceName} ${cityName}`;
    }
  },
  methods: {
    edit() {
      let {provinceCode, cityCode,} = this.value || {provinceCode:null,cityCode:null,}
      appBridge.chooseCity({
        provinceCode, cityCode
      }, res => {
        this.updateValue(res.data)
      })
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
  .wrap{
    flex: 1
  }
</style>
