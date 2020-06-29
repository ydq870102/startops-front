<template>
  <el-dialog :append-to-body="true" :visible="isShow" :title="isfile? '新增文件' : '新增文件夹'" width="600px" @close="cancel">
    <el-form ref="ruleForm" :model="form_data" :rules="rules" size="small" label-width="100px">
      <el-form-item label="节点名称" prop="add_path">
        <el-input v-model="form_data.add_path" placeholder="请输入名称" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="节点类型" prop="path_type">
        <el-select
          v-model="form_data.path_type"
          placeholder="请选择类型"
          style="width: 360px;">
          <el-option
            v-for="item in path_types"
            :key="item.id"
            :label="item.label"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属父节点" prop="parent_name">
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
      base_url: 'api/inventory/',
      form_data: {
        'label_cn': 'this.parent_name',
        'path': '',
        'add_path': '',
        'path_type': ''
      },
      path_types: [{ label: '文件夹', id: 'dir' }, { label: '文件', id: 'file' }],
      rules: {
        add_path: [
          { required: true, message: '请输入文件夹名称', trigger: 'blur' }
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
      this.form_data.label_cn = this.parent_name
      this.form_data.path = this.parent_path
      add('/api/edit/addnode/', this.form_data).then(res => {
        this.resetForm()
        this.$message({
          showClose: true,
          type: 'success',
          message: '添加成功!',
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
