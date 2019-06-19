<template lang="html">
  <span v-if="computedValue">{{computedValue}}</span>
  <span v-else class="lighter">{{placeholder}}</span>
</template>

<script>
import helper from '@/helper'
import {toast} from '@/util'

export default {
  data(){
    return {
      selected: {}
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

    }

  },
  computed:{
    computedOptions(){
      if(!this.options){
        return [];
      }
      return this.options.map(item=>{
        return (typeof item == 'object') ? {value: item.value, label: item.label || item.text} : {value: item, lable: item};
      });
    },
    computedValue(){
      return this.value == this.selected.value ? this.selected.label : ''
    }
  },
  mounted () {

  },
  methods: {
    edit() {
      this.$root.Plugins.weui.picker(this.computedOptions, {
        onConfirm: result => {
          let value = result[0].value
          this.selected = result[0]
          this.updateValue(value)
        }
      });
    },
    updateValue(value) {
      this.$emit('input', value)
    }
  },
  watch: {

  }
}
</script>
