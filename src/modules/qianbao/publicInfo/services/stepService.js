import helper from "@/utils/helper"
import { MessageBox } from "@/utils/helper"
import AppBridge from "@/services/AppBridge"
import sinaAds from '@/utils/SinaAds'
import stat from '@/statistic/home'

// 检查相机权限
async function checkCameraPermission(realcheck) {


  // 首次检测权限标识
  let permission = await helper.get('cameraPermission')


  if (!permission) {
    // 自定义提示
    await MessageBox({
      title: '温馨提示',
      message: '身份信息填写需相机授权，仅用于核实身份',
      confirmButtonText: '我知道了',
      closeOnClickModal: false
    })
    .then(action => {
      sinaAds.click(stat.publicInfo.idCard.permission)
    })

    // 设置权限标识
    helper.set('cameraPermission', true)
  }

  // 不触发App权限
  if (!realcheck) {
    return true
  }

  // 申请App权限，返回true/false
  return await new Promise(resolve => {
    AppBridge.permission({ scope: 'camera' }, res => {
      resolve(res.data.grant == 'granted')
    })
  })

}

// 检查通讯录权限
async function checkContactPermission(realcheck) {
  // 首次检测权限标识
  let permission = await helper.get('contactPermission')

  if (!permission) {
    // 自定义提示
    await MessageBox({
      title: '温馨提示',
      message: '通讯录填写需授权访问，仅用于联系人信息选取',
      confirmButtonText: '我知道了',
      closeOnClickModal: false
    })
    .then(action => {
      sinaAds.click(stat.publicInfo.contacts.permission)
    })
    // 设置权限标识
    helper.set('contactPermission', true)
  }

  // 不触发App权限
  if(!realcheck) {
    return true
  }

  // 申请App权限，返回true/false
  return await new Promise(resolve => {
    AppBridge.permission({scope: 'contacts'}, res => {
      resolve(res.data.grant == 'granted')
    })
  })

}


// 检查定位权限
async function checkLocationPermission(realcheck) {
  // 首次检测权限标识
  let permission = await helper.get('locationPermission')

  if(!permission) {
    // 自定义提示
    await MessageBox({
      title: '温馨提示',
      message: '惠义贷款想获取您的位置信息，请允许，否则会影响您的借款相关操作',
      confirmButtonText: '我知道了',
      closeOnClickModal: false
    })
    .then(action => {
      sinaAds.click(stat.publicInfo.userBasicInfo.permission)
    })

    // 设置权限标识
    helper.set('locationPermission', true)
  }

  // 不触发App权限
  if(!realcheck) {
    return true
  }

  // 申请App权限，返回true/false
  return await new Promise(resolve => {
    AppBridge.permission({scope: 'location'}, res => {
      resolve(res.data.grant == 'granted')
    })
  });

}

export {
  checkCameraPermission,
  checkContactPermission,
  checkLocationPermission
}


// 检索错误信息
const fieldMap = {
  1: {
    1: 'posimageurl',
    2: 'oppimageurl',
    3: 'posandopp',
    4: 'mediaid'
  },
  2: {
    1: 'family',
    2: 'friend',
    3: 'colleague'
  },
  3: {
    1: 'addr',
    2: 'companyaddr',
    3: 'companyname'
  }
}
function resolveErrorInfo(data, step) {
  data = data || []
  let result = {}
  data.forEach(item => {
    // dealstatus==1时不显示
    if(item.dealstatus == 1) return
    let field = fieldMap[step][item.type]
    result[field] = item.returnreason
  })
  return result
}

export {resolveErrorInfo}
