
/**
 * 导流联合登录
 */
const baseData = {
    state: {

        //小球导流
        xm_driverSuspensionWindowConfig: {
            imgurl: "",
            unloginUrl: "",
            type: "",
            showmodel: "",
            tipCount: 0,
            url: ""
        },

        //弹窗导流
        xm_driverPopConfig: {
            imgurl: "",
            unloginUrl: "",
            type: "",
            showmodel: "",
            tipCount: 0,
            url: ""
        },

        //new卡
        xm_newcardsconfig: {
            unloginUrl: "",
            type: "1",
            showmodel: "2",
            url: ""
        },

        //拒件列表
        refuseList: {},

    },
    mutations: {

        //设置导流
        setDriverConfig(state, {key, data}) {
            let obj = {}
            obj[key] = data
            Object.assign(state, obj)
        },


    },
    actions: {},
    getters: {}
};

export default baseData;
