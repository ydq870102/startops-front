<template>
  <el-dialog :append-to-body="true" :visible="isShow" :title="isAdd ? '新增菜单' : '编辑菜单'" width="600px" @close="cancel">
    <el-form ref="ruleForm" :model="edit_data" :rules="rules" size="small" label-width="100px">
      <el-form-item label="项目代号" prop="project_code">
        <el-input v-model="edit_data.project_code" placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="项目名称" prop="project_name">
        <el-input v-model="edit_data.project_name" placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="创建用户" >
        <el-input :disabled="true" :value="name" placeholder="" styl e="width: 360px;"/>
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
          'project_code': '',
          'project_name': '',
          'create_user': ''
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      base_url: 'api/process/project/',
      file: '',
      rules: {
        project_code: [
          { required: true, message: '请输入脚本名称', trigger: 'blur' }
        ],
        project_name: [
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
      this.edit_data.create_user = this.id
      add(this.base_url, this.edit_data).then(res => {
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
    },
    handleSuccess(file, fileList) {
      this.file = this.$refs.file.files[0]
    }
  }
}
</script>
