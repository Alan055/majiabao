import util from "../../utils/index";

//用户信息相关的数据

const page = {
    state: {
        background: "#f2f2f2",
        hasFooter: true
    },
    mutations: {
        page_set({ state, commit }) {
            if (util.isObject(state)) {
                commit(state);
            } else {
                console.error(`state mast be a object!`);
            }
        }
    },
    actions: {},
    getters: {
        page_get: state => state
    }
};

export default page;
