import about from './pages/about/aboutAds';
import feedback from './pages/feedback/feedbackAds';
import message from './pages/message/messageAds';
import bill from './pages/bill/billAds';
import bankCard from './pages/bankCard/bankCardAds';
import news from './pages/news/newsAds';

// 导流极速熊猫贷款 埋点
let prefix_common = 'XM_pandaflash_diversionXmLoan_';

let diversionXmLoan = {
  billpopover: prefix_common + '01', // 账单弹窗曝光
  billclick: prefix_common + '02', // 账单弹窗点击跳转
  billclickclose: prefix_common + '03', // 账单弹窗点击关闭
  repaypopover: prefix_common + '04', // 还款弹窗曝光
  repayclick: prefix_common + '05', // 还款弹窗点击跳转
  repayclickclose: prefix_common + '06', // 还款弹窗点击关闭
  homepopover: prefix_common + '07', // 首页弹窗曝光
  homeclick: prefix_common + '08', // 首页弹窗点击跳转
  homeclickclose: prefix_common + '09', // 首页弹窗点击关闭
  homeTopclick: prefix_common + '10', // 首页弹窗点击关闭
};


export default {
  about, feedback, message, bill, bankCard, news, diversionXmLoan
};
