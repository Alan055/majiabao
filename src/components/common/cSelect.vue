<template lang="html">
  <transition name="fade">
    <div ref="select" class="c-select" v-show="showSelect" @click="close">
      <transition name="down">
        <div class="wrap" v-show="showSelect" @click.stop="">
          <div class="handler">
            <span @click="close">取消</span>
            <span class="c-fr" @click="confirm">确认</span>
          </div>
          <mt-picker class="mt-picker" :slots="slots" valueKey="text" @change="onchange" ></mt-picker>
          <!-- <ul class="cp-dropdown">
            <li v-for="item in computedOptions" :class="{active: item.value == value}" @click="updateValue(item.value, item)">{{item.text}}</li>
          </ul>
          <ul class="cp-dropdown cancel">
            <li>取消</li>
          </ul> -->
        </div>
      </transition>
    </div>
  </transition>

</template>

<script>
import { Picker } from 'mint-ui';
export default {
  data(){
    return {
      showSelect: false,
      selected: null,
      value: '',
      options: [],
      resolve: null,
      reject: null,
      slots: []
    }
  },
  props:{

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
    open(setting) {
      this.options = setting.options
      this.value = setting.value
      this.slots = [
        {
          flex: 1,
          values: setting.options,
          className: 'slot1'
        }
      ]
      this.showSelect = true;

      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    updateValue(value, item) {
      this.$emit('input', value, item)
      this.resolve(value, item)
    },
    close() {
      this.showSelect=false
      this.reject()
    },
    confirm() {
      this.updateValue(this.value, this.selected)
      this.showSelect=false
    },
    onchange(picker, values) {
      if(!values[0]) {
        return
      }
      this.selected = values[0]
      this.value = this.selected.value
    }
  },
  watch: {

  }
}
</script>

<style lang="scss" scoped>
.c-select{
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .3);
}
.wrap{
  position: absolute;
  z-index: 1;
  bottom: 0;
  left: 0;
  right: 0;
}
.active{
  color: $primary;
}

.wrap{
  background: white;
  .handler{
    padding: 10px $gap;
    font-size: $fontL;
  }
}
</style>
