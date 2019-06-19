// 增信 H3
let moduleName = 'DW_clickH3'

// 增信首页 00
let moduleHome = moduleName + '00' + '_'
let home = {
  // index 00
  index: {
    // 点击认证链接（附加类型参数）
    link: moduleHome + '0001'
  }
}

// 运营商认证 01
let moduleOperator = moduleName + '01' + '_'
let operator = {
  // 认证页 00
  certify: {
    // 提交 01
    submit: moduleOperator + '0001',
    // 查看协议 02
    agreements: moduleOperator + '0002',
    // 忘记密码 03
    forgot: moduleOperator + '0003',
    // 拨打电话 04
    call: moduleOperator + '0004'
  },
  // 认证中 01
  processing: {
    
  }
}

export default {
  home,
  operator
};
