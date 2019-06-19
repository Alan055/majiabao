import Vue from "vue";
import Router from "vue-router";

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
  ]
});
