<template>
  <div class="attribute-wrapper">
    <el-form ref="form" :model="form_base" size="small" label-width="98px">
      <div class="attribute-group">
        <h3 class="title">基础属性</h3>
        <el-row>
          <el-col :span="12">
            <el-form-item label="数据库名称">
              <el-input v-model="form_base.label_cn" :readonly="is_Readonly" style="width: 300px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="环境类型" >
              <el-select v-model="form_base.env" :disabled="is_Readonly" style="width: 300px" filterable placeholder="请选择环境类型">
                <el-option v-for="item in env_list" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="数据库类型">
              <el-select v-model="form_base.type" :disabled="is_Readonly" style="width: 300px" filterable placeholder="请选择数据库类型">
                <el-option v-for="item in type_list" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属主机">
              <el-select v-model="form_base.related_host_id" :disabled="is_Readonly" style="width: 300px" filterable placeholder="请选择所属主机">
                <el-option v-for="item in host_list" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="集群名称">
              <el-input v-model="form_base.cluster_name" :readonly="is_Readonly" style="width: 300px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="集群类型" >
              <el-input v-model="form_base.cluster_mode" :readonly="is_Readonly" style="width: 300px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="集群角色">
              <el-input v-model="form_base.cluster_role" :readonly="is_Readonly" style="width: 300px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="端口" >
              <el-input v-model="form_base.port" :readonly="is_Readonly" style="width: 300px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="虚拟IP">
              <el-input v-model="form_base.vip" :readonly="is_Readonly" style="width: 300px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="虚拟IP1" >
              <el-input v-model="form_base.vip1" :readonly="is_Readonly" style="width: 300px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用途">
              <el-input v-model="form_base.use_for" :readonly="is_Readonly" style="width: 300px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本" >
              <el-input v-model="form_base.version" :readonly="is_Readonly" style="width: 300px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input v-model="form_base.mark" :readonly="is_Readonly" style="width: 300px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" >
              <el-input v-model="form_base.status" :readonly="is_Readonly" style="width: 300px;"/>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="attribute-group">
        <h3 class="title">其他属性</h3>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="form_base.create_time"
                :disabled="true"
                type="datetime"
                placeholder="选择日期"
                style="width: 300px;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最后修改时间">
              <el-date-picker
                v-model="form_base.last_modify_time"
                :disabled="true"
                type="datetime"
                placeholder="选择日期"
                style="width: 300px;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-form-item>
        <div style="display: inline-block;margin: 20px 0px;float: left">
          <el-button v-if="checkPermission(['admin','database_all','database_edit']) && button == 'edit'" type="primary" @click="edit">编辑</el-button>
          <el-button v-if="checkPermission(['admin','database_all','database_edit']) && button == 'save'" type="success" @click="doSubmit">保存</el-button>
          <el-button v-if="checkPermission(['admin','database_all','database_edit']) && button == 'save'" type="warning" @click="cancel">取消</el-button>
          <el-button v-if="checkPermission(['admin','database_all','database_edit']) && button == 'edit'" @click="closeTag">返回</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import detail_edit from '@/mixins/detail_edit'
import permission from '@/mixins/permission'
import { retrieve, edit } from '@/api/data'
import related from '../../common/js/related'
export default {
  name: 'Base',
  mixins: [permission, detail_edit, related],
  data() {
    return {
      base_url: 'api/database/',
      loading: false,
      button: 'edit',
      is_Readonly: true,
      form_base: {},
      env_list: [{ value: '生产环境', label: '生产环境' }, { value: '测试环境', label: '测试环境' }, { value: '开发环境', label: '开发环境' }],
      type_list: [{ value: 'ORACLE', label: 'ORACLE' }, { value: 'MYSQL', label: 'MYSQL' }, { value: 'SQLSERVER', label: 'SQLSERVER' }]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      retrieve(this.base_url, this.$route.query.id).then(res => {
        this.form_base = res
      })
      this.getAllHost()
    },
    closeTag() {
      this.$store.dispatch('delView', this.$store.state.tagsView.visitedViews.slice(-1)[0])
      this.$router.go(-1)
    },
    cancel() {
      this.button = 'edit'
      this.is_Readonly = true
    },
    edit() {
      this.button = 'save'
      this.is_Readonly = false
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          edit(this.base_url, this.form_base.id, this.form_base).then(res => {
            this.$message({
              showClose: true,
              type: 'success',
              message: '修改成功!',
              duration: 2500
            })
            this.loading = false
            this.is_Readonly = true
            this.button = 'edit'
            this.init()
          }).catch(err => {
            this.loading = false
            console.log(err.response.data.detail)
          })
        }
      })
    }
  }
}
</script>

<style>
  .el-select__tags-text {
    color: #409EFF;
  }
  .el-input.is-disabled .el-input__inner {
    color: #606266;
  }

</style>
