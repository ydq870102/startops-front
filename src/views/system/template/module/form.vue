<template>
  <el-dialog :append-to-body="true" :visible="isShow" :title="isAdd ? '新增菜单' : '编辑菜单'" width="600px" @close="cancel">
    <el-form ref="ruleForm" :model="edit_data" :rules="rules" size="small" label-width="100px">
      <el-form-item label="模板名称" prop="label_cn">
        <el-input v-model="edit_data.label_cn" placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="模板类型" prop="type">
        <el-select v-model="edit_data.type" style="width: 360px;" placeholder="请选择模板类型">
          <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="模板对象" prop="object_type">
        <el-select v-model="edit_data.object" style="width: 360px;" placeholder="请选择模板对象">
          <el-option v-for="item in object_type" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item v-show="isAdd" label="上传模板" prop="path" >
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
          'type': '',
          'path': '',
          'object': ''
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      object_type: [{ label: '主机', value: 'host' }, { label: '信息系统', value: 'itsystem' }, { label: '网络区域', value: 'zone' }, { label: '机房', value: 'room' }, { label: '数据库', value: 'database' },
        { label: '数据库-实例', value: 'dbinstance' }, { label: '数据库-用户', value: 'dbuser' }, { label: '主机-用户', value: 'password' },
        { label: '网络设备', value: 'network' }, { label: '网络设备-用户', value: 'netuser' }],
      type: [{ label: '导入模板', value: 'import' }, { label: '导出模板', value: 'export' }],
      base_url: 'api/templates/',
      file: '',
      rules: {
        label_cn: [
          { required: true, message: '请输入脚本名称', trigger: 'blur' }
        ],
        type: [
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
      formData.append('path', this.file)
      formData.append('label_cn', this.edit_data.label_cn)
      formData.append('type', this.edit_data.type)
      formData.append('object', this.edit_data.object)
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
      formData.append('type', this.edit_data.type)
      formData.append('object', this.edit_data.object)
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
      this.file = this.$refs.file.files[0]
    }
  }
}
</script>
