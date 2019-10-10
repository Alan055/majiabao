import Vue from 'vue'
import util from '@/utils'
import AppBridge from "@/services/AppBridge.js"
import api from "@/services/api";
import qs from 'qs'
import rest from "../services/rest";


let defaultAppName = '极速熊猫';

//app 整体全局变量
window.sinaif_global = {
    appName: ''
};

Vue.mixin({
    data() {
        return {
            thirdproductsStatus: '0', //三級商戶状态 -1：未申请，0:已申请， 1:已撤销
            insertBeforeIframeCount: 1, //循环设置插入贷超次数
            marketUserStatsus: 1, //1.未登录 2.已登录未提交公共资料 3.有分发一二级商户 4.未分发商户 5.一二级商户全部被拒
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
                window.isGetAppName = true;

            })
        } else {
            setTimeout(() => {
                this.appName = defaultAppName;
                window.sinaif_global.appName = defaultAppName;
                //document.title = defaultAppName
            }, 0);
        }
    },

    methods: {
        /**
         * 三级商户和贷超显示顺序问题
         */
        insertBeforeIframe(thirdproductsStatus, marketUserStatsus) {
            let $iframeSection = document.getElementById("iframeSection");
            let $offlineProduct = document.getElementById("offlineProduct");

            //let $iframeSection = this.$refs.iframeSection;
            //let $offlineProduct = this.$refs.offlineProduct;

            //console.log('$thirdproductsStatus', thirdproductsStatus)
            //console.log('$marketUserStatsus', marketUserStatsus)
            if ($iframeSection && $offlineProduct) {
                //未申请三级商户 且 有分发一二级商户 且未全部被拒
                if ((thirdproductsStatus == -1 || thirdproductsStatus == 1) && marketUserStatsus == 3) {
                    $iframeSection.parentNode.insertBefore($offlineProduct, $iframeSection);
                    console.log('满足将三级商户前置的条件，并已前置')
                }
            } else {
                if (this.insertBeforeIframeCount < 10) {
                    setTimeout(() => {
                        this.insertBeforeIframe(thirdproductsStatus, marketUserStatsus);
                        this.insertBeforeIframeCount++;
                    }, 1000)
                }
            }
        },
        /**
         * 导流前置操作-联合登录
         * @param url 请求接口
         * @returns {function(*=, *=): *}
         * @constructor
         */
        //分流前置操作
        beforeDriver(url) {

            if (!url) return

            // url = 'http://api.sinawallent.com/app/sys/unionLoginRz?params={"loginProduct":"2001",channelId:"king2001"}'

            let search = url.split('?')[1] || ''
            search = search.split("#")[0] //去掉hash
            let args = qs.parse(search) || ''

            let request = (url, data, method) => {
                return function(params, options) {
                    return rest.emptyRequest(url, data, options, method);
                };
            }

            let path = (url.indexOf('?') != -1) ? url.split('?')[0] : url

            //  let data=args && args.hasOwnProperty('params') ? {params: args.params}: {}

            console.error('path========>', path);
            console.error('args===>', args);

            request(path, args, 'get')().then(res => {

            }).catch(e => {
                console.error('接口请求异常', e);
            })
        },

    },
    watch: {
        "homeData.thirdproducts.status" (newVal, oldVal) {
            console.log('thirdproducts newVal', newVal)
            this.thirdproductsStatus = newVal;
            this.insertBeforeIframe(newVal, this.marketUserStatsus)
        },
        "marketUserStatsus" (newVal, oldVal) {
            console.log('marketUserStatsus newVal', newVal)
            this.insertBeforeIframe(this.thirdproductsStatus, newVal)
        },
    }

})