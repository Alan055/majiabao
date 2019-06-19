
// 公共信息三步资料 H101
// 返件三步资料 H120

const generator = function (modulePublicInfo) {
  let publicInfo = {
    // 身份信息 01
    idCard: {
      // 提交 01
      submit: modulePublicInfo + '0101',
      // 返回 02
      back: modulePublicInfo + '0102',
      // 残忍离开 03
      leave: modulePublicInfo + '0103',
      // 继续申请 04
      continue: modulePublicInfo + '0104',
      // 相机授权自定义提示 05 
      permission: modulePublicInfo + '0105',

      // 人像面 06
      pos: modulePublicInfo + '0106',
      // 国徽面 07
      opp: modulePublicInfo + '0107',
      // 人像国徽面（蒙层）,点击后拍摄人像面然后自动拍摄国徽面 08
      mask: modulePublicInfo + '0108',
      // 身份证号码输入 09
      idNumber: modulePublicInfo + '0109',
      // 身份证姓名输入 10
      idName: modulePublicInfo + '0110',
      // 人脸识别 11
      face: modulePublicInfo + '0111'
    },

    // 联系人信息 02
    contacts: {
      // 提交 01
      submit: modulePublicInfo + '0201',
      // 返回 02
      back: modulePublicInfo + '0202',
      // 残忍离开 03
      leave: modulePublicInfo + '0203',
      // 继续申请 04
      continue: modulePublicInfo + '0204',
      // 通讯录授权自定义提示 05 
      permission: modulePublicInfo + '0205',

      // 家人 06
      family: modulePublicInfo + '0206',
      // 朋友 07
      friend: modulePublicInfo + '0207',
      // 同事 08
      colleague: modulePublicInfo + '0208',
    },

    // 基本信息 03
    userBasicInfo: {
      // 提交 01
      submit: modulePublicInfo + '0301',
      // 返回 02
      back: modulePublicInfo + '0302',
      // 残忍离开 03
      leave: modulePublicInfo + '0303',
      // 继续申请 04
      continue: modulePublicInfo + '0304',
      // 定位授权自定义提示 05 
      permission: modulePublicInfo + '0305',

      // 确认提交 06
      confirm: modulePublicInfo + '0306',
      // 再次核对 07
      cancel: modulePublicInfo + '0307',

      // 学历 08
      degree: modulePublicInfo + '0308',
      // 婚姻 09
      marriage: modulePublicInfo + '0309',
      // 月收入 10
      income: modulePublicInfo + '0310',
      // 单位名称 11
      companyName: modulePublicInfo + '0311',
      // 期望借款金额 12
      amount: modulePublicInfo + '0312',
      // 居住地址 13
      homeCity: modulePublicInfo + '0313',
      // 详细居住地址 14
      homeAddress: modulePublicInfo + '0314',
      // 工作地址 15
      companyCity: modulePublicInfo + '0315',
      // 详细工作地址 16
      companyAddress: modulePublicInfo + '0316',
    }
  }
}


export default generator