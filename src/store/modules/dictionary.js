//数据字典
import util from '@/utils'
import api from '@/services/api'
import AppBridge from '@/services/AppBridge'
import {
    resolve
} from 'path';

// warn: dictionary是只读的，不可操作

const dictionary = {
    state: {},
    mutations: {
        // // deprecated
        // set_dictionary(state, data) {
        //   if(!data) return
        //   state = util.extend(state, data)
        // },
        // // 设置数据字典
        // setDictionary(state, data = []) {
        //   let source = {}
        //   Object.keys(data).forEach(key => {
        //     if (util.isArray(data[key])) {
        //       source[key] = data[key].map(item => ({ text: item.pname, value: item.pcode }))
        //     }
        //   })
        //   state = util.extend(state, source)
        // },
        // 以serviceType为索引
        setServiceType(state, {
            serviceType,
            data
        }) {
            state[serviceType] = data.map(item => ({
                text: item.pname,
                value: item.pcode
            }))
        }
    },
    actions: {
        async fetchServiceType({
            commit,
            state
        }, serviceType) {
            if (state[serviceType]) return state[serviceType]
            let data
            if (AppBridge.isApp) {
                data = await new Promise(resolve => {
                    AppBridge.getInitData({
                        type: serviceType
                    }, res => {
                        if (res.data[serviceType]) {
                            resolve(res.data[serviceType])
                        } else {
                            resolve();
                        }
                    })
                })
                console.log('  ----------->>>> ', data)
                if (!data) {
                    data = await api.dictionary({
                        servicetype: serviceType
                    }).then(res => res.data)
                    console.log('data await ----------->>>> ', data)
                }
            } else {
                data = await api.dictionary({
                    servicetype: serviceType
                }).then(res => res.data)
            }
            commit('setServiceType', {
                serviceType,
                data
            })
            return state[serviceType]
        }
    },
    getters: {
        dictionary: state => {
            return state;
        }
    }
};

export default dictionary