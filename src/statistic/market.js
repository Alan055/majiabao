// 贷超弹框埋点
let moduleClick = "DW_click_market_";
let marketShow = "DW_show_market_";

let market = {
    // 产品推荐 01
    recommend: {
        show: marketShow + '0101', //显示
        btnClick: moduleClick + '0102', //确认点击
        closeClick: moduleClick + '0103', //关闭点击
    }
};

export default {
    market
};