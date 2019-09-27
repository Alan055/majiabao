let prefix_common = 'DW_clickH400_8';
let prefix_index = prefix_common + '1';
let prefix_detail = prefix_common + '2';

let index = {
  clickSysMsg: prefix_index + '01', // 点击“系统消息“
  clickActMsg: prefix_index + '02', // 点击 "活动消息"
  clickList: prefix_index + '03', // 点击 “消息列表” 暂时没用
  clickSysMsgList: prefix_index + '04', // 点击”消息列表数据“
  clickActMsgList: prefix_index + '05' // 点击”活动列表数据“
};

let detail = {
};


export default {
  index, detail
};
