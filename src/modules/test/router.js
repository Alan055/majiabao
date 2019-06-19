import Vue from "vue";
import Router from "vue-router";
import index from "./index";
import chooseImg from "./imagePath/index.vue";
import testGetStorage from "./testGetStorage.vue";
import decode from "./decode.vue";
import testOpenWindow from "./testOpenWindow.vue";
import testCloseWindow from "./testCloseWindow.vue";
import testListRefresh from "./testListRefresh.vue";
import testPopup from './testPopup'
import testSinaAds from './testSinaAds'
import testDialog from "./testDialog.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "index",
      component: index
    },
    {
      path: "/chooseImg",
      name: "chooseImg",
      component: chooseImg
    },
    {
      path: "/testGetStorage",
      name: "testGetStorage",
      component: testGetStorage
    },
    {
      path: "/decode",
      name: "decode",
      component: decode
    },
    {
      path: "/testOpenWindow",
      name: "testOpenWindow",
      component: testOpenWindow
    },
    {
      path: "/testCloseWindow",
      name: "testCloseWindow",
      component: testCloseWindow,
      meta: {
        title: 'title in meta'
      }
    },
    {
      path: "/testListRefresh",
      name: "testListRefresh",
      component: testListRefresh
    },
    {
      path: "/testDialog",
      name: "testDialog",
      component: testDialog
    },
    {
      path: '/testSinaAds',
      name: 'testSinaAds',
      component: testSinaAds
    },
    {
      path: '/testPopup',
      name: 'testPopup',
      component: testPopup
    }
  ]
});
