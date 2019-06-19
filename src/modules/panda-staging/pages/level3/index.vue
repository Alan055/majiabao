<template>
    <div class="level3-wrap">


        <template v-if="applyDone!=0">

            <div class="c-layer">
                <div class="pull-down-bg"></div>
            </div>

            <!-- IOS在滚动时界面不会重绘，将数据打印在此以强制触发重绘 -->
            <div class="c-layer" style="overflow: hidden">{{input}}{{assetsCheckedList}}</div>


            <div class="c-layer">
                <c-header class="header" title="线下大额贷款" :show="true" :transparent="!showHeader">
          <span slot="left" @click="handleBack">
              <mt-button>
                  <img v-if="!showHeader" class="c-icon icon_c" src="~@/assets/images/home/ad_co@2x.png" width="20px"/>
                  <c-icon type="back" v-else/>
              </mt-button>
          </span>
                </c-header>
            </div>
            <div class="c-view-content" @scroll="scrollControl.listen($event)">
                <div class="banner" :style="`padding-top: ${$root.statusHeight}px`">
                    <img class="block" :src="bannerPic" alt="">
                </div>

                <div class="loan-info-wrap">
                     <div class="noticeModel">
                         <p>重要提醒：此产品为线下大额贷款，有专门的贷款顾问提供服务，若无真实贷款需求，请勿提交！</p>
                     </div>
                    <div class="apply-undone">
                        <div class="info-box">
                            <dl class="info-box-item c-border-b c-table-row"
                                v-sina-ads="stat.recommend.offline.applyamount">
                                <dt>贷款金额</dt>
                                <dd><input type="tel" :class="{'strong': !!input.applyamount}" placeholder="1万元起"
                                           maxlength="8"
                                           v-model="input.applyamount"><span class="unit">万元</span></dd>
                            </dl>

                            <dl class="info-box-item c-border-b c-table-row"
                                v-sina-ads="stat.recommend.offline.applydeadline">
                                <dt>贷款期限</dt>
                                <dd><input type="tel" :class="{'strong': !!input.applydeadline}" placeholder="填写"
                                           maxlength="3" v-model="input.applydeadline"><span class="unit">个月</span></dd>
                            </dl>

                            <ul class="have sal">
                                <li class="tit">工资发放形式</li>
                                <li v-for="(item,index) in dictionary.salaryprovide" :class="{'active':item.value==input.payroll}"
                                    @click="input.payroll=item.value" :key="index">{{item.text}}
                                </li>
                            </ul>

                            <dl class="assets-box"
                                v-sina-ads="stat.recommend.offline.assets">
                                <dt>资产情况</dt>
                                <dd class="assets-info">
                <span v-for="(item,index) in dictionary.asset" :class="{'active': assetsCheckedList[item.value]}"
                      @click="changeItem(item.value)" :key="index">{{item.text}}</span>
                                </dd>
                            </dl>

                            <ul v-if="dictionary.creditCardList.length" style="margin-top: 18px;" class="have">
                                <li class="tit">有无信用卡</li>
                                <li v-for="(item) in dictionary.creditCardList"
                                    :class="{'active':input.isHaveCreditCard==item.value}"
                                    @click="thirdParty(item.value,'isHaveCreditCard')">{{item.text}}
                                </li>
                            </ul>

                            <ul  v-if="dictionary.weiLiDaiList.length"   class="have">
                                <li class="tit">有无微粒贷</li>
                                <li v-for="(item) in dictionary.weiLiDaiList"
                                    :class="{'active':input.isHaveWeiLiDai==item.value}"
                                    @click="thirdParty(item.value,'isHaveWeiLiDai')">{{item.text}}
                                </li>

                            </ul>

                        </div>
                        <div class="info-supplement-box c-border-t">
                            <p>点击立即申请即同意
                                <span v-sina-ads="stat.recommend.offline.agreement"
                                      @click="$root.openUrl(agreements.url)">《{{agreements.name}}》</span>
                            </p>

                            <div class="btn" :class="{'active':submitStatus}" v-sina-ads="stat.recommend.offline.submit"
                                 @click="submit()"
                            >立即申请
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>


        <template v-else>

            <div class="c-layer">
                <c-header title="线下大额贷" :show="true">
                  <span slot="left" @click="handleBack">
                      <mt-button>
                          <c-icon type="back"/>
                      </mt-button>
                  </span>
                </c-header>

                <div class="success-wrap">
                    <div class="success-box">
                        <div class="icon-box">
                            <img src="~@/assets/images/home/chenggong@2x.png" alt="">
                        </div>
                        <h4>资料提交成功</h4>
                        <p>请保持电话畅通，贷款顾问将以手机电话联系您</p>
                    </div>
                </div>

                <div class="clearBoth bg"></div>

                <div class="apply-done">
                    <div class="c-border-b info-middle">
                        <div class="info-box">
                            <dl class="info-box-item c-flex-row">
                                <dt>申请时间</dt>
                                <dd>
                                    <p class="c-tl">{{applyData.createtime | format('YYYY-MM-DD HH:mm')}}</p>
                                </dd>
                            </dl>
                            <dl v-if="applyData.applyamount" class="info-box-item c-flex-row">
                                <dt>申请金额</dt>
                                <dd><p class="c-tl ">{{Number(applyData.applyamount)/10000}}&nbsp;万元</p></dd>
                            </dl>

                            <dl class="info-box-item c-flex-row" v-if="applyData.applydeadline">
                                <dt>贷款期限</dt>
                                <dd><p class="c-tl ">{{applyData.applydeadline}}&nbsp;个月</p></dd>
                            </dl>

                            <dl class="info-box-item c-flex-row">
                                <dt>工资发放形式</dt>
                                <dd><p class="c-tl">{{payroll}}</p></dd>
                            </dl>
                            <dl class="info-box-item c-flex-row">
                                <dt>资产情况</dt>
                                <dd><p class="c-tl">{{applyData.relationString || '无'}}</p></dd>
                            </dl>

                            <dl v-if="applyData.isHaveCreditCard" class="info-box-item c-flex-row">
                                <dt>有无信用卡</dt>
                                <dd><p class="c-tl">{{applyData.isHaveCreditCard || '无'}}</p></dd>
                            </dl>

                            <dl v-if="applyData.isHaveWeiLiDai" class="info-box-item c-flex-row">
                                <dt>有无微粒贷</dt>
                                <dd><p class="c-tl">{{applyData.isHaveWeiLiDai || '无'}}</p></dd>
                            </dl>

                        </div>
                    </div>
                    <div class="info-bottom">
                        <p>上述信息仅用于当地线下贷款机构服务</p>
                        <p>若您不想使用该服务，请点击<span class="info-blue" @click="revoke"
                                              v-sina-ads="stat.recommend.offline.revoke">撤销申请</span></p>
                    </div>
                </div>

            </div>


        </template>


        <!--撤销-->
        <div class="c-view cancel-wrap " v-if="isCancel">
            <div class="c-view cancel-shadow "></div>
            <div class="cancel-box">
                <div class="title">
                    <h4>撤销申请的理由是</h4>
                    <p>撤销后，贷款机构将取消对您的服务</p>
                    <div class="icon-close-box" @click="revoke">
                        <img src="~@/assets/images/firstmerchant/bf_aab@2x.png" alt="">
                    </div>
                </div>
                <div class="cancel-items-list">
                    <ul>
                        <li v-for="(item,index) in dictionary.offlinereason"
                            :class="{'isCheck': reasonCheckedList[item.value]}"
                            @click="chooseReason(item.value)" :key="index">
                            <i></i>{{item.text}}
                        </li>
                    </ul>
                    <div class="other-reason">
            <textarea name="" id="" cols="30" rows="10" placeholder="其他理由" v-model="reasonsText" maxlength="60"
                      @keyup="filterTextarea($event)"></textarea>
                    </div>
                </div>
                <div class="btn submit" v-sina-ads="stat.recommend.offline.revoke" @click="revokeClick"
                     :class="{'active':revokeStatus}">提交
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
    import {mapGetters, mapMutations, mapActions} from "vuex";
    
    import {Indicator, Toast, MessageBox} from "@/utils/helper";
    import RegMap from "@/utils/RegMap";
    import Vue from "vue";
    import EventBus from '@/services/EventBus';
    import ScrollControl from '@/utils/ScrollControl'

    export default {
        name: "level3",
        data() {
            return {
                //是否已完成资料提交 -1：未申请 0:已申请 1:已撤销
                applyDone: util.getParams("status") || -1,
                isCancel: false,
                input: {
                    applyamount: "",
                    username: "",
                    usermobile: "",
                    payroll: "",
                    applydeadline: "",
                    isHaveCreditCard: '', //有无信用卡
                    isHaveWeiLiDai: '', //有无微粒贷
                },

                assetsCheckedList: {}, //资产情况
                reasonCheckedList: {}, //撤销原因
                applyData: {},
                reasonsText: "",
                bannerPic: '',

                //排除以下code值, 有无信用卡
                filterCode1: ['10096', '10097'],  //10096 有  10097 无

                //有无微粒贷
                filterCode2: ['10098', '10099'], //10098 有  10097 无

                dictionary: {
                    asset: [],
                    salaryprovide: [],
                    offlinereason: [],
                    creditCardList: [], //有无信用卡
                    weiLiDaiList: [], //有无微粒贷
                },
                agreements: {},
                showHeader: false,
                scrollControl: new ScrollControl()
            };
        },
        computed: {
            ...mapGetters(["serviceType"]),
            submitStatus() {
                let {applyamount, username, usermobile, payroll, applydeadline, isHaveCreditCard, isHaveWeiLiDai} = this.input;

                return Boolean(
                    applyamount &&
                    isHaveCreditCard != '' && isHaveWeiLiDai != '' &&
                    //username &&
                    applydeadline &&
                    usermobile &&
                    /1\d{10}/.test(usermobile) &&
                    payroll
                );
            },
            revokeStatus() {
                let isCheckNum = Object.keys(this.reasonCheckedList).length;
                return Boolean(isCheckNum > 0 || util.getCharLen(this.reasonsText) >= 10);
            },
            // 工资发放形式
            payroll() {
                let match =
                    this.dictionary.salaryprovide.filter(
                        item => item.value == this.applyData.payroll
                    )[0] || {};
                return match.text || "";
            }
        },
        methods: {
            ...mapActions(['fetchServiceType']),

            thirdParty(value, key) {
                this.input[key] = value
                console.log();
            },
            /*
            *   选择资产情况
            */
            changeItem: function (value) {
                if (this.assetsCheckedList.hasOwnProperty(value)) {
                    this.$delete(this.assetsCheckedList, value);
                } else {
                    this.$set(this.assetsCheckedList, value, true);
                }
            },

            handleClick: function () {
                this.$root.closeWindow();
            },
            submit: function () {

                if (!this.submitStatus) return;


                if (parseInt(this.input.applyamount) < 1) {
                    this.input.applyamount = ''
                    return Toast("线下借款最低申请金额为1万元，请重新填写。");
                }

                if (/\D/.test(this.input.applydeadline)) {
                    return Toast("月份必须为数字");
                }

                if (/^0/.test(this.input.applydeadline)) {
                    return Toast("请输入正确的月份");
                }

                this.input.city = util.getParams("city");
                this.input.assetsituation = Object.keys(this.assetsCheckedList).join() + `,${ this.input.isHaveCreditCard},${this.input.isHaveWeiLiDai}`;


                let formData = JSON.parse(JSON.stringify(this.input))

                formData.applyamount = Number(this.input.applyamount * 10000)

                /*  console.log(JSON.stringify(formData, null, 2));
                  return*/

                Indicator.open();
                api.home
                    .apply(formData)
                    .then(res => {

                        if (res.code == 200) {
                            MessageBox({
                                title: "申请成功",
                                message: "请保持电话畅通，稍后线下贷款顾问将会以手机电话联系您，帮你解决资金问题。",
                                confirmButtonText: "我知道了"
                            }).then(action => {
                                this.$root.backHome();
                            });
                        } else {
                            Toast(res.msg)
                        }
                    })
                    .finally(Indicator.close);
            },
            //勾选撤销理由
            chooseReason: function (value) {
                if (this.reasonCheckedList.hasOwnProperty(value)) {
                    this.$delete(this.reasonCheckedList, value);
                } else {
                    this.$set(this.reasonCheckedList, value, true);
                }
            },
            //撤销弹窗
            revoke() {
                this.isCancel = !this.isCancel;
            },
            //获取数据
            applyDetails() {
                api.home.applyDetails({}).then(res => {
                    if (res.code == 200) {
                        this.bannerPic = res.data.bannerpic;

                        //  alert( this.bannerPic )

                        // 等于1时才有数据
                        if (res.data.existFlag != 1) return;

                        //兼容老版本数据
                        if (!res.data.hasOwnProperty('applydeadline')) {
                            res.data = Object.assign(res.data, {
                                applydeadline: ''
                            })
                        }

                        if (!res.data.hasOwnProperty('prompt')) {
                            res.data = Object.assign(res.data, {
                                prompt: '您已成功提交贷款需求，信贷经理近期会联系您，请耐心等待'
                            })
                        }


                        let tempData = Object.assign({}, res.data) // JSON.parse(JSON.stringify(res.data))

                        let tempList = [], newArr = [], res2 = [], res3 = [];
                        tempData.relationcode.split(",").map(item => {

                            //资产code
                            if ([...this.filterCode2, ...this.filterCode1].indexOf(item) == -1) {
                                tempList.push(item)
                            }

                            //提取信用卡code
                            if (this.filterCode1.indexOf(item) != -1) {
                                res2.push(item)
                            }

                            //提取微粒贷code
                            if (this.filterCode2.indexOf(item) != -1) {
                                res3.push(item)
                            }
                        })

                        //是否选择信用卡
                        if (res2.length && this.dictionary.creditCardList.length) {
                            let temp1 = this.dictionary.creditCardList.filter(item => item.value == res2[0])
                            if (temp1) tempData['isHaveCreditCard'] = temp1[0].text
                        }

                        //是否选择微粒贷
                        if (res3.length && this.dictionary.weiLiDaiList.length) {
                            let temp1 = this.dictionary.weiLiDaiList.filter(item => item.value == res3[0])
                            if (temp1) tempData['isHaveWeiLiDai'] = temp1[0].text
                        }

                        this.applyData = tempData;

                        console.error('资产code==>', JSON.stringify(tempList, null, 2));
                        console.error('res2==>', JSON.stringify(res2, null, 2));
                        console.error('res3==>', JSON.stringify(res3, null, 2));

                        //for (let i of this.applyData.relationcode.split(",")) {

                        //有无资产，倒查
                        for (let i of tempList) {
                            let match =
                                this.dictionary.asset.filter(item => item.value == i)[0] || {};
                            this.assetsCheckedList[i] = true;
                            newArr.push(match.text);
                        }

                        //有无信用卡倒查
                        this.applyData.relationString = newArr.join("  ");

                        let {applyamount, username, usermobile, applydeadline, payroll} = res.data;

                        applyamount = parseInt(applyamount) / 1000
                        this.input = {applyamount, username, usermobile, payroll, applydeadline};
                    } else Toast(res.msg);
                }).finally(this.$root.loadingClose);
            },
            //撤销
            revokeClick() {
                if (!this.revokeStatus) return;
                api.home
                    .revoke({
                        reasons: this.reasonsText,
                        reasonscode: Object.keys(this.reasonCheckedList).join()
                    })
                    .then(res => {
                        if (res.code == 200) {
                            Toast("撤销申请成功");
                            this.$root.backHome();
                        } else Toast(res.msg);
                    });
            },

            // 获取下拉列表
            fetchDictionary() {
                // 资产情况
                this.fetchServiceType('20011009').then(data => {


                    console.error('=============>');
                    console.log(JSON.stringify(data, null, 2));

                    let res1 = [], res2 = [], res3 = [];

                    data.map(item => {

                        //资产code
                        if ([...this.filterCode2, ...this.filterCode1].indexOf(item.value) == -1) {
                            res1.push(item)
                        }

                        //提取信用卡code
                        if (this.filterCode1.indexOf(item.value) != -1) {
                            res2.push(item)
                        }

                        //提取微粒贷code
                        if (this.filterCode2.indexOf(item.value) != -1) {
                            res3.push(item)
                        }
                    });


                    this.dictionary.asset = res1
                    this.dictionary.creditCardList = res2
                    this.dictionary.weiLiDaiList = res3
                })

                // 工资发放形式
                this.fetchServiceType('20011036').then(data => {
                    this.dictionary.salaryprovide = data
                })

                // 撤销原因
                this.fetchServiceType('20011010').then(data => {
                    this.dictionary.offlinereason = data
                })
            },
            //后退置首页
            handleBack() {
                this.$root.backHome();
            },
            //过滤表情
            filterTextarea(event) {
                if (event.target.value) {
                    this.reasonsText = event.target.value.replace(RegMap.emoji, "");
                }
            }
        },
        created() {
            // detail里面包含banner图片配置信息
            this.applyDetails();

            // 获取注册手机号
            this.$AppBridge.getUserInfo(res => {

                if (!this.input.usermobile) {
                    this.input.usermobile = res.data.mobile;
                }
                if (!this.input.username) {
                    this.input.username = res.data.realname
                }
            });

            this.fetchDictionary();

            // // 读取上次申请时间
            // helper.get('level3_apply_time').then(res => {
            // 	this.lastApplyTime = res
            // })

            this.$AppBridge.setWebAttribute({intercept: true, isFull: true});
            EventBus.$on('back', this.handleBack)

            // 获取协议
            this.$AppBridge.getVisitUrl({
                pageName: '10081',
                type: 'agreement'
            }, res => {
                this.agreements = res.data
            })

        },
        filters: {
            mobile(value) {
                if (!value) {
                    return "";
                }
                value = String(value);
                return value.replace(/(^\d{3})\d{4}/, "$1****");
            }
        },
        watch: {
            // 金额： 1-10000000 纯数字
            "input.applyamount"(value) {

                if (this.applyDone == 0) {
                    return
                }
                // 纯数字
                if (/\D/.test(value)) {
                    this.input.applyamount = value + ''.replace(/\D/g, "");
                }
                // 1-10000000 （不可以0开头）
                if (/^0/.test(value)) {
                    this.input.applyamount = value + ''.replace(/^0/, "");
                    console.log('val===>' + this.input.applyamount);
                }
                // 超过10000000的数字自动变为10000000
                // if (value > 10000000) {

                if (value > 20) {
                    this.input.applyamount = 20;
                    return Toast("请输入20万元以内的贷款金额");
                }
            },


            // 贷款期限
            "input.applydeadline"(value) {

                if (value == '') {
                    return
                }

                // 纯数字
                if (/\D/.test(value)) {
                    this.input.applydeadline = value + ''.replace(/\D/g, "");
                }

                // 以0开头。默认变为1
                if (/^0/.test(value)) {
                    this.input.applydeadline = 1
                }

                if (value == 0) {
                    this.input.applydeadline = 1
                    return
                }

                if (value > 36) {
                    this.input.applydeadline = 36
                }
            },

            "input.username"(value) {
                // 4-30 非英文或数字，可以有中间点·
                if (/[^·\u4e00-\u9fa5]/.test(value)) {
                    this.input.username = value.replace(/[^·\u4e00-\u9fa5]/g, "");
                }
            },
            reasonsText(value, oldValue) {
                // 限制10-60个字符
                if (util.getCharLen(value) > 60) {
                    this.reasonsText = oldValue;
                }
            }
        },
        mounted() {
            this.scrollControl.watch({
                breakpoint: 10,
                before: () => {
                    this.showHeader = false
                    this.$root.setStatusColor('white')
                },
                after: () => {
                    this.showHeader = true
                    this.$root.setStatusColor('black')
                }

            })


            // document.body.style.overflow = 'auto'
            // document.getElementsByClassName('c-view')[0].style.overflow = 'visible'
            // document.getElementsByClassName('c-view')[0].style.position = 'static'

        }
    };
</script>

<style lang="scss" scoped>

    .bg {
        background: #F5F5F5;
        height: 8px;
    }

    .success-wrap {
        background: #FFF;
        padding-bottom: 18px;
        .success-box {
            display: flex;
            height: 100%;
            flex-direction: column;
            text-align: center;
            .icon-box {
                width: 100%;
                height: 90px;
                text-align: center;

                margin: 20px auto 13px auto;

                img {
                    height: 100%;
                    display: block;
                    margin: 5px auto;
                }
            }
            h4 {
                font-family: PingFangSC-Regular;
                font-size: 20px;
                color: #333333;
                letter-spacing: -0.27px;
                text-align: center;
            }
            p {
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #E72427;
                letter-spacing: -0.36px;
                text-align: center;
            }
        }
    }

    div.noticeModel {
        p {
            width: 95%;
            margin: 0 auto;
            padding-top: 7px;
        }
        height: 52px;
        background: #FFE1E1;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #E72427;
        letter-spacing: -0.27px;
        text-align: justify;
        margin-top: -6px;
        position: relative;
        z-index: 2;
    }

    .pull-down-bg {
        height: 40vh;
        background: linear-gradient(to right, #b6863f, #deb973);
    }

    .banner {
        background: linear-gradient(to right, #b6863f, #deb973);
        min-height: 180px;
        box-sizing: content-box;
        position: relative;
        z-index: -1;

        img.block {
            width: 100%;
            display: block;
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 0;
        }
    }

    ul.have {
        display: flex;
        height: 58px;

        li {
            &.tit {
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #333333;
                letter-spacing: -0.34px;
                border: none;
                vertical-align: bottom;
            }

            &.active {
                color: #e72427;
                border-color: #e72427;
            }
            text-align: center;
            border: 1px solid #999;
            color: #999;
            border-radius: 16px;
            margin: 0px 10px;
            height: 28px;
            font-size: 14px;
            width: 100px;

            line-height: 30px;
            vertical-align: middle;
        }
    }

    ul.sal{
        margin-top: 20px; height: 40px;
    }

    .header {
        position: relative;
        z-index: 1;
        transition: all .3s;
    }

    .level3-wrap {
        // width: 100%;height: 2000px;
        // position: relative;

        .progress-wrap {
            padding: 34px 16px;
            padding-bottom: 14px;
            color: #fff;
            position: relative;
            z-index: 1;
            .progress-title {
                height: 22px;
                line-height: 22px;
                font-size: 16px;
                margin-bottom: 20px;
                font-weight: 300;
            }
            .progress-item-line {
                position: relative;
                margin: 0 18px;
                z-index: 4;
                .line {
                    width: 100%;
                    height: 1px;
                    background: #fff;
                    position: absolute;
                    top: 10px;
                    left: 0;
                }
                .progress-item-box {
                    display: flex;
                    height: 21px;
                    justify-content: space-between;
                    span {
                        width: 20px;
                        height: 21px;
                        line-height: 21px;
                        text-align: center;
                        border-radius: 10.5px;
                        background: #fff;
                        color: #d0a252;
                        position: relative;
                    }
                    .icon-before {
                        position: absolute;
                        content: "";
                        display: block;
                        width: 0;
                        height: 0;
                        border-top: 5px solid transparent;
                        border-right: 6px solid white;
                        border-bottom: 5px solid transparent;
                        left: -5px;
                        top: 5px;
                        z-index: 2;
                    }
                    .icon-after {
                        position: absolute;
                        right: -5px;
                        top: 5px;
                        content: "";
                        display: block;
                        width: 0;
                        height: 0;
                        border-top: 5px solid transparent;
                        border-left: 6px solid white;
                        border-bottom: 5px solid transparent;
                        z-index: 2;
                    }
                }
            }
            .progress-item-info {
                margin-top: 10px;
                height: 20px;
                line-height: 20px;
                line-height: 20px;
                display: flex;
                justify-content: space-between;
            }
        }

        .loan-info-wrap {
            overflow: hidden;
            background: #fff;

            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
            margin-top: -12px;

            padding-top: 14px;
        }

        .info-box {
            font-size: 16px;
            color: #333;
            font-weight: normal;
            .info-box-item {
                box-sizing: border-box;
                margin-left: 18px;
                display: flex;
                justify-content: space-between;
                position: relative;

                span.unit {
                    position: absolute;
                    right: 8px;
                    top: -1.55px;
                    font-size: 13px;
                    color: #999;
                }

                input {
                    -webkit-appearance: none;
                    border: none;
                    text-align: right;
                    color: #666666;
                    display: block;
                    width: 100%;
                    font-size: 14px;
                    padding-right: 30px;

                    height: 35px;
                    line-height: 35px;

                    &.strong {
                        font-size: 20px;
                        color: #333333;

                    }
                }
                dt {
                    white-space: nowrap;
                    min-width: 7em;
                    text-align: left;

                }
                dd {
                    margin-right: 16px;
                }
            }
            .assets-box {
                display: block;
                margin-left: 18px;
                dt {
                    height: 48px;
                    line-height: 48px;
                }
                .assets-info {
                    display: flex;
                    flex-wrap: wrap;
                    // justify-content: space-between;
                    margin-right: 16px;
                    padding-bottom: 12px;

                    span {
                        display: inline-block;
                        width: 100px;
                        line-height: 28px;
                        text-align: center;
                        border-radius: 15px;
                        font-size: 14px;
                        border: 1px solid #999;
                        color: #999;
                        margin: 7px 0;
                        &:nth-child(3n + 2) {
                            margin-left: calc((100% - 300px) / 2);
                            margin-right: calc((100% - 300px) / 2);
                        }
                    }
                    .active {
                        color: #e72427;
                        border-color: #e72427;
                    }
                }
            }
        }
        .info-supplement-box {
            padding-top: 8px;
            p {
                margin: 0 16px;
                height: 17px;
                line-height: 17px;
                font-size: 12px;
                color: #666;
                span {
                    color: #679dd2;
                }
            }
            .btn {
                margin: 40px 16px;
                margin-top: 16px;
                height: 48px;
                line-height: 48px;
                text-align: center;
                font-size: 16px;
                border-radius: 24px;
                background: #ccc;
                color: #fff;
            }
            .active {
                background: linear-gradient(to right, #e72427, #fe4c35);
                box-shadow: 0 2px 10px rgba(236, 44, 42, 0.3);
            }
        }

        .apply-undone {
            .info-box-item {

                height: 38px;
                line-height: 38px;

               // border: 2px solid red;

              /*  height: 30px;
                line-height: 30px;*/
                //
            }
        }

        .apply-done {

            padding-bottom: 10px;

            .info-top {
                font-size: 18px;
                height: 44px;
                line-height: 30px;
                padding-left: 16px;

            }
            .info-box-item {
                line-height: 20px;
                padding: 14px 0;
                font-size: 14px;
                dt {
                    font-size: 16px;
                    min-width: 7em;
                    text-align: left;
                }
                dd {
                    color: #999;
                    white-space: normal;
                    p {
                        float: right;
                    }
                }
            }
            .info-bottom {
                padding: 8px 16px;
                color: #666;
                font-size: 14px;
                line-height: 24px;
                .info-blue {
                    color: #6ea4f4;
                }
            }
        }
        .cancel-wrap {
            z-index: 10;
            .cancel-shadow {
                background: rgba(0, 0, 0, 0.5);
                z-index: 10;
            }
            .cancel-box {
                position: absolute;
                width: 270px;
                height: 356px;
                top: 130px;
                left: 53px;
                background: #fff;
                overflow: hidden;
                border-radius: 8px;
                z-index: 11;
                font-weight: 400;
                .title {
                    height: 70px;
                    position: relative;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    background: #fcf9f3 url("~@/assets/images/home/title@2x.png") no-repeat;
                    background-size: contain;
                    h4 {
                        height: 22px;
                        line-height: 22px;
                        color: #dda252;
                        font-size: 16px;
                    }
                    p {
                        height: 17px;
                        line-height: 17px;
                        color: #dda252;
                        font-size: 12px;
                    }
                    .icon-close-box {
                        position: absolute;
                        right: 8px;
                        top: 8px;
                        width: 24px;
                        height: 24px;
                        img {
                            width: 100%;
                        }
                    }
                }
                .cancel-items-list {
                    padding: 16px;
                    ul {
                        padding-left: 20px;
                        li {
                            height: 20px;
                            line-height: 20px;
                            margin: 12px 0;
                            display: flex;
                            font-size: 14px;
                            align-items: center;
                            i {
                                display: block;
                                width: 16px;
                                height: 16px;
                                border-radius: 10px;
                                border: 1px solid #e6e6e6;
                                box-sizing: border-box;
                                margin-right: 10px;
                            }
                        }
                        .isCheck {
                            i {
                                background: url("~@/assets/images/home/aj_caa@2x.png") no-repeat;
                                background-size: contain;
                                border: none;
                            }
                        }
                    }
                }
                .other-reason {
                    width: 100%;
                    height: 63px;
                    background: #f4f4f4;
                    color: #999;
                    font-size: 12px;
                    padding: 10px;
                    textarea {
                        width: 100%;
                        height: 100%;
                        border: none;
                        background: #f4f4f4;
                    }
                }
                .btn {
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                    background: #ccc;
                    border-radius: 20px;
                    margin: 0 24px;
                    color: #fff;
                }
                .active {
                    background: #d0a252;
                }
            }
        }
    }
</style>
