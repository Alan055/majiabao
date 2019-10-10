import Vue from 'vue'
import util from '@/utils'

let browser = util.browser.versions
let appName2 = browser.android ? '熊猫信用' : '熊猫信用';
export default {
    appName2: appName2,
    data() {
        return {
            mjbCompanyName: browser.android ? '志丹民生村镇银行股份有限公司' : '志丹民生村镇银行股份有限公司', //公司主体
            simpleMjbCompanyName: browser.android ? '民生村镇银行' : '民生村镇银行', //公司简称
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
