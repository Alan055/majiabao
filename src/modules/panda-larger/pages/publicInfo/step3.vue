<template>
  <div class="view-step3 view-public-info-step c-bg-gray">
    <c-header title="基本信息">
      <mt-button slot="left" @click="handleBack">
        <c-icon type="back" />
      </mt-button>
    </c-header>

    <!-- val=》{{tendencyList}}-->

    <div class="c-view-content">
      <div class="content-wrap" v-min-height>
        <step-progress step="3" />

        <div class="c-section">
          <form-control
            type="select"
            title="学历"
            v-model="formData.degreecode"
            source="20011002"
            name="degreecode"
            v-validate="'required'"
            v-sina-ads="stat.publicInfo.userBasicInfo.degree"
          />
          <form-control
            type="select"
            title="月均收入(元)"
            v-model="formData.incomecode"
            source="20011004"
            name="incomecode"
            v-validate="'required'"
            v-sina-ads="stat.publicInfo.userBasicInfo.income"
          />

          <form-control
            type="select"
            title="是否有信用卡"
            v-if="is_show_info_credit_card"
            v-model="formData.hascreditcard"
            source="20017008"
            name="hascreditcard"
            v-validate="'required'"
            v-sina-ads="stat.publicInfo.userBasicInfo.hascreditcard"
          />
          <form-control title="单位名称" :class="{'no-border': errors.has('companyName')}">
            <input
              slot="right"
              type="text"
              class="mint-field-core"
              v-no-emoji
              v-max-char-len="42"
              v-sina-ads="stat.publicInfo.userBasicInfo.companyName"
              @focus="companyNameFocused=true"
              @blur="companyNameFocused=false"
              placeholder="填写"
              v-model="formData.companyname"
              maxlength="42"
              name="companyName"
              v-validate="'required|minChar:8'"
            />
          </form-control>
          <p
            class="error-tip"
            v-if="!companyNameFocused && errors.has('companyName')"
          >{{errors.first('companyName')}}</p>
          <p
            class="error-tip"
            v-else-if="fields.companyName && !fields.companyName.dirty && errorInfo.companyname"
          >{{errorInfo.companyname}}</p>

          <form-control
            type="tel"
            title="期望借款金额(元)"
            v-model="formData.applyamount"
            maxlength="7"
            @blur="resolveAmount"
            name="applyamount"
            v-validate="'required'"
            v-sina-ads="stat.publicInfo.userBasicInfo.amount"
          />

          <div class="address-wrap home-address-wrap">
            <form-control
              type="addressSelect"
              title="居住地址"
              v-model="formData.homeAddress"
              ref="homeAddress"
              name="homeCity"
              v-validate="'required'"
              v-sina-ads="stat.publicInfo.userBasicInfo.homeCity"
            >
              <div
                class="c-mask"
                slot="after"
                v-if="!formData.homeAddress"
                @click="defendClick.wrap(() => clickOnMask('homeAddress'))"
              ></div>
              <!-- <div class="c-mask" slot="after" v-if="!formData.homeAddress" @click="clickOnMask('homeAddress')" ></div> -->
            </form-control>
            <div class="address-inputer" v-if="formData.homeAddress">
              <textarea
                v-model="formData.addr"
                v-no-emoji
                v-max-char-len="50"
                v-sina-ads="stat.publicInfo.userBasicInfo.homeAddress"
                placeholder="请输入详细地址信息，如道路、门牌号、小区、楼栋号、单元室等"
                maxlength="50"
                name="homeAddress"
                v-validate="'required|minChar:10'"
                @focus="homeAddressFocused=true"
                @blur="homeAddressFocused=false"
              ></textarea>
              <p class="error-tip" v-if="homeAddressFocused">地址需精确到门牌号，例: 沙河路10号石鼓花园6栋601室</p>
              <p
                class="error-tip"
                v-else-if="errors.has('homeAddress')"
              >{{errors.first('homeAddress')}}</p>
              <p
                class="error-tip"
                v-else-if="fields.homeAddress && !fields.homeAddress.dirty && errorInfo.addr"
              >{{errorInfo.addr}}</p>
            </div>
          </div>

          <div class="address-wrap">
            <form-control
              type="addressSelect"
              title="工作地址"
              v-model="formData.companyAddress"
              ref="companyAddress"
              name="companyCity"
              v-validate="'required'"
              v-sina-ads="stat.publicInfo.userBasicInfo.companyCity"
            >
              <div
                class="c-mask"
                slot="after"
                v-if="!formData.companyAddress"
                @click="defendClick.wrap(() => clickOnMask('companyAddress'))"
              ></div>
              <!-- <div class="c-mask" slot="after" v-if="!formData.companyAddress" @click="clickOnMask('companyAddress')" ></div> -->
            </form-control>
            <div class="address-inputer" v-if="formData.companyAddress">
              <textarea
                v-model="formData.companyaddr"
                v-no-emoji
                v-max-char-len="50"
                v-sina-ads="stat.publicInfo.userBasicInfo.companyAddress"
                placeholder="请输入详细地址信息，如道路、门牌号、小区、楼栋号、单元室等"
                maxlength="50"
                name="companyAddress"
                v-validate="'required|minChar:10'"
                @focus="companyAddressFocused=true"
                @blur="companyAddressFocused=false"
              ></textarea>
              <p class="error-tip" v-if="companyAddressFocused">地址需精确到门牌号，例: 沙河路10号石鼓花园6栋601室</p>
              <p
                class="error-tip"
                v-else-if="errors.has('companyAddress')"
              >{{errors.first('companyAddress')}}</p>
              <p
                class="error-tip"
                v-else-if="fields.companyAddress && !fields.companyAddress.dirty && errorInfo.companyaddr"
              >{{errorInfo.companyaddr}}</p>
            </div>
          </div>
        </div>

        <div class="c-button-group">
          <mt-button
            type="primary"
            size="large"
            class="btn-lg btn-primary btn-round"
            :disabled="!finished"
            @click.native="submit"
            v-sina-ads="stat.publicInfo.userBasicInfo.submit"
          >提交</mt-button>
        </div>
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
import { Toast, Indicator, MessageBox } from "@/utils/helper";
import { mapGetters, mapMutations, mapActions } from "vuex";
import stepProgress from "./components/stepProgress";
import formControl from "@/components/common/formControl";
import AppBridge from "@/services/AppBridge";
import backDialog from "./components/noobDialog";
import EventBus from "@/services/EventBus";
import "./style/index.scss";
import {
  checkLocationPermission,
  resolveErrorInfo
} from "./services/stepService";
import DefendClick from "@/utils/DefendClick";
import _ from "lodash";

import chooseTendency from "./components/chooseTendency";

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
        hascreditcard: "",
        companyaddr: "",
        tendencyCode: "",
        tendencyRightText: ""
      },
      isTendencyTwo: false,
      showBack: false, //是否显示后退
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
  mixins: [require("@/modules/panda/pages/publicInfo/mixins").default],
  computed: {
    ...mapGetters([])
  },
  methods: {
    ...mapMutations([]),

    // 处理返回
    handleBack() {
      document.activeElement.blur();

      this.sinaAds.click(this.stat.publicInfo.userBasicInfo.back);

      if (this.sendBack) return this.$root.closeWindow();

      if (this.backDialog) {
        let messageBoxType = [1]; //标记弹窗类型不为:messageBox

        //弹窗类型不为messageBox
        if (messageBoxType.indexOf(this.backDialog.type) != -1) {
          this.backDialog.visibility = true;
          return;
        }
        let { title, button, desc } = this.backDialog.data;
        MessageBox({
          title: title,
          //   message: desc,
          //   showCancelButton: true,
          //   confirmButtonText: button[1],
          //   cancelButtonText: button[0]
          message: "填写基本资料，即可快速到账，是否继续？",
          showCancelButton: true,
          confirmButtonText: "继续借款",
          cancelButtonText: "残忍放弃"
        }).then(action => {
          if (action == "cancel") {
            this.sinaAds.click(this.stat.publicInfo.userBasicInfo.leave);
            this.setLocalStorage();
            this.$root.closeWindow();
          } else {
            this.sinaAds.click(this.stat.publicInfo.userBasicInfo.continue);
          }
        });
        return;
      }

      this.setLocalStorage();

      this.sinaAds.click(this.stat.publicInfo.userBasicInfo.leave);
      this.$root.closeWindow();
    }
  },
  components: {
    stepProgress,
    formControl,
    chooseTendency,
    backDialog
  },
  async created() {
    this.starttime = new Date().getTime();

    helper.set("locationPermission", false);

    AppBridge.setWebAttribute({ intercept: true });
    EventBus.$on("back", this.handleBack);
  },
  beforeRouteLeave(to, from, next) {
    EventBus.$off("back");
    AppBridge.setWebAttribute({ intercept: false });
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
