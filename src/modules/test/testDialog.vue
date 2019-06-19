<template lang="html">
<div class="view-template">
  <c-header title="Test Dialog"></c-header>
  <br>
  <mt-button @click.native="toast">Toast</mt-button>
  <br>
  <mt-button @click.native="indicator">Indicator</mt-button>
  <br>
  <mt-button @click.native="messageBox">MessageBox</mt-button>
</div>
</template>

<script>
import api from '@/services/api'
import util from '@/utils'
import storage from "@/utils/storage"
import helper from '@/utils/helper'
import {Toast, Indicator, MessageBox} from '@/utils/helper'

export default {
  name: 'testDialog',
  data () {
    return {
      
    }
  },
  computed: {

  },
  methods: {
    toast() {
      Toast('xx')
    },
    indicator() {
      Indicator.open()

      setTimeout(Indicator.close, 2000)
    },
    messageBox() {
      // MessageBox({
      //   title: 'title',
      //   message: 'message',
      //   confirmButtonText: 'confirm',
      //   cancelButtonText: 'cancel'
      // }).then(action => {
      //   console.log(action)
      // })
      MessageBox.confirm('xxx', 'xxxxx').then(action => {
        console.log(action)
      })
    }
  },
  components: {

  },
  watch: {

  },
  created() {

  }

}
</script>

<style lang="scss" scoped>
</style>
