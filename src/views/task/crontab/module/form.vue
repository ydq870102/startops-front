<template>
  <el-dialog :append-to-body="true" :visible.sync="isShow" :title="isAdd ? '新增菜单' : '编辑菜单'" width="600px" @close="resetForm">
    <el-form ref="ruleForm" :model="edit_data" :rules="rules" size="small" label-width="80px">
      <el-form-item label="分" prop="minute">
        <el-input v-model="edit_data.minute" placeholder="" style="width: 460px;"/>
      </el-form-item>
      <el-form-item label="时" prop="hour">
        <el-input v-model="edit_data.hour" placeholder="" style="width: 460px;"/>
      </el-form-item>
      <el-form-item label="天" prop="day_of_week">
        <el-input v-model="edit_data.day_of_week" placeholder="" style="width: 460px;"/>
      </el-form-item>
      <el-form-item label="月" prop="day_of_month">
        <el-input v-model="edit_data.day_of_month" placeholder="" style="width: 460px;"/>
      </el-form-item>
      <el-form-item label="年" prop="month_of_year">
        <el-input v-model="edit_data.month_of_year" placeholder="" style="width: 460px;"/>
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
          'minute': '',
          'hour': '',
          'day_of_week': '',
          'day_of_month': '',
          'month_of_year': ''
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      base_url: 'api/task/crontab/',
      rules: {
        minute: [
          { required: true, message: '请输入分钟', trigger: 'blur' }
        ],
        hour: [
          { required: true, message: '请输入小时', trigger: 'blur' }
        ],
        day_of_week: [
          { required: true, message: '请输入周', trigger: 'blur' }
        ],
        day_of_month: [
          { required: true, message: '请输入月', trigger: 'blur' }
        ],
        month_of_year: [
          { required: true, message: '请输入年', trigger: 'blur' }
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
        console.log(this)
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
