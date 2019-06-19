import {MessageBox} from '@/utils/helper';
import AppBridge from '@/services/AppBridge.js';
import helper from "@/utils/helper";
import {Indicator, Toast} from "@/utils/helper";

/**
 * 活体调用公共方法
 */
export default {

  data() {
    return {
      recognitionType: -1,  //人脸识别方式？0-依图 1-face++
    }
  },

  mounted() {

    AppBridge.getInitData({}, res => {

      //活体类型  人脸识别方式？0-依图 1-face++
      if (res.code == '200' && res.data && res.data.config && typeof res.data.config.face_recognition_method != 'undefined') {

        console.error('人脸识别方式？0-依图 1-face++\n活体类型人脸识别方式==》' + res.data.config.face_recognition_method);
        console.error(res.data.config)

        //识别方式
        this.recognitionType = res.data.config.face_recognition_method
        this.getType()
      }
    })

  },
  methods: {

    /**
     * 活体类型根据APP版本判断
     */
    getType() {

      //老版本只能调用依图， 新版本，活体SDK类型通过服务端下发
      let appVersion = this.$route.query.verno

      if (appVersion && this.recognitionType != -1) {
        this.recognitionType = Number(this.recognitionType)
        return
      }

      //老版本APP，默认使用依图
      this.recognitionType = 0
    },


    /**
     * 活体调用
     */
    callLivingBody() {

      //防止没有赋值，直接调用
      if (this.recognitionType == -1) {
        Toast("服务器繁忙，请稍后再试")
        return
      }

      let type = this.recognitionType

      let defaultArgs = {
        livingType: type,  //0 依图 1 face++
        jumpUrl: `${process.env.path}/pages/home/index.html#/livingBodyAction`,

        //jumpUrl: `http://192.168.8.115:8081/pages/home/index.html#/livingBodyAction`,
        resultKey: 'livingBody',
      }

      if (this.beforeLivingBody) {
        let flag = this.beforeLivingBody(type)
        if (flag) defaultArgs = flag
      }

      //调用活体SDK
      AppBridge.livingBodyCheck(defaultArgs, res => (this.afterLivingBody) ? this.afterLivingBody(res) : '')
    },
  },

}
