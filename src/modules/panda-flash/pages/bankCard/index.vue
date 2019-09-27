<template lang="html">
<div class="view bankCard">

  <div class="c-view-content">

    <!--有数据-->
    <div class="card-list" v-if="isNoList === false">

      <div class="card-item" v-for="(item, key) in list" :key="'bankListKey_' + item.banknumber + key">
        <p class="c-table-row title-row">
          <span class="c-flex-item c-tl title">
            <img class="c-icon icon_e" :src="item.banklogo" alt="">
            {{item.bankname}}
          </span>
        </p>
        <p class="c-table-row number-row">
          <span class="c-flex-item c-tl">
            <!-- {{item.banktype | type}} -->
            <span class="number">{{item.banknumber.slice(0, 4)}}  ****  **** {{item.banknumber.slice(-4)}}</span>
          </span>
        </p>
        <div class="line"></div>
        <div class="c-flex-row detail-row">
          <ul class="c-flex-item c-table-row c-flex-wrap detail-list" :class="{open: item.open}">
            <li class="c-tl detail-item"
                v-for="(subItem,subKey) in item.productVOS"
                :key="'bankListSubItemKey_' + item.banknumber + subKey"
            >
              <img class="c-icon icon_c h-auto icon-bank" :src="subItem.iconurl" alt="">

              {{subItem.productname}}
            </li>
          </ul>
          <div v-if="item.productVOS.length > 3">
            <span class="icon expand"
                  @click="item.open = !item.open"
                  v-sinaAds="adsInfo.bankCard.index.clickBankCardToggle"
            >
              <c-icon type="arrowDown" v-if="!item.open" />
              <c-icon type="arrowUp" v-else />
            </span>
          </div>
        </div>

      </div>

    </div>

    <no-data
        :imgUrl="require('../../assets/images/no-bankcard@2x.png')"
        text="您暂未添加银行卡"
        v-if="isNoList === true"
    ></no-data>

  </div>

</div>
</template>

<script>
import api from "@/services/api";
import helper from "@/utils/helper";
import { Toast } from "@/utils/helper";
import noData from "@/components/common/noData";

export default {
  data() {
    return {
      list: [],
      isNoList: null
    };
  },
  methods: {
    fetchData() {
      api.user.bankCard.list().then(res => {
        if (!helper.isSuccess(res)) return;

        this.list = res.data.map(item => {
          item.open = false;
          return item;
        });

        this.isNoList = this.list.length === 0;

        this.$root.loadingClose();
      });
    }
  },
  mounted() {
    this.$root.setWebAttribute({
      title: "我的银行卡"
    });
  },
  beforeRouteEnter(to, from, next) {
    // 导航进入该组件时调用
    // 不！能！获取组件实例 `this`
    // 因为组件实例还没被创建

    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.fetchData();
    });
  },
  components: {
    noData
  },
  filters: {
    type(value) {
      if (value == 1) {
        return "储蓄卡";
      }
      if (value == 2) {
        return "信用卡";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.h-auto {
  height: initial;
}
.card-list {
  padding: $gap;
}
.c-aspectratio:before {
  padding-top: 0 !important;
}
.c-aspectratio-content {
  text-align: center;
  position: relative;
}
.card-item {
  background: #ffffff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-bottom: $gap;
  padding: 12px;
  padding-bottom: 0;
}

.title-row {
  .title {
    font-size: $fontXXL;
    .c-icon {
      top: 0;
      vertical-align: -12px;
    }
  }
}

.number-row {
  font-size: $fontL;
  margin-top: 23px;
  .number {
    margin-left: 8px;
    letter-spacing: 1px;
  }
}

.line {
  @extend %border-b;
  margin-top: 16px;
}

.detail-row {
  font-size: $fontS;
  color: $gray;
  margin-top: 18px;
  padding-bottom: 5px;

  .detail-list {
    height: 28px;
    overflow: hidden;
    &.open {
      height: auto;
    }
    .c-icon {
      line-height: 1em;
      position: static;
      vertical-align: text-top;
    }
  }
  .detail-item {
    width: 33.33%;
    margin-bottom: 12px;
    line-height: 1.6;
  }
}

.card-noList {
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*展示图片样式*/
  .card-noList-img {
    width: 180px;
    img {
      width: 100%;
    }
  }
  /*占位符*/
  .w-180-140 {
    aspect-ratio: "180:140";
  }
  /*展示文字样式*/
  .card-noList-text {
    font-size: 14px;
    color: #999999;
  }
}
</style>
