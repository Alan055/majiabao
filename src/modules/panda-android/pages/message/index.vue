<template lang="html">
    <div class="page-message">
        <div class="c-view-content">
            <div class="c-flex-row m-message-list" v-for="(item, i) in data" :key="i" @click="goDetail(item)">
                <div class="c-col-20 left">
                    <img src="../../assets/images/my-message.png" v-if="item.msgtype == 1"/>
                    <img src="../../assets/images/system-message.png" v-if="item.msgtype == 0"/>
                </div>
                <div class="c-col-80 right">
                    <div class="c-flex-row c-justify-between">
                        <div class="c-flex-item el-title">
                            {{item.msgtitle}}
                        </div>
                        <div class="c-flex-item el-time">
                            {{item.createtime}}
                        </div>
                    </div>
                    <div class="c-flex-row c-flex-wrap el-content" v-if="item.msgtype == 1">
                        <img class="he-full-img" v-if="item.msgimgurl" :src="item.msgimgurl"/>
                    </div>
                    <div class="c-flex-row c-flex-wrap el-content" v-if="item.msgtype == 0">
                        {{item.msgcontent}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pageSize: 1000,
            pageNo: 1,
            token: '',
            data: []
        };
    },
    methods: {
        getData(type) {
            
            return new Promise((resolve, reject) => {
                this.$api.user.message
                    .lists({
                        msgType: type, //活动消息
                        pageNum: this.pageNo,
                        pageSize: this.pageSize,
                        productId: '2001',
                        token: this.token
                    })
                    .then(res => {
                        if (!this.$helper.isSuccess(res)) return;
                        
                        resolve(res.data.pageData)

                    });
                });
        },
        goDetail(item) {
            if (item.openurl) {
                this.$root.openUrl(item.openurl);
            }else {
                this.$router.replace({
                    name: "messageDetail",
                    query: {
                        item: JSON.stringify(item),
                        productid: this.productId
                    }
                });
            }
        },
        pushData(){
            this.data = [{
                msgtype: 0,
                msgtitle: '系统公告',
                createtime: '2019-05-08',
                msgcontent: '温馨提示：谨防诈骗！',
                openurl: process.env.kingPath + "/pages/speed-panda/#/message/example", //消息中心
            }]
        }
    },
    watch: {
        
    },
    async created () {
        this.token = this.$route.query.token;
        
        if(this.token){
            let data1 = await this.getData(1);//系统消息
            let data2 = await this.getData(0);//活动消息

            this.data = data1.concat(data2);

            if(this.data.length == 0) {
                this.pushData()
            }
        }else {
            this.pushData()
        }
    },

    mounted() {
        
    }
};
</script>

<style lang="scss" scoped>
.page-message {
    background: #FFFFFF;

    .m-message-list {
        overflow: hidden;
        padding: 20px 16px;
        .left {
            text-align: left;
            img {
                width: 48px;
            }
        }
        .right {
            @extend %border-b;
            .el-title {
                font-size: 18px;
                color: #444444;  
                text-align: left;            
            }
            .el-time {
                font-size: 12px;
                color: #BFBFBF;
            }
            .el-content {
                height: 100%;
                font-size: 14px;
                color: #797979;
                letter-spacing: 0;
                padding-bottom: 10px;
                text-align: left;
            }
        }
    }
}
</style>
