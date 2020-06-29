<template>
  <el-dialog :append-to-body="true" :visible="isShow" :title="isAdd ? '新增菜单' : '编辑菜单'" width="600px" @close="cancel">
    <el-form ref="ruleForm" :model="edit_data" :rules="rules" size="small" label-width="100px">
      <el-form-item label="任务名称" prop="label_cn">
        <el-input v-model="edit_data.label_cn" :disabled="!isAdd " placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="任务类型" prop="type">
        <el-select v-model="edit_data.type" :disabled="!isAdd" style="width: 360px;" placeholder="请选择任务类型" @change="SetSubType">
          <el-option v-for="item in task_type" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="任务子类型" prop="sub_type">
        <el-select v-model="edit_data.sub_type" :disabled="!isAdd" style="width: 360px;" placeholder="请选择子任务类型">
          <el-option v-for="item in task_sub_type" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="所属定时器" prop="related_cron_id">
        <el-select v-model="edit_data.related_cron_id" style="width: 360px;" placeholder="请选择定时器">
          <el-option v-for="item in cron_list" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="任务状态" prop="status">
        <el-radio v-model="edit_data.status" label="激活">激活</el-radio>
        <el-radio v-model="edit_data.status" label="停止">停止</el-radio>
      </el-form-item>
      <el-form-item label="过期时间" prop="expire_time">
        <el-date-picker
          v-model="edit_data.expire_time"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          style="width: 360px;">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="任务描述" prop="desc">
        <el-input v-model="edit_data.desc" placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="连接源地址" prop="host">
        <el-input v-model="edit_data.host" placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="edit_data.username" placeholder="" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="edit_data.password" type="password" placeholder="" style="width: 360px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit(edit_data)">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, get } from '@/api/data'
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
          'sub_type': '',
          'related_cron_id': '',
          'status': '激活',
          'expire_time': '',
          'desc': '',
          'host': '',
          'username': '',
          'password': '',
          'arg1': '',
          'arg2': '',
          'arg3': ''
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      task_type: [{ label: '服务器', value: 'HOST' }, { label: '网络设备', value: 'NETWORK' }],
      cron_list: [],
      task_sub_type: [],
      base_url: 'api/task/collect/',
      rules: {
        label_cn: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择任务类型', trigger: 'blur' }
        ],
        sub_type: [
          { required: true, message: '请选择任务子类型', trigger: 'blur' }
        ],
        related_cron_id: [
          { required: true, message: '请选择定时器', trigger: 'blur' }
        ],
        expire_time: [
          { required: true, message: '请输入过期时间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.getCron()
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
    getCron() {
      if (Array.isArray(this.cron_list) && this.cron_list.length === 0) {
        get('api/task/crontab/', { size: 10000 }).then(res => {
          const _this = this
          res.results.forEach(function(data, index) {
            const room = { value: data.id, label: data.label_cn }
            _this.cron_list.push(room)
          })
        })
      }
    },
    resetForm() {
      this.$emit('update:isShow', false)
    },
    SetSubType(value) {
      if (value === 'HOST') {
        this.task_sub_type = [{ label: '阿里云', value: 'ALiYun' }, { label: '虚拟化', value: 'VMWARE' }]
      } else if (value === 'NETWORK') {
        this.task_sub_type = [{ label: '备份', value: 'Backup' }]
      }
    }
  }
}
</script>
