<template lang="html">
  <mt-cell class="cp-choose-contacts" :title="title" :is-link="!readonly" @click.native="chooseContacts">
    <span v-if="!computedValue" class="c-light">{{readonly ? '' : '选择'}}</span>
    <div v-else class="c-table-row c-light value-grid">
      <dd class="c-tl name-cell" v-if="readonly || !value">{{computedValue.contactName}}</dd>
      <dd class="c-tl name-cell" v-else @click.stop><input @blur="updateValue($event.target.value)" :value="value.contactName" maxlength="15" /></dd>
      <dt class="c-light">{{computedValue.contactPhone}}</dt>
    </div>
  </mt-cell>

</template>

<script>

import { Toast } from "@/utils/helper";
import { mapGetters, mapMutations } from "vuex";
import {checkContactPermission} from "../services/stepService"
import RegMap from '@/utils/RegMap'

export default {
	props: ["value", "title", "readonly"],
	data() {
		return {
			selected: null
		};
	},
	computed: {
        ...mapGetters(['userInfo']),
		computedValue() {
			return this.selected || this.value;
        }        
    },
    
	methods: {       
		async chooseContacts() {
            if(this.readonly) return

            await checkContactPermission()

			this.$AppBridge.chooseContacts(res => {
				// res = JSON.parse(res);
				if (res.code == 200) {
                    let phone = res.data.contactPhone
                    let name = res.data.contactName
                    phone = phone.replace(/ /g, "").replace(/^(0086|\+86|\+0)/, "")
                    name = name.replace(RegMap.emoji, '')
                    res.data.contactPhone = phone
                    res.data.contactName = name

                    
                    this.selected = res.data;

					if (!/^1\d{10}/.test(phone)) {
						this.toast("需选择含有正确手机号码的联系人，请重选");
						this.$emit("input", "");
						return;
                    }
                    if (phone == this.userInfo.mobile) {
                        this.toast("联系人号码不能与注册号码相同，请重选");
						this.$emit("input", "");
						return;
                    }
					if (/^(145|147)/.test(phone)) {
						this.toast("不支持以147、145开头的联系人手机号，请重选");
						this.$emit("input", "");
						return;
                    }                    

					this.$emit("input", res.data);
				}
			});
        },        
        toast(msg) {
            this.$emit('toast', Toast(msg))
        },
        // 更新value
        updateValue(value) {
            let {contactName, contactPhone} = this.value
            if(value == contactName) return
            
            // 过滤特殊字符
            if(RegMap.emoji.test(value)) {
                value = value.replace(RegMap.emoji, '')
            }
            this.$emit('input', {contactName: value, contactPhone})
        }
        
    }
};
</script>

<style lang="scss">
.cp-choose-contacts{
    .value-grid {
        padding-left: 16px;
        overflow: visible;
    }
    input{
        display: block;
        width: 100%;
        border: none;
        color: #666;
        padding: 0;
        height: 40px;
        @extend %ellipsis;
    }
    .mint-cell-mask{
        display: none;
    }
    .name-cell{
        max-width: 12em;
        padding-right: 1em;
        @extend %ellipsis;
    }
}

</style>
