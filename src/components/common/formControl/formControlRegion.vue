<template lang="html">
  <div class="c-table-row">
    <span class="item" @click="selectCity">
      <span class="placeholder" v-if="!city.name">居住城市</span>
      {{city.name}}
      <svg-icon class="fr" icon="icon-arrow-xiangxia"></svg-icon>
    </span>
    <span class="item second" @click="selectArea">
      <span class="placeholder" v-if="!area.name">区</span>
      {{area.name}}
      <svg-icon class="fr" icon="icon-arrow-xiangxia"></svg-icon>
    </span>
  </div>

</template>

<script>
import helper from '@/helper'
import {toast} from '@/util'
import rest from '@/rest'
import {mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  data(){
    return {
      province: {},
      city: {},
      area: {},
      cityList: [],
      areaList: []
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

    }

  },
  computed:{
    ...mapGetters(['location'])
  },
  async mounted () {
    await this.fetchRegionData()
  },
  methods: {
    ...mapMutations([]),
    ...mapActions(['fetchRegionData']),
    edit() {
      // this.regionData.promise.done(data => {
      //   this.picker(this.transformData(data, this.value))
      // })
    },
    selectCity() {
      if(!this.cityList.length) return

      let data = this.transformData(this.cityList)
      this.$root.Plugins.weui.picker(data, {
        defaultValue: this.city ? this.city.id : '',
        onConfirm: result => {
          let {province, city, area} = this
          city = this.transformValue(result[0])
          this.readValue({province, city, area})
          this.updateValue()
        },
        id: 'cityPicker'
      });
    },
    selectArea() {
      if(!this.areaList.length) return this.selectCity()

      let data = this.transformData(this.areaList)
      this.$root.Plugins.weui.picker(data, {
        defaultValue: this.area ? this.area.id : '',
        onConfirm: result => {
          let {province, city, area} = this
          area = this.transformValue(result[0])
          this.readValue({province, city, area})
          this.updateValue()
        },
        id: 'areaPicker'
      });
    },
    transformData(data) {
      let result = data.map(item => ({
        value: item.provinceId || item.cityId || item.areaId,
        label: item.provinceName || item.cityName || item.areaName
      }))
      return result
    },
    transformValue(data) {
      return {
        id: data.value,
        name: data.label
      }
    },
    updateValue() {
      let {province, city, area} = this
      this.$emit('input', {province, city, area})
    },
    async readValue(value) {
      let {province, city, area} = value || this.value || {}
      this.province = province || {}
      this.city = city || {}
      this.area = area || {}

      let provinceList = await this.fetchRegionData()

      if(province) {
        let match = provinceList.filter(item => item.provinceId == province.id)[0]
        if(match) {
          this.cityList = match.cityList
        }
        else {
          this.province = {}
          this.cityList = []
        }
      }
      else {
        this.cityList = []
      }

      if(city) {
        let match = this.cityList.filter(item => item.cityId == city.id)[0]
        if(match) {
          this.areaList = match.areaList
        }
        else {
          this.city = {}
          this.areaList = []
        }
      }
      else {
        this.areaList = []
      }

      if(area) {
        let match = this.areaList.filter(item => item.areaId == area.id)[0]
        if(!match) {
          this.area = {}
        }
      }

    }
  },
  watch: {
    value(value) {
      this.readValue()
    }
  }
}
</script>

<style lang="scss" scoped>
.placeholder{
  color: #C2C2C2;
}
.item{
  text-align: left;
  padding: px2rem(20px) 0;
  width: 50%;
  &.second{
    padding-left: px2rem($baseGap);
    flex: none;
  }
}
.icon-arrow-xiangxia{
  height: 1.6em;
}

</style>
