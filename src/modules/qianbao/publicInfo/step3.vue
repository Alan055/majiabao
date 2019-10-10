<template>
  <div class="view-step3 view-public-info-step c-bg-gray">
    <c-header title="基本信息">
      <mt-button slot="left" @click="handleBack">
        <c-icon type="back"/>
      </mt-button>
    </c-header>

    <!-- val=》{{tendencyList}}-->

    <div class="c-view-content">
      <div class="content-wrap" v-min-height>
        <step-progress step='3'/>


        <div class="c-section">
          <form-control type="select" title="学历" v-model="formData.degreecode" source="20011002" name="degreecode"
                        v-validate="'required'" v-sina-ads="stat.publicInfo.userBasicInfo.degree"/>
          <form-control type="select" title="月均收入(元)" v-model="formData.incomecode" source="20011004" name="incomecode"
                        v-validate="'required'" v-sina-ads="stat.publicInfo.userBasicInfo.income"/>
          <form-control title="单位名称" :class="{'no-border': errors.has('companyName')}">
            <input slot="right" type="text" class="mint-field-core" v-no-emoji v-max-char-len="42"
                   v-sina-ads="stat.publicInfo.userBasicInfo.companyName" @focus="companyNameFocused=true"
                   @blur="companyNameFocused=false" placeholder="填写" v-model="formData.companyname" maxlength="42"
                   name="companyName" v-validate="'required|minChar:8'">
          </form-control>
          <p class="error-tip" v-if="!companyNameFocused && errors.has('companyName')">
            {{errors.first('companyName')}}</p>
          <p class="error-tip" v-else-if="fields.companyName && !fields.companyName.dirty && errorInfo.companyname">
            {{errorInfo.companyname}}</p>

        <form-control type="tel" title="期望借款金额(元)" v-model="formData.applyamount" maxlength="7" @blur="resolveAmount"
                    name="applyamount" v-validate="'required'" v-sina-ads="stat.publicInfo.userBasicInfo.amount"/>

          <div class="address-wrap home-address-wrap">
            <form-control type="addressSelect" title="居住地址" v-model="formData.homeAddress" ref="homeAddress"
                          name="homeCity" v-validate="'required'" v-sina-ads="stat.publicInfo.userBasicInfo.homeCity">
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
              <p class="error-tip" v-else-if="errors.has('homeAddress')">{{errors.first('homeAddress')}}</p>
              <p class="error-tip" v-else-if="fields.homeAddress && !fields.homeAddress.dirty && errorInfo.addr">
                {{errorInfo.addr}}</p>
            </div>
          </div>

          <div class="address-wrap">
            <form-control type="addressSelect" title="工作地址" v-model="formData.companyAddress" ref="companyAddress"
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
              <p class="error-tip" v-else-if="errors.has('companyAddress')">{{errors.first('companyAddress')}}</p>
              <p class="error-tip"
                 v-else-if="fields.companyAddress && !fields.companyAddress.dirty && errorInfo.companyaddr">
                {{errorInfo.companyaddr}}</p>
            </div>
          </div>
        </div>

        <div class="c-button-group">
          <mt-button type="primary" size="large" class="btn-lg btn-primary btn-round" :disabled="!finished"
                     @click.native="submit" v-sina-ads="stat.publicInfo.userBasicInfo.submit">下一步
          </mt-button>
        </div>

      </div>
    </div>


    <backDialog v-if="backDialog && backDialog.isNeedOpen && backDialog.visibility && backDialog.type==1"
                :visibility="backDialog.visibility"
                :data="backDialog.data"
                @close="backDialogClose"/>

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
  import backDialog from '@/components/business/noobDialog'

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

  export default {
    name: "step3",
    data() {
      return {
        errorInfo: {}, //返件错误信息

        //返回弹窗
        backDialog: null,

        formData: {
          applyamount: "",
          companyname: "",
          addr: "",
          companyaddr: "",
          tendencyCode: '',
          tendencyRightText: '',
        },
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
        console.log('emptyFields', emptyFields)
        let finished = emptyFields.length == 0 && this.errors.count() == 0;
        /*
        let {
                  degreecode,
                  incomecode,
                  companyname,
                  applyamount,
                  homeAddress,
                  companyAddress,
                  addr,
          companyaddr,
          tendencyCode
        } = this.formatData;
        let finished = degreecode && incomecode && companyname && applyamount && homeAddress && addr && companyaddr && tendencyCode;
        console.log('tendencyCode', tendencyCode)*/
        // if(!this.formData.tendencyCode){
        //   return false;
        // }
        return finished && (!this.sendBack || this.changed);
      },
      isAndroid() {
        return util.browser.versions.android;
      }
    },
    methods: {
      ...mapMutations([]),

      //返回显示新手挽留弹窗
      backDialogClose(flag) {

        this.backDialog.visibility = false

        if (flag) {
          this.sinaAds.click(this.stat.publicInfo.idCard.newbieNext_3);
          return
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
          if (res.code == '200' && res.data && res.data.mobile) {
            api.publicInfo.newbiePackets({
              accountid: util.getParams('fromUserId') || '',
              productid: `2001`,
              type: 3, //1身份证信息、2联系人信息、3基础信息、4完成提交申请
              phonenum: res.data.mobile,
             //  phonenum:`18718790180`

            }).then(res2 => {

              if (res2.code == '200' && res2.data && res2.data.CONFIG && res2.data.CONFIG.length) {

                let result = res2.data.CONFIG

                console.log('弹窗文案===================>');
                console.log(res2);

                let item = result.filter(item => item.visibility)

                if (item.length) {
                  let {type, visibility,} = item[0]

                  this.backDialog = {
                    type,
                    visibility: false,
                    isNeedOpen: visibility,
                    data: Object.assign(item[0], {current: 3}),
                  }
                  console.log(JSON.stringify(this.backDialog));
                }
              }
            }).catch(e => {
              //Toast(e)
            })
          }
        })
      },

      // 处理返回
      handleBack() {

        document.activeElement.blur();

        this.sinaAds.click(this.stat.publicInfo.userBasicInfo.back);

        if (this.sendBack) return this.$root.closeWindow();

        if (this.backDialog) {

          let messageBoxType = [1]; //标记弹窗类型不为:messageBox

          //弹窗类型不为messageBox
          if (messageBoxType.indexOf(this.backDialog.type) != -1) {
            this.backDialog.visibility = true
            return
          }
          let {title, button, desc} = this.backDialog.data
          MessageBox({
            title: title,
            message: desc,
            showCancelButton: true,
            confirmButtonText: button[1],
            cancelButtonText: button[0],
          }).then(action => {
            if (action == "cancel") {
              this.sinaAds.click(this.stat.publicInfo.userBasicInfo.leave);
              this.setLocalStorage();
              this.$root.closeWindow();
            } else {
              this.sinaAds.click(this.stat.publicInfo.userBasicInfo.continue);
            }
          });
          return
        }

        this.setLocalStorage();

        this.sinaAds.click(this.stat.publicInfo.userBasicInfo.leave);
        this.$root.closeWindow();
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
        return result;
      },
      // 监听formData变化
      startWatch() {
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
          this.$root.replaceRoute({name});
        }
      },
      //借款意向查询
      getLoanIntentionConfig() {
        return new Promise((resolve, reject) => {
          api.publicInfo
            .getLoanIntentionConfig()
            .then(res => {
              if (helper.isSuccess(res)) {


                //loy-debug===>
                // res=null

                if (res.data.length && res.data[0].answerDTO) {

                  // alert(JSON.stringify(res.data,null,3))
                  this.tendencyList = res.data;

                }


                resolve()
                //  console.log('.......................this.tendencyList', this.tendencyList[0].answerDTO)
              }
            })
        })
      },
      chooseFinshed(item) {
        this.formData.tendencyCode = item.code;
        this.formData.tendencyRightText = '已选择';
        console.log('借款期限选择好了', item)
      }
    },
    components: {
      stepProgress,
      formControl,
      chooseTendency,
      backDialog,
    },
    watch: {},
    mounted () {
      this.$nextTick(() => {
        this.$root.loadingClose();
      })
    },
    async created() {
      //let userid = util.getParams()["fromUserId"];
      //helper.remove(`${userid}-userBasicInfo`)
      this.starttime = new Date().getTime();

      this.getNewbieDesc()

      helper.set('locationPermission', false);

      AppBridge.setWebAttribute({intercept: true});
      EventBus.$on("back", this.handleBack);

      /*  不要删除这段代码，后面版本要恢复

      AppBridge.getInitData(res => {
        console.log('获取全部的初始化信息', res)
        if(res.data){
          var systemParamConfBeans = res.data.system.systemcode.filter(item => {
            return item.servicetype == '20017007';
          });
          var questionnaires = {};
          var answers={};
          var result=new Array();
          for(var i=0;i<systemParamConfBeans.length;i++){
                var systemParamConfBean=systemParamConfBeans[i];
              if(systemParamConfBean.plevel == 0){
                  var array=new Array();
                  var questionnaireDTO={
                  "code":systemParamConfBean.pcode,
                  "content":systemParamConfBean.pname,
                  "parentCode":systemParamConfBean.parentcode,
                  "answerDTO" : array
                  };
                  questionnaires[''+systemParamConfBean.pcode]=questionnaireDTO;
                  if(answers.hasOwnProperty(''+systemParamConfBean.parentcode)){
                      answers[''+systemParamConfBean.parentcode]['nextQuestionnaire']=questionnaireDTO;
                  }
                  if(!systemParamConfBean.parentcode){
                      result.push(questionnaireDTO);
                  }
              }else if(systemParamConfBean.plevel == 1){
                  var answerDTO={
                  "code":systemParamConfBean.pcode,
                  "content":systemParamConfBean.pname,
                  "parentCode":systemParamConfBean.parentcode
                  };
                  answers[''+systemParamConfBean.pcode]=answerDTO;
                  if(questionnaires.hasOwnProperty(''+systemParamConfBean.parentcode)){
                    questionnaires[''+systemParamConfBean.parentcode]['answerDTO'].push(answerDTO);
                  }
              }
          }
        }
        //console.log("获取app初始化信息", result)
        this.tendencyList = result;

        console.log("----------->>>>获取app初始化信息", result)
        console.log("获取app初始化信息", this.tendencyList)
      })*/

      //await this.getLoanIntentionConfig();

      // 返件修改，获取服务端数据
      if (this.sendBack) {
        console.log("返件修改，获取服务端数据");
        this.fetchData().finally(this.startWatch);
      } else {
        //读取基本信息
        let userid = util.getParams()["fromUserId"];
        helper.get(`${userid}-userBasicInfo`).then(value => {
          console.log("本地数据值：" + JSON.stringify(value));
          //先判断本地数据内部有没有信息，有就是用本地数ju
          if (value && this.checkData(value)) {
            this.formData = value;
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
            console.log("----------->>>>判断是否是第二步", this.isTendencyTwo)
            this.startWatch();
          } else {
            console.log(`本地数据值：获取服务数据`);
            this.fetchData().finally(this.startWatch);
          }
        });
      }

      this.initValidator();
    },
    beforeRouteLeave(to, from, next) {
      EventBus.$off("back");
      AppBridge.setWebAttribute({intercept: false});
      next();
    }
  };
</script>

<style lang="scss" scoped>
  .view-step3 {
    height: 100%;
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
