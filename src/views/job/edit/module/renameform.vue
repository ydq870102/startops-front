<template>
  <el-dialog :append-to-body="true" :visible="isShow" :title="isfile? '新增文件' : '新增文件夹'" width="600px" @close="cancel">
    <el-form ref="ruleForm" :model="form_data" :rules="rules" size="small" label-width="100px">
      <el-form-item label="节点名称" prop="dest_path">
        <el-input v-model="form_data.dest_path" placeholder="请输入名称" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="修改前节点名称" prop="parent_name">
        <el-input v-model="parent_name" :disabled="true" placeholder="" style="width: 360px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add } from '@/api/data'

export default {
  props: {
    isfile: {
      type: Boolean,
      default: false
    },
    isShow: {
      type: Boolean,
      default: false
    },
    parent_path: {
      type: String,
      default: ''
    },
    parent_name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      form_data: {
        'path': '',
        'src_path': '',
        'dest_path': ''
      },
      rules: {
        dest_path: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.doAdd()
        }
      })
    },
    doAdd() {
      this.form_data.src_path = this.parent_name
      this.form_data.path = this.parent_path
      add('/api/edit/renamenode/', this.form_data).then(res => {
        this.resetForm()
        this.$message({
          showClose: true,
          type: 'success',
          message: '修改成功!',
          duration: 2500
        })
        this.$emit('refresh', '')
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    resetForm() {
      this.$emit('update:isShow', false)
    }
  }
}
</script>
