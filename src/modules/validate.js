import Vue from 'vue';
import VeeValidate from 'vee-validate';
import {Validator} from 'vee-validate';
import util from '@/utils'

Vue.use(VeeValidate);

// 最少输入字符(区分中文)
Validator.extend('minChar', (value, args) => {
  let len = util.getCharLen(value)
  let min = Number(args[0])
  console.log('minChar', len, min)
  return len >= min
})

/*
  文档：http://vee-validate.logaretm.com/

  使用方法：
    <input type="text" name="email" v-validate="'required|email'">
    <span v-show="errors.has('email')" class="error">{{ errors.first('email') }}</span>

    this.$validator.validateAll().then((result) => {
      if (! result) {
        // invalid
        toast(this.errors.all()[0])
        return
      }

    });

    this.$validator.validate('field').then((result) => {
      if (! result) {
        // invalid
        toast(this.errors.first('field'))
        return
      }

    })

  注意：
    name字段不可为空，
    v-validate接收字符串

  系统自带校验规则（30个）：
    required email digits decimal max min image url ...(更多请查看文档)

  错误提示文字：
    const dict = {
      custom: {
        name: {
          required: '请输入姓名'
        },
        phone: {
          required: '请输入联系方式',
          digits: '请输入手机号'
        }
      }
    }
    this.$validator.localize('en', dict)

  自定义规则：
    全局：
      Validator.extend('test',value => value>1)
      Validator.extend('test',{
        // 校验方法，返回 Boolean
        validate: (value, args) => value==1,
        // 提示文字(可选)
        getMessage: field => field + ' is not valid.'
      })

    局部：
      this.$validator.extend(...)
*/
