//初始数据

import util from '@/utils'

const store = {
  state: {
    agreements: {
      signup: {},   // 用户注册协议-10080
      platform: {}, // 平台服务协议-10081
      operator: {}, // 运营商授权协议-10082
      disclaimer: {}  // 免责说明协议-10083
    }
  },
  mutations: {
    setInitData(state, data) {
      if(!data) return
      state = util.extend(state, data)
    },
    // setAgreements(state, data = []) {
    //   let agreements = {}
    //   // 用户注册协议-10080
    //   agreements.signup = data.filter(item => item.code == '10080')[0] || {}
    //   // 平台服务协议-10081
    //   agreements.platform = data.filter(item => item.code == '10081')[0] || {}
    //   // 运营商授权协议-10082
    //   agreements.operator = data.filter(item => item.code == '10082')[0] || {}
    //   // 免责说明协议-10083
    //   agreements.disclaimer = data.filter(item => item.code == '10083')[0] || {}

    //   state.agreements = agreements

    //   console.log(agreements, data)
    // }
  },
  actions: {},
  getters: {
    initData: state => {
      return state;
    },
    // agreements: state => {
    //   return state.agreements
    // }
  }
};

export default store


