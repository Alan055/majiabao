import Vue from 'vue'
import util from '@/utils'

let browser = util.browser.versions
let appName2 = browser.android ? '熊猫有钱' : '极速熊猫贷款';
export default {
    appName2: appName2,
    data() {
        return {
            mjbCompanyName: browser.android ? '中盟盛世投资控股（深圳）有限公司' : '包头市包银消费金融股份有限公司', //公司主体
            simpleMjbCompanyName: browser.android ? '中盟盛世' : '包银消费金融', //公司简称
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
