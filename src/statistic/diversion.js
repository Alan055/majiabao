// 流量分发
let moduleClick = "DW_click_diversion_";
let moduleShow = "DW_show_diversion_";

let diversion = {
    // 产品推荐 01
    recommend: {
        btnClick: moduleClick + '0101',  //点击导流融泽
        show: moduleShow + '0102',
        showQsj:moduleShow + '0103', //导流轻松借
        btnClickQSJ:moduleClick + '0104', //点击导流轻松借
    },



    //未分流到商户 02
    nopass: {
        btnClick: moduleClick + '0201'
    },
    //弹窗 03
    dialog: {
        show: moduleShow + '0301',
        hideClick: moduleClick + '0302',
        btnClick: moduleClick + '0303'
    },
    //拒件记录 04
    refuse: {
        btnClick: moduleClick + '0401',
        show: moduleShow + '0402'
    },
    //new 卡 05
    newcards: {
        btnClick: moduleClick + '0501',
        show: moduleShow + '0502'
    },
    //抖动图标
    jitter:{
        show:moduleShow + "0601",
        click:moduleClick + "0602",
    },
};

export default {
    diversion
};
