<template>
  <el-dialog :append-to-body="true" :visible="isShow" :title="isAdd ? '新增菜单' : '编辑菜单'" width="600px" @close="cancel">
    <el-form ref="ruleForm" :model="edit_data" :rules="rules" size="small" label-width="100px">
      <el-form-item label="脚本名称" prop="label_cn">
        <el-input v-model="edit_data.label_cn" placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="脚本类型" prop="script_type">
        <el-select v-model="edit_data.script_type" style="width: 360px;" placeholder="请选择脚本类型">
          <el-option v-for="item in scripts_type" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="脚本描述" prop="script_desc">
        <el-input v-model="edit_data.script_desc" placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="脚本参数" prop="script_args">
        <el-input v-model="edit_data.script_args" placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="上传用户" >
        <el-input :disabled="true" :value="name" placeholder="" styl e="width: 360px;"/>
      </el-form-item>
      <el-form-item v-show="isAdd" label="上传脚本" prop="script_file" >
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
          'script_type': '',
          'script_desc': '',
          'script_file': '',
          'script_user': ''
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      scripts_type: [{ label: 'shell', value: 'shell' }, { label: 'python', value: 'python' }],
      base_url: 'api/scripts/',
      file: '',
      rules: {
        label_cn: [
          { required: true, message: '请输入脚本名称', trigger: 'blur' }
        ],
        script_type: [
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
      const config = { 'content-type': 'multipart/form-data' }
      formData.append('script_file', this.file)
      formData.append('label_cn', this.edit_data.label_cn)
      formData.append('script_desc', this.edit_data.script_desc)
      formData.append('script_type', this.edit_data.script_type)
      formData.append('script_user', this.id)
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
      formData.append('label_cn', this.edit_data.label_cn)
      formData.append('script_desc', this.edit_data.script_desc)
      formData.append('script_type', this.edit_data.script_type)
      formData.append('script_user', this.id)
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
