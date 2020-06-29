<template>
  <el-dialog :append-to-body="true" :visible="isShow" :title="isAdd ? '新增菜单' : '编辑菜单'" width="600px" @close="cancel">
    <el-form ref="ruleForm" :model="form_data" :rules="rules" size="small" label-width="100px">
      <el-form-item label="认证类型" prop="auth_type">
        <el-select v-model="form_data.auth_type" style="width: 360px;" placeholder="请选择认证类型">
          <el-option v-for="item in auth_list" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="端口" prop="port">
        <el-input v-model="form_data.port" placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="用户" prop="label_cn">
        <el-input v-model="form_data.label_cn" placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form_data.password" placeholder="" show-password style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="is_become" prop="is_become">
        <el-select v-model="form_data.is_become" style="width: 360px;" placeholder="请选择become类型">
          <el-option v-for="item in become_list" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit(form_data)">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/data'
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
    form_data: {
      type: Object,
      default: function() {
        return {
          label_cn: '',
          alias: '',
          total_size: '',
          related_database_id: ''
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      auth_list: [{ label: 'SSH', value: 'SSH' }],
      become_list: [{ label: 'YES', value: 'YES' }, { label: 'NO', value: 'NO' }],
      base_url: 'api/cmdb/password/',
      rules: {
        auth_type: [
          { required: true, message: '请输入认证类型', trigger: 'blur' }
        ],
        port: [
          { required: true, message: '请输入端口', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
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
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit()
        } else {
          return false
        }
      })
    },
    doAdd() {
      this.form_data.related_host_id = this.$parent.id
      add(this.base_url, this.form_data).then(res => {
        this.resetForm()
        this.$message({
          showClose: true,
          type: 'success',
          message: '添加成功!',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
        this.$emit('update:isShow', false)
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    doEdit() {
      edit(this.base_url, this.form_data.id, this.form_data).then(res => {
        this.resetForm()
        this.$message({
          showClose: true,
          type: 'success',
          message: '修改成功!',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
        this.$emit('update:isShow', false)
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
