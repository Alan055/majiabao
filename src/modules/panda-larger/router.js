import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import routerView from '@/modules/routerView'
import {transformRoutes} from '@/modules/routerView'
import {routes as message} from './message/router'
import {routes as feedback} from './feedback/router'
import {routes as bill} from './bill/router'
import {routes as bankCard} from './bankCard/router'
import {routes as ticket} from './ticket/router'
import {routes as getTrust} from './getTrust/router'

export default new Router({
    routes: [

        {
            path: "/",
            name: "landing",
            component: r => require.ensure([], () => r(require("./landing")), 'landingIndex')
        },
        {
            path: "/home",
            name: "home",
            component: r => require.ensure([], () => r(require("./home")), 'homeIndex')
        },

        // 公共信息
        {
            path: "/publicInfo",
            component: r => require.ensure([], () => r(require("./publicInfo/index")), 'publicInfoContainer'),
            children: [
                {
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
            component: r => require.ensure([], () => r(require("./card/nopass.vue")), 'nopass'),
        },
        // 拒件记录
        {
            path: "/refuse",
            name: "refuse",
            component: r => require.ensure([], () => r(require("./refuse/index.vue")), 'refuse'),
        },

        // 介绍
        {
            path: "/about",
            name: "about",
            component: r => require.ensure([], () => r(require("./about/index.vue")), 'about'),
        },
        
        // 关于我们
        {
            path: "/about/us",
            name: "about/us",
            component: r => require.ensure([], () => r(require("./about/us.vue")), 'about'),
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
        
        //提额
        {
            path: '/getTrust',
            component: routerView,
            children: transformRoutes(getTrust)
        },
        //账单
        {
            path: '/bill',
            component: routerView,
            children: transformRoutes(bill)
        },
        //银行卡
        {
            path: '/ticket',
            component: routerView,
            children: transformRoutes(ticket)
        },
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
