import util from "@/utils/index";
import storage from "@/utils/storage";

/**
 * 三步资料
 * @type {{state: {stepEmum: Map<*[], any>}, mutations: {}, actions: {}, getters: {}}}
 */
const baseData = {
    state: {

        //当前处于第几步骤
        currentStep: {
            step: 1,
            text: '',
            // text: '身份信息',
        },

        btnText: `下一步`,

        //传入到子组件的步骤数组
        stepList: [],

        //路由动作，默认为下一步next 返回为back
        routerAction: 'next',

        //步骤枚举模板
        stepEmum: new Map([
            [
                '1', {
                step: 1,
                text: '身份信息',
                url: `/publicInfo/step1`
            }
            ],
            [
                '2', {
                step: 2,
                text: '联系人信息',
                url: `/publicInfo/step2`
            }
            ],
            [
                '3', {
                step: 3,
                text: '基本信息',
                url: `/publicInfo/step3`
            }
            ],
        ]),

        //返回弹窗
        backDialog:null,

    },
    mutations: {

        //设置步骤高亮
        setCurrentStep(state, step) {

            let item = [...state.stepEmum].filter(([key, value]) => value.step == step)

            if (item && item.length) {

                Object.assign(state, {
                    currentStep: {
                        step,
                        text: item[0][1].text,
                    }
                })
            }
        },

        //设置步骤顺序
        setStepList(state, stepList) {

            Object.assign(state, {
                stepList
            })
        },

        //设置路由行为 -前进or后退
        setRouterAction(state, routerAction) {
            Object.assign(state, {
                routerAction
            })
        },

        //根据步骤，动态设置按钮文本
        setBtnText(state, btnText) {
            Object.assign(state, {
                btnText
            })
        },

        //设置弹窗
        setBackDialog(state, backDialog) {
            Object.assign(state, {
                backDialog
            })
        },


    },
    actions: {},
    getters: {}
};

export default baseData;
