<template lang="html">
  <span class="form-control-star">
    <span v-for="n in 5" @click="updateValue(n*2)">
      <svg-icon class="star" icon="icon-pingjia" v-if="n <= value/2"></svg-icon>
      <svg-icon class="star" icon="icon-pingjiahuise" v-else></svg-icon>
    </span>
  </span>
</template>

<script>
import helper from '@/helper'
import {toast} from '@/util'

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

    }

  },
  computed:{

  },
  mounted () {

  },
  methods: {
    edit() {

    },
    updateValue(value) {
      if(this.readonly || this.disabled) return

      this.$emit('input', value)
    }
  },
  watch: {

  }
}
</script>

<style lang="scss">
.star{
  margin-right: px2rem(25px);
  font-size: px2rem(40px) !important;
}
</style>
