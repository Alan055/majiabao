// 信用生活 埋点
let prefix_common = 'XM_click_pandaflash_news_';

let prefix_tab2 = 'XM_click_panda_tab2_';

let prefix_pingAnNews = 'XM_click_pingAnNews_';

let index = {
    clickCredit: prefix_common + '01', // 点击信用卡
    clickbefore: prefix_common + '02', // 点击贷前检测

    clickArea1: prefix_tab2 + '01',  //点击位置1
    clickArea2: prefix_tab2 + '02',  //点击位置2
};

let pingAnNews = {
    clickArea1: prefix_pingAnNews + '01',  //点击位置1
    clickArea2: prefix_pingAnNews + '02',  //点击位置2
    clickSwiper: prefix_pingAnNews + '03', //点击轮播

    swiperDisplay: prefix_pingAnNews + '04', //轮播曝光
    imgDisplay: prefix_pingAnNews + '05', //图片资源位曝光
};

export default {
    index,
    pingAnNews,
};
