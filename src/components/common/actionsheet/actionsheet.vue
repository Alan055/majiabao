<template>
  <transition name="actionsheet-float">
    <div v-show="currentValue" class="mint-actionsheet">
      <ul class="mint-actionsheet-list">

      	<li class="mint-actionsheet-listitem mint-actionsheet-title c-relative"
            @click.stop="currentValue = false">
          {{actions.title}}
          <i v-if="actions.title" class="mintui mintui-success"></i>
          <i v-if="actions.closeIcon" class="closeIcon">
            <img src="@/assets/images/login/ac_cl@2x.png" alt="">
          </i>
        </li>

        <li v-for="( item, index ) in actions.list" :key="index" class="mint-actionsheet-listitem" @click.stop="itemClick(item, index)">{{ item.name }}</li>
      </ul>
    </div>
  </transition>
</template>

<style lang="scss">
	.mint-actionsheet-button, .mint-actionsheet-listitem {
        display: block;
        width: 100%;
        height: 48px;
        line-height: 48px;
        font-size: 16px;
        color: #333;
        background-color: #fff;
        &:active {
           background-color: #f0f0f0;
        }
      }
  .actionsheet-float-enter,
  .actionsheet-float-leave-active {
    transform: translate3d(-50%, 100%, 0);
  }
  .mint-actionsheet-title{font-size: 14px;color: #999;}
  .c-relative {
    position: relative;
  }
  .closeIcon {
    position: absolute;
    top: 0;
    width: 52px;
    height: 100%;
    right: 0;
    img {
      position: absolute;
      top: 50%;
      right: 0;
      margin-top: -12px;
      margin-right: 14px;
      width: 24px;
      height: 24px;
    }
  }
</style>

<script type="text/babel">
  import { Popup } from 'mint-ui'

  export default {
    name: 'mt-actionsheet',

    mixins: [Popup],

    props: {
      modal: {
        default: true
      },
      selectItem : {

      },
      modalFade: {
        default: true
      },

      lockScroll: {
        default: false
      },
      closeOnClickModal: {
        default: true
      },
      cancelText: {
        type: String,
        default: '取消'
      },
      actions: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        currentValue: false
      };
    },
    watch: {
      currentValue(val) {
        this.$emit('input', val);
      },

      value(val) {
        this.currentValue = val;
      }
    },

    methods: {
      itemClick(item, index) {
        if (this.selectItem && typeof this.selectItem === 'function') {
					this.selectItem(item,index)
        }
        this.currentValue = false;
      }
    },
    mounted() {
      if (this.value) {
        this.rendered = true;
        this.currentValue = true;
        this.open();
      }
    }
  };
</script>

