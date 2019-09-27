// 关于我们 埋点
let prefix_common = 'DW_clickH400_6';
let prefix_index = prefix_common + '1';
let prefix_about = prefix_common + '2';

let index = {
  clickGoMarket: prefix_index + '01', // 点击“去好评”
  clickGoFeedback: prefix_index + '02', // 点击“意见反馈”
  clickGoAgreements: prefix_index + '03',  // 点击“免责申明”
  clickAboutSinaif: prefix_index + '04', // 点击“关于大王贷款”
  clickCheckVersion: prefix_index + '05', // 点击“检查更新”
  clickMessagePush: prefix_index + '06', // 点击“消息设置”
  clickWeiXinCopy: prefix_index + '07', // 点击“官方微信”
};
let about = {
  clickGoWebsite: prefix_about + '01', // 点击前往官网
  clickGoWeibosite: prefix_about + '02' // 点击前往微博
};
let reward = {
};

export default {
  index,
  about,
  reward
};
