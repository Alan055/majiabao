import {MessageBox} from '@/utils/helper';
import AppBridge from '@/services/AppBridge.js';
import helper from "@/utils/helper";
import {Indicator, Toast} from "@/utils/helper";
import qs from "qs";
import util from "@/utils";

/**
 * H5本地调试：
 *   使用方法:
 1.访问： my/index.html#/about/weinre
 2.安装weinre：npm -g install weinre
 3.启动服务： weinre --httpPort  端口 --boundHost IP地址 （ weinre模式如关闭，可跳过此项）
 例如：weinre --httpPort  9999 --boundHost 192.168.8.115

 *     说明：
 *       1.当【本地调试模式】 开启后，将访问对应 本地服务模块（当模块端口没有填写，默认访问远程，并有tips提醒）
 *       2.当 【weinre模式】 开启后， vConsole 默认不显示
 *       3.建议开发中，根据业务需要，填写对应模块模块。不要全部填写（因为很吃内存）
 */
export default {

    data() {
        return {
            configData: null
        }
    },

    mounted() {

        //如果当前是线上地址，并且是调试模式，那么跳转到本地对应服务
        helper.get('webDebugSetting').then(res => {

            if (res && res.isOpen) {
                let sourceUrl = window.location.href

                if (sourceUrl.indexOf(res.host) == -1) {

                    this.configData = res

                    let splitUrl = sourceUrl.split(`?`),
                        http = splitUrl[0].split('pages'),  //获取域名
                        module = http[1].split('/')[1]; //获取模块

                    let item2 = this.configData.modules.filter(item => {
                        return item.title.toLowerCase() == module.toLowerCase()
                    })

                    //本地服务没有开启，直接走远程
                    if (!item2.length || !item2[0].value) {
                        Toast(`本地模块：${module}服务未开启，当前是远程访问`)
                        return ''
                    } else {

                        helper.set('flagTips', `已由远程页面跳转到本地服务`)
                        this.openUrl(this._debugParseUrl(res, sourceUrl) || sourceUrl)
                    }
                }
            }
        })
        this.checkDebugTips()

        this.$nextTick(() => {

            let firstLoad = true;
            let secondLoad = false;
            let vConsoleObj = null;

            let statistics = {
                first: '',
                second: '',
                third: '',
                count: 0
            }

            let loadLogResource = function () {

                // if (firstLoad) {
                firstLoad = false;
                const btnStyle = 'display: inline-block;width: 47px;height: 25px;line-height: 25px;border: 1px solid #ccc;';
                const html = "<div id='log-preload' style='position: fixed;top: 45px;left: 50%;z-index: 1209;width:280px;height: 120px;line-height:8px;padding:16px;-webkit-transform: translateX(-50%);text-align: center;background-color: #fff;box-shadow: 0 0 10px #888;' class='log-preload slideLeft'><p style='margin-top:10px;'>请输入log密码?</p><P><input id='sinaifLogPwd' type='number' oninput=\"if(value.length>8)value=value.slice(0,8)\" style='width: 80%; height:30px; margin: 8px 0; border: 1px solid #ccc;' /> </P><div><div style='" + btnStyle + "margin-right:20px;' id='yesLog'>确定</div><div style='" + btnStyle + "' id='noLog'>关闭</div></div></div>";
                let div = document.createElement('div');
                div.innerHTML = html;
                document.body.appendChild(div);
                document.getElementById('yesLog').addEventListener('touchstart', function () {

                    let pwd = document.getElementById('sinaifLogPwd').value

                    if (pwd === '88888888') {

                        //再次唤起，关闭
                        let res = localStorage.getItem('openProdLog')
                        if (res && res == 1) {
                            localStorage.removeItem('openProdLog')
                            window.location.reload()
                            return
                        }

                        secondLoad = true
                        document.getElementById('log-preload').style.display = 'none';

                        vConsoleObj = require("@/assets/lib/console/vconsole.min.js").VConsole;
                        new vConsoleObj()


                        localStorage.setItem('openProdLog', 1)
                        window.location.reload()


                    }
                });
                document.getElementById('noLog').addEventListener('touchstart', function () {
                    document.getElementById('log-preload').style.display = 'none';
                    statistics.count=0
                });
            };

            // loadLogResource()

            let triggerLog = function (callback) {
                let first = {
                    x: 0,
                    y: document.documentElement.clientHeight
                };
                let second = {
                    x: document.documentElement.clientWidth / 2,
                    y: 0
                };
                let third = {
                    x: document.documentElement.clientWidth,
                    y: document.documentElement.clientHeight
                };
                let flag1;
                let flag2;
                let distance = 80;


                document.addEventListener('touchmove', (e) => {
                    if (flag1 && Math.abs(e.targetTouches[0].clientX - second.x) < distance && Math.abs(e.targetTouches[0].clientY - second.y) < distance) {
                        flag2 = true;
                    }
                    if (flag2 && Math.abs(e.targetTouches[0].clientX - third.x) < distance && Math.abs(e.targetTouches[0].clientY - third.y) < distance) {

                        statistics.count++

                        if (statistics.count == 3) {
                            callback && callback()
                        }

                        console.log('statistics.count===>', statistics.count);

                        flag1 = flag2 = false;

                    }
                });
                document.addEventListener('touchend', (e) => {

                    flag1 = flag2 = false;
                });
                document.addEventListener('touchstart', (e) => {

                    flag1 = flag2 = false;

                    if (Math.abs(e.targetTouches[0].clientX - first.x) < distance && Math.abs(e.targetTouches[0].clientY - first.y) < distance) {
                        flag1 = true;
                        e.preventDefault();
                    }
                });
            };

            triggerLog(loadLogResource)

        })

    },
    methods: {

        /**
         * URL 解析
         * @param sourceUrl
         */
        _debugParseUrl(webDebugSetting, sourceUrl) {

            let splitUrl = sourceUrl.split(`?`),
                http = splitUrl[0].split('pages'),  //获取域名
                currentPoint = '', //当前端口
                module = http[1].split('/')[1]; //获取模块

            //目标页面已经是本地服务，直接返回
            if (http[0].indexOf(webDebugSetting.host) != -1) {
                return ``
            }

            let urlJSON = qs.parse(splitUrl[1]); //获取URL参数

            //APP传递的参数，过滤掉  'fromUserId','token' 保留
            let filterArr = ['channel', 'appVersion', 'deviceId', 'verno', 'mjbname', 'sinaifiosauditing',],
                webArgs = {}

            Object.keys(urlJSON).map(item => {
                if (filterArr.indexOf(item) == -1) webArgs[item] = urlJSON[item]
            })

            webArgs = qs.stringify(webArgs)


            let item2 = this.configData.modules.filter(item => {
                return item.title.toLowerCase() == module.toLowerCase()
            })


            //本地服务没有开启，直接走远程
            if (!item2.length || !item2[0].value) {
                helper.set('flagTips', `本地模块：${module}服务未开启，当前是远程访问`)

                //let VConsole = require("../assets/lib/console/vconsole.min.js").VConsole;
                //new VConsole()
                return ''
            }

            currentPoint = item2[0].value
            let currentDomain = splitUrl[0].replace(http[0], `${this.configData.host}:${currentPoint}/`)

            //有一种特殊情况，URL 是服务端下发，没有一些必传参数，可能需要做拼接
            let tempArr = qs.parse(webArgs), requiredKeyList = ['fromUserId', 'token'], requireFlag = false

            requiredKeyList.map(item => {

                let urlValue = util.getParams(item) || ``

                if (!tempArr.hasOwnProperty(item) && !urlValue) {
                    requireFlag = true
                    return
                }
                tempArr[item] = urlValue || tempArr[item]
            })


            if (requireFlag) {
                helper.set('flagTips', `因缺少URL必传参数：${item}，默认远程访问`)
                return ''
            }

            webArgs = qs.stringify(tempArr)
            console.error('本地地址：==========>');
            console.error(`${currentDomain}?${webArgs}`);
            return `http://${currentDomain}?${webArgs}`

        },

        /**
         * debug 模式，将远程URL 映射到本地URL
         */
        _h5debug(sourceUrl, callback) {
            helper.get('webDebugSetting').then(res => {

                if (!res || !res.isOpen) {
                    return callback(sourceUrl)
                }
                this.configData = res
                callback(this._debugParseUrl(res, sourceUrl) || sourceUrl)

            })
        },

        /**
         * 检查tips
         */
        checkDebugTips() {
            helper.get('flagTips').then(res => {
                if (res) {
                    Toast(res)
                    helper.remove('flagTips')
                }
            })


            /*helper.get('openProdLog').then(res => {
                if (res && res==1) {
                   let vConsoleObj = require("@/assets/lib/console/vconsole.min.js").VConsole;
                    new vConsoleObj()
                }
            })*/

        },
    },

}
