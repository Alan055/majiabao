<template lang="html">
  <div class="wrap">

    <input ref="input" name="input" class="mint-field-core" :value="value"
           @input="updateValue($event.target.value)"
           @focus="focus"
           @blur="blur"
           :type="type"
           :placeholder="placeholder"
           :readonly="readonly"
           :maxlength="maxlength"
           :disabled="disabled"
    >

    <div class="mint-field-clear" v-show="showClear" @click="clear"><i class="mintui mintui-field-error"></i></div>
  </div>
</template>

<script>

export default {
  data(){
    return {
      active: false
    }
  },
  props:{
    title: {

    },
    type: {

    },
    value: {

    },
    placeholder: {
      default: '填写'
    },
    readonly: {

    },
    disabled: {

    },
    maxlength: {},
    disableClear: {
      default: true
    }
  },
  computed:{
    showClear() {
      return !this.disableClear && this.active && this.value
    }
  },
  mounted () {

  },
  methods: {
    edit() {
      this.$refs.input && this.$refs.input.focus();
    },
    updateValue(value) {
      this.$emit('input', value)
    },
    focus() {
      this.active = true
      this.$emit('focus')
    },
    blur() {
      this.active = false
      this.$emit('blur')
    },
    clear() {
      this.$emit('input', '')
    },
  },
  watch: {
    'value'(value) {
      if(this.type == 'tel' && value && /\D/.test(value)) {
        this.updateValue(value.replace(/\D/g, ''))
      }
    }
  }
}
</script>

<style type="scss" scoped>
  .wrap{
    flex: 1;
  }
  input:disabled{
    background-color: #fff!important; color:#333333!important; opacity: 1!important;
  }
  input[disabled]{
    background-color: #fff!important; color:#333333!important; opacity: 1!important;
  }
</style>

