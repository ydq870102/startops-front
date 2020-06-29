import { get } from '@/api/data'

export default {
  data() {
    return {
      // 导出数据变量
      exportArr: {
        DataResult: '',
        tHeader: '',
        timeField: '',
        filterVal: '',
        downloadLoading: false
      }
    }
  },
  methods: {

    // 导出获取数据方法
    fetchExportData() {
      get(this.model_url).then(res => {
        this.exportArr.filterVal = Object.keys(res.detail)
        this.exportArr.tHeader = Object.values(res.detail)
      }).then(() => {
        get(this.base_url, { size: 1000 }).then(res => {
          this.exportArr.exportData = res.results
          import('@/vendor/Export2Excel').then(excel => {
            const data = this.jsonToList(this.exportArr.filterVal, this.exportArr.exportData)
            excel.export_json_to_excel({
              header: this.exportArr.tHeader,
              data,
              filename: 'table_list'
            })
          })
        })
      }).finally(
        this.exportArr.downloadLoading = false)
    },
    // 格式化导出数据方法
    jsonToList(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (v[j]) {
          if (v[j] instanceof Object) {
            v[j] = v[j].label_cn
          }
          return v[j]
        }
      }))
    },
    // 导出方法
    downloadHandler() {
      this.exportArr.downloadLoading = true
      this.fetchExportData()
    }
  }
}
