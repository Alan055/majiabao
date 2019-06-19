<template lang="html">
  <div class="header-wrap" :class="{'transparent': transparent}" v-if="show">
    <div class="top" :style="`min-height: ${$root.statusHeight}px`" v-if="$root.isApp"></div>
    <slot name="content">
      <mt-header :title="title">
        <slot name="left" slot="left">
          <mt-button v-if="back" @click="backAction"><c-icon type="back"/></mt-button>
        </slot>
        <slot name="right" slot="right"></slot>
      </mt-header>
    </slot>
  </div>
</template>

<script>
import AppBridge from "@/services/AppBridge";
import util from "@/utils";

export default {
	data() {
		return {
			hasHistory: window.history.length > 1 //仅在进入时判断一次
			// topHeight: 0
		};
	},
	props: {
		title: String,
		back: Boolean, //显示返回箭头
		transparent: Boolean, //透明头部
		show: {
			//是否显示头部
			type: Boolean,
			default: !AppBridge.isApp
		}
	},
	methods: {
		backAction() {
			if (this.hasHistory) {
				this.$router.back();
			} else {
				this.close();
			}
		},
		close() {
			this.$root.closeWindow();
		}
	},
	watch: {
		title(value) {
			this.$root.setTitle(value);
		}
	},
	created() {
		this.$root.setTitle(this.title);

		// 显示自定义header
		if (AppBridge.isApp && this.show) {
			AppBridge.setWebAttribute({ isFull: true });
			// AppBridge.getStatusHeight(res => {
			//   this.topHeight = res.data.statusHeight
			// })
		}
	}
};
</script>

<style lang="scss" scoped>
.top {
	height: 20px;
}
.header-wrap {
	background: white;
	color: #030303;

	&.transparent {
		background: none;
		color: white;
		.mint-header {
			border: none;
		}
	}
}
.mint-header {
	background: transparent;
	color: inherit;
}
</style>
