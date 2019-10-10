<template>
    <div class="view c-view-gay">
        <div class="c-view-content">
            <div class="m-question">    
                <div class="el-question-list">
                    <div class="el-question-item" v-for="(item, i) in data" :key="i" @click="handleListClick(item)">
                        {{item.title}}
                        <i class="mint-cell-allow-right"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import api from "@/services/api";
    import util from "@/utils";
    import helper from "@/utils/helper";

    export default {
        name: "helplist",
        data() {
            return {
                data: [],
                dataList: [
                    {
                        type: 1,
                        id: 3,
                        title: '熊猫钱包的申请条件？',
                    },
                    {
                        type: 1,
                        id: 4,
                        title: '为什么身份证无法扫描成功？',
                    },
                    {
                        type: 2,
                        id: 2,
                        title: '审核时间有多长？',
                    },
                    {
                        type: 2,
                        id: 6,
                        title: '最高可申请多少额度？',
                    },
                    {
                        type: 3,
                        id: 7,
                        title: '为什么我无法登陆？',
                    },
                    {
                        type: 4,
                        id: 8,
                        title: '为什么扣款成功APP还是现实逾期？',
                    },
                ]
            };
        },
        computed: {

        },
        methods: {
            handleListClick(item) {
                this.$root.nextTitle = '问题详情';
                this.$router.push({
                    name: 'help/detail',
                    params: {
                        id: item.id
                    },
                })
            }
        },
        activated () {
            this.$root.getRouteData().then(params => {
                console.log('params.type', params.type)
                this.data = this.dataList.filter( (d) => {
                    return d.type == params.type
                });
                console.log('this.data', this.data)
            })
        },
        mounted () {
            this.$root.loadingClose();
        },
        onRefresh(tag, data) {
            if (tag == "refresh") {
                
            }
        }
    };
</script>

<style lang="scss" scoped>
    .m-question {
        border-top: 8px solid #F8F8F8;

        .el-question-list {

            .el-question-item {
                position: relative;
                padding: 13px 0;
                margin-left: 16px;
                font-size: 16px;
                color: #444444;
                &:not(:last-child) {
                    @extend %border-b;
                }
            }
        }
    }

</style>
