<template lang="html">
  <div class="c-flex-row progress-wrap c-section">

    <div class="c-flex-item" v-for="(item,index) in list" :class="{active: item.flag}">
      <img class="c-icon" :src=icons[index].finish v-if="item.flag"/>
      <img class="c-icon" :src=icons[index].unFinish v-else/>
      <p v-text="item.text"></p>
    </div>

  </div>
</template>

<script>

  import _ from "lodash";

  export default {

    props: {
      currentStep: {
        type: Number,
        required: true
      },
      stepList: {
        type: Array,
        required: true,
      }
    },

    watch: {

      //下一步骤点亮
      currentStep: {
        handler(newValue, oldValue) {

          this.list.map((item, index) => {

            if (item.step == newValue) {

              this.list.splice(index, 1, Object.assign(item, {
                flag: true
              }))
            }
          })
        }
      }

    },

    data() {
      return {

        icons: [
          {
            finish: require(`../../../../assets/images/publicInfo/ba_ah@2x.png`),
            unFinish: require(`../../../../assets/images/publicInfo/ba_an@2x.png`),
          },
          {
            finish: require(`../../../../assets/images/publicInfo/bb_ah@2x.png`),
            unFinish: require(`../../../../assets/images/publicInfo/bb_an@2x.png`),
          },
          {
            finish: require(`../../../../assets/images/publicInfo/bc_ah@2x.png`),
            unFinish: require(`../../../../assets/images/publicInfo/bc_an@2x.png`),
          }
        ],

        list: [],
        step: 1,
      }
    },
    created() {
      let copyList = _.clone(this.stepList)
      //   copyList.map((item, index) => copyList[index]['flag'] = (index < this.currentStep))

      let num = this.$route.name.replace('step', '')
      copyList.map((item, index) => copyList[index]['flag'] = (this.currentStep == num && item.step == num))

      this.list = copyList

      console.log(JSON.stringify(copyList, null, 3));


    }

  }
</script>

<style lang="scss" scoped>
  .progress-wrap {
    margin-left: -25px;
    margin-right: -25px;
    height: 80px;
  }

  .c-flex-item {
    position: relative;
    padding-top: 14px;
    padding-bottom: 8px;

    .c-icon {
      @include size(24px);
      position: relative;
      z-index: 1;
    }
    p {
      margin-top: 8px;
    }

    &::after {
      content: '';
      display: block;
      position: absolute;
      top: 24px;
      left: 0;
      right: 0;
      height: 1px;
      background: #E6E6E6;
    }
    &:first-child::after {
      left: 50%;
    }
    &:last-child::after {
      right: 50%;
    }
    &.active {
      &::after {
        background: #659FFC;
      }
    }
  }
</style>
