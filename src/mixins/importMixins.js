import { imp } from '@/api/data'

export default {
  data() {
    return {
      // 导出数据变量
      importInst: {
        show: false,
        result: {},
        fullscreenLoading: false
      }
    }
  },
  methods: {

    // 导入前校验
    beforeUpload(file) {
      const isLt50M = file.size / 1024 / 1024 < 50
      if (isLt50M) {
        this.importInst.result = {}
        this.importInst.fullscreenLoading = this.$loading({
          lock: true,
          text: 'Loading,导入中.',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        return true
      }
      this.$message({
        message: '导入文件请不要超过50M',
        type: 'warning'
      })
      return false
    },
    // 导入成功提示
    handleSuccess({ results }) {
      imp(this.imp_url, results).then(res => {
        this.importInst.result = res
        this.importInst.fullscreenLoading.close()
      }).then(() => {
        this.$message({
          type: 'success',
          message: '导入完成，结果请看详情.!'
        })
      }).catch(err => {
        this.importInst.fullscreenLoading.close()
        console.log(err)
      })
    },
    // 导入相关方法
    importHandler() {
      this.importInst.show = true
      this.importInst.result = {}
      this.get_template_download_path(this.template_url, this.download_object)
    }
  }
}
