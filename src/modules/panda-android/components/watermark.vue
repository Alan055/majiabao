<template lang="html">
    <div class="page-watermark">
        熊猫钱包，诗和远方
    </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
  watch: {}
};
</script>

<style lang="scss" scoped>
.page-watermark {
  background: #f8f8f8;
  padding: 24px 0;
  text-align: center;
  font-size: 12px;
  color: #bfbfbf;
  letter-spacing: -0.24px;

  &:before {
    content: "";
    position: relative;
    height: 1px;
    width: 32px;
    background-color: #bfbfbf;
    display: inline-block;
    top: -4px;
    right: 4px;
  }
  &:after {
    content: "";
    position: relative;
    height: 1px;
    width: 32px;
    background-color: #bfbfbf;
    display: inline-block;
    top: -4px;
    left: 4px;
  }
}
</style>
