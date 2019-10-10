<template>

    <div class="c-bg-gray" ref="stepContent" style="overflow-x:hidden">
        <div class="view-step-con view-public-info-step" ref="view">

            <div v-if="shadow" ref="shadow" class="shadow"></div>
            <div v-if="!isPreview" class="parentCon">
                <c-header :title=publicInfoStep.currentStep.text>
                    <mt-button slot="left">
                        <c-icon type="back"/>
                    </mt-button>
                </c-header>
<!--
                <template v-if="publicInfoStep.backDialog">
                    val==>{{publicInfoStep.backDialog.data.current}}
                </template>-->
                <step-progress :currentStep=publicInfoStep.currentStep.step
                               :stepList="publicInfoStep.stepList"></step-progress>
            </div>

            <transition :name="transitionName">
                <router-view :class="{'child-view':!isPreview, 'trans':!isAndroid}" v-min-height></router-view>
            </transition>


            <!--新手红包挽留弹窗-->
            <backDialog
                v-if="publicInfoStep.backDialog && publicInfoStep.backDialog.isNeedOpen && publicInfoStep.backDialog.visibility && publicInfoStep.backDialog.type==1"
                :visibility="publicInfoStep.backDialog.visibility"
                :data="publicInfoStep.backDialog.data"
                @close="backDialogClose"/>


        </div>
    </div>
</template>

<script>
    import api from "@/services/api";
    import util from "@/utils";
    import storage from "@/utils/storage";
    import helper from "@/utils/helper";
    import {Toast, Indicator, MessageBox} from "@/utils/helper";
    import {mapGetters, mapMutations, mapState} from "vuex";
    import stepProgress from "./components/stepProgress";
    import AppBridge from "@/services/AppBridge.js";
    import EventBus from "@/services/EventBus";
    import {
        checkCameraPermission,
        resolveErrorInfo
    } from "./services/stepService";
    import _ from "lodash";
    import backDialog from '@/components/business/noobDialog'
    import "./style/index.scss";

    let stepMixin = require('./components/stepMixin')

    export default {

        mixins: [stepMixin.default],

        name: "container",

        data() {
            return {


                transitionName: 'slide-left',
                shadow: false,


            };
        },

        watch: {
            '$route'(to, from) {

                if (this.publicInfoStep.backDialog) {

                    let data = {
                        visibility: false,
                        isNeedOpen: false,
                        data: Object.assign({}, this.publicInfoStep.backDialog.data, {current: parseInt(this.getUrlStepList().indexOf(this.$route.name.replace('step', ''))) + 1}),
                    }

                    this.setBackDialog(Object.assign({}, this.publicInfoStep.backDialog, data))

                }

            }
        },

        computed: {

            //是否为预览页访问
            isPreview() {
                return (this.$route.path.indexOf('/view') != -1) || (this.$route.path.indexOf('/stepLoading') != -1)
            },

            isAndroid() {
                return util.browser.versions.android;
            }
        },

        components: {
            stepProgress,
            backDialog,
        },

        beforeRouteLeave(to, from, next) {
            EventBus.$off("back");
            EventBus.$off("resize");
        },

        beforeRouteUpdate(to, from, next) {

            this.transitionName = this.publicInfoStep.routerAction == 'next' ? 'slide-left' : 'slide-right'

            let {name} = to

            this.$refs.stepContent.scrollTop = 0

            //标记不使用伪协议跳转
            this.$root.routeJump = true

            let arr = this.getUrlStepList()

            //切换到最后一步，按钮变为提交
            if (name.replace('step', '') == arr[arr.length - 1]) {
                setTimeout(() => {
                    this.setBtnText('提交')
                }, 290)
            }
            next()
        },

        created() {

            this.starttime = new Date().getTime();

            EventBus.$on("showTendency", this.showTendency);

            //获取三步骤排序
            this.getStepSequence()

            //获取新手红包
            this.getNewbieDesc()


            //view 页面不拦截
            if (this.$route.path.indexOf('/view') == -1) {

                //标记不使用伪协议跳转
                this.$root.routeJump = true
                //AppBridge.setWebAttribute({intercept: true});
            }

            // 监听window resize
            window.addEventListener("resize", () => {
                EventBus.$emit("resize");
            });
        },

        methods: {

            ...mapMutations(['setCurrentStep', 'setStepList', 'setBackDialog']),

            //根据URL参数，动态设置三步资料顺序
            getStepSequence() {

                let tempList = [], arr = this.getUrlStepList()

                arr.map(item => tempList.push(this.publicInfoStep.stepEmum.get(item)))

                this.setStepList(tempList)
                this.setCurrentStep(parseInt(this.$route.name.replace('step', '')))

                console.log('===========>');
                console.log(this.publicInfoStep);
            },

            //是否显示遮罩层
            showTendency(flag) {
                if (flag) {
                    this.$refs.stepContent.scrollTop = 0   //滚动到顶部，防止叠加
                    this.$refs.stepContent.style.overflowY = 'hidden'
                } else {
                    this.$refs.stepContent.style.overflowY = 'auto'
                }

                this.shadow = flag
                //this.$refs.shadow.style.height ='100%'

            },


            //返回显示新手挽留弹窗
            backDialogClose(flag) {


                let step = this.$route.name.replace('step', '');

                //关闭弹窗
                this.setBackDialog(Object.assign({}, this.publicInfoStep.backDialog, {
                    visibility: false
                }))


                if (step == '1') {

                    if (flag) {
                        this.sinaAds.click(this.stat.publicInfo.idCard.newbieNext_1);
                        return
                    }
                    //放弃申请
                    this.sinaAds.click(this.stat.publicInfo.idCard.newbieWaive_1);
                    this.sinaAds.click(this.stat.publicInfo.userBasicInfo.leave);
                    this.$root.backHome();
                    return
                }

                if (step == '2') {
                    if (flag) {
                        this.sinaAds.click(this.stat.publicInfo.idCard.newbieNext_2);
                        return
                    }
                    //放弃申请
                    this.sinaAds.click(this.stat.publicInfo.idCard.newbieWaive_2);
                    this.sinaAds.click(this.stat.publicInfo.userBasicInfo.leave);
                    this.$root.backHome();
                    return
                }

                if (step == '3') {
                    if (flag) {
                        this.sinaAds.click(this.stat.publicInfo.idCard.newbieNext_3);
                        return
                    }
                    //放弃申请
                    this.sinaAds.click(this.stat.publicInfo.idCard.newbieWaive_3);
                    this.sinaAds.click(this.stat.publicInfo.userBasicInfo.leave);
                    this.$root.backHome();
                    return
                }
            },

            //获取新手红包挽留文案
            getNewbieDesc() {

                AppBridge.getUserInfo({}, res => {
                    if (res.code == '200' && res.data && res.data.mobile) {

                        api.publicInfo.newbiePackets({
                            accountid: util.getParams('fromUserId') || '',
                            productid: `2001`,
                            type: 1, //1身份证信息、2联系人信息、3基础信息、4完成提交申请
                            phonenum: res.data.mobile,
                            //phonenum:`18718790180`

                        }).then(res2 => {


                            if (res2.code == '200' && res2.data && res2.data.CONFIG && res2.data.CONFIG.length) {

                                let result = res2.data.CONFIG

                                let item = result.filter(item => item.visibility)

                                if (item.length) {
                                    let {type, visibility,} = item[0]

                                    let backDialog = {
                                        type,
                                        visibility: false,
                                        isNeedOpen: visibility,
                                        data: Object.assign(item[0], {current: parseInt(this.getUrlStepList().indexOf(this.$route.name.replace('step', ''))) + 1}),
                                    }

                                    console.error('test弹窗文案===================>');
                                    console.log(backDialog);

                                    this.setBackDialog(backDialog)

                                }
                            }
                        }).catch(e => {

                            console.log('newbiePackets network Error==========>', e);
                            //Toast(e)
                        })
                    }
                })
            },


        },
    };
</script>


<style lang="scss" scoped>
    .shadow {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 100;
        height: 88px;
    }

    .view-step-con {
        width: 100%;
    }

    .trans {
        transition: all 0.25s cubic-bezier(.25, 0, .1, 1)
    }

    .child-view {

        //margin-top: 10px;
        width: 100%;
        background: #FFF;
        height: 100%;
        position: absolute;
        top: 88px;

    }

    .slide-left-enter {
        opacity: 0;
        -webkit-transform: translate(100%, 0);
        transform: translate(100%, 0);
    }

    .slide-left-leave-active {
        opacity: 0;
        -webkit-transform: translate(-100px, 0);
        transform: translate(-100%, 0);
    }

    .slide-right-enter {
        opacity: 0;
        -webkit-transform: translate(100%, 0);
        transform: translate(-100%, 0);
    }

    .slide-right-leave-active {
        opacity: 0;
        -webkit-transform: translate(-100px, 0);
        transform: translate(100%, 0);
    }

</style>
