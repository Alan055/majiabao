import Vue from "vue";
import Router from "vue-router";

import routerView from '@/modules/routerView'
import {transformRoutes} from '@/modules/routerView'

import {routes as about} from './about/router'
import {routes as help} from './help/router'
import {routes as agreements} from './agreements/router'
import {routes as feedback} from './feedback/router'
import {routes as message} from './message/router'
import {routes as bill} from './bill/router'
import {routes as bankCard} from './bankCard/router'

//首页资讯
import {routes as info} from './info/router'

import step1 from "./publicInfo/step1";
import step2 from "./publicInfo/step2";
import step3 from "./publicInfo/step3";

import loading from "./loading/index.vue";
import view from "./publicInfo/view";
import publicInfo from "./publicInfo/index";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/publicInfo",
      component: publicInfo,
      children: [
        {
          path: "",
          redirect: '/publicInfo/step1',
          name: "step1",
          component: step1
        },
        {
          path: "step1",
          name: "step1",
          component: step1
        },
        ,
        {
          path: "step2",
          name: "step2",
          component: step2
        },
        {
          path: "step3",
          name: "step3",
          component: step3
        },
        {
          path: "view",
          name: "view",
          component: view
        }
      ]
    },
    // loading
    {
        path: "/loading",
        name: "loading",
        component: loading
    },
    // 关于我们
    {
      path: '/about',
      component: routerView,
      children: transformRoutes(about)
    },
    //帮助中心
    {
      path: '/help',
      component: routerView,
      children: transformRoutes(help)
    },
    //协议
    {
      path: '/agreements',
      component: routerView,
      children: transformRoutes(agreements)
    },
    //意见反馈
    {
      path: '/feedback',
      component: routerView,
      children: transformRoutes(feedback)
    },
    //消息
    {
      path: '/message',
      component: routerView,
      children: transformRoutes(message)
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

    //首页资讯
    {
      path: '/info',
      component: routerView,
      children: transformRoutes(info)
    }
  ]
});
