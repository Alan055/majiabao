<template lang="html">
    <div class="home-page-detail view c-view">
        <div class="c-view-content">
            <div class="title">（一）为什么选择大王贷款</div>
            <div class="desc">
                <ul>
                    <li>1.额度高—最高20万额度</li>
                    <li>2.门槛低—凭身份证即可申请</li>
                    <li>3.放款快—快至当天放款</li>
                </ul>
            </div>

            <div class="title">（二）贷款前需要准备什么资料</div>
            <div class="desc">
                <ul>
                    <li>1.手机号码—及时知道借款进度，获取福利活动</li>
                    <li>2.身份证—身份信息认证是正规网贷平台的硬性条件</li>
                    <li>3.银行卡—借款成功后，这张卡可用于收款和还款哦。</li>
                </ul>
            </div>

            <div class="title">（三）借款有哪些步骤</div>
            <div class="desc step-list">
                <div class="step step1">
                    <img src="../images/jq.png" />
                </div>
                <div class="step step2">
                    <img src="../images/ed.png" />
                </div>
                <div class="step step3">
                    <img src="../images/sq.png" />
                </div>
                <div class="step step4">
                    <img src="../images/sqian.png" />
                </div>
            </div>
            <div class="step-text">
                <p>实名认证</p>
                <p>获得额度</p>
                <p>申请借款</p>
                <p>坐等收钱</p>
            </div>
        </div>
    </div>
</template>

<script>
  import Api from '@/services/api'
  import helper from '@/utils/helper'
  import EventBus from '@/services/EventBus'
  import {Toast, Indicator} from '@/utils/helper'
  import AppBridge from '@/services/AppBridge'

  export default {
    data() {
      return {
        item: {

        }
      }
    },


    methods: {

    },
    created () {


    },
    mounted () {
      this.$nextTick(() => {
        this.$root.loadingClose();
      })
    },
    filters: {
    }
  }
</script>

<style lang="scss" scoped>
.home-page-detail {
    .c-view-content {
        padding: 0 18px;

        .title {
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #333333;
            letter-spacing: -0.45px;
            text-align: justify;
            line-height: 24px;
            margin: 12px 0;
            font-weight: 600;
        }

        .desc {
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #666666;
            letter-spacing: -0.45px;
            line-height: 24px;

            ul {
                line-height: 24px;
            }
        }

        .step-list {
            display: flex;
            width: 100%;
            justify-content: center;
            align-items: center;
            margin-top: 30px;

            .step {
                width: 25%;
                position: relative;
                text-align: center;
                img {
                    content: normal !important;
                    width: 24px;
                    height: auto;
                }

                &:not(:last-child) {
                    &:after {
                        border-bottom-width: 0;
                        border-left-width: 0;
                        border: .142857rem solid #c8c8cd;
                        border-bottom-width: 0;
                        border-left-width: 0;
                        content: " ";
                        top: 50%;
                        right: 0;
                        position: absolute;
                        width: .357143rem;
                        height: .357143rem;
                        -webkit-transform: translateY(-50%) rotate(45deg);
                        transform: translateY(-50%) rotate(45deg);
                    }
                }
            }
        }
        .step-text {
            display: flex;
            width: 100%;
            justify-content: center;
            align-items: center;

            p {
                width: 25%;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #666666;
                letter-spacing: 0.12px;
                text-align: center;
            }
        }
    }
}
</style>
