<!--选择借款意向-->
<template>
    <div class="bankList-wrap" >
        <div class="shadow" v-if="show"></div>
        <div class="contain-wrap" v-if="show">
            <div class="c-bg-white c-border-b title" v-if="title">
                <span class="back" v-if="showBack" @click="handleBack"></span>
                <p>{{title}}</p>
                <span class="close" @click="toggled"></span>
            </div>
            <div class="contain-box" :class="{'animation-left':showBack}">
                <div class="c-bg-white bankList">
                    <div class="box">
                        <ul class="c-bg-white list" v-if="list.length">
                            <li class="c-border-b" v-for="(item,index) in computedList" :key="index" @click="handleChooseTendency(item,index)" :class="{'active':item.isDefault == 1}">
                                <p :class="['list-text', active == item.code?'active':'']">{{item.content}}</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import isType from '@/utils/isType.js';

import api from '@/services/api.js';
import util from '@/utils/index.js';
import {Toast,Indicator} from '@/utils/helper';
export default {
    name:"chooseTendency",
    data(){
        return{
          showBack: false,
          title: '选择借款偏好',
          nextQuestionnaire: []
        }
    },
    props:{
        list:{
            type:Array,
        },
        showAddBtn:{
            type:Boolean,
            required:false
        },
        show:{
            type:Boolean,
            required:true,
            default:false
        },
        active: {
          type:String,
          required:true,
          default:''
        },
        isTwo: {
          type:Boolean,
          required:true,
          default:false
        }
    },
    computed: {
      computedList() {
        console.log('this.list[0].answerDTO', this.list[0].answerDTO);
        console.log('当前选中的code', this.active)

        console.log('this.isTwo', this.isTwo)

        if(this.nextQuestionnaire && this.nextQuestionnaire.answerDTO){
          return this.nextQuestionnaire.answerDTO
        }if(this.isTwo){//缓存回来如果显示第二步
          this.showBack = true;
          //this.isTwo = true;
          //this.$emit('changeFirst');
          this.title = '若借款被拒绝';
          let nextQuestionnaire;
          this.list[0].answerDTO.forEach((item) => {
            if(item.nextQuestionnaire){
              nextQuestionnaire = item.nextQuestionnaire
            }
          })
          console.log('nextQuestionnaire', nextQuestionnaire)
          return nextQuestionnaire.answerDTO
        }else{
          return this.list[0].answerDTO
        }
      }
    },
    methods:{
        toggled(){
            console.log('toggleDone')
            this.$emit('toggleDone');
        },
        handleBack() {
          this.title = '选择借款偏好';
          this.showBack = false;
          this.$emit('changeTwo');
          this.nextQuestionnaire = [];
          console.log('handleBack')
        },
        handleChooseTendency(item){
          if(item.nextQuestionnaire){//如果有下一步
            this.showBack = true;
            this.title = '若借款被拒绝';
            this.nextQuestionnaire = item.nextQuestionnaire;
          }else{
            this.title = '选择借款偏好';
            this.$emit('toggleDone')
            this.$emit('chooseFinshed', item);
          }
        }

    },
    created(){

    },
    watch:{
      list() {

      },
      active() {
        //判断是否是第一步
        console.log('this.active', this.active)
        console.log('created list', this.list)
      }
    }
}
</script>

<style lang="scss" scoped>
.contain-wrap{
    width: 100%;
    height: 316px;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 121;
    overflow:hidden;
    .title{
        height: 48px;
        line-height: 48px;
        color: #aaa;
        font-size: 14px;
        text-align: center;
        position: relative;
        display: flex;
        align-items: center;
        padding: 0 16px;
        p{
            flex: 1;
        }
        .close{
            width: 20px;
            height: 20px;
            background: url("~@/assets/images/login/ac_cl@2x.png") no-repeat;
            background-size: contain;
            position: absolute;
            right: 18px;
            top: 50%;
            transform: translateY(-50%);
        }
        .back{
            width: 14px;
            height: 14px;
            background: url("~@/assets/images/login/ad_cj@2x.png") no-repeat;
            background-size: contain;
            position: absolute;
            left: 18px;
            top: 50%;
            transform: translateY(-50%);
        }
    }
    .contain-box{
        width: 100%;
        height: 368px;
        display: flex;
        transition: .3s all;
    }
    .list-text {
      width: 100%;
      text-align: center;
      font-size: 16px;
      color: #666666;
    }
    .active {
      color: #659ffc;
    }
    .bank-wrap,.sms-box-wrap{
        flex: 1;
    }
}
.shadow{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 100;
}
.bank-wrap{
    display: flex;
    width: 100%;
    justify-content: flex-end;
    z-index: 111;
}
.bankList{
    flex: 1;
    justify-content: center;
    .box{
        overflow: scroll;
        max-height: 368px;
    }
    ul{
        li{
            height: 48px;
            line-height: 48px;
            display: flex;
            margin-left: 16px;
            box-sizing: border-box;
            align-items: center;
            img{
                width: 24px;
                height: 24px;
                border-radius: 12px;
                overflow: hidden;
                margin-right: 10px;
            }
            span{
                color: #666;
                font-size: 14px;
            }
        }
    }
}
//动画
// .animation-left{
//     animation: goLeft .3s forwards;
// }
.visibility{
    visibility: visible;
}
input{
    // appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    -o-appearance: none;
    border: none;
}
.sms-box-wrap{
    .item{
        height: 48px;
        position: relative;
        input{
            text-align: right;
        }
        .send-sms{
            display: flex;
            height: 48px;
            justify-content: flex-end;
            align-items: center;
            input{
                width: 100%;
            }
            .edit{
                display: block;
                width: 100px;
                height: 16px;
                line-height: 16px;
                text-align: right;
                overflow-x: scroll;
            }
            .smssendbtn{
                width: 80px;
                height: 16px;
                border-left: 1px solid #ccc;
                margin-left: 10px;
                .disabled{
                    color: #999;
                }
            }

        }
        &:before{
            content: "";
            width: 0;
            height: 1px;
            background: $blue;
            position: absolute;
            bottom: 0;
            left: 50%;
            z-index: 1;
            transform: translateX(-50%);
        }
    }
    .active{
        .edit{
            border: 0 solid #E6E6E6;
            box-shadow: inset 0 1px 4px 0 rgba(0,0,0,0.12);
            border-radius: 2px;
            height: 29px !important;
            line-height: 29px !important;
            width: 162px;
            display: inline-block;
            padding-right: 10px;
        }
        .send-sms {
            .edit {
                width: 80px !important;
            }
        }
    }
    .submit{
        margin-top: 8px;
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 16px;
    }
}
@keyframes goLeft {
    from{
        transform: translateX(0)
    }
    to{
        transform: translateX(-50%);
    }
}
.inEdit{
    color: #999;
}
</style>
