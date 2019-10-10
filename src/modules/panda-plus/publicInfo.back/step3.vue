<template>
    <div class="view-step3 view-public-info-step c-bg-gray" ref="step3Content">


        <div class="c-view-content">
            <div class="content-wrap" v-min-height>

                <div class="c-section">
                    <form-control type="select" title="学历" v-model="formData.degreecode" source="20011002"
                                  name="degreecode"
                                  v-validate="'required'" v-sina-ads="stat.publicInfo.userBasicInfo.degree"/>
                    
                    <form-control type="select" title="月均收入(元)" v-model="formData.incomecode" source="20011004"
                                  name="incomecode"
                                  v-validate="'required'" v-sina-ads="stat.publicInfo.userBasicInfo.income"/>
                                  
                    <form-control title="单位名称" :class="{'no-border': errors.has('companyName')}">
                        <input slot="right" type="text" class="mint-field-core" v-no-emoji v-max-char-len="42"
                               v-sina-ads="stat.publicInfo.userBasicInfo.companyName" @focus="companyNameFocused=true"
                               @blur="companyNameFocused=false" placeholder="填写" v-model="formData.companyname"
                               maxlength="42"
                               name="companyName" v-validate="'required|minChar:8'">
                    </form-control>
                    <p class="error-tip" v-if="!companyNameFocused && errors.has('companyName')">
                        {{errors.first('companyName')}}</p>

                    <p class="error-tip"
                       v-else-if="fields.companyName && !fields.companyName.dirty && errorInfo.companyname">
                        {{errorInfo.companyname}}</p>

                    <form-control type="tel" title="期望借款金额(元)" v-model="formData.applyamount" maxlength="7"
                                  @blur="resolveAmount"
                                  name="applyamount" v-validate="'required'"
                                  v-sina-ads="stat.publicInfo.userBasicInfo.amount"/>

                    <div class="address-wrap home-address-wrap">
                        <form-control type="addressSelect" title="居住地址" v-model="formData.homeAddress" ref="homeAddress"
                                      name="homeCity" v-validate="'required'"
                                      v-sina-ads="stat.publicInfo.userBasicInfo.homeCity">
                            <div class="c-mask" slot="after" v-if="!formData.homeAddress"
                                 @click="defendClick.wrap(() => clickOnMask('homeAddress'))"></div>
                            <!-- <div class="c-mask" slot="after" v-if="!formData.homeAddress" @click="clickOnMask('homeAddress')" ></div> -->
                        </form-control>
                        <div class="address-inputer" v-if="formData.homeAddress">
              <textarea v-model="formData.addr" v-no-emoji v-max-char-len="50"
                        v-sina-ads="stat.publicInfo.userBasicInfo.homeAddress"
                        placeholder="请输入详细地址信息，如道路、门牌号、小区、楼栋号、单元室等" maxlength="50" name="homeAddress"
                        v-validate="'required|minChar:10'" @focus="homeAddressFocused=true"
                        @blur="homeAddressFocused=false"></textarea>
                            <p class="error-tip" v-if="homeAddressFocused">地址需精确到门牌号，例: 沙河路10号石鼓花园6栋601室</p>
                            <p class="error-tip" v-else-if="errors.has('homeAddress')">
                                {{errors.first('homeAddress')}}</p>
                            <p class="error-tip"
                               v-else-if="fields.homeAddress && !fields.homeAddress.dirty && errorInfo.addr">
                                {{errorInfo.addr}}</p>
                        </div>
                    </div>

                    <div class="address-wrap">
                        <form-control type="addressSelect" title="工作地址" v-model="formData.companyAddress"
                                      ref="companyAddress"
                                      name="companyCity" v-validate="'required'"
                                      v-sina-ads="stat.publicInfo.userBasicInfo.companyCity">
                            <div class="c-mask" slot="after" v-if="!formData.companyAddress"
                                 @click="defendClick.wrap(() => clickOnMask('companyAddress'))"></div>
                            <!-- <div class="c-mask" slot="after" v-if="!formData.companyAddress" @click="clickOnMask('companyAddress')" ></div> -->
                        </form-control>
                        <div class="address-inputer" v-if="formData.companyAddress">

              <textarea v-model="formData.companyaddr" v-no-emoji v-max-char-len="50"
                        v-sina-ads="stat.publicInfo.userBasicInfo.companyAddress"
                        placeholder="请输入详细地址信息，如道路、门牌号、小区、楼栋号、单元室等" maxlength="50" name="companyAddress"
                        v-validate="'required|minChar:10'" @focus="companyAddressFocused=true"
                        @blur="companyAddressFocused=false"></textarea>
                            <p class="error-tip" v-if="companyAddressFocused">地址需精确到门牌号，例: 沙河路10号石鼓花园6栋601室</p>
                            <p class="error-tip" v-else-if="errors.has('companyAddress')">
                                {{errors.first('companyAddress')}}</p>
                            <p class="error-tip"
                               v-else-if="fields.companyAddress && !fields.companyAddress.dirty && errorInfo.companyaddr">
                                {{errorInfo.companyaddr}}</p>
                        </div>
                    </div>

                    <p v-if="errorMessage" class="errorNotice" v-text="errorMessage"/>
                </div>

                <div class="c-button-group">
                    <mt-button type="primary" size="large" class="btn-lg btn-primary btn-round" :disabled="!finished"
                               @click.native="submit" v-sina-ads="stat.publicInfo.userBasicInfo.submit">
                        {{publicInfoStep.btnText}}
                    </mt-button>
                </div>
            </div>
        </div>



    </div>
</template>

<script>
    import api from "@/services/api";
    import util from "@/utils";
    import storage from "@/utils/storage";
    import helper from "@/utils/helper";
    import {Toast, Indicator, MessageBox} from "@/utils/helper";
    import {mapGetters, mapMutations, mapActions} from "vuex";
    import stepProgress from "./components/stepProgress";
    import formControl from "@/components/common/formControl";
    import AppBridge from "@/services/AppBridge";
    import EventBus from "@/services/EventBus";


    import {
        checkLocationPermission,
        resolveErrorInfo
    } from "./services/stepService";
    import DefendClick from "@/utils/DefendClick";
    import _ from "lodash";

    import chooseTendency from "./components/chooseTendency"

    // 错误提示文字：
    const dict = {
        custom: {
            companyName: {
                required: "请填写详细工作单位名称",
                minChar: "请填写详细工作单位名称"
            },
            homeAddress: {
                required: "请填写详细居住地址",
                minChar: "请填写详细居住地址"
            },
            companyAddress: {
                required: "请填写详细工作地址",
                minChar: "请填写详细工作地址",
                address: "地址需要精确XX路XX号，例: 幸福路6号幸福大厦6栋601室"
            }
        }
    };


    let stepMixin = require('./components/stepMixin')
    export default {
        mixins: [stepMixin.default],
        name: "step3",
        data() {
            return {
                errorInfo: {}, //返件错误信息


                formData: {
                    applyamount: "",
                    companyname: "",
                    addr: "",
                    companyaddr: "",
                    tendencyCode: '',
                    tendencyRightText: '',
                },

                errorMessage: ``,

                isTendencyTwo: false,
                showBack: false,//是否显示后退
                showTendency: false,//是否显示借款意向
                tendencyList: [//借款意向的添加

                ],
                remoteData: {},
                starttime: "", //进入页面的时间
                endtime: "", //点击提交页面的时间
                companyNameFocused: false,
                homeAddressFocused: false,
                companyAddressFocused: false,
                defendClick: new DefendClick(),
                sendBack: util.getParams("stageid") == 2
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

                let fields = [
                    "degreecode",
                    "incomecode",
                    "companyname",
                    "applyamount",
                    "homeAddress",
                    "companyAddress",
                    "addr",
                    "companyaddr",
                ];
                let emptyFields = fields.filter(key =>
                    util.isEmpty(this.formData[key])
                );

                let finished = emptyFields.length == 0 && this.errors.count() == 0;
                return finished && (!this.sendBack || this.changed);
            },
            isAndroid() {
                return util.browser.versions.android;
            }
        },
        // 返回按钮拦截
        onBack() {
            this.handleBack()
        },
        methods: {


            textClick(ev) {

                document.body.scrollTop = '300px'

            },

            textOnFource(ev) {

                console.log('test===>', ev);

                console.log(document.activeElement.scrollIntoViewIfNeeded);

                window.setTimeout(function () {

                    document.body.scrollTop = '300px'

                }, 0);


                this.companyAddressFocused = true

            },

            //借款偏好 设置
            showTendencyAction() {
                this.showTendency = !this.showTendency
                EventBus.$emit('showTendency', this.showTendency);
            },


            // 处理返回
            handleBack() {

                document.activeElement.blur();

                this.sinaAds.click(this.stat.publicInfo.userBasicInfo.back);

                if (this.sendBack) return this.$root.closeWindow();

                if (this.publicInfoStep.backDialog) {

                    let messageBoxType = [1]; //标记弹窗类型不为:messageBox

                    //弹窗类型不为messageBox
                    if (messageBoxType.indexOf(this.publicInfoStep.backDialog.type) != -1) {

                        let data = Object.assign({}, this.publicInfoStep.backDialog, {
                            visibility: true,
                            isNeedOpen:true
                        })

                        //返回保存历史数据
                        this.setLocalStorage(this.formData);
                        this.setBackDialog(data)
                        return

                    }
                    let {title, button, desc} =this.publicInfoStep.backDialog.data
                    MessageBox({
                        title: title,
                        message: desc,
                        showCancelButton: true,
                        confirmButtonText: button[1],
                        cancelButtonText: button[0],
                    }).then(action => {
                        if (action == "cancel") {
                            this.sinaAds.click(this.stat.publicInfo.userBasicInfo.leave);
                            this.$root.backHome();
                        } else {
                            this.sinaAds.click(this.stat.publicInfo.userBasicInfo.continue);
                        }
                    });
                    return
                }

                this.setLocalStorage(this.formData);

                this.sinaAds.click(this.stat.publicInfo.userBasicInfo.leave);
                this.$root.backHome();
            },

            async submit() {

                if (!this.isSubmit3) {
                    console.log('重复提交');
                    return
                }

                // 表单校验
                let result = await this.$validator.validateAll();
                if (!result) {

                    this.errorMessage = this.errors.all()[0]
                    // Toast(this.errors.all()[0]);
                    return;
                }
                this.errorMessage = ''

                if (!this.isAndroid) {

                    //防止重复点击出现弹窗
                    if (!this.isSubmit3) {
                        return
                    }

                    // 权限检查
                    let permission = await checkLocationPermission(true);
                    if (!permission) {
                        return;
                    }
                    this.isSubmit3 = false
                }

                // 返件，直接提交
                if (this.sendBack) {
                    this.defendClick.wrap(this.submitConfirm);
                    return;
                }

                this.defendClick.wrap(this.submitConfirm);
            },
            submitConfirm() {
                this.endtime = new Date().getTime();
                let {
                    degreecode,
                    incomecode,
                    companyname,
                    addr,
                    companyaddr,
                    applyamount,
                    tendencyCode
                } = this.formData;
                let {starttime, endtime} = this;
                let {
                    provinceCode: addrprovince,
                    cityCode: addrcity,
                    countryCode: addrarea
                } = this.formData.homeAddress;
                let {
                    provinceCode: companyprovince,
                    cityCode: companycity,
                    countryCode: companyarea
                } = this.formData.companyAddress;
                let data = {
                    degreecode,
                    incomecode,
                    companyname,
                    addr,
                    companyaddr,
                    applyamount,
                    addrprovince,
                    addrcity,
                    addrarea,
                    companyprovince,
                    companycity,
                    companyarea,
                    starttime,
                    endtime,
                    clienttype: 1, //APP
                    sourcetype: 1, //公共信息
                    loanIntention: tendencyCode
                };

                // 返件
                if (this.sendBack) {
                    data.sourcetype = 3;
                    data.orderid = util.getParams("orderid");
                }


                Indicator.open();
                console.log(`==============》发起保存`);
                console.log(data);
                if (this.isAndroid) {
                    return api.publicInfo
                        .saveUserInfo(data)
                        .then(res => {
                            if (helper.isSuccess(res)) {
                                // 确认信息采集
                                if (res.data.ishavegps == 0) {
                                    AppBridge.notify({tag: "collect"});
                                }
                                this.next("step2");
                            }
                        })
                        .finally(Indicator.close);
                } else {
                    return api.publicInfo
                        .saveDetailInfo(data)
                        .then(res => {
                            if (helper.isSuccess(res)) {
                                // 确认信息采集
                                if (res.data.ishavegps == 0) {
                                    AppBridge.notify({tag: "collect"});
                                }
                                this.next("step2");
                            }
                        })
                        .finally(Indicator.close);
                }

            },
            /**
             * 获取服务器缓存
             * @return {*}
             */
            fetchData() {

                return api.publicInfo
                    .getUserBaseInfo({
                        retype: "3",
                        orderid: util.getParams("orderid")
                    })
                    .then(res => {

                        //  alert('val===>'+JSON.stringify(res,null,2))

                        if (res.code == 200) {
                            //{"msg":"ok","code":200,"data":{"contacts":[],"idCard":{"agency":"","cardname":"","cardno":"","entertype":1,"famadr":"","imageid":"","mediaid":"","mobileNo":"","nation":"","oppimageid":"","oppimagethumurl":"","oppimageurl":"","posimageid":"","posimagethumurl":"","posimageurl":"","updatetime":null,"validenddate":"","validstartdate":""},"userBasicInfo":{"addr":"人家怕 solo 人哦怕外婆一起了","addrarea":"440305","addrcity":"440300","addrprovince":"440000","applyamount":1,"clienttype":null,"companyaddr":"头儿这破网最热销破 Mr 度","companyarea":"440305","companycity":"440300","companyname":"1","companyprovince":"440000","degreecode":"E02","endtime":"","id":"","incomecode":"5","maritalstatus":"D04","occupations":"","productid":"","starttime":"","updatetime":"2018-06-01 15:54:01","userid":"","vertype":null}},"timestamp":"20180605211608"}

                            console.error("使用服务器数据===>", JSON.stringify(res.data.userBasicInfo, null, 2));
                            this.formData = this.formatData(res.data.userBasicInfo);

                            this.remoteData = _.cloneDeep(this.formData);
                            this.errorInfo = resolveErrorInfo(
                                res.data.returnRecordList,
                                3
                            );

                            this.initValidator();
                            this.isSubmit3 = true
                        }

                    }).catch(e => {

                        this.isSubmit3 = true
                        this.initValidator();
                    });
            },
            checkData(obj) {
                //只要有非空数据即可
                let {
                    degreecode,
                    incomecode,
                    companyname,
                    addr,
                    companyaddr,
                    applyamount
                } = obj;
                if (obj == "") {
                    console.log(`数据校验不通过！`);
                    return false;
                    // } else if (degreecode != "" || incomecode != "" || companyname != "" || addr != "" || companyaddr != "" || applyamount != "") {

                } else if (degreecode || incomecode || companyname || addr || companyaddr || applyamount) {
                    console.log(`数据校验通过！`);
                    return true;
                } else {
                    console.log(`数据校验不通过！`);
                    return false;
                }
            },
            setLocalStorage(newVal, oldVal) {
                console.log("formData changed", this.formData);
                let userid = util.getParams("fromUserId");
                let _this = this;

                this.getLocation(newVal)
                this.checkData(_this.formData) &&
                helper.set(`${userid}-userBasicInfo`, _this.formData);
            },

            //数据格式化,讲对应数据转存为data的格式
            formatData(obj) {
                let result = obj;
                // //反查数据
                // result.homeAddress = {};
                // result.companyAddress = {};
                // console.log(`数据格式化函数！`);
                // if(obj.addrarea !="" && obj.addrarea != 'undefined'){
                //     console.log("addrarea存在"+ obj.addrarea);
                //     AppBridge.getAddressByCountryCode({
                //         countryCode:obj.addrarea
                //     },res=>{
                //         console.log("调用反查接口，数据是" + JSON.stringify(res));
                //         if(res.code == 200){
                //              result.homeAddress = res.data;
                //         };
                //     })
                // };
                // //检查代码是否存在
                // result.addrcity && (result.homeAddress.cityCode = result.addrcity);
                // result.addrprovince && (result.homeAddress.provinceCode = result.addrprovince);
                // result.companycity && (result.companyAddress.cityCode = result.companycity);
                // result.companyprovince && (result.companyAddress.provinceCode = result.companyprovince);
                // if(obj.companyarea != "" && obj.companyarea != 'undefined'){
                //     console.log("companyarea"+ obj.companyarea);
                //     AppBridge.getAddressByCountryCode({
                //         countryCode:obj.companyarea
                //     },res=>{
                //         console.log("调用反查接口，数据是" + JSON.stringify(res));
                //         if(res.code == 200){
                //             result.companyAddress = res.data;
                //         }
                //     });
                // };
                // console.log("看数据"+JSON.stringify(result));

                let {
                    addrprovince,
                    addrcity,
                    addrarea,
                    companyprovince,
                    companycity,
                    companyarea
                } = result;
                if (addrarea) {
                    result.homeAddress = {
                        provinceCode: addrprovince,
                        cityCode: addrcity,
                        countryCode: addrarea,
                        provinceName: "",
                        cityName: "",
                        countryName: ""
                    };
                } else {
                    result.homeAddress = "";
                }
                if (companyarea) {
                    result.companyAddress = {
                        provinceCode: companyprovince,
                        cityCode: companycity,
                        countryCode: companyarea,
                        provinceName: "",
                        cityName: "",
                        countryName: ""
                    };
                } else {
                    result.companyAddress = "";
                }

                if (!result['addr']) {
                    result['addr'] = ''
                }

                if (!result['companyaddr']) {
                    result['companyaddr'] = ''
                }

                if (result['loanIntention']) {
                    result['tendencyCode'] = result['loanIntention']
                    result['tendencyRightText'] = '已选择';
                }

                return result;
            },
            // 监听formData变化
            startWatch() {

                /* if ( !this.formData.homeAddress &&   !this.formData.companyAddress) {
                            this.getLocation(this.formData)
                 }*/


                this.getLocation(this.formData)

                //alert(JSON.stringify( this.formData))

                this.$root.loadingClose();
                this.$watch("formData", this.setLocalStorage, {deep: true});
            },
            // 配置校验方案
            initValidator() {
                // this.$validator.localize("en", dict);
                this.$validator.localize("zh_CN", dict);
                // 地址需精确到门牌号 (判定条件为含有数字即可)
                this.$validator.extend("address", value => /\d/.test(value));
            },

            // 处理金额
            resolveAmount() {
                let value = this.formData.applyamount;
                if (!value) return;

                value = Number(value);
                // 小于500.00自动变为500.00，大于200,000.00自动变为200,000.00，
                if (value < 500) {
                    this.formData.applyamount = 500;
                } else if (value > 200000) {
                    this.formData.applyamount = 200000;
                } else if (value % 100 > 0) {
                    // 在区间内按照向下取整规则，例：输入501变为500.00，输入599变为500.00
                    this.formData.applyamount = value - value % 100;
                }
            },

            // 地址选择前申请权限
            async clickOnMask(ref) {

                if (!this.isSubmit3) {
                    return
                }
                let locationPermission = await helper.get('locationPermission');
                // let permission = await checkLocationPermission(true);

                if (this.isAndroid) {
                    if (locationPermission) {
                        this.$refs[ref].edit();
                    } else {
                        let permission = await checkLocationPermission(true);
                        if (permission) {
                            this.$refs[ref].edit();
                        }
                    }
                } else {
                    let checkLocationPermissionTag = await checkLocationPermission(true);
                    if (checkLocationPermissionTag) {
                        this.$refs[ref].edit();
                    }
                }
            },

            next(name) {
                if (this.sendBack) {
                    // 通知补件/返件刷新
                    AppBridge.notify({tag: "field"});
                    this.$root.closeWindow({refresh: true});
                } else {
                    this.isSubmit3 = true
                    this.stepNext()
                }
            },
            //借款意向查询
            getLoanIntentionConfig() {
                return new Promise((resolve, reject) => {
                    api.publicInfo
                        .getLoanIntentionConfig()
                        .then(res => {

                            //不管成功失败，都调用resolve()，因为可能没有借款意向的情况
                            if (helper.isSuccess(res) && res.data.length && res.data[0].answerDTO) this.tendencyList = res.data;
                            resolve()

                        }).catch(e => {
                        resolve()
                    })
                })
            },

            chooseFinshed(item) {
                this.formData.tendencyCode = item.code;
                this.formData.tendencyRightText = '已选择';
                console.log('借款期限选择好了', item)
                EventBus.$emit('showTendency', false);
            },
            chooseDone() {
                this.showTendency = false
                EventBus.$emit('showTendency', false);
            },

            /**
             * 获取当前位置
             */
            getLocation(obj) {


                if (obj.homeAddress && obj.companyAddress) {
                    console.log('地址不为空时，不调用定位...', JSON.stringify(obj, null, 2));
                    return
                }

                AppBridge.getLocation(res => {

                    if (res.code == '200' && res.data) {

                        //android 返回是字符串，IOS返回是个对象
                        let {province, provinceCode, city, cityCode, district, districtCode} = Object.prototype.toString.call(res.data) === '[object String]' ? JSON.parse(res.data) : res.data

                        if (province && provinceCode && city && cityCode && district && districtCode) {

                            console.error('getLocation===>', JSON.stringify(res.data, null, 2));

                            let data = {
                                provinceName: province,
                                provinceCode,
                                cityName: city,
                                cityCode,
                                countryName: district,
                                countryCode: districtCode
                            }
                            this.formData = Object.assign({}, this.formData, {
                                homeAddress: data,
                                companyAddress: data,
                            })
                        }

                    }
                    console.log('获取当前位置========>', res);
                })
            },


        },
        components: {
            stepProgress,
            formControl,
            chooseTendency,
        },
        watch: {},
        async created() {

            this.starttime = new Date().getTime();

            helper.set('locationPermission', false);


            Indicator.close()

            await this.getLoanIntentionConfig();

            // 返件修改，获取服务端数据
            if (this.sendBack) {
                console.log("返件修改，获取服务端数据");
                this.fetchData().finally(this.startWatch);

            } else {

                //读取基本信息
                let userid = util.getParams()["fromUserId"];

                helper.get(`${userid}-userBasicInfo`).then(value => {

                    //先判断本地数据内部有没有信息，有就是用本地数ju
                    if (value && this.checkData(value)) {

                        this.fetchData().finally(() => {

                            // 合并参数，远程数据优先
                            this.formData = _.extendWith({}, value, this.formData, (a, b) => {
                                return !b && b !== 0 ? a : b;
                            });

                            //有一种特殊情况，只保存了部分资料，没有填写定位信息
                            this.getLocation(this.formData)

                            console.log('this.formData', this.formData)
                            //判断是否是第二步
                            console.log('------------<<<<<<, this.tendencyList', this.tendencyList)
                            let isTendencyTwo = false;

                            if (this.tendencyList.length && this.tendencyList[0].answerDTO) {

                                this.tendencyList[0].answerDTO.forEach((item) => {
                                    console.log('this.formDat-------    item  ', item)
                                    console.log('this.formData.tendencyCode', this.formData.tendencyCode)
                                    if (item.nextQuestionnaire) {
                                        isTendencyTwo = item.nextQuestionnaire.answerDTO.some((item) => {
                                            return item.code == this.formData.tendencyCode
                                        })
                                    }
                                })
                            }

                            //高优需求 V1.1 ：  借款意向通过服务端下发,如果没有内容，清空
                            if (!(this.tendencyList.length && this.tendencyList[0].answerDTO)) {

                                console.log('高优需求 V1.1 ：  借款意向通过服务端下发,如果没有内容，清空');
                                this.formData.tendencyCode = '';
                                this.formData.tendencyRightText = '';
                            }

                            this.isTendencyTwo = isTendencyTwo;

                            this.companyNameFocused = true  //去除掉默认的错误

                            console.log("----------->>>>判断是否是第二步", this.isTendencyTwo)
                            this.startWatch();
                            this.initValidator();
                            this.isSubmit3 = true

                        })


                    } else {

                        console.log(`本地无数据============》：获取服务数据`);
                        this.fetchData().finally(this.startWatch);

                    }
                });


            }

        },
        beforeRouteLeave(to, from, next) {
            EventBus.$off("resize");
            next();
        }
    };
</script>

<style lang="scss" scoped>

    .view-step3 {
        height: 100%;
        overflow-x: hidden;
    }

    p.errorNotice {
        background: #F9E6E7;
        color: #E83134;
        text-indent: 10px;
        font-size: 12px;
        padding: 5px;
    }

    .home-address-wrap {
        position: relative;
        &::after {
            content: "";
            display: block;
            margin-left: $gap;
            @extend %border-b;
        }
    }

    .address-inputer {
        textarea {
            width: 100%;
            height: 58px;
            padding: 8px $gap;
            display: block;
            border: none;
            outline: none;
            font-size: 14px;
            line-height: 20px;
            color: #666;
        }
    }

    .error-tip {
        font-size: 12px;
        color: #e72427;
        background: #f9e6e7;
        line-height: 24px;
        padding: 0 $gap;
    }

    .c-right {
        color: #999;
    }

    .ready {
        color: #666666;
    }

    .step-arrow-right {
        height: 16px !important;
        width: 16px !important;
    }
</style>
