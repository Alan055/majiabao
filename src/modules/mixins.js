import Vue from 'vue'
import util from '@/utils'
import AppBridge from "@/services/AppBridge.js"

let defaultAppName = '大王贷款';

//app 整体全局变量
window.sinaif_global = {
    appName: ''
};

Vue.mixin({
    data() {
        return {
            appName: ''
        }
    },
    beforeCreate() {
        let self = this;
        if (!!util.getParams("appVersion")) {
            if (window.isGetAppName) return;
            AppBridge.getInitData({}, res => {
                if (res.code == '200' && res.data && res.data.config && typeof res.data.config.app_name != 'undefined') {
                    this.appName = res.data.config.app_name;
                    window.sinaif_global.appName = res.data.config.app_name;
                    document.title = res.data.config.app_name;
                } else {
                    this.appName = defaultAppName;
                    window.sinaif_global.appName = defaultAppName;
                    //document.title = defaultAppName;
                }

                window.isGetAppName = this.appName;
                //console.log('this.appName', this.appName)
            })
        } else {
            setTimeout(() => {
                this.appName = defaultAppName;
                window.sinaif_global.appName = defaultAppName;
                //document.title = defaultAppName
            }, 0);
        }
    },
})