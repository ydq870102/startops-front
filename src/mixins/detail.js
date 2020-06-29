export default {
  data() {
    return {
      detailInst: {
        detailshow: false,
        detailData: {}
      }
    }
  },
  methods: {
    // 详情
    toDetail(id) {
      this.$router.push({
        path: this.detail_url,
        query: { id: id }
      })
    }
  }
}
