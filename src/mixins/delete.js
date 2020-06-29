import { del } from '@/api/data'

export default {
  data() {
    return {
      allSelect: false,
      delLoading: false
    }
  },
  methods: {
    subDelete(id) {
      this.delLoading = true
      del(this.base_url, id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.init()
        this.$message({
          showClose: true,
          type: 'success',
          message: '删除成功!',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err)
      })
    },
    // 全选
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.table.toggleRowSelection(row, !this.allSelect)
        })
        this.allSelect = !this.allSelect
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 批量删除
    doSelectionDel() {
      const resultArr = []
      const _this = this
      this.multipleSelection.forEach(function(data, index) {
        const result = del(_this.base_url, data.id).catch(err => {
          console.log(err)
        })
        resultArr.push(result)
      })
      Promise.all(resultArr).then((resultArr) => {
        this.init()
      })
    }
  }
}
