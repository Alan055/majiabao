<template lang="html">
  <svg class="iconfont" :class="icon" aria-hidden="true">
    <use :xlink:href="'#'+icon"></use>
  </svg>
</template>

<!--
  usage:
  <svg-icon icon="icon-shanchuicon"></svg-icon>
 -->

<script>
export default {
  props: {
    icon: {}
  }
}
</script>
