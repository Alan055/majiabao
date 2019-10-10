import Vue from 'vue'
import util from '@/utils'

let appName2 = '熊猫贷款';
export default {
    appName2: appName2,
    data() {
        return {
            mjbCompanyName: '西安国报融华网络借贷信息中介服务有限公司', //公司主体
            simpleMjbCompanyName: '西安国报融华', //公司简称
            appName2: appName2, //app包名，跟appName区分
        }
    },
    beforeCreate() {
        let self = this;
        if (!!util.getParams("appVersion")) {
            if (window.isGetAppName2) return;
            this.$AppBridge.getInitData({}, res => {
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