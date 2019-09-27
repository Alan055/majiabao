//数据字典
import util from '@/utils'

const userInfo = {
  state: {},
  mutations: {
    setUserInfo(state, data) {
      if(!data) return
      state = util.extend(state, data)
    }
  },
  actions: {},
  getters: {
    userInfo: state => {
      return state;
    }
  }
};

export default userInfo


