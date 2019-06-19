<template>
<div class="view">
  <c-header :title="'账单列表'" :back="true">
    <span slot="right" class="header-text"
    >借款协议</span>
  </c-header>
    <!-- tab-container -->
  <mt-tab-container v-model="selected" :swipeable="true" class="c-view-block">

    <!--待还款-->
    <mt-tab-container-item id="1" >
      <div class="c-view-content" @scroll="pageControl.scroll($event)">
        <mt-loadmore class="load-more-wrap" :top-method="refresh" ref="loadmore">
          <div class="bill-list">
            <p v-for="item in pageControl.dataList" :key="item" >{{item}}</p>
          </div>
        </mt-loadmore>
      </div>
      
    </mt-tab-container-item>
    <mt-tab-container-item id="2" >
      <div class="c-view-content">
        <!-- <mt-loadmore class="load-more-wrap" :top-method="loadTop" ref="loadmore">
          <div class="bill-list">
            <p v-for="item in list" :key="item" >{{item}}</p>
          </div>
        </mt-loadmore> -->
      </div>
      
    </mt-tab-container-item>
  </mt-tab-container>
</div>

</template>

<script>
import PageControl from "@/utils/PageControl"

function request({pageIndex, pageSize}) {
  return new Promise(resolve => {
    let data = []
    for(let i = 0; i < 10; i++) {
      data.push(pageIndex*pageSize + 1 + i)
    }
    resolve(data)
  })
}

export default {
  data() {
    return {
      selected: '1',
      list: [1,2,3,4,5,6,7,8,9],
      pageControl: new PageControl({
        api: request,
        keyPath: []
      })
    }
  },
  methods: {
    refresh() {
      this.pageControl.refresh()
    }
  },
  created() {
    this.pageControl.onRefresh = () => {
      this.$refs.loadmore.onTopLoaded();
    }
    this.refresh()
  }
}
</script>

<style lang="scss" scoped>

// .mint-tab-container-wrap 高度超出

.c-view-content{
  height: 100%;
}
.bill-list p{
  height: 80px;
  padding: $gap;
}
</style>
