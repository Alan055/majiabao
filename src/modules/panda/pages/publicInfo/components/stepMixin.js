import AppBridge from '@/services/AppBridge.js';
import helper from "@/utils/helper";
import {Indicator, Toast, MessageBox} from "@/utils/helper";
import {mapGetters, mapMutations, mapState} from "vuex";
import util from "@/utils";
import DefendClick from "@/utils/DefendClick";
import EventBus from "@/services/EventBus";


/**
 * 三步资料mixin
 */
export default {

    data() {
        return {
            defendClick: new DefendClick(),
            isSubmit1: false, //防止延迟，当前步骤没有填充数据，直接快速提交进入下一步!【致命bug】
            isSubmit2: false,
            isSubmit3: false,

        }
    },

    computed: {
        ...mapState(['publicInfoStep']),
    },

    methods: {

        ...mapMutations(['setCurrentStep', 'setStepList', 'setRouterAction', 'setBtnText','setBackDialog']),

        //获取url动态顺序
        getUrlStepList() {
            return (util.getParams("stepList") || '123').split('')
        },


        /**
         * 高亮步骤条
         * @returns {*}
         *   达到最后一步：-1
         *   URL匹配到： next
         *   URL匹配不到：0
         */
        stepHighlight() {

            let arr = this.getUrlStepList()

            let curr = `${this.$route.name.replace('step', '')}`

            let findIndex = arr.indexOf(curr)

            //最后一步
            if (findIndex == arr.length - 1) return -1

            //未找到
            if (findIndex == -1) return 0

            //获取下一步骤
            let next = this.publicInfoStep.stepEmum.get(arr[findIndex + 1])

            console.error('设置当前高亮==>', next);

            return next
        },

        //下一步
        stepNext() {

            let curr = `${this.$route.name.replace('step', '')}`

            console.error('下一步...',this.$route.name);

            //如果当前数据完整，快速点击，则直接拦截掉
            if (!this[`isSubmit${curr}`]) {
                console.error('快速点击，直接拦截...');
                return
            }

            let next = this.stepHighlight()

            if (next == -1) { //最后一步

                // 确认提示
                MessageBox({
                    title: "温馨提示",
                    message:
                        "请确保所提交资料真实性，凡提供虚假资料一经核实，90天后方可再次提交申请，是否确认提交？",
                    showCancelButton: true,
                    confirmButtonText: "确认提交",
                    cancelButtonText: "再次核对",
                    cancelButtonClass: "strong"
                }).then(action => {
                    if (action == "confirm") {

                        this.sinaAds.click(
                            this.stat.publicInfo.userBasicInfo.confirm
                        );

                        this.$root.replaceRoute({
                            name: "stepLoading"
                        });

                    } else {

                        Indicator.close()

                        // this.isSubmit = true

                        this.sinaAds.click(
                            this.stat.publicInfo.userBasicInfo.cancel
                        );
                    }
                });

                //this.$root.replaceRoute(`loading`);
                return
            }


            if (next.step && next.url) {

                //this.isSubmit = true

                //this.setSubmit(true)

                this.setCurrentStep(parseInt(next.step)) //设置当前步骤
                this.setRouterAction('next') //设置动作
                this.$router.push(`${next.url}?stepList=${this.getUrlStepList().join('')}&stepAction=next`);

                EventBus.$off("back");

                /*this.$root.pushRoute({
                  path: `${next.url}?stepList=${this.getUrlStepList().join('')}&stepAction=next`,
                  query: {},
                  title: next.text
                })*/

            }

        },
    },

    created(){



      /*  let data = Object.assign({}, this.publicInfoStep.backDialog, {
            data:{current: parseInt(this.getUrlStepList().indexOf(this.$route.name.replace('step', ''))) + 1}
        })

        this.setBackDialog(data)*/


    }

}
