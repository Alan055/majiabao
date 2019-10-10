import util from "@/utils/index";
import storage from "@/utils/storage";

//用户信息相关的数据

const user = {
    state: {
      // 从localStorage读取数据
      userInfo: storage.getJson('userInfo')
    },
    mutations: {
        user_set(state, obj) {
            if (util.isObject(state)) {
                state = util.mergeObj(state, obj);
            } else {
                console.error(`state mast be a object!`);
            }
        },
        setUserInfo(state, data = {}) {
          state.userInfo = data
          storage.setJson({userInfo: data})
        }
    },
    actions: {},
    getters: {
        user_get: state => state,
        userInfo: state => state.userInfo,
    }
};

export default user;
