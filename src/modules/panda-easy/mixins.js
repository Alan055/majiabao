import Vue from 'vue'
import util from '@/utils'
import AppBridge from "@/services/AppBridge.js"

export default {
    data() {
        return {
            mjbCompanyName: '中盟盛世投资控股(深圳)有限公司', //公司主体
            simpleMjbCompanyName: '中盟盛世', //公司简称
            appName2: '熊猫容易贷', //app包名，跟appName区分
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