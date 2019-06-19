import util from "@/utils/index";
import storage from "@/utils/storage";

//请求基本参数

const baseData = {
    state: {
        ver: "信用卡中心", //	字符串	Y	当前客户端版本名称
        verno: "1.0.0", //	字符串	Y	当前客户端版本号，从1开始，每升级一个版本加1
        deviceId: "", //	字符串	Y	手机设备号
        deviceType: "", //	字符串	Y	设备类型：1:android，2:iphone
        timestamp: "", //	字符串	Y	时间戳，格式：yyyyMMddHHmmss
        productId: "1002", //	字符串	Y	来源产品ID，暂定：1002
        channelId: "weibo", //	字符串	Y	来源渠道ID，暂定：1001
        deviceToken: "", //	字符串	Y	android个推的clientId  iphone 个推的deviceToken
        token: storage.get('token'), //	String	Y	用户Token
        uid: "",
        jfchannel: "" //渠道
    },
    mutations: {
        baseData_set: ( state, obj ) => {
            if (util.isObject(obj)) {
                state = obj;
                // 缓存token
                storage.set({token: obj.token})
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
