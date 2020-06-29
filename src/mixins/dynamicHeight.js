export default {
  data() {
    return {
      contentStyleObj: {
        height: ''
      }
    }
  },
  created() {
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
  },
  methods: {
    // 动态设置高度
    getHeight() {
      this.contentStyleObj.height = window.innerHeight - 220 + 'px'
    }
  }
}
