<template>
  <div class="app-container">
    <div style="display: inline-block;margin: 10px 14px;float: left">
      <el-button
        v-if="checkPermission(['admin','password_all','password_create'])"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="toOpenDialog">新增</el-button>
      <eForm ref="ruleForm" :is-show.sync="dialog" :form_data="form_data" :is-add="isadd"></eForm>
    </div>
    <el-table v-loading="loading" ref="table" :data="data" size="small" border style="width: 100%;">
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          <div>{{ scope.$index + 1 }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="related_host_id.label_cn" label="主机名称" width="180"/>
      <el-table-column prop="related_host_id.ip" label="主机IP" show-overflow-tooltip width="120"/>
      <el-table-column prop="auth_type" label="认证类型" width="80" show-overflow-tooltip />
      <el-table-column prop="port" label="端口" width="80"/>
      <el-table-column prop="label_cn" label="用户" show-overflow-tooltip />
      <el-table-column prop="is_become" label="become" show-overflow-tooltip />
      <el-table-column prop="is_ansible" label="ansible" show-overflow-tooltip />
      <el-table-column label="操作" align="center" min-width="160">
        <template slot-scope="scope">
          <el-button v-if="checkPermission(['admin','password_all','password_list'])" size="mini" type="success" @click="toOpenDialog(scope.row)">编辑</el-button>
          <el-popover
            v-if="checkPermission(['admin','password_all','password_delete'])"
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import del from '@/mixins/delete'
import { dateFormat } from '@/utils/index'
import permission from '@/mixins/permission'
import eForm from '../module/form'
import { retrieve } from '@/api/data'

export default {
  components: { eForm, retrieve },
  mixins: [initData, permission, del],
  data() {
    return {
      base_url: 'api/cmdb/password/',
      dialog: false,
      id: this.$route.query.id,
      form_data: {},
      isadd: true
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    dateFormat,
    beforeInit() {
      const sort = '-create_time'
      this.params = { page: this.page, size: this.size, ordering: sort }
      this.params['related_host_id'] = this.id
      return true
    },
    toOpenDialog(row) {
      if (row.id) {
        this.isadd = false
        retrieve(this.base_url, row.id).then(res => {
          this.form_data = res
          setTimeout(() => {
          }, this.time)
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.form_data = {}
        this.isadd = true
      }

      this.dialog = true
    }
  }
}
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
  .app-container{
    margin: -30px 0px;
  }
  .el-table--border {
    border-right: none;
    border-bottom: none;
    margin-left: 14px;
  }
</style>
