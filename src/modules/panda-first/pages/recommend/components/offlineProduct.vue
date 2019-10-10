<template lang="html">
    <!-- 三级商户，线下大额贷款 -->
    <div class="model offline-wrap" v-if="data">
        <div class="offline-content">
            <div class="title">大额线下贷</div>
            <div class="c-flex-row">
                <div class="c-col-60">
                    <div class="moeny">￥200,000</div>
                    <div class="desc">最高可借额度</div>
                </div>
                <div class="c-col-40">
                    <mt-button class="btn-round handle-button" size="normal" type="primary" @click.native="$root.openUrl({url: data.nextpage.url, isFull: false}, resdata)">去申请</mt-button>
                </div>
            </div>
            <div class="c-flex-row c-v-center step3">
                <div class="c-col-33">
                    <img src="../../../assets/images/success@2x.png"/> 额度高
                </div>
                <div class="c-col-33">
                    <img src="../../../assets/images/success@2x.png"/> 线下面签
                </div>
                <div class="c-col-33">
                    <img src="../../../assets/images/success@2x.png"/> 合规机构
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['resdata'],
        data() {
            return {}
        },
        computed: {
            data() {
                return this.resdata.thirdproducts;
            },
        }

    }
</script>

<style lang="scss" scoped>

    .offline-wrap {
        padding: 10px 16px;
        padding-bottom: 30px;
    }

    .offline-content {
        padding: 10px 16px;
        background: #FFFFFF;
        box-shadow: 0 4px 18px 0 rgba(0,0,0,0.10);
        border-radius: 6px;
        .c-col-40 {
            text-align: right;
        }
        .title {
            font-size: 18px;
            color: #353241;
            letter-spacing: 0.5px;
        }

        .moeny {
            font-family: PingFangSC-Medium;
            font-size: 24px;
            color: #DEC371;
            letter-spacing: 1px;
            text-align: left;
            margin-top: 10px;
            margin-bottom: 4px;
            margin-left: -4px;
        }

        .desc {
            font-size: 14px;
            color: #535370;
            letter-spacing: 0.78px;
            text-align: left;
        }

        .step3 {
            margin-top: 17px;
            background: #F5F7FC;
            border-radius: 4px;
            height: 40px;

            img {
                height: 16px;
                width: 16px;
                display: inline-block;
                vertical-align: text-bottom;
            }
        }

        .mint-button--primary {
            background: #DEC371;
            box-shadow: 0 1px 6px 0 rgba(208,162,82,0.34);
            border-radius: 16px;
            color: #fff;
            height: 32px;
            width: 72px;
            font-size: 14px;
            letter-spacing: 0.78px;
            margin-top: 24px;
        }
    }

    .model{
        img{
            width: 100%;
            display: block;
            margin: 0 auto;
        }
    }



</style>
