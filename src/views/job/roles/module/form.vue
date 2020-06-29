<template>
  <el-dialog :append-to-body="true" :visible="isShow" :title="isAdd ? '新增菜单' : '编辑菜单'" width="600px" @close="cancel">
    <el-form ref="ruleForm" :model="edit_data" :rules="rules" size="small" label-width="100px">
      <el-form-item label="名称" prop="label_cn">
        <el-input v-model="edit_data.label_cn" placeholder="" style="width: 360px;"/>
        <el-tooltip content="导入前请先将ROLES文件夹导入，并与文件夹名字一致" placement="top">
          <i class="el-icon-warning"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="描述" prop="role_desc">
        <el-input v-model="edit_data.role_desc" placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="上传用户" >
        <el-input :disabled="true" :value="name" placeholder="" style="width: 360px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit(edit_data)">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/data'
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
          'role_desc': '',
          'role_user': ''
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      base_url: 'api/role/',
      rules: {
        label_cn: [
          { required: true, message: '请输入role名称', trigger: 'blur' }
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
      this.edit_data['role_user'] = this.id
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
      add(this.base_url, this.edit_data).then(res => {
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
      edit(this.base_url, this.edit_data.id, this.edit_data).then(res => {
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
    }
  }
}
</script>
