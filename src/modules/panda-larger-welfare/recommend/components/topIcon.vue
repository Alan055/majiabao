<template lang="html">
    <!-- 顶部4个tab -->
    <div class="model topIcon-wrap c-flex-row" v-if="data && data.length > 0">
        <div class="c-col-25" v-for="(item, i) in data" :key="i">
            <div class="icon-content" @click="$root.openUrl(item.url)">
                <img :src="item.iconunselect"/>
                <p>{{item.name}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import api from "@/services/api";
import helper from "@/utils/helper";
export default {
  data() {
    return {
      data: []
    };
  },
  computed: {},
  created() {
    this.getInitMJP();
  },
  methods: {
    //获取数据
    getInitMJP() {
        this.$AppBridge.initMJP({}, res => {
            if (res.code == '200' && res.data && res.data.homeentrances) {
                console.log('initMJP', res.data)
                this.data = res.data.homeentrances;
            }
        })
    }
  }
};
</script>

<style lang="scss" scoped>
.topIcon-wrap {
  padding: 14px 16px;

  .icon-content {
      img {
          height: 40px;
          width: 40px;
          content: normal !important;
      }
  }
}

.c-flex-row {
    justify-content: start !important;
}
</style>
