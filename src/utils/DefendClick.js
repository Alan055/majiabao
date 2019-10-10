/*
  DefendClick —— 防止重复点击
  usage: 
    let defendClick = new DefendClick()

    defendClick.wrap(asyncFunc)
      —— 在asyncFunc执行完毕后允许点击
    
    if(defendClick.prevent()) {...}
      —— 在间隔时间之后允许点击
      —— 点击被prevent会返回true

  notice:
    1. 实例拥有独立的clicked状态
    2. asyncFunc需要返回一个Promise
*/

export default class DefendClick {
  constructor(options = {}) {
    this.clicked = false
    this.gapTime = options.gapTime || 500
    this.lastClickTime = null
  }
  // 在asyncFunc执行完毕后允许点击
  wrap(asyncFunc) {
    if (this.clicked){
      console.log('click defended')
      return Promise.reject()
    }
    this.clicked = true
    return asyncFunc().finally(() => { this.clicked = false })
  }
  // 在间隔时间之后允许点击
  // 返回true 表示需要阻止点击
  prevent() {
    // 储存点击时间
    let time = new Date()
    let { lastClickTime, gapTime } = this
    // 首次点击
    if(!lastClickTime) {
      this.lastClickTime = time
    }
    // 与首次点击时间间隔不足500
    else if (time - lastClickTime < gapTime) {
      console.log('click prevented')
      return true
    }
    // 已超过间隔时间
    else {
      this.lastClickTime = time
    }
  }
}
