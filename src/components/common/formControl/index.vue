<template >
  <li class="mint-cell mint-field">
    <dl @click="edit" class="mint-cell-wrapper">
      <dt class="mint-cell-title">
        <slot name="left">
          <span class="mint-cell-text" v-html="title"></span>
        </slot>
      </dt>
      <dd class="mint-cell-value">
        <slot name="right">
          <component :is="componentName" v-bind="computedData" @input="updateValue" ref="formControl" @focus="focus" @blur="blur"></component>
        </slot>
      </dd>
    </dl>
    <slot name="after"></slot>
  </li>
</template>

<script>
import {Toast} from '@/utils/helper'
import formControlText from './formControlText.vue'
import formControlSelect from './formControlSelect.vue'
import formControlAddressSelect from './formControlAddressSelect.vue'
import formControlCitySelect from './formControlCitySelect.vue'
// import formControlRadio from './formControlRadio.vue'
// import formControlRegion from './formControlRegion.vue'
// import formControlPicker from './formControlPicker.vue'
// import formControlDatePicker from './formControlDatePicker.vue'
// import formControlStar from './formControlStar.vue'

export default {
  data(){
    return {
      showSelect: false
    }
  },
  components: {
    formControlText,
    formControlSelect,
    formControlAddressSelect,
    formControlCitySelect
    // formControlRadio,
    // formControlRegion,
    // formControlPicker,
    // formControlDatePicker,
    // formControlStar
  },
  props:{
    type: {
      default: 'text'
    },
    title: {

    },
    value: {

    },
    placeholder: {

    },
    readonly: {

    },
    disabled: {

    },
    required: {
      default: 'false'
    },
    options: {

    },
    notice: {
      type: String
    },
    maxlength: {},

    // text: {
    //   type: String
    // },
    // textKey: {
    //   type: String
    // },



    source: {

    },
    // validate: {
    //
    // },
    // collapse: {
    //   type: String,
    //   default: 'false'
    // },


  },
  computed:{
    componentName() {
      let type = this.type.replace(/^(\w)/,(v, $1) => $1.toUpperCase())
      if(['Tel', 'Email', 'Number'].indexOf(type) == 0) {
        type = 'Text'
      }
      return 'formControl' + type
    },
    computedData(){
      return {
        type: this.type,
        title: this.title,
        value: this.value,
        placeholder: this.placeholder,
        readonly: this.readonly && this.readonly!=='false',
        disabled: this.disabled && this.disabled!=='false',
        required: this.required && this.required!=='false',
        options: this.options,
        maxlength: this.maxlength,
        // text: this.text,
        // textKey: this.textKey,
        // title: this.title,
        source: this.source,
        // validate: this.computedValidate,
        // collapse: this.collapse
      }
    }

  },
  mounted () {

      //解决Android机型隐藏输入框的bug
      !navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) && window.addEventListener("resize", function () {
          "INPUT" != document.activeElement.tagName && "TEXTAREA" != document.activeElement.tagName || window.setTimeout(function () {
              document.activeElement.scrollIntoViewIfNeeded()
          }, 0)
      })
  },
  methods: {
    edit() {
      if(this.computedData.readonly || this.computedData.disabled){
        return;
      }
      this.$refs.formControl && this.$refs.formControl.edit()
    },
    updateValue(value) {
      this.$emit('input', value)
    },

    focus() {
      this.$emit('focus')
    },
    blur() {
      this.$emit('blur')
    }
  },
  watch: {

  }
}
</script>

<style lang="scss" scoped>
  .form-control-wrap{
    @extend %border-b;
    &:last-child{
      border: none;
    }
  }

  .no-border .mint-cell-wrapper{
    border: none;
  }
</style>
