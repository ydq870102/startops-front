export default {
  methods: {
    // 批量删除方法
    deleteSelect() {
      if (this.$parent.multipleSelection) {
        const count = this.$parent.multipleSelection.length
        this.$confirm('此操作将删除' + count + '条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$parent.doSelectionDel()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message({
          type: 'info',
          message: '请先选择数据'
        })
      }
    }
  }
}
