<template>
  <el-dialog :append-to-body="true" :visible="isShow" :title="isAdd ? '新增菜单' : '编辑菜单'" width="600px" @close="cancel">
    <el-form ref="ruleForm" :model="edit_data" :rules="rules" size="small" label-width="100px">
      <el-form-item label="名称" prop="label_cn">
        <el-input v-model="edit_data.label_cn" placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="描述" prop="playbook_desc">
        <el-input v-model="edit_data.playbook_desc" placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="参数" prop="playbook_args">
        <el-input v-model="edit_data.playbook_args" placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="上传用户" >
        <el-input :disabled="true" :value="name" placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item v-show="isAdd" label="上传脚本" prop="playbook_file" >
        <input ref="file" type="file" class="input is-rounded" @change="handleSuccess()"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit(edit_data)">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add_header, edit_header } from '@/api/data'
import { mapGetters } from 'vuex'

export default {
  props: {
    isAdd: {
      type: Boolean,
      required: false,
      default: false
    },
    isShow: {
      type: Boolean,
      default: false
    },
    edit_data: {
      type: Object,
      default() {
        return {
          'label_cn': '',
          'playbook_desc': '',
          'playbook_file': '',
          'playbook_user': ''
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      base_url: 'api/playbook/',
      file: '',
      rules: {
        label_cn: [
          { required: true, message: '请输入playbook名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'id',
      'name'
    ])
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit()
        } else {
          return false
        }
      })
    },
    doAdd() {
      const formData = new FormData()
      const config = { 'content-type': 'multipart/form-data' }
      formData.append('playbook_file', this.file)
      formData.append('label_cn', this.edit_data.label_cn)
      formData.append('playbook_desc', this.edit_data.playbook_desc)
      formData.append('playbook_user', this.id)
      add_header(this.base_url, formData, config).then(res => {
        this.resetForm()
        this.$message({
          showClose: true,
          type: 'success',
          message: '添加成功!',
          duration: 2500
        })
        this.loading = false
        this.$parent.$parent.init()
        this.$emit('update:isShow', false)
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    doEdit() {
      const formData = new FormData()
      const config = { 'content-type': 'multipart/form-data' }
      formData.append('playbook_file', this.file)
      formData.append('label_cn', this.edit_data.label_cn)
      formData.append('playbook_desc', this.edit_data.playbook_desc)
      formData.append('playbook_user', this.id)
      edit_header(this.base_url, this.edit_data.id, formData, config).then(res => {
        this.resetForm()
        this.$message({
          showClose: true,
          type: 'success',
          message: '修改成功!',
          duration: 2500
        })
        this.loading = false
        this.$parent.$parent.$parent.init()
        this.$emit('update:isShow', false)
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    resetForm() {
      this.$emit('update:isShow', false)
    },
    handleSuccess(file, fileList) {
      console.log(this)
      this.file = this.$refs.file.files[0]
    }
  }
}
</script>
