let prefix_common = 'DW_clickH400_5';
let prefix_index = prefix_common + '1';
let prefix_list = prefix_common + '2';
let prefix_detail = prefix_common + '3';

let index = {
  clickBanner: prefix_index + '01', // 点击“banner”
  clickNav: prefix_index + '02', // 点击“问题分类”
  clickHotQuestion: prefix_index + '03', // 点击“热门问题”
  clickOnlineServer: prefix_index + '04' // 点击“咨询在线客服”
};

let list = {
  clickQuestionList: prefix_list + '01', // 点击“账单列表详情”
  clickOnlineServer: prefix_list + '02' // 点击“点击咨询在线客服”
};

let detail = {
  clickInUse: prefix_detail + '01', // 点击有用
  clickNoUse: prefix_detail + '02', // 点击无用
  clickNoUseList: prefix_detail + '03', // 点击无用列表
  clickOnlineServer: prefix_detail + '04', // 点击“咨询在线客服”
}


export default {
  index, list, detail
};
