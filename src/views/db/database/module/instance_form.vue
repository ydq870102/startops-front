<template>
  <el-dialog :append-to-body="true" :visible="isShow" :title="isAdd ? '新增菜单' : '编辑菜单'" width="600px" @close="cancel">
    <el-form ref="ruleForm" :model="form_data" :rules="rules" size="small" label-width="100px">
      <el-form-item label="实例名称" prop="label_cn">
        <el-input v-model="form_data.label_cn" placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="别名" prop="alias">
        <el-input v-model="form_data.alias" placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="实例大小" prop="total_size">
        <el-input v-model="form_data.total_size" placeholder="" style="width: 360px;"/>
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
      base_url: 'api/dbinstance/',
      rules: {
        label_cn: [
          { required: true, message: '请输入实例名称', trigger: 'blur' }
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
      this.form_data.related_database_id = this.$parent.id
      add(this.base_url, this.form_data).then(res => {
        console.log(this)
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
      this.form_data.related_database_id = this.$parent.id
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
