<template>
    <div class="view-step2 view-public-info-step c-bg-gray">
        <c-header title="联系人信息">
            <mt-button slot="left" @click="handleBack">
                <c-icon type="back"/>
            </mt-button>
        </c-header>

        <div class="c-view-content">
            <div class="content-wrap" v-min-height>
                <div class="c-section"></div>
                <div class="c-section">
                    <!--婚姻状态-->
                    <form-control
                        type="select"
                        title="婚姻状况"
                        v-model="formData.maritalstatus"
                        source="20011003"
                        @input="selectedCallBack"
                        name="maritalstatus"
                        v-validate="'required'"
                        placeholder="请选择"
                        v-sina-ads="stat.publicInfo.contacts.maritalstatus.marriage"
                    />
                    <!--已婚 c-border-b-->
                    <div
                        class="c-box "
                        v-if="formData.maritalstatus == 'D02'"
                        @click="handleClickTag1"
                    >


                        <choose-contacts
                            title="配偶"
                            v-model="formData.family"
                            name="family"
                            v-validate="'required'"
                            placeholder="请选择"
                        />
                    </div>
                    <div class="c-box" v-else>
                       <!-- <div class="relationShip-box c-border-b" @click="handleClickTag2">-->

                              <div class="relationShip-box " @click="handleClickTag2">
                            <form-control
                                type="select"
                                title="直系亲属关系"
                                @input="selectedCallBack2"
                                v-model="formData.extratype"
                                source="20011041"
                                name="extratype"
                                v-validate="'required'"
                                placeholder="请选择"
                            />
                        </div>
                        <!--   <div class="relationShipClick-box c-border-b" @click="handleClickTag3">-->

                        <div class="relationShipClick-box" @click="handleClickTag3">
                            <choose-contacts
                                title="直系亲属电话"
                                v-model="formData.family"
                                name="family"
                                v-validate="'required'"
                                placeholder="从通讯录选择"
                            />
                        </div>
                    </div>
                    <div
                        class="error-tip"
                        v-if="errorInfo.family && fields.family && !fields.family.dirty"
                    >{{errorInfo.family}}</div>

                    <choose-contacts
                        title="同事"
                        v-model="formData.colleague"
                        name="colleague"
                        v-validate="'required'"
                        v-sina-ads="stat.publicInfo.contacts.colleague"
                        placeholder="从通讯录选择"
                    />
                    <div
                        class="error-tip"
                        v-if="errorInfo.colleague && fields.colleague && !fields.colleague.dirty"
                    >{{errorInfo.colleague}}</div>
                    <choose-contacts
                        title="朋友"
                        v-model="formData.friend"
                        name="friend"
                        v-validate="'required'"
                        v-sina-ads="stat.publicInfo.contacts.friend"
                        placeholder="从通讯录选择"
                    />
                    <div
                        class="error-tip"
                        v-if="errorInfo.friend && fields.friend && !fields.friend.dirty"
                    >{{errorInfo.friend}}</div>
                </div>

                <div class="c-button-group">
                    <mt-button
                        type="primary"
                        size="large"
                        class="btn-lg btn-primary btn-round"
                        :disabled="!finished"
                        @click.native="defendClick.wrap(submit)"
                        v-sina-ads="stat.publicInfo.contacts.submit"
                    >下一步</mt-button>
                </div>

                <p class="el-desc">联系人信息仅用于借款审核</p>
            </div>
        </div>

        <backDialog
            v-if="backDialog && backDialog.isNeedOpen && backDialog.visibility && backDialog.type==1"
            :visibility="backDialog.visibility"
            :data="backDialog.data"
            @close="backDialogClose"
        />
    </div>
</template>

<script>
    import api from "@/services/api";
    import util from "@/utils";
    import storage from "@/utils/storage";
    import helper from "@/utils/helper";
    import { mapGetters, mapMutations } from "vuex";
    import stepProgress from "./components/stepProgress";
    import chooseContacts from "./components/chooseContacts";
    import { Toast, Indicator, MessageBox } from "@/utils/helper";
    import EventBus from "@/services/EventBus";
    import backDialog from "./components/noobDialog";
    import "./style/index.scss";
    import {
        checkContactPermission,
        resolveErrorInfo
    } from "./services/stepService";
    import DefendClick from "@/utils/DefendClick";
    import _ from "lodash";

    import formControl from "@/components/common/formControl";

    function checkDuplicated(array) {
        let group = {};
        let duplicated = false;
        array.forEach(item => {
            if (group.hasOwnProperty(item)) {
                duplicated = true;
                return false;
            } else {
                group[item] = 1;
            }
        });
        return duplicated;
    }

    let toastQueue = [];

    export default {
        name: "step2",
        data() {
            return {
                errorInfo: {}, //返件错误信息
                formData: {
                    family: "", //家人关系
                    friend: "", //朋友关系
                    colleague: "", // 同事关系
                    maritalstatus: "", //婚姻状态
                    extratype: "" //直系亲属关系
                },

                //已婚code值，从伪协议获取
                marriedData: {
                    text: `配偶`,
                    code: 13
                },

                //返回弹窗
                backDialog: null,

                remoteData: {},
                starttime: "", //进入页面的时间
                endtime: "", //点击提交页面的时间
                defendClick: new DefendClick(),
                sendBack: util.getParams("stageid") == 2
            };
        },
        computed: {
            ...mapGetters([]),
            changed() {
                // 返件时，必须修改所有问题字段
                if (this.sendBack) {
                    let changed = true;
                    let keys = Object.keys(this.errorInfo);

                    // 检查问题字段是否有修改
                    keys.forEach(key => {
                        // 只要有一个未修改，即返回false
                        if (this.formData[key] === this.remoteData[key]) {
                            changed = false;
                        }
                    });
                    return changed;
                } else {
                    return !_.isEqual(this.formData, this.remoteData);
                }
            },
            finished() {
                let {
                    family,
                    friend,
                    colleague,
                    maritalstatus,
                    extratype
                } = this.formData;
                let finished;
                if (maritalstatus == "D02") {
                    finished = family && friend && colleague && maritalstatus;
                } else {
                    finished = family && friend && colleague && maritalstatus && extratype;
                }

                return finished && (!this.sendBack || this.changed);
                // return true;
            }
        },
        methods: {
            //亲属选择后的回调
            selectedCallBack(value) {
                //选择已婚，默认为配偶的 code值
                if (this.formData.maritalstatus == "D02") {
                    this.formData.extratype = this.marriedData.code;
                } else {
                    let data = { extratype: "" };
                    data["flag"] = new Date().getTime();

                    this.formData = Object.assign({}, this.formData, data);
                }
            },

            //直系亲属选择回调
            selectedCallBack2(value) {
                let data = {};

                Vue.delete(this.formData, "flag");

                // data[new Date().getTime()]=''

                data["extratype"] = value;

                this.formData = Object.assign({}, this.formData, data);

                // Vue.set('formData',data)

                console.log(JSON.stringify(this.formData, null, 2));
            },

            //返回显示新手挽留弹窗
            backDialogClose(flag) {
                this.backDialog.visibility = false;

                if (flag) {
                    this.sinaAds.click(this.stat.publicInfo.idCard.newbieNext_2);
                    return;
                }
                //放弃申请
                this.sinaAds.click(this.stat.publicInfo.idCard.newbieWaive_2);
                this.sinaAds.click(this.stat.publicInfo.userBasicInfo.leave);
                this.setLocalStorage();
                this.$root.closeWindow();
            },

            //获取新手红包挽留文案
            async getNewbieDesc() {
                this.$AppBridge.getUserInfo({}, res => {
                    if (res.code == "200" && res.data && res.data.mobile) {
                        api.publicInfo
                            .newbiePackets({
                                accountid: util.getParams("fromUserId") || "",
                                productid: `2001`,
                                type: 2, //1身份证信息、2联系人信息、3基础信息、4完成提交申请
                                phonenum: res.data.mobile
                                // phonenum:`18718790180`
                            })
                            .then(res2 => {
                                if (
                                    res2.code == "200" &&
                                    res2.data &&
                                    res2.data.CONFIG &&
                                    res2.data.CONFIG.length
                                ) {
                                    let result = res2.data.CONFIG;

                                    console.log("弹窗文案===================>");
                                    console.log(res2);

                                    let item = result.filter(item => item.visibility);

                                    if (item.length) {
                                        let { type, visibility } = item[0];

                                        this.backDialog = {
                                            type,
                                            visibility: false,
                                            isNeedOpen: visibility,
                                            data: Object.assign(item[0], { current: 2 })
                                        };
                                        console.log(JSON.stringify(this.backDialog));
                                    }
                                }
                            })
                            .catch(e => {
                                //Toast(e)
                            });
                    }
                });
            },

            // 处理返回
            handleBack() {
                document.activeElement.blur();

                this.sinaAds.click(this.stat.publicInfo.contacts.back);

                if (this.sendBack) return this.$root.closeWindow();

                let messageBoxType = [1]; //标记弹窗类型不为:messageBox

                if (this.backDialog) {
                    //弹窗类型不为messageBox
                    /*if (messageBoxType.indexOf(this.backDialog.type) != -1) {
                      this.backDialog.visibility = true;
                      return;
                    }*/
                    let { title, button, desc } = this.backDialog.data;
                    MessageBox({
                        title: "温馨提示",
                        //   message: desc,
                        //   showCancelButton: true,
                        //   confirmButtonText: button[1],
                        //   cancelButtonText: button[0]
                        message: "亲，您离成功只差一步之遥，放弃简直太可惜了！",
                        showCancelButton: true,
                        confirmButtonText: "我再想想",
                        cancelButtonText: "坚决离开"
                    }).then(action => {
                        if (action == "cancel") {
                            this.sinaAds.click(this.stat.publicInfo.contacts.leave);
                            this.setLocalStorage();
                            this.$root.closeWindow();
                        } else {
                            this.sinaAds.click(this.stat.publicInfo.contacts.continue);
                        }
                    });
                    return;
                }
                this.setLocalStorage();
                this.$root.closeWindow();
            },

            handleClickTag1() {
                this.sinaAds.click(this.stat.publicInfo.contacts.maritalstatus.spouse);
            },
            handleClickTag2() {
                this.sinaAds.click(
                    this.stat.publicInfo.contacts.maritalstatus.relationShip
                );
            },
            handleClickTag3() {
                this.sinaAds.click(
                    this.stat.publicInfo.contacts.maritalstatus.relationShipClick
                );
            },
            ...mapMutations([]),

            async submit() {
                console.log(this.changed, this.formData, this.remoteData);
                // 非返件时，获取服务端数据且未做修改，直接下一步
                // 修改原因，数据反映有不真实数据。故继续提交
                // if (!this.sendBack && !this.changed) {
                // 	Indicator.open();
                // 	let permission = await checkContactPermission(true);
                // 	if (!permission) return Indicator.close();

                // 	this.next("step3");
                // 	return;
                // }

                this.endtime = new Date().getTime();

                let {
                    family,
                    friend,
                    colleague,
                    maritalstatus,
                    extratype
                } = this.formData;
                let { starttime, endtime } = this;

                if (
                    checkDuplicated(
                        [family, friend, colleague].map(item => item.contactPhone)
                    )
                ) {
                    Toast("联系人重复，请重选");
                    return;
                }

                Indicator.open();
                let permission = await checkContactPermission(true);

                console.log(permission);

                if (!permission) return Indicator.close();
                let data = {
                    maritalstatus,
                    contactfamily: `${family.contactName}&${family.contactPhone}`,
                    contactfriend: `${friend.contactName}&${friend.contactPhone}`,
                    contactworkmate: `${colleague.contactName}&${colleague.contactPhone}`,
                    starttime,
                    endtime,
                    clienttype: 1, //APP
                    sourcetype: 1 //公共信息
                };
                if (extratype != null) {
                    data.extratype = extratype;
                }
                //已婚
                if (maritalstatus == "D02") {
                    data.extratype = this.marriedData.code;
                } else {
                    data.extratype = extratype;
                }

                // 返件
                if (this.sendBack) {
                    data.sourcetype = 3;
                    data.orderid = util.getParams("orderid");
                }

                let res = await api.publicInfo.saveContact(data).finally(Indicator.close);

                if (helper.isSuccess(res)) {
                    // 确认信息采集
                    if (res.data.ishavecall == 0 || res.data.ishavephonebook == 0) {
                        this.$AppBridge.notify({ tag: "collect" });
                    }
                    this.next("step1");
                }
            },
            // 获取服务器缓存数据
            fetchData() {
                return api.publicInfo
                    .getUserBaseInfo({
                        retype: "2",
                        orderid: util.getParams("orderid")
                    })
                    .then(res => {
                        //{"msg":"ok","code":200,"data":{"contacts":{"batchid":"","clienttype":null,"contacts":[{"batchid":"","contactname":"AA","contactphone":"18680689295","contacttype":4,"createby":"","createtime":null,"extratype":"","id":"","productid":"","terminalid":"","updateby":"","updatetime":"2018-09-04 19:59:50"},{"batchid":"","contactname":"波波","contactphone":"18680365665","contacttype":6,"createby":"","createtime":null,"extratype":"","id":"","productid":"","terminalid":"","updateby":"","updatetime":"2018-09-04 19:59:50"},{"batchid":"","contactname":"伯","contactphone":"15827498781","contacttype":7,"createby":"","createtime":null,"extratype":"","id":"","productid":"","terminalid":"","updateby":"","updatetime":"2018-09-04 19:59:50"}],"createby":"","createtime":null,"endtime":"","id":"","maritalstatus":"D03","orderid":"","productid":"","sourcetype":null,"starttime":"","terminalid":"","updateby":"","updatetime":null,"userid":""},"idCard":{"agency":"","authimage":null,"authstatus":null,"cardname":"","cardno":"","entertype":1,"famadr":"","imageid":"","mediaid":"","mobileNo":"","nation":"","oppimageid":"","oppimagethumurl":"","oppimageurl":"","posimageid":"","posimagethumurl":"","posimageurl":"","updatetime":null,"validenddate":"","validstartdate":""},"returnRecordList":null,"userBasicInfo":{"addr":"","addrarea":"","addrcity":"","addrprovince":"","applyamount":null,"channelId":"","clienttype":null,"companyaddr":"","companyarea":"","companycity":"","companyname":"","companyprovince":"","degreecode":"","deviceid":"","endtime":"","id":"","incomecode":"","ip":"","maritalstatus":"","occupations":"","productid":"","starttime":"","updatetime":null,"userid":"","vertype":null}},"timestamp":"20180905200720"}
                        console.log("个人用户数据" + JSON.stringify(res));
                        // res = {};
                        if (res.code == 200 && JSON.stringify(res.data.contacts) != "{}") {
                            //需要对应tpye转义成对象格式，需要格式化
                            this.formData = this.format(res.data.contacts);
                            // if (res.data.contacts.maritalstatus) {
                            // 	this.formData.maritalstatus =
                            // 		res.data.contacts.maritalstatus;
                            // }
                            //

                            this.remoteData = _.cloneDeep(this.formData);
                            this.errorInfo = resolveErrorInfo(res.data.returnRecordList, 2);
                        }
                    });
            },
            // 数据格式转换
            format(obj) {
                let result = {};
                obj.contacts.forEach(item => {
                    let itemData = {
                        contactName: item.contactname,
                        contactPhone: item.contactphone,
                        contacttype: item.contacttype
                    };
                    if ([6, 7].indexOf(item.contacttype) == -1) {
                        result.family = itemData;
                    }

                    if (item.contacttype == 6) {
                        result.friend = itemData;
                    }
                    if (item.contacttype == 7) {
                        result.colleague = itemData;
                    }
                });
                let family = obj.contacts.filter(item => {
                    return [6, 7].indexOf(item.contacttype) == -1;
                })[0];

                if (obj.maritalstatus) {
                    result.maritalstatus = obj.maritalstatus;
                }
                if (family && family.extratype) {
                    result.extratype = family.contacttype;
                }
                return result;
            },

            checkData(obj) {
                //判断三个对象是否是空值
                console.log(JSON.stringify(obj));
                console.log();
                if (obj == undefined) {
                    return false;
                } else if (
                    JSON.stringify(obj.family) != "" ||
                    JSON.stringify(obj.family) != "" ||
                    JSON.stringify(obj.family) != ""
                ) {
                    return true;
                } else {
                    return false;
                }
            },
            // 监听formData变化
            startWatch() {
                this.$watch("formData", this.setLocalStorage, { deep: true });
            },
            //保存到本地数据中
            setLocalStorage() {
                console.log("formData changed", this.formData);
                let _this = this;
                let userid = util.getParams()["fromUserId"];
                if (this.checkData(_this.formData)) {
                    helper.set(`${userid}-Contactsinfo`, _this.formData);
                }
            },
            // 将toast弹窗的instance push到队列
            pushToast(instance) {
                // toastQueue.push(instance)
                // console.log(instance, 'toast')
            },
            // 关闭所有弹窗
            clearToast() {
                // console.log(toastQueue.length, 'clear')
                // // toastQueue.forEach(instance => setTimeout(() => instance.close(), 200))
                // toastQueue.forEach(instance => instance.$el.remove())
                // toastQueue = []
            },

            next(name) {
                if (this.sendBack) {
                    // 通知补件/返件刷新
                    this.$AppBridge.notify({ tag: "field" });
                    this.$root.closeWindow({ refresh: true });
                } else {
                    this.$root.replaceRoute({ name });
                }
            }
        },
        components: {
            stepProgress,
            chooseContacts,
            formControl,
            backDialog
        },
        watch: {
            formData: {
                deep: true,
                handler(newValue, oldValue) {
                    if (newValue.maritalstatus == "D02") {
                        this.formData.extratype = this.marriedData.code;
                    }
                }
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.$root.loadingClose();
            });
        },
        created() {
            this.starttime = new Date().getTime();

            this.getNewbieDesc();

            this.$AppBridge.setWebAttribute({ intercept: true });
            EventBus.$on("back", this.handleBack);

            //20011061 已婚的code值
            this.$AppBridge.getInitData({ type: 20011061 }, res => {
                if (res.data && res.data["20011061"] && res.data["20011061"][0]) {
                    this.marriedData = {
                        text: res.data["20011061"][0].pname || `配偶`,
                        code: res.data["20011061"][0].pcode || "13"
                    };
                }
            });

            this.fetchData()
                .finally(() => {
                    if (this.sendBack) return;

                    //非返件时，读取缓存
                    let userid = util.getParams()["fromUserId"];
                    helper.get(`${userid}-Contactsinfo`).then(value => {
                        console.log("获取缓存");
                        console.log(value);
                        if (value && this.checkData(value)) {
                            Object.keys(value).forEach(key => {
                                console.log(value);
                                // if(value != null && value)
                                if (value && value[key] != null && value[key].contactType) {
                                    delete value[key].contactType;
                                }
                            });
                            // 合并参数，远程数据优先
                            this.formData = _.extendWith({}, value, this.formData, (a, b) => {
                                return !b && b !== 0 ? a : b;
                            });
                            // this.formData = _.extend({}, this.formData, value)
                        }
                        this.startWatch();
                    });
                })
                .finally(this.$root.loadingClose);
        },
        beforeRouteLeave(to, from, next) {
            EventBus.$off("back");
            next();
        }
    };
</script>

<style lang="scss" scoped>
    .view-step2 {
        height: 100%;

        .el-desc {
            font-size: 12px;
            color: #9e9e9e;
            text-align: center;
            margin-top: 9px;
        }
    }

    div.c-box{
        /deep/ .mint-cell-wrapper{
            @extend %border-b;
        }
    }
    .error-tip {
        font-size: 12px;
        color: #e72427;
        background: #f9e6e7;
        line-height: 24px;
        padding: 0 $gap;
    }
    .notice {
        font-size: 12px;
        background: #e1f5ff;
        color: $blue;
        line-height: 24px;
        padding: 0 $gap;
    }

    .marriage-info {
        display: flex;
        justify-content: flex-end;
        .mint-checklist-label {
            width: 80px;
            height: 16px;
            line-height: 16px;
        }
        .mint-checkbox {
            font-size: 14px;
            color: #666666;
            letter-spacing: -0.08px;
        }
        .mint-checkbox-core {
            width: 16px;
            height: 16px;
            &:after {
                top: 1px;
                left: 4px;
            }
        }
    }
    .c-section {
        .section-title {
            padding-left: 16px;
        }
        .sub-section-title {
            margin-top: 4px;
            font-size: 12px;
            color: #999999;
            letter-spacing: 0;
        }
    }
</style>
