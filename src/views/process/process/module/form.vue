<template>
  <el-dialog :append-to-body="true" :visible="isShow" :title="isAdd ? '新增菜单' : '编辑菜单'" width="600px" @close="cancel">
    <el-form ref="ruleForm" :model="edit_data" :rules="rules" size="small" label-width="100px">
      <el-form-item label="应用名称" prop="label_cn">
        <el-input v-model="edit_data.label_cn" placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="版本" prop="version">
        <el-input v-model="edit_data.version" placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="所属主机" prop="related_host" >
        <el-select
          v-model="edit_data.related_host"
          multiple
          placeholder="请选择主机"
          style="width: 360px;">
          <el-option
            v-for="item in host_list"
            :key="item.related_host_id.id"
            :label="item.related_host_id.ip"
            :value="item.related_host_id.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用途" prop="use_for">
        <el-input v-model="edit_data.use_for" placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="服务名" prop="service_name">
        <el-input v-model="edit_data.service_name" placeholder="" style="width: 360px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit(edit_data)">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { get, add, edit } from '@/api/data'
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
          'version': '',
          'use_for': ''
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      host_list: [],
      base_url: 'api/process/process/',
      file: '',
      rules: {
        label_cn: [
          { required: true, message: '请输入脚本名称', trigger: 'blur' }
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
  created() {
    this.$nextTick(() => {
      this.getAllHost()
    })
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
    },
    getAllHost() {
      get('/api/cmdb/password/', { 'is_ansible': 1 }).then(res => {
        this.host_list = res.results
      })
    }
  }
}
</script>
