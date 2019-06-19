import util from "../../utils/index";

//用户信息相关的数据

const banner = {
    state: {},
    mutations: {
        banner_set(state, obj) {
            if (util.isObject(obj)) {
                state = util.mergeObj(state, obj);
            } else {
                console.error(`state mast be a object!`);
            }
        }
    },
    actions: {},
    getters: {
        banner_get: state => state
    }
};

export default banner;
