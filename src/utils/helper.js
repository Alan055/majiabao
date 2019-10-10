/* eslint-disable */

// 项目辅助工具集

import {Toast, Indicator, MessageBox} from 'mint-ui'
import storage from './storage'
import AppBridge from '@/services/AppBridge'

const helper = {


  /* 判断请求是否成功
      @param res `Object` 后台返回的response对象
     Usage:
      helper.isSuccess(res)
  */
  isSuccess: function(res, showMessage = true) {
    if(!res) {
      return false
    }
    if (Number(res.code) === 200) {
      return true;
    } else {
      showMessage && Toast(res.msg || res.error);
      return false;
    }
  },

  /*
   * 判断网络连接
   */
  offlineFunc: function() {
      Toast({
          message: "网络未连接，请检查网络设置",
          position: "middle",
          duration: 5000
      });
      if (root.$indicator) {
          root.$indicator.close();
      }
  },
  // 判断网络状态
  isOnline: function() {
      // if(navigator.onLine === 'undefined'){
      // 	return true;
      // }else{
      // 	return navigator.onLine;
      // }
      var online = true;
      // $.ajax({
      //     type: "POST",
      //     url: CONFIG.url.user + "/sys/h5/online",
      //     success: function() {
      //         online = true;
      //     },
      //     error: function() {
      //         console.log("起飞");
      //         online = false;
      //     },
      //     async: false,
      //     timeout: 5000
      // });
      return online;
  },
  // 默认错误方法
  errFunc: function(err) {
      if (!helper.isOnline()) {
          return false;
      }
      Toast({
          message: "网络错误，请稍后再试！",
          position: "middle",
          duration: 5000
      });
      console.error(err);
  },

  formatStorage(str){
    if(str.match('"{')){
        let newStr = str.replace(/^\"|\"|\\$/g,'')
    }
  },
  // 数据缓存
  get(key) {
    if (AppBridge.isApp) {
      return new Promise(resolve => {
        AppBridge.getStorage({key}, res => {


          // res = {data: {key: {value: 'value'}}}
          let value = res.data ? res.data[key] : undefined

          if (value) {

            //是对象直接返回
            if (typeof value == 'object') {

              resolve(value)

            } else {

              let temp = JSON.parse(value)
              value = (temp.hasOwnProperty('value')) ? temp.value : temp
              resolve(value)
            }

          }

          resolve(value)

        })
      })
    }
    else {
      return new Promise(resolve => {
        let value = storage.get(key)
        if (value) {
          value = JSON.parse(value).value
        }
        resolve(value)
      })
    }
  },
  set(key, value) {
    // 用json string, 确保value存取的数据类型一致
    value = JSON.stringify({value})
    if(AppBridge.isApp) {
      AppBridge.setStorage({key, value})
    }
    else {
      storage.set(key, value)
    }
  },
  remove(key) {
    if(AppBridge.isApp) {
      AppBridge.removeStorage({key})
    }
    else {
      storage.remove(key)
    }
  },

  // 加载动画
  _loadingTimer: null,
  loadingStart(msg) {
    if(AppBridge.isApp) {
      AppBridge.loadingView({msg})
    }
    else {
      Indicator.open(msg)
    }
  },
  loadingEnd() {
    if(AppBridge.isApp) {
      AppBridge.loadingView({close: true})
    }
    else {
      Indicator.close()
    }
  }

}

export default helper;

// Toast
/*
  eg.
    Toast('1')
    Toast({
      message: '1',
      duration: 2000
    })
*/
const _toast = function (options) {
  if(AppBridge.isApp) {
    let msg = typeof options == 'string' ? options : options.message
    let time = options.duration > 2000 ? 'long' : 'short'
    AppBridge.toast({msg, time})
  }
  else {
    return Toast(options)
  }
}
export { _toast as Toast }

// Indicator
/*
  eg.
    Indicator.open();
    Indicator.open('加载中...');
    Indicator.open({
      text: '加载中...',
      type: 1   //伪协议参数
    });

    Indicator.close()
*/
const _indecator = {
  open(options) {
    if (AppBridge.isApp) {
      if(typeof options == 'string') {
        options = {text: options}
      }
      AppBridge.loadingView(options)
    }
    else {
      Indicator.open(options)
    }
  },
  close() {
    if (AppBridge.isApp) {
      AppBridge.loadingView({close: true})
    }
    else {
      Indicator.close()
    }
  }
}
export { _indecator as Indicator }

// MessageBox
/*
  eg.
    MessageBox({
      title: 'title',
      message: 'message',
      confirmButtonText: 'confirm',
      cancelButtonText: 'cancel'
    }).then(action => {
      if(action == 'confirm') {

      }
    })

    MessageBox.confirm('title', 'message').then()
*/
const _messageBox = function (options) {
  if (AppBridge.isApp) {
    if(typeof options == 'string') {
      options = {message: options}
    }
    let { title, message, showCancelButton, confirmButtonText, cancelButtonText, leftColor, rightColor, cancelButtonClass } = options
    // 深色: #030303
    // 浅色: #999999
    leftColor = cancelButtonClass == 'strong' ? '030303' : '999999'
    rightColor = rightColor || '030303'
    if(showCancelButton) {
      cancelButtonText = cancelButtonText || '取消'
    }
    return new Promise(resolve => {
      AppBridge.dialogView({
        title: title,
        msg: message || 'message',
        leftBtn: cancelButtonText,
        rightBtn: confirmButtonText || '确定',
        leftColor,
        rightColor
      }, res => {
        let btnType = res.data.btnType
        if (btnType == 'leftBtn') {
          resolve('cancel')
        }
        else if (btnType == 'rightBtn') {
          resolve('confirm')
        }
      })
    })
  }
  else {
    return MessageBox(options)
  }
}
_messageBox.confirm = function(message, title) {
  return new Promise((resolve, reject) => {
    _messageBox({
      message,
      title,
      showCancelButton: true,
      confirmButtonText: '确定'
    }).then(action => {
      if (action == 'confirm') {
        resolve(action)
      }
      else {
        reject(action)
      }
    })
  })
}
export { _messageBox as MessageBox }
