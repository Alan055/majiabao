<!--市场商业化链接-->
<template lang="html">
    <div class='iframe-wrap' ref="iframeWrap">
        <iframe v-if="iframeUrl && iframeLoad" :src="iframeUrlAddParam" width='100%' frameborder='0' name="_blank"
                ref="iframeContent"
                id="iframeContent"
                scrolling="no" style="width: 1px; min-width: 100%; *width: 100%;">
        </iframe>
    </div>
</template>

<script>
    import appBridge from '@/services/AppBridge'
    import util from '@/utils'
    import getiframeData from '@/utils/getiframeData'
    import EventBus from "@/services/EventBus"

    export default {
        data() {
            return {
                setHeightValue: '',
                iframeLoad: false,
            }
        },
        props: {
            iframeUrl:  {
                type: String,
                default: ''
            },
            className: { // 这里特别注意一下   如果页面只有一个iframe就不要传这个name  这个是为了处理页面中有两个iframe时  高度共用的bug
              type: String,
              default: ''
            },
        },
        mounted() {
            let self = this;
            console.log('挂载了message')
            if (window.addEventListener) {
                console.log('window.addEventListener')
                window.addEventListener("message", (e) => {
                    console.log('self.setHeight addEventListener')
                    self.setHeight(e)
                }, false);
            } else if (window.attachEvent) {
                console.log('window.attachEvent')
                window.attachEvent("message", (e) => {
                    console.log('self.setHeight attachEvent')
                    self.setHeight(e)
                });
            }else{
                console.log('addEventListener,attachEvent都不支持')
            }

            this.iframeLoad = true;
            console.log('this.iframeLoad', this.iframeLoad)
        },
        computed: {
            iframeUrlAddParam() {
                let urlParams = util.formatUrlData(util.getParams() || {});

                let connector = '';

                if (urlParams) {
                    connector = this.iframeUrl.indexOf('?') === -1 ? '?' : '&';
                }

                return this.iframeUrl + connector + urlParams;
            }
        },
        methods: {
            setHeight(e) {
                console.log('setHeight fun', e.data.height)
                if(this.setHeightValue == e.data.height){
                    console.log('已设置高度，', this.$refs.iframeWrap.style.height, '但还是接受到相等高度message===>', e.data);
                    return;
                }

                if (e.data && e.data.height) {
                    console.log('接受到message===>', e.data);
                  if(this.className) { // 多个iframe 分开设置高度  多个的时候不能用refs的方法去修改  只能修改全局的 用jq
                    let list = document.getElementsByTagName('iframe')
                    for(let val of list){
                    	if(val.src.includes(e.origin)){
                        val.style.height = e.data.height + "px";
                        val.parentElement.style.height = e.data.height + "px";
                      }
                    }
                  }else{ // 单个iframe时  直接多全局所有的iframe(唯一)设置高度即可
                    this.$refs.iframeWrap.style.height = e.data.height + "px";
                    this.$refs.iframeContent.style.height = e.data.height + "px";
                    this.setHeightValue = e.data.height;

                    setTimeout(() => {
                      document.getElementById('iframeContent').style.height = e.data.height + "px";
                    }, 200)
                    EventBus.$emit('postMessage', e.data.height); // 这句话好像根本就订阅不到
                  }
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    .iframe-wrap {
        overflow: hidden;
    }
</style>
