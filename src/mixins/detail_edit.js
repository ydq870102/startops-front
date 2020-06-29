import { edit } from '@/api/data'

export default {
  props: {
    detailData: {
      type: Object,
      default() {
      }
    }
  },
  methods: {
    // 编辑保存方法
    editSave() {
      edit(this.base_url, this.detailData.id, this.detailData).then(res => {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
      }
      )
      this.$emit('reload', this.detailData.id)
      this.isshowbase = true
    },
    // 编辑取消方法
    editCancel() {
      this.isshowbase = true
    }
  }
}
