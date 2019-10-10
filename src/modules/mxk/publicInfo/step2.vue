<template>
    <div class=" view-public-info-step c-bg-gray" ref="view" >

        <div class="c-view-content" ref="content">
            <div class="content-wrap">


                <!--      <pre>
                             {{JSON.stringify(formData,null,2)}}
                         </pre>-->

                <!-- <div class="notice">若已婚，家人项须填写配偶的联系方式</div> -->

                <div class="c-section">

                    <form-control type="select" title="婚姻状况" v-model="formData.maritalstatus" source="20011003"
                                  name="maritalstatus" v-validate="'required'"
                                  @input="selectedCallBack"
                                  v-sina-ads="stat.publicInfo.contacts.maritalstatus.marriage"/>
                    <div class="c-box">


                        <form-control title="直系亲属关系" v-if="formData.maritalstatus == 'D02'" class="maritalstatusText"
                                      v-model="marriedData.text" :disabled="true" :readonly="true"/>


                        <form-control v-else type="select" title="直系亲属关系"
                                      v-model="formData.extratype" source="20011041" name="extratype"
                                      v-validate="'required'"
                                      @input="selectedCallBack2"/>

                        <div class="relationShipClick-box" @click='handleClickTag3'>
                            <choose-contacts title="直系亲属" v-model="formData.family" name="family"
                                             :onError="contactsError" :before="beforeChoose" v-validate="'required'"/>
                        </div>
                    </div>

                    <!--
                    <div class="error-tip" v-if="errorInfo.family && fields.family && !fields.family.dirty">{{errorInfo.family}}
                 </div>
                    -->

                </div>

                <div class="c-section">

                    <choose-contacts title="朋友" v-model="formData.friend" name="friend" v-validate="'required'"
                                     :before="beforeChoose"
                                     :onError="contactsError"
                                     v-sina-ads="stat.publicInfo.contacts.friend"/>
                    <div class="error-tip" v-if="errorInfo.friend && fields.friend && !fields.friend.dirty">
                        {{errorInfo.friend}}
                    </div>
                    <choose-contacts title="同事" v-model="formData.colleague" name="colleague" v-validate="'required'"
                                     :before="beforeChoose"
                                     :onError="contactsError"
                                     v-sina-ads="stat.publicInfo.contacts.colleague"/>
                    <div class="error-tip" v-if="errorInfo.colleague && fields.colleague && !fields.colleague.dirty">
                        {{errorInfo.colleague}}
                    </div>

                    <p v-if="errorMessage" class="errorNotice" v-text="errorMessage"/>
                </div>

                <div class="c-button-group">
                    <mt-button type="primary" size="large" class="btn-lg btn-primary btn-round" :disabled="!finished"
                               @click.native="defendClick.wrap(submit)" v-sina-ads="stat.publicInfo.contacts.submit">
                        {{sendBack ?
                        '提交' : publicInfoStep.btnText}}
                    </mt-button>
                </div>
                <!--   <input type="button" @click="defendClick.wrap(submit)" value="测试"/>-->


            </div>
        </div>

        <div class="bottom-info">
            <img class="c-icon" src="~@/assets/images/publicInfo/ba_cg@2x.png" alt=""> {{appName}}不会向联系人泄漏您的正常借款信息
        </div>

    </div>
</template>

<script>
    import api from "@/services/api";
    import util from "@/utils";
    import storage from "@/utils/storage";
    import helper from "@/utils/helper";
    import {mapGetters, mapState, mapMutations} from "vuex";
    import stepProgress from "./components/stepProgress";
    import chooseContacts from "./components/chooseContacts";
    import {Toast, Indicator, MessageBox} from "@/utils/helper";
    import AppBridge from "@/services/AppBridge.js";
    import EventBus from "@/services/EventBus";

    import {
        checkContactPermission,
        resolveErrorInfo
    } from "./services/stepService";
    import DefendClick from "@/utils/DefendClick";
    import _ from "lodash";

    import formControl from "@/components/common/formControl";

    let stepMixin = require('./components/stepMixin')
    export default {
        mixins: [stepMixin.default],
        name: "step2",
        data() {
            return {
                errorInfo: {}, //返件错误信息
                formData: /* {
                    "family": {"contactName": "阿里巴巴", "contactPhone": "18718790147"},
                    "friend": {"contactName": "阿里巴巴", "contactPhone": "18718790142"},
                    "colleague": {"contactName": "方法pino", "contactPhone": "18718790145"},
                    "maritalstatus": "",
                    "extratype": ""
                },*/

                    {
                        family: "", //家人关系
                        friend: "", //朋友关系
                        colleague: "", // 同事关系
                        maritalstatus: "", //婚姻状态
                        extratype: "" //直系亲属关系
                    },

                recordContactIndex: '', //记录选择的联系人name

                errorMessage: ``,

                remoteData: {},
                starttime: "", //进入页面的时间
                endtime: "", //点击提交页面的时间
                defendClick: new DefendClick(),
                sendBack: util.getParams("stageid") == 2,
                //已婚code值，从伪协议获取
                marriedData: {
                    text: `配偶     `,
                    code: 13
                },

                sourceCode: '20011041'
            };
        },
        computed: {

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
                    finished =
                        family && friend && colleague && maritalstatus && extratype;
                }

                return finished && (!this.sendBack || this.changed) && this.isSubmit2;
                // return true;
            }
        },
        methods: {

            contactsError(key, msg) {
                //  this.formData[key] = ""
                this.errorMessage = msg
            },

            //选择联系人之前的回调
            beforeChoose(name) {
                this.recordContactIndex = name  //记录当前选择的是哪个类型， 用于数据验证
                this.errorMessage = ``
            },

            /**
             * 检查联系人是否重复
             * @param array
             * @param key
             * @return {{flag: boolean, item: string}}
             */
            checkContactDuplicated(array, key) {
                let group = {};
                let duplicated = false, value = '';

                console.error('========>', JSON.stringify(array, null, 2));

                array.forEach(item => {
                    if (group.hasOwnProperty(item[key])) {
                        duplicated = true;
                        //value = item

                        value = group[item[key]].key

                        //value = group[key]
                        // console.log('检查联系人是否重复==>',group, item, group[item[key]]);

                        console.log('检查联系人是否重复==>', group[item[key]].key);

                        //   console.log('检查联系人是否重复', this.formData[item.key], item.key);
                        return false;
                    } else {
                        group[item[key]] = Object.assign({}, this.formData[key], {key: item.key});
                    }
                });
                return {flag: duplicated, key: value};
            },

            //亲属选择后的回调
            selectedCallBack(value) {

                //选择已婚，默认为配偶的 code值
                if (this.formData.maritalstatus == "D02") {
                    this.formData.extratype = this.marriedData.code
                } else {

                    let data = {extratype: ''}
                    data['flag'] = new Date().getTime()

                    this.formData = Object.assign({}, this.formData, data)
                }
            },

            //直系亲属选择回调
            selectedCallBack2(value) {

                let data = {}

                Vue.delete(this.formData, 'flag');
                data['extratype'] = value
                this.formData = Object.assign({}, this.formData, data)
            },



            // 处理返回
            handleBack() {

                document.activeElement.blur()

                this.sinaAds.click(this.stat.publicInfo.contacts.back);


                if (this.sendBack) return this.$root.closeWindow();

                let messageBoxType = [1]; //标记弹窗类型不为:messageBox

                if (this.publicInfoStep.backDialog) {

                    //弹窗类型不为messageBox
                    if (messageBoxType.indexOf(this.publicInfoStep.backDialog.type) != -1) {



                        let data = Object.assign({}, this.publicInfoStep.backDialog, {
                            visibility: true,
                            isNeedOpen:true
                        })

                        console.error('返回前====>', JSON.stringify(data,null,2));


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
                            this.sinaAds.click(this.stat.publicInfo.contacts.leave);
                            this.$root.closeWindow();
                        } else {
                            this.sinaAds.click(this.stat.publicInfo.contacts.continue);
                        }
                    });
                    return
                }
                this.setLocalStorage();
                this.$root.closeWindow();
            },

            handleClickTag1() {
                this.sinaAds.click(
                    this.stat.publicInfo.contacts.maritalstatus.spouse
                );
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


            //组装对应键值的联系人
            assembleContact(family, friend, colleague) {

                //优先把选择的，放在第一位
                let list = [Object.assign({}, family, {key: 'family'}), Object.assign({}, friend, {key: 'friend'}), Object.assign({}, colleague, {key: 'colleague'})]

                if (this.recordContactIndex) {

                    let flagIndex = -1
                    list.map((item, index) => {
                        if (item.key == this.recordContactIndex) flagIndex = index
                    })

                    let item = list[flagIndex]
                    list.splice(flagIndex, 1)
                    list.unshift(item)
                }
                return list
            },

            async submit() {

                if (!this.isSubmit2) {
                    console.log('重复提交');
                    return
                }

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
                let {starttime, endtime} = this;


                if (!this.checkData(this.formData)) {
                    return
                }

                Indicator.open();
                let permission = await checkContactPermission(true);

                console.log(permission);

                if (!permission) {
                    return Indicator.close();
                }
                let data = {
                    maritalstatus,
                    contactfamily: `${family.contactName}&${family.contactPhone}`,
                    contactfriend: `${friend.contactName}&${friend.contactPhone}`,
                    contactworkmate: `${colleague.contactName}&${
                        colleague.contactPhone
                        }`,
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

                let res = await api.publicInfo
                    .saveContact(data)
                    .finally(Indicator.close);

                if (helper.isSuccess(res)) {

                    // 确认信息采集
                    if (res.data.ishavecall == 0 || res.data.ishavephonebook == 0) {
                        AppBridge.notify({tag: "collect"});
                    }
                    this.next("step3");
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
                        //    console.error("个人用户数据==>" + JSON.stringify(res));
                        // res = {};
                        if (
                            res.code == 200 &&
                            JSON.stringify(res.data.contacts) != "{}"
                        ) {
                            //需要对应tpye转义成对象格式，需要格式化
                            this.formData = this.format(res.data.contacts);

                            /* console.error('需要格式化================>');
                             console.log(JSON.stringify(this.formData, null, 3));*/

                            // if (res.data.contacts.maritalstatus) {
                            // 	this.formData.maritalstatus =
                            // 		res.data.contacts.maritalstatus;
                            // }
                            //

                            this.remoteData = _.cloneDeep(this.formData);
                            this.errorInfo = resolveErrorInfo(
                                res.data.returnRecordList,
                                2
                            );
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
                        contacttype: item.contacttype,
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
                    return ([6, 7].indexOf(item.contacttype) == -1)
                })[0];

                if (obj.maritalstatus) {
                    result.maritalstatus = obj.maritalstatus;
                }

                if (family && family.contacttype) {
                    result.extratype = family.contacttype + '';
                }
                return result;
            },

            checkData(obj) {

                if (obj == undefined || !obj) {
                    return false;

                } else if (obj.family && obj.friend && obj.colleague) {

                    let {family, friend, colleague} = obj;

                    let flag = null, list = this.assembleContact(family, friend, colleague)

                    list.map(item => {

                        if (!new RegExp("[\\u4E00-\\u9FFF]+", "g").test(item.contactName)) {
                            flag = {msg: '不可选择名字为纯数字或纯英文的联系人', item}
                            this.formData[item.key] = ""
                        }
                    })

                    if (flag) {
                        this.errorMessage = flag.msg;
                        return false
                    }

                    let result1 = this.checkContactDuplicated(list, 'contactPhone'),
                        result2 = this.checkContactDuplicated(list, 'contactName');

                    if (result1.flag) {
                        this.errorMessage = `联系人手机号码重复，请重选`
                        this.formData[result1.key] = ""
                        return false;
                    }

                    if (result2.flag) {
                        this.errorMessage = `联系人的姓名不可以重复`;
                        this.formData[result2.key] = ""
                        return false;
                    }
                    return true;
                } else {
                    return false;
                }
            },
            // 监听formData变化
            startWatch() {
                this.$watch("formData", this.setLocalStorage, {deep: true});
            },
            //保存到本地数据中
            setLocalStorage(newVal, oldVal) {

                /* console.error("formData changed===========》", JSON.stringify(newVal, null, 2));
                 console.error("formData changed===========》", JSON.stringify(this.formData, null, 2));*/

                let userid = util.getParams()["fromUserId"];
                if (this.checkData(newVal)) {
                    helper.set(`${userid}-Contactsinfo`, newVal);
                }
            },

            next(name) {
                if (this.sendBack) {
                    // 通知补件/返件刷新
                    AppBridge.notify({tag: "field"});
                    this.$root.closeWindow({refresh: true});
                } else {
                    this.isSubmit2 = true

                    this.formData = {
                        family: "", //家人关系
                        friend: "", //朋友关系
                        colleague: "", // 同事关系
                        maritalstatus: "", //婚姻状态
                        extratype: "" //直系亲属关系
                    }
                    this.stepNext()
                }
            }
        },
        components: {
            stepProgress,
            chooseContacts,
            formControl,
        },

        created() {

            this.starttime = new Date().getTime();



            //20011061 已婚的code值
            AppBridge.getInitData({type: 20011061}, res => {

                if (res.data && res.data['20011061'] && res.data['20011061'][0]) {

                    this.marriedData = {
                        text: res.data['20011061'][0].pname + '     ' || `配偶     `,
                        code: res.data['20011061'][0].pcode || '13'
                    }
                }
            })


            //AppBridge.setWebAttribute({intercept: true});



            this.fetchData().finally(() => {

                this.isSubmit2 = true
                if (this.sendBack) return;

                //非返件时，读取缓存
                let userid = util.getParams()["fromUserId"];
                helper.get(`${userid}-Contactsinfo`).then(value => {

                    if (value && this.checkData(value)) {
                        Object.keys(value).forEach(key => {
                            console.log(value);
                            // if(value != null && value)
                            if (
                                value &&
                                value[key] != null &&
                                value[key].contactType
                            ) {
                                delete value[key].contactType;
                            }
                        });
                        // 合并参数，远程数据优先
                        this.formData = _.extendWith(
                            {},
                            value,
                            this.formData,
                            (a, b) => {
                                return !b && b !== 0 ? a : b;
                            }
                        );

                        // this.formData = _.extend({}, this.formData, value)
                    }

                    this.startWatch();
                });
            })
                .finally(this.$root.loadingClose);


        },
        beforeRouteLeave(to, from, next) {

            next();
        },
        // 返回按钮拦截
        onBack() {


            this.handleBack()
        },
    };
</script>

<style lang="scss" scoped>
    .view-step2 {
        height: 100%;
    }

    div.bottom-info{
        position:fixed ;
        bottom: 0;
    }
    .error-tip {
        font-size: 12px;
        color: #e72427;
        background: #f9e6e7;
        line-height: 24px;
        padding: 0 $gap;
    }

    p.errorNotice {
        background: #F9E6E7;
        color: #E83134;
        text-indent: 10px;
        font-size: 12px;
        padding: 5px;
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
</style>
