<template>
  <el-dialog :append-to-body="true" :visible="isShow" :title="isAdd ? '新增配置' : '编辑配置'" width="600px" @close="cancel">
    <el-form ref="ruleForm" :model="edit_data" :rules="rules" size="small" label-width="100px">
      <el-form-item label="项目名称" >
        <el-input :disabled="true" :value="related_project_name" placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="环境" prop="env">
        <el-select v-model="edit_data.env" style="width: 360px;" placeholder="请环境类型">
          <el-option v-for="item in env_type" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="服务" prop="service">
        <el-input v-model="edit_data.service" placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="上传用户" >
        <el-input :disabled="true" :value="name" placeholder="" styl e="width: 360px;"/>
      </el-form-item>
      <el-form-item v-show="isAdd" label="上传脚本" prop="config_file" >
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
          'related_project_id': '',
          'env': '',
          'service': '',
          'config_file': '',
          'create_user': ''
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      related_project_name: this.$route.query.code,
      env_type: [{ label: '开发环境', value: 'dev' }, { label: '测试环境', value: 'uat' }, { label: '生产环境', value: 'prod' }],
      base_url: 'api/process/config/',
      file: '',
      rules: {
        env: [
          { required: true, message: '请输入脚本名称', trigger: 'blur' }
        ],
        service: [
          { required: true, message: '请输入脚本类型', trigger: 'blur' }
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
      console.log(this.$route.query)
      const config = { 'content-type': 'multipart/form-data' }
      formData.append('config_file', this.file)
      formData.append('related_project', this.$route.query.id)
      formData.append('env', this.edit_data.env)
      formData.append('service', this.edit_data.service)
      formData.append('create_user', this.id)
      add_header(this.base_url, formData, config).then(res => {
        this.resetForm()
        this.$message({
          showClose: true,
          type: 'success',
          message: '添加成功!',
          duration: 2500
        })
        this.loading = false
        this.$parent.$parent.getPath()
        this.$emit('update:isShow', false)
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    doEdit() {
      const formData = new FormData()
      const config = { 'content-type': 'multipart/form-data' }
      formData.append('config_file', this.file)
      formData.append('related_project', this.$route.query.id)
      formData.append('env', this.edit_data.env)
      formData.append('service', this.edit_data.service)
      formData.append('create_user', this.id)
      edit_header(this.base_url, this.edit_data.id, formData, config).then(res => {
        this.resetForm()
        this.$message({
          showClose: true,
          type: 'success',
          message: '修改成功!',
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
