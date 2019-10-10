import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

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

        // 三级商户
        {
            path: "/level3",
            name: "level3",
            component: r => require.ensure([], () => r(require("./level3/index.vue")), 'level3'),
        },

        // 三级商户
        {
            path: "/nopass",
            name: "nopass",
            component: r => require.ensure([], () => r(require("./card/nopass.vue")), 'nopass'),
        },

        // 资讯
        {
            path: "/news",
            name: "news",
            component: r => require.ensure([], () => r(require("./news/index.vue")), 'news'),
        },
        // 介绍
        {
            path: "/about",
            name: "about",
            component: r => require.ensure([], () => r(require("./about/index.vue")), 'about'),
        },
        // 资讯详情
        {
            path: "/news/detail",
            name: "news/detail",
            component: r => require.ensure([], () => r(require("./news/detail.vue")), 'detail'),
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
