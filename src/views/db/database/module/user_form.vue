<template>
  <el-dialog :append-to-body="true" :visible="isShow" :title="isAdd ? '新增菜单' : '编辑菜单'" width="600px" @close="cancel">
    <el-form ref="ruleForm" :model="form_data" :rules="rules" size="small" label-width="100px">
      <el-form-item label="用户名称" prop="label_cn">
        <el-input v-model="form_data.label_cn" placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="用户密码" prop="password">
        <el-input v-model="form_data.password" placeholder="" show-password style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio v-model="form_data.status" label="激活">激活</el-radio>
        <el-radio v-model="form_data.status" label="停用">停用</el-radio>
      </el-form-item>
      <el-form-item label="是否管理员" prop="is_admin">
        <el-radio v-model="form_data.is_admin" label="是">是</el-radio>
        <el-radio v-model="form_data.is_admin" label="否">否</el-radio>
      </el-form-item>
      <el-form-item label="用途" prop="use_for">
        <el-input v-model="form_data.use_for" placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="所属实例" prop="related_instance_id">
        <el-select v-model="form_data.related_instance_id" style="width: 360px" placeholder="请选择信息系统">
          <el-option v-for="item in instance_list" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="所属信息系统" prop="related_itsystem_id">
        <el-select v-model="form_data.related_itsystem_id" style="width: 360px" placeholder="请选择信息系统">
          <el-option v-for="item in itsystem_list" :key="item.value" :label="item.label" :value="item.value"/>
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
import { add, edit, get } from '@/api/data'
import related from '../../common/js/related'
export default {
  mixins: [related],
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
      instance_list: [],
      auth_list: [{ label: 'SSH', value: 'SSH' }],
      become_list: [{ label: 'YES', value: 'YES' }, { label: 'NO', value: 'NO' }],
      base_url: 'api/dbuser/',
      rules: {
        label_cn: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.getAllITsystem()
      this.getAllInstance()
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
      this.form_data.related_database_id = this.$parent.id
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
    },
    // 获取信息系统列表
    getAllInstance() {
      if (Array.isArray(this.instance_list) && this.instance_list.length === 0) {
        get('api/dbinstance/', { size: 10000, related_database_id: this.$parent.id }).then(res => {
          const _this = this
          res.results.forEach(function(data, index) {
            const instance = { value: data.id, label: data.label_cn }
            _this.instance_list.push(instance)
          })
        })
      }
    }
  }
}
</script>
