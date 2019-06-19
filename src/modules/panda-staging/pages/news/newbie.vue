<template>
    <div class="view ">
        <div class="c-view-content">
            <img class="he-auto-img" src="../../assets/images/newbie.png" />

            <mt-button
                class="btn-round handle-button"
                size="normal"
                type="primary"
                @click.native="handleBtnClick"
                >
                一键拿钱
            </mt-button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import api from "@/services/api";
    import util from "@/utils";
    import helper from "@/utils/helper";

    export default {
        name: "newbie",
        data() {
            return {
                isLogin: false,
                stepUrl: process.env.staticPath + "/pages/speed-panda/#/publicInfo/step3", //三步资料第一步
            };
        },
        computed: {

        },
        methods: {
            handleBtnClick() {
                if (this.$root.isLogin || this.isLogin) {
                    this.$root.openUrl(this.stepUrl)
                }else {
                    this.$AppBridge.goNative({
                        pkg: 'login',
                    })
                }
            }
            
        },
        created() {
           console.log('this.stepUrl', this.stepUrl)
        },
        mounted () {
            this.$root.loadingClose();
        },
        onRefresh(tag, data) {
            if (tag == "login") {
                if (data) {
                    this.isLogin = true;
                    console.log("登录成功", data);
                    console.log("this.isLogin", this.isLogin);

                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .c-view-content {
        position: relative;
        padding-bottom: 50px;    
        background-color: #00ad78;
        text-align: center;

        .handle-button {
            z-index: 99;
            position: relative;
            top: -145px;
            width: 255px;
            height: 48px;
            background-image: linear-gradient(0deg, 
                #ff9d11 0%, 
                #ffdf5e 100%);
            box-shadow: 0px 14px 18px 0px 
                rgba(0, 0, 0, 0.14);
            border-radius: 24px;
            font-size: 18px;
            color: #8a4c01;
        }
    }

</style>
