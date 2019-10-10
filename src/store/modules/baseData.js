import util from "@/utils/index";
import storage from "@/utils/storage";

//请求基本参数

const baseData = {
    state: {
        ver: util.getParams('appVersion') || '', //	字符串	Y	当前客户端版本名称
        verno: util.getParams('verno') || '', //	字符串	Y	当前客户端版本号，从1开始，每升级一个版本加1
        deviceId: util.getParams('deviceId') || '', //	字符串	Y	手机设备号
        deviceType: util.browser.versions.android ? "1" : "2", //	字符串	Y	设备类型：1:android，2:iphone
        timestamp: "", //	字符串	Y	时间戳，格式：yyyyMMddHHmmss
        productId: "", //	字符串	Y	来源产品ID，暂定：1002
        channelId: util.getParams('channelId') || '', //	字符串	Y	来源渠道ID，暂定：1001
        deviceToken: "", //	字符串	Y	android个推的clientId  iphone 个推的deviceToken
        token: storage.get('token') || '', //	String	Y	用户Token
        uid: "",
        mjbname: util.getParams('mjbname') || ''
    },
    mutations: {
        baseData_set: (state, obj) => {
            if (util.isObject(obj)) {
                state = obj;
                // 缓存token
                storage.set({
                    token: obj.token
                })
            } else {
                console.error(`state mast be a object!`);
            }
        }
    },
    actions: {
        baseData_action: () => {
            baseData_set();
        }
    },
    getters: {
        baseData_get: state => {
            return state;
        }
    }
};

export default baseData;
