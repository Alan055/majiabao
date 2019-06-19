// Maxent SDK(JavaScript)

const loadSDK = function() {
  (function (a, b) {
    window['_mjObject'] = b;
    window[b] = window[b] || function () {
      (window[b].q = window[b].q || []).push(arguments);
    };
    var c = document.createElement('script');
    var d = document.getElementsByTagName('script')[0];
    c.async = 1;
    c.src = a;
    c.onerror = function() {
      setTimeout(loadSDK, 6000);
    }
    d.parentNode.insertBefore(c, d);
  })(process.env.resourceUrl + 'static/lib/maxent/mjsdk-1.4.4.min.js', 'mj');
}

export default {  
  // 初始化参数
  init(userId) {
    if(window.mj) return
    loadSDK()
    window.mj('set_params', {
      url: 'https://trk.mxtrk.com/jta/event', // 事件发送地址
      tid: '2b969938afd733da963bff8d94c34ba8', // 绑定在平台上的 API key
      user_id: userId // 用户id
    });
  },
  // primise封装
  send(type, data) {
    return new Promise(resolve => {
      window.mj(type, data, resolve)
    })
  },
  // 激活
  active(tick) {
    //用户ID + timestamp
    // let tick = util.getParams('fromUserId') + new Date().getTime()
    return this.send('activation', {tick})    
  },

}