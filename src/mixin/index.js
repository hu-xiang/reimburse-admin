import Vue from 'vue';

Vue.mixin({
  data() {
    return {
    };
  },
  computed: {
    tipsTitle() { return this.$t('message.tipsTitle') },
    tips() { return this.$t('message.tips') },
    okBtn() { return this.$t('message.okBtn') },
    cancelBtn() { return this.$t('message.cancelBtn') },
  },
  created() {
  },
  beforeRouteLeave(to, from, next) {
  },
});