<template lang="html">
<div class="view-limit-increase">
    <div class="c-layer header-layer">
        <c-header ref="transparentHeader" class="header transparent" title="我的信用" :show="true"></c-header>
    </div>
    <div class="c-view-content">
        <div class="banner">
        <div class="banner-content" :style="style">
            <p class="p0">{{isAuth ? '500':'350'}}</p>
            <!--
            <p class="txt2">信用极好</p>
            <p class="p2">认证越多，信用值越高</p> -->
        </div>
        </div>
        <div class="content-wrap">
            <!-- <div class="title">信用提额</div> -->
            <div class="desc">信用分越高，额度越高，借款利率越低</div>
            <ul class='c-border-t'>
                <li v-for='item in getOperator' @click='handleClick(item)'>
                    <img class='icon' src="../images/yys-icon.png" alt="">
                    <p>{{item.name + '认证'}}</p>
                    <div class="btn">{{item.authstatus | authstatus}}</div>
                </li>
            </ul>
        </div>
    </div>

</div>
</template>

<script>
import api from '@/services/api'
import util from '@/utils'
import storage from "@/utils/storage"
import helper from '@/utils/helper'
import {Toast, Indicator, MessageBox} from '@/utils/helper'
import {mapGetters, mapMutations} from 'vuex'
import EventBus from '@/services/EventBus'
import PageControl from "@/utils/PageControl"

import appbridge from '@/services/AppBridge.js';

export default {
    name: 'getTrust',
    data () {
    return {
        data: [],
        wait: `${process.env.path}/pages/my/#/wait`,
        publicInfoUrl: process.env.path + "/v1.1.0/king/pages/panda-larger/#/publicInfo/step3", //三步资料
        isAuth: false,
        pageControl: new PageControl({
            api: api.getTrust.home,
            keyPath: ['data']
        }),
    }
    },
    computed: {
        ...mapGetters([]),
        style() {
            return {
            paddingTop: this.$root.statusHeight,
            backgroundImage: "url(" + require(`../images/ybp${this.isAuth ? '500' : '350'}.png`) + ")",
            }
        },
        getOperator() {
            let result ;
            return (this.data.filter(item=>{
                return item.name == "运营商";
            }));
        }
    },
    methods: {
    ...mapMutations([]),
    async handleClick(item) {
        // 埋点
        this.sinaAds.click({
            currEvent: this.adsInfo.getTrust.home.index.link,
            currentEventParams: item
        })

        // 不可申请
        if(!item.editable) return

        // 未登录
        if(! this.$root.isLogin) {
            this.$root.jumpToLogin()
            return
        }

        Indicator.open();
        let res = await api.getTrust
            .validateUserInfo({ type: "3" })
            .finally(Indicator.close);
        if (!helper.isSuccess(res)) return;
        if (res.data.status != 1) {
            MessageBox({
                title: "温馨提示",
                message:res.data.remark,
                showCancelButton: true,
                confirmButtonText: "确认",
                cancelButtonText: "取消"
            }).then(action => {
                if (action == "confirm") {
                    //20190523 bike 暂时先前端匹配到大额版的三步资料
                    if(res.data.nextpage && res.data.nextpage.url.indexOf('publicInfo') > -1) {
                        this.$root.openUrl(this.publicInfoUrl);
                    }else {
                        this.$root.openUrl(res.data.nextpage);
                    }
                }
            });
        }else{
            // 前往认证
            this.$root.openUrl(item.url)
        }
        
    },
    fetchData() {
        return api.getTrust.home().then(res => {
            if(! helper.isSuccess(res)) return
            this.data = (res.data || []).map(item => {
            let {authstatus, repeatflag, openflag} = item
            // 认证状态(0-未认证，1-认证申请中，2-认证通过，3-认证失败,4-已过期)
            // 是否可点击：已开启 && (无状态或未认证 || 认证失败 || 认证通过且可以重复认证)
            item.editable = !!openflag && (!authstatus || authstatus == 3  || authstatus == 4 || (authstatus == 2 && repeatflag))
                return item
            })

            let yys = this.data.filter(item=>{
                return item.name == "运营商";
            })
            console.log('yys', yys)
            if(yys[0].authstatus == 2){
            this.isAuth = true;
            }
            console.log('this.data', this.data)
        })
        },
    },
    filters: {
        authstatus(value) {
        let str = '';
        switch (value) {
            case null:
            str = '未认证'
            break;
            case 1:
            str = '认证申请中'
            break;
            case 2:
            str = '认证通过'
            break;
            case 3:
            str = '认证失败'
            break;
            case 4:
            str = '已过期'
            break;

            default:
            str = '未认证'
            break;
        }
        return str;
        },

    },
    components: {

    },
    watch: {

    },
    created() {
        this.fetchData().finally(this.$root.loadingClose)
    },
    onRefresh(tag, data) {
        if(tag == 'login'){
            console.log("收到通知了!,token是", data);
            this.pageControl.refresh()
        }
        console.log('收到tab的消息了', tag)
        if (tag == "tab2") {
            this.fetchData();
        }
    }
}
</script>

<style lang="scss" scoped>
.view-limit-increase{
    .header-layer {
        position: relative;
        z-index: 2;
    }
    .banner {
        height: 290px;
        background: url('../images/getTrust-bg.png') no-repeat center center;
        background-size: 100% 100%;
    }

    .banner-content{
        position: absolute;
        top: 80px;
        width: 50%;
        margin-left: 25%;
        height: 227px;
        box-sizing: content-box;
        background-size: 100%;
        background-repeat: no-repeat;
        color: #FFFFFF;
        text-align: center;
        overflow: hidden;

        .p0{
            font-size: 40px;
            margin-top: 60px;
            line-height: 56px;
            font-family: DINAlternate-Bold;
            font-size: 40px;
            color: #FFFFFF;
            letter-spacing: 0;
            text-align: center;
        }
        .txt2{
            font-size: 14px;
            margin-bottom: 10px;
            margin-top: 0 !important;
        }
        .p2{
            &::before,&::after{
                content: '';
                display: inline-block;
                background: white;
                height: 1px;
                width: 50px;
                margin: 0 10px;
                vertical-align: middle;
                opacity: 0.5;
            }
        }
  }
  .content-wrap{
        width: 100%;
        background: #FFFFFF;
        background: url('../images/getTrust-cricel.png') no-repeat top center;

        border-radius: 4px;
        margin-top: -50px;
        z-index: 10;
        padding:20px 12px 0;
        .title{
            height: 26px;
            line-height: 26px;
            font-size: 18px;
            color: #333;
        }
        .desc{
            font-size: 14px;
            color: #5A6275;
            text-align: center;
        }
        ul{
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            li{
                width: 100%;
                height: 96px;
                display: flex;
                align-items: center;
                .icon{
                    width: 40px;
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                    border-radius: 50%;
                    overflow: hidden;
                    margin-right: 10px;
                }
                p{
                    font-size: 16px;
                    color: #333;
                    flex: 1;
                }
                .btn{
                    width: 86px;
                    height: 32px;
                    line-height: 32px;
                    background: #FCB628;
                    background: #019AFF;
                    box-shadow: 0 3px 13px 0 rgba(0,91,250,0.24);
                    border-radius: 100px;
                    font-size: 14px;
                    color: #FFFFFF;
                    letter-spacing: -0.31px;
                    border-radius: 16px;
                    overflow: hidden;
                    text-align: center;
                }
            }
        }
  }
  .setion-list{
      margin: 16px;
      .title{
          font-size: 18px;
          color: #333333;
          position: relative;
          padding-left: 10px;
          &:after{
              content: "";
              background: #E72427;
              border-radius: 2px;
              width: 4px;
              height: 14px;
              display: block;
              position: absolute;
              left: 0;
              top: 6px;
          }
      }
      ul{
          li{
              height: 90px;
              margin:20px 0;
              display: flex;
                align-items: center;
                box-shadow: 0 0 20px 0 rgba(0,0,0,0.10);
                border-radius: 4px;
                .icon-wrap{
                    width: 40px;
                    height: 40px;
                    margin-left: 18px;
                    border-radius: 50%;
                    overflow: hidden;
                    margin-right: 12px;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                .text-info{
                    flex: 1;
                    h4{
                        font-size: 16px;
                        color: #FFFFFF;
                        letter-spacing: -0.08px;
                    }
                    span{
                        opacity: .8;
                        font-size: 12px;
                        color: #FFFFFF;
                        letter-spacing: -0.07px;
                    }
                }
                .desc{
                    opacity: .9;
                    font-size: 12px;
                    color: #FFFFFF;
                    letter-spacing: -0.07px;
                    text-align: center;
                    margin-right: 16px;
                }
          }
      }
      .orange{
          background: #FF8F17;
          background-image: linear-gradient(-90deg, #FCB628  0%, #FF8F17 100%);
      }
      .purple{
          background: #B21ABA;
        background-image: linear-gradient(-90deg, #FF7575 0%, #B21ABA  100%);
      }
      .blue{
          background: #445DFB;
          background-image: linear-gradient(-90deg, #73D5FF  0%, #445DFB 100%);
      }
  }

  .mint-cell-wrapper{
    border: none;
  }
  .mint-cell{
    @extend %border-t;

    &.disabled{
      .mint-cell-text, .mint-cell-value{
        color: #999999;
      }
    }
  }
}

</style>
