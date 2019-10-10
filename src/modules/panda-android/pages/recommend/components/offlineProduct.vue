<template lang="html">
    <!-- 三级商户，线下大额贷款 -->
    <div class="model offline-wrap" v-if="data">
        <div class="section-title" v-if="resecondproducts">钱包提额</div>
        <div class="offline-content">
            <div class="c-flex-row">
                <div class="c-col-60">
                    <div class="moeny">500,000</div>
                    <div class="desc">线下贷款，面签拿大额</div>
                </div>
                <div class="c-col-40 el-btn">
                    <mt-button class="btn-round handle-button" size="normal" type="primary" @click.native="$root.openUrl({url: data.nextpage.url, isFull: false}, resdata)">去申请</mt-button>
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
            resecondproducts() {
                let count = 0;
                this.resdata.resecondproducts.forEach(item => {
                    count += item.maxamount
                });
                return count <= 0;
            },
            data() {
                return this.resdata.thirdproducts;
            },
        }

    }
</script>

<style lang="scss" scoped>
    @import "../../../assets/sass/variables";
    .offline-wrap {
        background: #FFFFFF;
        padding: 10px 16px;
    }
    .title {
        font-size: 20px;
        color: #333333;
        letter-spacing: 0.5px;
        margin-bottom: 12px;
        margin-top: 10px;
    }

    .offline-content {
        box-shadow: 0 2px 10px 0 rgba(0,0,0,0.10);
        border-radius: 8px;
        padding: 10px 16px;
        background: #FFFFFF;

        .el-btn {
            text-align: right;
        }
        .moeny {
            font-size: 29px;
            color: #444444;
            letter-spacing: 1px;
            text-align: left;
        }

        .desc {
            font-size: 14px;
            color: #999;
            letter-spacing: 0.78px;
            text-align: left;
        }

        .step3 {
            margin-top: 17px;
            border-top: 1px dashed #EDEDED;
            border-radius: 4px;
            height: 40px;
            text-align: justify;

            img {
                height: 18px;
                width: 18px;
                display: inline-block;
                vertical-align: text-bottom;
            }
        }

        .mint-button--primary {
            background: $base-color;
            border-radius: 16px;
            color: #fff;
            height: 32px;
            width: 72px;
            font-size: 14px;
            letter-spacing: 0.78px;
            margin-top: 14px;
        }
    }

    .model{
        img{
            width: 100%;
            display: block;
            margin: 0 auto;
        }
    }
    .section-title {
        border: 0;
    }



</style>
