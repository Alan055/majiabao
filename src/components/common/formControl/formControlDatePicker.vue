<template lang="html">
  <span v-if="computedValue">{{computedValue}}</span>
  <span v-else class="lighter">{{placeholder}}</span>
</template>

<script>
import helper from '@/helper'
import {toast} from '@/util'

let now = moment()
let defaultOption = {
  defaultValue: [now.year(), now.month()+1, now.date()]
}

export default {
  data(){
    return {

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
    computedValue(){
      return this.value
    }
  },
  mounted () {

  },
  methods: {
    edit() {
      let options = $.extend({}, defaultOption, this.options)
      options.onConfirm = result => {
        let value = result.map(item => item.value).join('.');
        this.updateValue(value)
      }
      this.$root.Plugins.weui.datePicker(options);
    },
    updateValue(value) {
      this.$emit('input', value)
    }
  },
  watch: {

  }
}
</script>
