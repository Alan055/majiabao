import Vue from "vue";
import Vuex from "vuex";
// import init from "./modules/init";
// import creditStatus from "./modules/creditStatus";
// import banner from "./modules/banner";
// import myCards from "./modules/mycards";
// import page from "./modules/page";
import baseData from "./modules/baseData";
import dictionary from "./modules/dictionary";
import userInfo from "./modules/userInfo";
import initData from "./modules/initData";
import publicInfoStep from "./modules/publicInfoStep";
import driver from "./modules/driver";

// 注册 VUEX
Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        // init: init,
        // creditStatus: creditStatus,
        // banner: banner,
        // myCards: myCards,
        // page: page,
        baseData: baseData,
        dictionary,
        userInfo,
        initData,
        publicInfoStep,
        driver,

    }
});

export default store;
