<template lang="html">
  <div class="wrap">
    <span v-if="readonly">{{computedValue}}</span>
    <span v-else>
      <span v-if="computedValue">{{computedValue}}</span>
      <span v-else class="c-light">{{placeholder}}</span>
      <c-icon class="icon-16" type="arrowRight" />
    </span>

  </div>

</template>

<script>
import appBridge from '@/services/AppBridge'

export default {
  data(){
    return {
      showSelect: false,
      asyncValue: null
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
      let {provinceCode, provinceName, cityCode, cityName, countryCode, countryName} = this.asyncValue || this.value || {}

      // 地址反查
      if(countryCode && !countryName) {
        appBridge.getAddressByCountryCode({
          countryCode: countryCode
        },res=>{
          console.log('反查成功')
          this.asyncValue = res.data
        });
        return ''
      }

      if(!provinceName && !cityName && !countryName) {
        return ''
      }

      return `${provinceName || ''} ${cityName || ''} ${countryName || ''}`
    },
    computedTitle() {
      return this.title.replace('地址', '城市')
    }
  },
  methods: {
    edit() {
      let {provinceCode, cityCode, countryCode} = this.value || {provinceCode:null,cityCode:null,countryCode:null}
      appBridge.chooseAddress({
        provinceCode, cityCode, countryCode,
        title: '选择' + this.computedTitle
      }, res => {
          this.asyncValue=null
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

  .icon-16{
    @include size(16px);
  }
</style>
