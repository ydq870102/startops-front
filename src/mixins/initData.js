import { get } from '@/api/data'

export default {
  data() {
    return {
      loading: true, data: [], page: 1, size: 10, total: 0, url: '', params: {}, query: {}, time: 50
    }
  },
  methods: {
    async init() {
      if (!await this.beforeInit()) {
        return
      }
      return new Promise((resolve, reject) => {
        this.loading = true
        get(this.base_url, this.params).then(res => {
          this.total = res.count
          this.data = res.results
          setTimeout(() => {
            this.loading = false
          }, this.time)
          resolve(res)
        }).catch(err => {
          this.loading = false
          console.log(err)
          reject(err)
        })
      })
    },
    beforeInit() {
      return true
    },
    pageChange(e) {
      this.page = e
      this.init()
    },
    sizeChange(e) {
      this.page = 1
      this.size = e
      this.init()
    }
  }
}
