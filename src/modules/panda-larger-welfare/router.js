import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import routerView from '@/modules/routerView'
import {
    transformRoutes
} from '@/modules/routerView'
import {
    routes as message
} from './message/router'
import {
    routes as feedback
} from './feedback/router'
import {
    routes as bill
} from './bill/router'
import {
    routes as bankCard
} from './bankCard/router'
import {
    routes as ticket
} from './ticket/router'
import {
    routes as getTrust
} from './getTrust/router'

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
        // 帮助中心
        {
            path: "/help",
            name: "help",
            component: r => require.ensure([], () => r(require("./help/index.vue")), 'help'),
        },
        // 帮助中心问题分类列表
        {
            path: "/help/list",
            name: "help/list",
            component: r => require.ensure([], () => r(require("./help/list.vue")), 'helpTypeList'),
        },
        // 帮助中心详情
        {
            path: "/help/detail",
            name: "help/detail",
            component: r => require.ensure([], () => r(require("./help/detail.vue")), 'helpDetail'),
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
                    component: r => require.ensure([], () => r(require("@/modules/panda/pages/publicInfo/view")), 'view')

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
            path: "/recommend/nopass",
            name: "nopass",
            component: r => require.ensure([], () => r(require("./recommend/nopass.vue")), 'nopass'),
        },
        // 拒件记录
        {
            path: "/refuse",
            name: "refuse",
            component: r => require.ensure([], () => r(require("./refuse/index.vue")), 'refuse'),
        },
        // 资讯
        {
            path: "/news",
            name: "news",
            component: r => require.ensure([], () => r(require("./news/index.vue")), 'news'),
        },
        // // 更多资讯
        // {
        //   path: "/news/more",
        //   name: "news/more",
        //   component: r => require.ensure([], () => r(require("./news/more.vue")), 'newsmore'),
        // },
        // 资讯详情
        {
            path: "/news/detail",
            name: "news/detail",
            component: r => require.ensure([], () => r(require("./news/detail.vue")), 'detail'),
        },
        // 新手攻略
        {
            path: "/news/newbie",
            name: "news/newbie",
            component: r => require.ensure([], () => r(require("./news/newbie.vue")), 'newbie'),
        },
        // 介绍
        {
            path: "/about",
            name: "about",
            component: r => require.ensure([], () => r(require("./about/index.vue")), 'about'),
        },
        //邀请好友
        {
            path: "/friends",
            name: "friends",
            component: r => require.ensure([], () => r(require("./friends/index.vue")), 'friends'),
        },
        // 红包
        {
            path: "/redpacket",
            name: "redpacket",
            component: r => require.ensure([], () => r(require("./redpacket/index.vue")), 'redpacket'),
        },
        // 关于我们
        {
            path: "/about/us",
            name: "about/us",
            component: r => require.ensure([], () => r(require("./about/us.vue")), 'about'),
        },
        // 福利页面
        {
            path: "/welfare",
            name: "welfare",
            component: r => require.ensure([], () => r(require("./welfare/index.vue")), 'welfare'),
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