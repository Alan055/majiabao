import util from "../../utils/index";

//用户信息相关的数据

const myCards = {
    state: {},
    mutations: {
        myCards_set(state, obj) {
            if (util.isObject(obj)) {
                state = util.mergeObj(state, obj);
            } else {
                console.error(`state mast be a object!`);
            }
        }
    },
    actions: {},
    getters: {
        myCards_get: state => {
            return state;
        }
    }
};

export default myCards;
