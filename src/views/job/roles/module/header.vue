<template>
  <div class="head-container">
    <!-- 新增 -->
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button v-if="checkPermission(['admin','playbook_all','playbook_list'])" size="mini" class="filter-item" type="primary" icon="el-icon-plus" @click="toAdd">新增</el-button>
      <eForm ref="ruleForm" :is-show.sync="dialog" :is-add="true"></eForm>
    </div>
    <!-- 删除 -->
    <el-button v-if="checkPermission(['admin','playbook_all','playbook_delete'])" class="filter-item" size="mini" type="danger" icon="el-icon-remove" @click="deleteSelect">删除</el-button>
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button v-if="checkPermission(['admin','playbook_all','playbook_edit'])" size="mini" class="filter-item" type="primary" icon="el-icon-upload" @click="toImport">导入</el-button>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      title="上传文件"
      width="940px">
      <uploader :url="upload_url"></uploader>
    </el-dialog>
  </div>
</template>

<script>
import allDelete from '@/mixins/allDelete'
import permission from '@/mixins/permission'
import eForm from './form'
import uploader from '@/components/Uploader'

// 查询条件
export default {
  components: { eForm, uploader },
  mixins: [permission, allDelete],
  data() {
    return {
      base_url: 'api/crontab/',
      upload_url: 'api/role/upload/',
      dialog: false,
      dialogVisible: false
    }
  },
  methods: {
    toAdd() {
      this.dialog = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    toImport() {
      this.dialogVisible = true
      this.upload_url = process.env.BASE_API + '/' + this.upload_url
    },
    onFileSuccess() {
      console.log(this)
    }
  }
}
</script>
