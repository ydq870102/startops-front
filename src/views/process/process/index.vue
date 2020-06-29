<template>
  <div class="app-container">
    <eHeader :query="query"/>
    <!--表格渲染-->
    <el-table v-loading="loading" ref="table" :data="data" size="small" border style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">
          <div>{{ scope.$index + 1 }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="label_cn" label="应用名称" min-width="180" align="center"/>
      <el-table-column prop="version" label="版本" min-width="100" align="center" />
      <el-table-column prop="related_host" label="所属主机" min-width="250" align="center">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.related_host" :key="item.ip" size="small" style="display: inline-block;margin: 0px 2px;">{{ item.ip }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="use_for" label="用途" min-width="100" align="center"/>
      <el-table-column prop="service_name" label="服务名" min-width="100" align="center"/>
      <el-table-column label="操作" align="center" width="240">
        <template slot-scope="scope">
          <el-button v-if="checkPermission(['admin','scripts_all','scripts_edit'])" size="mini" type="success" @click="toRestart(scope.row)">重启</el-button>
          <el-button v-if="checkPermission(['admin','scripts_all','scripts_edit'])" size="mini" type="success" @click="toEdit(scope.row.id)">编辑</el-button>
          <eForm :is-show.sync="dialog" :edit_data="edit_data" :is-add="false" />
          <el-popover
            v-if="checkPermission(['admin','task_all','task_delete'])"
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
      <deployForm ref="ruleDeploy" :is-show.sync="restartdiglog" :curobj ="cur_obj"></deployForm>
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
import permission from '@/mixins/permission'
import { dateFormat } from '@/utils/index'
import eHeader from './module/header'
import eForm from './module/form'
import { retrieve } from '@/api/data'
import deployForm from './module/deploy'

export default {
  components: { eHeader, eForm, deployForm },
  mixins: [permission, initData, del],
  data() {
    return {
      base_url: 'api/process/process/',
      dialog: false,
      restartdiglog: false,
      edit_data: {},
      cur_obj: {}
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
      const sort = 'id'
      this.params = { page: this.page, size: this.size, ordering: sort }
      return true
    },
    toEdit(id) {
      this.dialog = true
      retrieve(this.base_url, id).then(res => {
        this.edit_data = res
      })
    },
    // 详情
    toDetail(label_cn, id) {
      this.$router.push({
        path: 'task/detail',
        query: { label_cn: label_cn, id: id }
      })
    },
    toRestart(row) {
      this.restartdiglog = true
      this.cur_obj = row
    }
  }
}
</script>

<style scoped>

</style>
