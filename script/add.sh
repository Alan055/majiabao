#!/bin/sh
name=$1

if [ -d "src/modules/${name}" ]; then
  echo "********Module already exists. Please rename!"
fi

if [ ! -d "src/modules/${name}" ]; then
  cd src/modules
  mkdir -p ${name}
  echo "create The module ${name}"
  cd ${name}
  touch router.js entry.js index.vue
  echo "import Vue from 'vue'
import Router from 'vue-router'
import index from './index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    }
  ]
})
" > router.js

  echo "import Vue from 'vue'
import App from '@/modules/App.vue'
import router from './router'
import conifg from '@/modules/entryConfig'

Vue.config.productionTip = false

const RootAppConstructor = Vue.extend(App)
new RootAppConstructor({
  el: '#app',
  router
  // template: '<App/>',
  // components: { App }
})" > entry.js

  echo "<template lang=\"html\">
  <mt-header title=\"我是标题\">
    <span slot=\"left\" @click=\"$router.back()\">
      <mt-button icon=\"back\"></mt-button>
    </span>
  </mt-header>
<div class=\"view-"${name##*/}"\">
  hello world
</div>
</template>

<script>
import api from '@/services/api'
import util from '@/utils'
import storage from '@/utils/storage'
import helper from '@/utils/helper'
import {Toast} from 'mint-ui'
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: 'template',
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters([]),
  },
  methods: {
    ...mapMutations([]),
  },
  components: {

  },
  watch: {

  },
  created() {

  },
  mounted() {
   // DOM ready
  },
  beforeRouteEnter (to, from, next) {
   // 导航进入该组件时调用
   // 不！能！获取组件实例 \`this\`
   // 因为组件实例还没被创建

   next(vm => {
     // 通过 \`vm\` 访问组件实例
   })
  },
  beforeRouteLeave (to, from, next) {
   // 导航离开该组件时调用
   // 可以访问组件实例 \`this\`

   // 不要忘了next
   next();
  }
}
</script>

<style lang=\"scss\" scoped>
</style>" > index.vue

fi
