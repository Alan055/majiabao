let prefix_common = 'DW_clickH400_1';
let prefix_index = prefix_common + '1';
let prefix_list = prefix_common + '2';
let prefix_detail = prefix_common + '3';


let index = {
  clickBill: prefix_index + '01', // 点击“账单”
};

let list = {
  clickBillList: prefix_list + '01', // 点击“账单列表详情”
  clickLoanList: prefix_list + '02', // 点击“借款协议”
  clickNavTab1: prefix_list + '03', // 点击 "待还款账单tab"
  clickNavTab2: prefix_list + '04' // 点击 "已结清账单tab"
};

export default {
  index, list
};
