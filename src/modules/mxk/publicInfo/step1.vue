<template>
    <div class="view-step1 view-public-info-step c-bg-gray" ref="view">
        <div class="c-view-content" ref="content">
            <div class="content-wrap">

                <div class="id-card-input c-section">
                    <div class="c-flex-row">

                        <div class="c-flex-item" v-sina-ads="stat.publicInfo.idCard.pos">
                            <p class="title">身份证人像面</p>
                            <photo-scan v-model="formData.posimageurl" :readonly="!cardImageEditable"
                                        :ocr="cardNumberEditable"
                                        :showblur='showBlur2' type="front" v-on:idinfoChange="resolveFileId"
                                        ref="idCardFront"
                                        name="posimageurl" v-validate="'required'">
                                <img slot="default-img" src="~@/assets/images/publicInfo/renxiang.png" alt="">
                            </photo-scan>
                        </div>
                        <div class="c-flex-item" v-sina-ads="stat.publicInfo.idCard.opp">
                            <p class="title">身份证国徽面</p>
                            <photo-scan v-model="formData.oppimageurl" :readonly="!cardImageEditable" type="back"
                                        :showblur='showBlur'
                                        v-on:idinfoChange="resolveFileId" ref="idCardBack" name="oppimageurl"
                                        v-validate="'required'">
                                <img slot="default-img" src="~@/assets/images/publicInfo/guohui.png" alt="">
                            </photo-scan>
                        </div>
                        <div class="c-mask" v-if="cardImageEditable && !formData.posimageurl && !formData.oppimageurl"
                             @click="scanIdCard" v-sina-ads="stat.publicInfo.idCard.mask"></div>
                    </div>
                </div>
                <div class="error-tip">
                    <p
                        v-if="errorInfo.posandopp && ((fields.posimageurl && !fields.posimageurl.dirty) || (fields.oppimageurl && !fields.oppimageurl.dirty))">
                        {{errorInfo.posandopp}}</p>
                    <p v-else-if="errorInfo.posimageurl && fields.posimageurl && !fields.posimageurl.dirty">
                        {{errorInfo.posimageurl}}</p>
                    <p v-else-if="errorInfo.oppimageurl && fields.oppimageurl && !fields.oppimageurl.dirty">
                        {{errorInfo.oppimageurl}}</p>
                </div>

                <div class="c-section" v-if="formData.posimageurl" @click="watchResize">

                    <form-control title="真实姓名" v-model="formData.cardname" maxlength="15" :disabled="identityIsReadonly"
                                  :readonly="identityIsReadonly" v-sina-ads="stat.publicInfo.idCard.idName"/>
                    <form-control title="身份证号" v-model="formData.cardno" maxlength="18" :disabled="identityIsReadonly"
                                  :readonly="identityIsReadonly" v-sina-ads="stat.publicInfo.idCard.idNumber"/>
                </div>

                <div class="c-button-group">
                    <mt-button type="primary" size="large" class="btn-lg btn-primary btn-round" @click.native="submit()"
                               v-sina-ads="stat.publicInfo.idCard.submit" :disabled="!finished">{{sendBack ? '提交' :
                        publicInfoStep.btnText}}
                    </mt-button>
                </div>

                <ServiceLink v-if="onlineServiceURL" :link="onlineServiceURL"/>

            </div>

        </div>

        <div class="bottom-info">
            <img class="c-icon" src="~@/assets/images/publicInfo/ba_cg@2x.png" alt=""> 新浪智能加密，保障您的信息安全
        </div>

    </div>
</template>

<script>
    import api from "@/services/api";
    import util from "@/utils";
    import helper from "@/utils/helper";
    import {Toast, Indicator, MessageBox} from "@/utils/helper";
    import {mapGetters, mapState, mapMutations} from "vuex";
    import stepProgress from "./components/stepProgress";
    import photoScan from "./components/photoScan";
    import AppBridge from "@/services/AppBridge.js";
    import EventBus from "@/services/EventBus";
    import {
        checkCameraPermission,
        resolveErrorInfo
    } from "./services/stepService";
    import DefendClick from "@/utils/DefendClick";
    import formControl from "@/components/common/formControl";
    import _ from "lodash";

    import "./style/index.scss";

    import ServiceLink from '@/components/business/serviceLink'

    let TweenLite = require("@/assets/lib/gsap/TweenLite.min.js").TweenLite;

    let stepMixin = require('./components/stepMixin')
    export default {
        mixins: [stepMixin.default],
        name: "step1",
        data() {
            return {

                onlineServiceURL: '',


                //身份证信息是否只读
                identityIsReadonly: true,

                recognitionType: -1,  //人脸识别方式？0-依图 1-face++

                errorInfo: {}, //返件错误信息

                formData: {
                    //身份信息
                    cardname: "", //姓名
                    cardno: "", //身份证号码
                    oppimageid: "", //反面照ID
                    oppimageurl: "", //反面照URL
                    posimageurl: "", //正面照URL
                    posimageid: "" //正面照ID
                },
                originalData: {},
                remoteData: {},
                starttime: "",
                defendClick: new DefendClick(),
                sendBack: util.getParams("stageid") == 2, // 1.补件 2.返件
                formServerData: false, //是否是从服务器获取数据的标识符
                showBlur: false, //是否是从服务器获取数据的标识符
                cardname: '', // 缓存的姓名
                cardno: '',   //缓存的卡号
                deleteTag: {
                    name: false,
                    no: false
                } //删除标识符
            };
        },
        computed: {

            // 是否有修改
            changed() {
                // 返件时，必须修改所有问题字段
                if (this.sendBack) {
                    let changed = true;
                    let keys = _.clone(this.errorInfo);

                    // 检测到posandopp, 将pos和opp添加到检查集合
                    if (keys.hasOwnProperty("posandopp")) {
                        keys.posimageurl = true;
                        keys.oppimageurl = true;
                        delete keys.posandopp;
                    }
                    keys = Object.keys(keys);

                    // 检查问题字段是否有修改
                    keys.forEach(key => {

                        //荔枝V1.1需求，身份认证页面，删除了活体认证,所以这里不再校验mediaid
                        if (key.toLowerCase() != 'mediaid') {

                            // 只要有一个未修改，即返回false
                            if (this.formData[key] === this.remoteData[key]) {
                                changed = false;
                            }
                        }

                    });
                    return changed;
                } else {
                    return !_.isEqual(this.formData, this.remoteData);
                }
            },
            //下一步点亮
            finished() {
                let {
                    cardname,
                    cardno,
                    oppimageid,
                    posimageid
                } = this.formData;

                let finished = cardname && cardno && oppimageid && posimageid;

                console.error('下一步点亮', this.formData);
                console.log('return===>', !this.sendBack);

                return finished && (!this.sendBack || this.changed) && this.isSubmit1;
            },
            // 身份证姓名和号码是否可修改
            cardNumberEditable() {
                // -1: 异常，0：未通过，1：通过，2：销户
                return this.originalData.authstatus != 1;
                // return false
            },
            // 身份证照片是否可修改
            // 照片修改后，如果身份证号码不可修改，不要做识别
            cardImageEditable() {
                return this.originalData.authImage != 0;
            },
            showBlur2() {
                return this.showBlur;
            },
        },
        methods: {


            // 处理返回
            handleBack() {

                document.activeElement.blur();

                this.sinaAds.click(this.stat.publicInfo.idCard.back);

                if (this.sendBack) return this.$root.closeWindow();

                let messageBoxType = [1]; //标记弹窗类型不为:messageBox

                if (this.publicInfoStep.backDialog) {

                    //弹窗类型不为messageBox
                    if (messageBoxType.indexOf(this.publicInfoStep.backDialog.type) != -1) {

                        let data = Object.assign({}, this.publicInfoStep.backDialog, {
                            visibility: true,
                            isNeedOpen:true
                        })

                        //返回保存历史数据
                        this.setLocalStorage();
                        this.setBackDialog(data)
                        return
                    }

                    let {title, button, desc} = this.publicInfoStep.backDialog.data

                    MessageBox({
                        title: title,
                        message: desc,
                        showCancelButton: true,
                        confirmButtonText: button[1],
                        cancelButtonText: button[0],
                    }).then(action => {
                        if (action == "cancel") {
                            this.sinaAds.click(this.stat.publicInfo.idCard.leave);
                            this.setLocalStorage();
                            this.$root.backHome();

                        } else {
                            this.sinaAds.click(this.stat.publicInfo.idCard.continue);
                        }
                    });
                    return
                }

                this.setLocalStorage();
                this.$root.backHome();

            },


            //获取客服链接地址
            getServiceLink() {

                AppBridge.getInitData({type: 'pageaddress'}, res => {

                    if (res.code === '200' && res.data && res.data.pageaddress && res.data.pageaddress.length) {

                        let list = (typeof  res.data.pageaddress != 'string') ? res.data.pageaddress : JSON.parse(res.data.pageaddress)

                        list.map((item, index) => {

                            if (item.type === 'ONLINESERVICE' && item.showmodel === '2') {

                                this.onlineServiceURL = item.url
                                return

                            }
                        })
                    }
                })
            },


            /**
             * 1.身份证开关设置，是否可修改从服务端下发
             * 2. 活体调用类型 从服务端下发
             */
            configSetting() {

                AppBridge.getInitData({}, res => {

                    console.error('服务器设置==>', res.code, res.data.config);

                    //身份证设置
                    if (res.code == '200' && res.data && res.data.config && typeof res.data.config.can_update_idcard != 'undefined') {

                        this.identityIsReadonly = res.data.config.can_update_idcard == '0' ? true : false

                    } else {
                        console.error('服务器未设置身份证开关，默认关闭');
                        this.identityIsReadonly = true
                    }

                    //活体类型  人脸识别方式？0-依图 1-face++
                    if (res.code == '200' && res.data && res.data.config && typeof res.data.config.face_recognition_method != 'undefined') {

                        console.error('活体类型 人脸识别方式==》' + res.data.config.face_recognition_method);

                        //识别方式
                        this.recognitionType = res.data.config.face_recognition_method
                    }
                })
            },

            /*
            * 掩码处理
            * type == 1 姓名掩码
            * type == 2 身份证掩码
            */
            maskInfo(type) {
                if (type == 1) {
                    let value = this.formData.cardname;
                    if (!value) return "";
                    let length = value.length - 1;
                    let str = '';
                    for (let i = 0; i < length; i++) {
                        str += '*';
                    }
                    ;
                    return `${value.substring(0, 1)}${str}`;
                } else if (type == 2) {
                    let val = this.formData.cardno;
                    if (!val) return "";
                    return `${val.substring(0, 3)}***********${val.substring(
                        val.length - 4
                    )}`;
                }
            },

            submit() {

                if (!this.isSubmit1) {
                    console.log('重复提交');
                    return
                }

                //提交之前，判断是否删除过
                // 未删除过,回显数据
                console.log("name Tag" + !this.deleteTag.name);
                console.log("no Tag" + !this.deleteTag.no);
                if (!this.deleteTag.name) {
                    this.formData.cardname = this.cardname;
                }
                ;
                if (!this.deleteTag.no) {
                    this.formData.cardno = this.cardno;
                }
                ;
                console.log(`提交前的数据` + this.formData.cardname);
                console.log(`提交前的数据` + this.formData.cardno);
                //身份证已拍摄，未输入姓名选择提交提示
                if (!this.formData.posimageid) return;
                // 4-30 非英文或数字，可以有中间点·
                if (!/^[·\u4e00-\u9fa5]{2,15}$/.test(this.formData.cardname))
                    return Toast("请输入您的真实姓名");
                // 15或18位数字，最后一位可为x或X
                if (!/^(?:\d{14}|\d{17})[\dXx]$/.test(this.formData.cardno))
                    return Toast("请输入正确的身份证号码");

                if (!this.finished) return;

                // 非返件时，获取服务端数据且未做修改，直接下一步
                if (!this.sendBack && !this.changed) {
                    Indicator.open();
                    this.next("step2");
                    return;
                }

                let data = {
                    endtime: new Date().getTime(),
                    starttime: this.starttime,
                    entertype: 2, //信息录入方式，1:手动,2face++识别
                    sourcetype: 1, //资料项来源	1、公共、2、补件 3、返件
                    clienttype: 1 //客户端类型，2代表H5
                };
                data = util.extend({}, this.formData, data);

                // 返件
                if (this.sendBack) {
                    data.sourcetype = 3;
                    data.orderid = util.getParams("orderid");
                }

                Indicator.open();
                api.publicInfo
                    .saveIdCard(data)
                    .then(res => {
                        if (res.code == "1200006") {
                            MessageBox({
                                title: "温馨提示",
                                message: res.msg,
                                confirmButtonText: "我知道了",
                                closeOnClickModal: false
                            });

                            this.isSubmit1 = true

                        } else if (helper.isSuccess(res)) {
                            this.next("step2");
                        }
                    })
                    .finally(Indicator.close);
            },
            //获取身份证扫描图片ID
            resolveFileId(obj) {
                console.log("id info changed", JSON.stringify(obj));
                if (obj.type == "front") {
                    this.formData.posimageid = obj.fileId;
                    // face++识别数据
                    if (obj.idCard) {
                        this.formData.cardname = obj.name;
                        this.formData.cardno = obj.idCard;
                        this.deleteTag.name = true;
                        this.deleteTag.no = true;
                    }
                } else if (obj.type == "back") {
                    this.formData.oppimageid = obj.fileId;
                }
            },


            //数据校验
            //身份信息数据校验
            validation(obj) {
                let reg = new Reg("/[]$/");
                if (!reg.test(obj.name)) {
                    return "请输入您的真实姓名";
                } else if (obj.idCard == "") {
                    return `请输入正确的身份证号码`;
                }
            },
            //检查formatDate里面是否有正确数据,有正确数据即可
            checkData(obj) {
                let tag = false;
                let ingoreType = [
                    "entertype",
                    "sourcetype",
                    "clienttype",
                    "updatetime",
                    "endtime",
                    "starttime"
                ];
                //判断有真实数据才存到存储中
                for (let i in obj) {
                    if (ingoreType.indexOf(i) == -1) {
                        if (obj[i] != "") {
                            tag = true;
                        }
                    }
                }
                return tag;
            },
            //获取远程数据
            fetchData() {
                return api.publicInfo
                    .getUserBaseInfo({
                        retype: "1",
                        orderid: util.getParams("orderid")
                    })
                    .then(res => {
                        if (res.code == 200 && res.data && res.data.idCard) {
                            //打上 服务器标识符
                            this.formServerData = true;
                            this.showBlur = true;
                            this.originalData = res.data.idCard;
                            // 缓存卡号和姓名
                            this.cardname = res.data.idCard.cardname;
                            this.cardno = res.data.idCard.cardno;
                            this.formData = this.format(res.data.idCard);


                            this.remoteData = _.cloneDeep(this.formData);
                            // 姓名和卡号打掩码
                            if (this.formData.cardname) {
                                this.formData.cardname = this.maskInfo(1);
                            }

                            if (this.formData.cardno) {
                                this.formData.cardno = this.maskInfo(2);
                            }
                            ;
                            this.errorInfo = resolveErrorInfo(
                                res.data.returnRecordList,
                                1
                            );


                        }
                    })
            },
            // 数据转换
            format(data) {
                let {
                    cardname,
                    cardno,
                    oppimageid,
                    oppimageurl,
                    posimageurl,
                    posimageid
                } = data;
                return {
                    cardname,
                    cardno,
                    oppimageid,
                    oppimageurl,
                    posimageurl,
                    posimageid
                };
            },
            // 监听formData变化
            startWatch() {
                // this.$watch("formData", this.setLocalStorage, { deep: true });
            },
            //保存到本地数据中
            setLocalStorage(value) {
                console.log("formData changed", this.formData);
                let userid = util.getParams("fromUserId");
                let _this = this;
                this.checkData(_this.formData) &&
                helper.set(`${userid}-IDinfo`, _this.formData);
            },
            // 首次扫描身份证
            async scanIdCard() {
                let permission = await this.defendClick.wrap(async () => {
                    return await checkCameraPermission(true);
                });
                console.log("permission", permission);

                // 没有权限时中断执行
                if (!permission) return;
                await this.$refs.idCardFront.scan();
                this.$refs.idCardBack.scan();
            },

            // 输入框获得焦点时监听resize，然后content向上滚动
            watchResize() {
                // 防止重复监听
                EventBus.$off("resize").$on("resize", () => {
                    console.log("resize");
                    // 缓动
                    TweenLite.to(this.$refs.content, 0.5, {scrollTop: 200});
                    EventBus.$off("resize");
                });
            },

            next(name) {
                if (this.sendBack) {
                    // 通知补件/返件刷新
                    AppBridge.notify({tag: "field"});
                    this.$root.closeWindow();
                } else {

                    // this.isSubmit1 = false
                    this.stepNext()
                }
            }
        },
        // 返回按钮拦截
        onBack() {

            this.handleBack()

        },
        components: {
            stepProgress,
            photoScan,
            formControl,
            ServiceLink,
        },
        watch: {

            // 去掉空格
            "formData.cardname"(value, oldVal) {
                // if (/ /.test(value)) {
                // 	this.$nextTick(() => {
                // 		this.formData.cardname = value.replace(/ /g, "");
                // 	});
                // };
                console.log(oldVal + (oldVal.length > value.length));
                console.log(value + value.includes("*"));
                //修改原因，从服务器获取数据,
                if ((oldVal.length > value.length) && value.includes("*") && !/ /.test(value)) {
                    this.$nextTick(() => {
                        this.formData.cardname = "";
                        console.error("打我了")
                        this.deleteTag.name = true;
                    });
                }
                else if (/ /.test(value)) {
                    this.$nextTick(() => {
                        this.formData.cardname = value.replace(/ /g, "");
                    });
                }
                ;
            },
            "formData.cardno"(value, oldVal) {
                // if (/ /.test(value)) {
                // 	this.$nextTick(() => {
                // 		this.formData.cardno = value.replace(/ /g, "");
                // 	});
                // }
                if ((oldVal.length > value.length) && value.includes("*") && !/ /.test(value)) {
                    this.$nextTick(() => {
                        this.formData.cardno = "";
                        this.deleteTag.no = true;
                    });
                }
                else if (/ /.test(value)) {
                    this.$nextTick(() => {
                        this.formData.cardno = value.replace(/ /g, "");
                    });
                }
                ;
            }
        },
        created() {

            this.starttime = new Date().getTime();

            this.getServiceLink()

            this.configSetting()

            // 获取远程数据
            this.fetchData()
                .finally(() => {

                    this.isSubmit1 = true

                    if (this.sendBack) return;

                    //非返件时，读取缓存
                    let userid = util.getParams()["fromUserId"];
                    helper.get(`${userid}-IDinfo`).then(value => {
                        // 合并参数，远程数据优先
                        this.formData = _.extendWith(
                            {},
                            // value,
                            this.formData,
                            (a, b) => {
                                return !b && b !== 0 ? a : b;
                            }
                        );
                    });
                })
                .finally(this.$root.loadingClose);

            // 监听window resize
            window.addEventListener("resize", () => {
                EventBus.$emit("resize");
            });
        },
        beforeRouteLeave(to, from, next) {
            EventBus.$off("resize");
            next();
        }
    };
</script>

<style lang="scss" scoped>

    .bottom-info{
        font-size: 12px;
        color: #666666;
        padding: 16px;
        text-align: center;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;

        .c-icon{
            @include size(16PX);
        }
    }


    div.bottom-info{
        position:fixed ;
        bottom: 0;
    }

    .view-step1 {
        overflow-x: hidden;

        //height: 100%;
        .id-card-input {
            padding: $gap;
            .c-flex-row {
                position: relative;
            }
            .c-flex-item:first-child {
                margin-right: 23px;
            }
            .title {
                font-size: $fontL;
                line-height: 24px;
                margin-bottom: 12px;
            }
            .photo-scan {
                width: 160px;
                height: 105px;
            }
        }
        .icon-done {
            margin-right: 6px;
        }
        .error-tip {
            font-size: 12px;
            color: #e72427;
            background: #f9e6e7;
            line-height: 24px;
            padding: 0 $gap;
        }
        .error-tip + .c-section {
            margin-top: 8px;
        }
    }
</style>
