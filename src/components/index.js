import Vue from 'vue'
//=============import======

import listState from './common/listState.vue'
import svgIcon from './common/svgIcon.vue'
import cIcon from './view/cIcon.vue'
import cHeader from './view/cHeader.vue'
import cFooter from './view/cFooter.vue'
import cWatermark from './view/cWatermark.vue' //水印

//============register===公共组件============

Vue.component('listState', listState)
Vue.component('svgIcon', svgIcon)
Vue.component('cIcon', cIcon)
Vue.component('cHeader', cHeader)
Vue.component('cFooter', cFooter)
Vue.component('cWatermark', cWatermark)