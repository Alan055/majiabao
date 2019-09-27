import api from "@/services/api";
import util from "@/utils";
import storage from "@/utils/storage";
import helper from "@/utils/helper";
import {
    Toast,
    Indicator,
    MessageBox
} from "@/utils/helper";
import AppBridge from "@/services/AppBridge";
import {
    checkLocationPermission,
    resolveErrorInfo
} from "./services/stepService";
import _ from "lodash";

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

export default {
    data() {
        return {
            is_show_info_credit_card: 0, //是否显示信用卡  1-显示 0-不显示
        };
    },
    computed: {
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

            if (this.is_show_info_credit_card == 1) {
                fields.push("hascreditcard")
            }

            let emptyFields = fields.filter(key =>
                util.isEmpty(this.formData[key])
            );
            console.log('emptyFields', emptyFields)
            let finished = emptyFields.length == 0 && this.errors.count() == 0;

            return finished && (!this.sendBack || this.changed);
        },
        isAndroid() {
            return util.browser.versions.android;
        }
    },
    async beforeCreate() {
        await new Promise(resolve => {
            try {
                AppBridge.getInitData({}, res => {
                    if (res.code == '200' && res.data && res.data.config) {
                        this.is_show_info_credit_card = parseInt(res.data.config.is_show_info_credit_card) || 0;
                        resolve();
                    }
                })
            } catch (error) {
                resolve();
            }
        })
    },
    async created() {

        // 返件修改，获取服务端数据
        if (this.sendBack) {
            this.fetchData().finally(this.startWatch);
        } else {
            //读取基本信息
            let userid = util.getParams()["fromUserId"];
            helper.get(`${userid}-userBasicInfo`).then(value => {
                //先判断本地数据内部有没有信息，有就是用本地数ju
                if (value && this.checkData(value)) {
                    this.formData = value;
                    this.startWatch();
                } else {
                    console.log(`本地数据值：获取服务数据`);
                    this.fetchData().finally(this.startWatch);
                }
            });
        }

        this.initValidator();
        this.getNewbieDesc();
    },
    methods: {
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
        //返回显示新手挽留弹窗
        backDialogClose(flag) {
            this.backDialog.visibility = false;

            if (flag) {
                this.sinaAds.click(this.stat.publicInfo.idCard.newbieNext_3);
                return;
            }
            //放弃申请
            this.sinaAds.click(this.stat.publicInfo.idCard.newbieWaive_3);
            this.sinaAds.click(this.stat.publicInfo.userBasicInfo.leave);
            this.setLocalStorage();
            this.$root.closeWindow();
        },

        //获取新手红包挽留文案
        async getNewbieDesc() {
            AppBridge.getUserInfo({}, res => {
                if (res.code == "200" && res.data && res.data.mobile) {
                    api.publicInfo
                        .newbiePackets({
                            accountid: util.getParams("fromUserId") || "",
                            productid: `2001`,
                            type: 3, //1身份证信息、2联系人信息、3基础信息、4完成提交申请
                            phonenum: res.data.mobile
                                //  phonenum:`18718790180`
                        })
                        .then(res2 => {
                            if (
                                res2.code == "200" &&
                                res2.data &&
                                res2.data.CONFIG &&
                                res2.data.CONFIG.length
                            ) {
                                let result = res2.data.CONFIG;

                                let item = result.filter(item => item.visibility);

                                if (item.length) {
                                    let {
                                        type,
                                        visibility
                                    } = item[0];

                                    this.backDialog = {
                                        type,
                                        visibility: false,
                                        isNeedOpen: visibility,
                                        data: Object.assign(item[0], {
                                            current: 3
                                        })
                                    };
                                    console.log(JSON.stringify(this.backDialog));
                                }
                            }
                        })
                }
            });
        },

        async submit() {

            // 表单校验
            let result = await this.$validator.validateAll();
            if (!result) {
                // invalid
                Toast(this.errors.all()[0]);
                return;
            };

            if (!this.isAndroid) {
                // 权限检查
                let permission = await checkLocationPermission(true);
                if (!permission) return;
            };

            // 返件，直接提交
            if (this.sendBack) {
                this.defendClick.wrap(this.submitConfirm);
                return;
            }

            this.sinaAds.click(
                this.stat.publicInfo.userBasicInfo.confirm
            );
            this.defendClick.wrap(this.submitConfirm);
        },
        submitConfirm() {
            this.endtime = new Date().getTime();

            let {
                degreecode,
                incomecode,
                hascreditcard,
                companyname,
                addr,
                companyaddr,
                applyamount,
                tendencyCode
            } = this.formData;

            let {
                starttime,
                endtime
            } = this;

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
                hascreditcard,
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
            if (this.isAndroid) {
                return api.publicInfo
                    .saveUserInfo(data)
                    .then(res => {
                        if (res.code == "1200006") {
                            MessageBox({
                                title: "温馨提示",
                                message: res.msg,
                                confirmButtonText: "我知道了",
                                closeOnClickModal: false
                            });
                        } else if (helper.isSuccess(res)) {
                            this.next("step2");
                        }
                    })
                    .finally(Indicator.close);
            } else {
                return api.publicInfo
                    .saveDetailInfo(data)
                    .then(res => {
                        if (res.code == "1200006") {
                            MessageBox({
                                title: "温馨提示",
                                message: res.msg,
                                confirmButtonText: "我知道了",
                                closeOnClickModal: false
                            });
                        } else if (helper.isSuccess(res)) {
                            this.next("step2");
                        }
                    })
                    .finally(Indicator.close);
            }
        },
        // 获取服务器缓存
        fetchData() {
            return api.publicInfo
                .getUserBaseInfo({
                    retype: "3",
                    orderid: util.getParams("orderid")
                })
                .then(res => {
                    if (res.code == 200) {
                        //{"msg":"ok","code":200,"data":{"contacts":[],"idCard":{"agency":"","cardname":"","cardno":"","entertype":1,"famadr":"","imageid":"","mediaid":"","mobileNo":"","nation":"","oppimageid":"","oppimagethumurl":"","oppimageurl":"","posimageid":"","posimagethumurl":"","posimageurl":"","updatetime":null,"validenddate":"","validstartdate":""},"userBasicInfo":{"addr":"人家怕 solo 人哦怕外婆一起了","addrarea":"440305","addrcity":"440300","addrprovince":"440000","applyamount":1,"clienttype":null,"companyaddr":"头儿这破网最热销破 Mr 度","companyarea":"440305","companycity":"440300","companyname":"1","companyprovince":"440000","degreecode":"E02","endtime":"","id":"","incomecode":"5","maritalstatus":"D04","occupations":"","productid":"","starttime":"","updatetime":"2018-06-01 15:54:01","userid":"","vertype":null}},"timestamp":"20180605211608"}
                        console.log("使用服务器数据");
                        this.formData = this.formatData(res.data.userBasicInfo);
                        if (!this.formData.hasOwnProperty('hascreditcard')) { //针对没有填信用卡字段的老数据，不显示
                            this.is_show_info_credit_card = 0;
                        }

                        this.remoteData = _.cloneDeep(this.formData);
                        this.errorInfo = resolveErrorInfo(
                            res.data.returnRecordList,
                            3
                        );
                    }
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
            } else if (
                degreecode != "" ||
                incomecode != "" ||
                companyname != "" ||
                addr != "" ||
                companyaddr != "" ||
                applyamount != ""
            ) {
                console.log(`数据校验通过！`);
                return true;
            } else {
                console.log(`数据校验不通过！`);
                return false;
            }
        },
        setLocalStorage() {
            console.log("formData changed", this.formData);
            let userid = util.getParams("fromUserId");
            let _this = this;
            this.checkData(_this.formData) &&
                helper.set(`${userid}-userBasicInfo`, _this.formData);
        },

        //数据格式化,讲对应数据转存为data的格式
        formatData(obj) {
            let result = obj;
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
            return result;
        },
        // 监听formData变化
        startWatch() {
            this.$root.loadingClose();
            this.$watch("formData", this.setLocalStorage, {
                deep: true
            });
        },
        // 配置校验方案
        initValidator() {
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
                AppBridge.notify({
                    tag: "field"
                });
                this.$root.closeWindow({
                    refresh: true
                });
            } else {
                this.$root.replaceRoute({
                    name
                });
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$root.loadingClose();
        })
    }
};