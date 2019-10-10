import Vue from 'vue'
import util from '@/utils'
import AppBridge from "@/services/AppBridge.js"

export default {
    data() {
        return {
            mjbCompanyName: '江苏沭阳东吴村镇银行股份有限公司', //公司主体
            simpleMjbCompanyName: '江苏沭阳', //公司简称
            appName2: '极速熊猫', //app包名，跟appName区分
        }
    },
    beforeCreate() {
        let self = this;
        if (!!util.getParams("appVersion")) {
            if (window.isGetAppName2) return;
            AppBridge.getInitData({}, res => {
                if (res.code == '200' && res.data && res.data.config && typeof res.data.config.app_name != 'undefined') {
                    this.appName2 = res.data.config.app_name;
                    window.sinaif_global.appName2 = res.data.config.app_name;
                }

                window.isGetAppName2 = this.appName2;
                console.log('this.appName2', this.appName2)
            })
        }
    },
}
