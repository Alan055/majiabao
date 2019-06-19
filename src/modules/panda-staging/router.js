import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import routerView from '@/modules/routerView'
import {
    transformRoutes
} from '@/modules/routerView'
import {
    routes as message
} from './pages/message/router'
import {
    routes as feedback
} from './pages/feedback/router'
import {
    routes as bill
} from './pages/bill/router'
import {
    routes as bankCard
} from './pages/bankCard/router'

export default new Router({
    routes: [

        {
            path: "/home",
            name: "home",
            component: r => require.ensure([], () => r(require("./pages/recommend/index")), 'homeIndex')
        },

        // 公共信息
        {
            path: "/publicInfo",
            component: r => require.ensure([], () => r(require("./pages/publicInfo/index")), 'publicInfoContainer'),
            children: [{
                    path: "",
                    redirect: '/publicInfo/step1',
                    name: "step1",
                    component: r => require.ensure([], () => r(require("./pages/publicInfo/step1")), 'step1')
                },
                {
                    path: "step1",
                    name: "step1",
                    component: r => require.ensure([], () => r(require("./pages/publicInfo/step1")), 'step1')
                },
                {
                    path: "step-test",
                    name: "step-test",
                    component: r => require.ensure([], () => r(require("./pages/publicInfo/step-test")), 'stepTest')
                },
                {
                    path: "step2",
                    name: "step2",
                    component: r => require.ensure([], () => r(require("./pages/publicInfo/step2")), 'step2')
                },
                {
                    path: "step3",
                    name: "step3",
                    component: r => require.ensure([], () => r(require("./pages/publicInfo/step3")), 'step3')
                },
                {
                    path: "view",
                    name: "view",
                    component: r => require.ensure([], () => r(require("./pages/publicInfo/view")), 'view')
                },
                {
                    path: "/stepLoading",
                    name: "stepLoading",
                    component: r => require.ensure([], () => r(require("./pages/loading/index.vue")), 'stepLoading'),
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
            component: r => require.ensure([], () => r(require("./pages/recommend/index")), 'recommend'),
        },

        // 三级商户
        {
            path: "/level3",
            name: "level3",
            component: r => require.ensure([], () => r(require("./pages/level3/index.vue")), 'level3'),
        },

        // 资讯
        {
            path: "/news",
            name: "news",
            component: r => require.ensure([], () => r(require("./pages/news/index.vue")), 'news'),
        },
        // 更多资讯
        {
            path: "/news/more",
            name: "news/more",
            component: r => require.ensure([], () => r(require("./pages/news/more.vue")), 'newsmore'),
        },
        // 资讯详情
        {
            path: "/news/detail",
            name: "news/detail",
            component: r => require.ensure([], () => r(require("./pages/news/detail.vue")), 'detail'),
        },
        // 新手攻略
        {
            path: "/news/newbie",
            name: "news/newbie",
            component: r => require.ensure([], () => r(require("./pages/news/newbie.vue")), 'newbie'),
        },

        // 帮助中心
        {
            path: "/help",
            name: "help",
            component: r => require.ensure([], () => r(require("./pages/help/index.vue")), 'help'),
        },
        // 帮助中心问题分类列表
        {
            path: "/help/list",
            name: "help/list",
            component: r => require.ensure([], () => r(require("./pages/help/list.vue")), 'helpTypeList'),
        },
        // 帮助中心详情
        {
            path: "/help/detail",
            name: "help/detail",
            component: r => require.ensure([], () => r(require("./pages/help/detail.vue")), 'helpDetail'),
        },

        // 信用生活
        {
            path: "/getTrust",
            name: "getTrust",
            component: r => require.ensure([], () => r(require("./pages/getTrust/index.vue")), 'getTrust'),
        },
        // 信用生活详情
        {
            path: "/getTrust/detail1",
            name: "getTrust/detail1",
            component: r => require.ensure([], () => r(require("./pages/getTrust/detail1.vue")), 'getTrustDetail1'),
        },
        // 信用生活详情
        {
            path: "/getTrust/detail0",
            name: "getTrust/detail0",
            component: r => require.ensure([], () => r(require("./pages/getTrust/detail0.vue")), 'getTrustDetail0'),
        },
        // 信用生活详情
        {
            path: "/getTrust/detail2",
            name: "getTrust/detail2",
            component: r => require.ensure([], () => r(require("./pages/getTrust/detail2.vue")), 'getTrustDetail2'),
        },
        // 信用生活介绍
        {
            path: "/getTrust/desc",
            name: "getTrust/desc",
            component: r => require.ensure([], () => r(require("./pages/getTrust/desc.vue")), 'getTrustDesc'),
        },
        // 介绍
        {
            path: "/about",
            name: "about",
            component: r => require.ensure([], () => r(require("./pages/about/index.vue")), 'about'),
        },
        // 介绍
        {
            path: "/test",
            name: "test",
            component: r => require.ensure([], () => r(require("./pages/test.vue")), 'about'),
        },
        // 红包
        {
            path: "/redpacket",
            name: "redpacket",
            component: r => require.ensure([], () => r(require("./pages/redpacket/index.vue")), 'redpacket'),
        },
        //邀请好友
        {
            path: "/friends",
            name: "friends",
            component: r => require.ensure([], () => r(require("./pages/friends/index.vue")), 'friends'),
        },
        // 优惠券
        {
            path: "/ticket",
            name: "ticket",
            component: r => require.ensure([], () => r(require("./pages/ticket/index.vue")), 'ticket'),
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

        {
            path: '/agreements/loanList/:fundproductids/:orderid?',
            name: 'loanListAgreements',
            component: r => require.ensure([], () => r(require("./pages/agreements/loanList.vue")), 'loanList'),
        },
        // 注册协议
        {
            path: "/agreements/register",
            name: "/agreements/register",
            component: r => require.ensure([], () => r(require("./pages/agreements/register.vue")), 'register'),
        },
        // 隐私协议
        {
            path: "/agreements/disclaimer",
            name: "/agreements/disclaimer",
            component: r => require.ensure([], () => r(require("./pages/agreements/disclaimer.vue")), 'disclaimer'),
        },
        // 平台服务协议
        {
            path: "/agreements/service",
            name: "/agreements/service",
            component: r => require.ensure([], () => r(require("./pages/agreements/service.vue")), 'service'),
        },
        // 服务及授权条款
        {
            path: "/agreements/authorization",
            name: "/agreements/authorization",
            component: r => require.ensure([], () => r(require("./pages/agreements/authorization.vue")), 'authorization'),
        },

        // 待还账单
        {
            path: "/recommend/repayList",
            name: "recommend/repayList",
            component: r => require.ensure([], () => r(require("./pages/recommend/repayList")), 'repayList'),
        },

        // 结清记录
        {
            path: "/recommend/finishList",
            name: "recommend/finishList",
            component: r => require.ensure([], () => r(require("./pages/recommend/finishList")), 'finishList'),
        },

        // 拒件状态卡
        {
            path: "/nopass",
            name: "nopass",
            component: r => require.ensure([], () => r(require("./pages/recommend/nopass.vue")), 'nopass'),
        },
        // 拒件记录
        {
            path: "/refuse",
            name: "refuse",
            component: r => require.ensure([], () => r(require("./pages/refuse/index.vue")), 'refuse'),
        },
        // loading
        {
            path: "/loading",
            name: "loading",
            component: r => require.ensure([], () => r(require("./pages/loading/index.vue")), 'stepLoading'),
            meta: {
                title: window.sinaif_global && window.sinaif_global.appName
            }
        }
    ]
});
