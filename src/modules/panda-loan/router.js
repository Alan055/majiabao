import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import routerView from '@/modules/routerView'
import { transformRoutes } from '@/modules/routerView'
import { routes as message } from './message/router'
import { routes as feedback } from './feedback/router'
import { routes as bill } from './bill/router'
import { routes as bankCard } from './bankCard/router'

export default new Router({
    routes: [

        {
            path: "/home",
            name: "home",
            component: r => require.ensure([], () => r(require("./recommend/index")), 'homeIndex')
        },

        // 公共信息
        {
            path: "/publicInfo",
            component: r => require.ensure([], () => r(require("./publicInfo/index")), 'publicInfoContainer'),
            children: [{
                    path: "",
                    redirect: '/publicInfo/step1',
                    name: "step1",
                    component: r => require.ensure([], () => r(require("./publicInfo/step1")), 'step1')
                },
                {
                    path: "step1",
                    name: "step1",
                    component: r => require.ensure([], () => r(require("./publicInfo/step1")), 'step1')
                },
                {
                    path: "step-test",
                    name: "step-test",
                    component: r => require.ensure([], () => r(require("./publicInfo/step-test")), 'stepTest')
                },
                {
                    path: "step2",
                    name: "step2",
                    component: r => require.ensure([], () => r(require("./publicInfo/step2")), 'step2')
                },
                {
                    path: "step3",
                    name: "step3",
                    component: r => require.ensure([], () => r(require("./publicInfo/step3")), 'step3')
                },
                {
                    path: "view",
                    name: "view",
                    component: r => require.ensure([], () => r(require("./publicInfo/view")), 'view')
                },
                {
                    path: "/stepLoading",
                    name: "stepLoading",
                    component: r => require.ensure([], () => r(require("./loading/index.vue")), 'stepLoading'),
                    meta: {
                        title: window.sinaif_global && window.sinaif_global.appName
                    }
                }
            ]
        },

        // 产品推荐
        {
            path: "/recommend",
            name: "recommend",
            component: r => require.ensure([], () => r(require("./recommend/index")), 'recommend'),
        },

        // 三级商户
        {
            path: "/level3",
            name: "level3",
            component: r => require.ensure([], () => r(require("./level3/index.vue")), 'level3'),
        },

        // 资讯
        {
            path: "/news",
            name: "news",
            component: r => require.ensure([], () => r(require("./news/index.vue")), 'news'),
        },
        // 更多资讯
        {
            path: "/news/more",
            name: "news/more",
            component: r => require.ensure([], () => r(require("./news/more.vue")), 'newsmore'),
        },
        // 资讯详情
        {
            path: "/news/detail",
            name: "news/detail",
            component: r => require.ensure([], () => r(require("./news/detail.vue")), 'detail'),
        },
        // 信用生活
        {
            path: "/getTrust",
            name: "getTrust",
            component: r => require.ensure([], () => r(require("./getTrust/index.vue")), 'getTrust'),
        },
        // 信用生活详情
        {
            path: "/getTrust/detail1",
            name: "getTrust/detail1",
            component: r => require.ensure([], () => r(require("./getTrust/detail1.vue")), 'getTrustDetail1'),
        },
        // 信用生活详情
        {
            path: "/getTrust/detail0",
            name: "getTrust/detail0",
            component: r => require.ensure([], () => r(require("./getTrust/detail0.vue")), 'getTrustDetail0'),
        },
        // 信用生活详情
        {
            path: "/getTrust/detail2",
            name: "getTrust/detail2",
            component: r => require.ensure([], () => r(require("./getTrust/detail2.vue")), 'getTrustDetail2'),
        },
        // 信用生活介绍
        {
            path: "/getTrust/desc",
            name: "getTrust/desc",
            component: r => require.ensure([], () => r(require("./getTrust/desc.vue")), 'getTrustDesc'),
        },
        // 介绍
        {
            path: "/about",
            name: "about",
            component: r => require.ensure([], () => r(require("./about/us.vue")), 'about'),
        },
        // 优惠券
        {
            path: "/ticket",
            name: "ticket",
            component: r => require.ensure([], () => r(require("./ticket/index.vue")), 'ticket'),
        },

        // 关于我们
        {
            path: "/about/us",
            name: "about/us",
            component: r => require.ensure([], () => r(require("./about/index.vue")), 'aboutUs'),
        },

        {
            path: '/message',
            component: routerView,
            children: transformRoutes(message)
        },

        //意见反馈
        {
            path: '/feedback',
            component: routerView,
            children: transformRoutes(feedback)
        },
        //账单
        {
            path: '/bill',
            component: routerView,
            children: transformRoutes(bill)
        },
        //银行卡
        {
            path: '/bankCard',
            component: routerView,
            children: transformRoutes(bankCard)
        },
        // 注册协议
        {
            path: "/agreements/register",
            name: "/agreements/register",
            component: r => require.ensure([], () => r(require("./agreements/register.vue")), 'register'),
        },
        // 隐私协议
        {
            path: "/agreements/disclaimer",
            name: "/agreements/disclaimer",
            component: r => require.ensure([], () => r(require("./agreements/disclaimer.vue")), 'disclaimer'),
        },
        // 平台服务协议
        {
            path: "/agreements/service",
            name: "/agreements/service",
            component: r => require.ensure([], () => r(require("./agreements/service.vue")), 'service'),
        },
        // 服务及授权条款
        {
            path: "/agreements/authorization",
            name: "/agreements/authorization",
            component: r => require.ensure([], () => r(require("./agreements/authorization.vue")), 'authorization'),
        },

        // 待还账单
        {
            path: "/recommend/repayList",
            name: "recommend/repayList",
            component: r => require.ensure([], () => r(require("./recommend/repayList")), 'repayList'),
        },

        // 结清记录
        {
            path: "/recommend/finishList",
            name: "recommend/finishList",
            component: r => require.ensure([], () => r(require("./recommend/finishList")), 'finishList'),
        },

        // 拒件状态卡
        {
            path: "/nopass",
            name: "nopass",
            component: r => require.ensure([], () => r(require("./recommend/nopass.vue")), 'nopass'),
        },
        // 拒件记录
        {
            path: "/refuse",
            name: "refuse",
            component: r => require.ensure([], () => r(require("./refuse/index.vue")), 'refuse'),
        },
        // loading
        {
            path: "/loading",
            name: "loading",
            component: r => require.ensure([], () => r(require("./loading/index.vue")), 'stepLoading'),
            meta: {
                title: window.sinaif_global && window.sinaif_global.appName
            }
        }
    ]
});