<template>
  <div class="wrap">
    <span v-if="readonly">{{computedValue}}</span>
    <span v-else>
      <span v-if="computedValue">{{computedValue}}</span>
      <span v-else class="c-light">{{placeholder}}</span>
      <c-icon class="icon-16" type="arrowRight" />
    </span>
  </div>
</template>

<script>
import appBridge from "@/services/AppBridge";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      showSelect: false,
      asyncOptions: null
    };
  },
  props: {
    title: {},
    type: {},
    source: {},
    value: {},
    text: {},
    textKey: {},
    required: {},
    placeholder: {
      default: "选择"
    },
    validate: {},
    readonly: {},
    disabled: {},
    options: {}
  },
  computed: {
    ...mapGetters(["dictionary"]),
    computedOptions() {
      let { source, options, asyncOptions } = this;

      // 优先使用异步获取的选项
      if (asyncOptions) {
        return asyncOptions;
      }

      // source为string，直接从dictionary取数据
      if (source && typeof source == "string") {
        this.fetchServiceType(source).then(data => {
          this.asyncOptions = data;
        });
      }

      if (!options) {
        return [];
      }
      return options.map(item => {
        return typeof item == "object" ? item : { value: item, text: item };
      });
    },
    computedValue() {
      let filter = this.computedOptions.filter(item => {
        return this.value === item.value;
      });
      return filter.length ? filter[0].text : "";
    }
  },
  methods: {
    ...mapActions(["fetchServiceType"]),
    edit() {
      if (appBridge.isApp) {
        appBridge.pickerView(
          {
            dataSource: "H5",
            dataArr: this.computedOptions.map(item => item.text),
            title: "选择" + this.title,
            select: this.computedValue
          },
          res => {
            let value = res.data.retValue;
            let match = this.computedOptions.filter(item => item.text == value);
            if (match.length > 0) {
              value = match[0].value;
              this.updateValue(value);
            }
          }
        );
      } else {
        this.$root.$refs.select
          .open({
            value: this.value,
            options: this.computedOptions
          })
          .then(
            (value, item) => {
              this.updateValue(value);
            },
            () => {}
          );
      }
    },
    updateValue(value) {
      this.$emit("input", value);
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  flex: 1;
}
.icon-16 {
  @include size(16px);
}
</style>
