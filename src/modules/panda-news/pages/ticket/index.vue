<template lang="html">

  <no-data
    :imgUrl="require('../../assets/images/news/no-ticket.png')"
    text="您暂时没有优惠券"
  ></no-data>
</template>

<script>
import noData from "@/components/common/noData";

export default {
  data() {
    return {};
  },
  components: {
    noData
  },
  methods: {},
  beforeRouteEnter(to, from, next) {
    next(vm => {});
  },
  filters: {}
};
</script>
