<template lang="html">
  <div>

  </div>
</template>

<script>
import api from '@/services/api'
import util from '@/utils'
import helper from '@/utils/helper'
import appBridge from '@/services/AppBridge'
import {Indicator} from '@/utils/helper'

// const Indicator = function() {
//   if(appBridge.isApp) {
//     return {
//       open() {
//         appBridge.loadingView({type: 2})
//       },
//       close() {
//         appBridge.loadingView({close: true})
//       }
//     }
//   }
//   else {
//     return indicator
//   }
// }()

function redirect(res, next) {
  /*
    userstatus
    0	公共信息未填写
    1	已填写身份证和活体
    2	已填写联系人
    3	已填写基本信息
    4	公共三步信息填写完成，未提交
    5	商户匹配中
    6	匹配失败，无一级商户结果
    7	商户匹配异常
    8	一级商户未补件
    9	一级商户补件中
    10	申请已完结
  */
  let {userstatus} = res.data

  // if(userstatus == 0) {
  //   next({name: 'home', params: res.data})
  // }
  // if([1,2,3,4].indexOf(userstatus) > -1) {
  //   next({name: 'step1'})
  // } 
  // if(userstatus == 5) {
  //   next({name: 'loading'})
  // }
  // if(userstatus == 6 || userstatus == 10) {
  //   next({name: 'recommend', params: res.data})
  // }
  // if(userstatus == 7) {
  //   next({name: 'home', params: res.data})
  // }
  // if(userstatus == 8 || userstatus == 9) {
  //   next({name: 'level1', params: res.data})
  // }

  if([6, 10].indexOf(userstatus) > -1) {
    next({name: 'recommend', params: res.data})
  }
  else {
    next({name: 'home', params: res.data})
  }


}

export default {
  created() {
    if(! this.$root.isLogin) {
      this.$root.replaceRoute({name: 'home'})
      return
    }

    Indicator.open()
    api.home.getHomePage().then(res => {
      if(helper.isSuccess(res)) {
        redirect(res, route => this.$root.replaceRoute(route))
      }
      else {
        this.$root.replaceRoute({name: 'home'})
      }
    })
    .catch(() => {
      this.$root.replaceRoute({name: 'home'})
    })
    .finally(Indicator.close);
  }
}
</script>
