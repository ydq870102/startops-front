import { get } from '@/api/data'

export default {
  data() {
    return {
      page: 1, size: 10
    }
  },
  methods: {
    async getLog() {
      if (!await this.before()) {
        return
      }
      return new Promise((resolve, reject) => {
        this.loading = true
        get(this.log_url, this.params).then(res => {
          this.total = res.count
          this.result_log = res.results
          setTimeout(() => {
            this.loading = false
          }, 170)
        }).catch(err => {
          this.loading = false
          reject(err)
        })
      })
    },
    before() {
      return true
    },
    getLogMore() {
      if (this.total > this.params.size) {
        this.params.size += 30
      }
      this.getLog()
    }
  }
}
